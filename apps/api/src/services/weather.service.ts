import axios from 'axios';
import { createClient } from 'redis';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Redis client for caching
const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

// Initialize Redis connection
(async () => {
  try {
    await redisClient.connect();
    console.log('Redis connected for weather caching');
  } catch (error) {
    console.warn('Redis connection failed, weather caching disabled:', error);
  }
})();

export interface WeatherData {
  temperature: number; // Celsius
  humidity: number; // Percentage
  pressure?: number; // hPa
  location: string;
  description?: string;
  timestamp: Date;
}

export interface WeatherAdjustments {
  proofingMultiplier: number; // 0.75 to 1.20
  recommendation: string;
}

export class WeatherService {
  private apiKey: string;
  private baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private cacheTTL = 900; // 15 minutes in seconds

  constructor() {
    this.apiKey = process.env.WEATHER_API_KEY || '';
    if (!this.apiKey) {
      console.warn(
        'WEATHER_API_KEY not set - weather features will use default values'
      );
    }
  }

  /**
   * Get weather data by location (city name or coordinates)
   */
  async getWeather(location: string): Promise<WeatherData> {
    // Check cache first
    const cached = await this.getCachedWeather(location);
    if (cached) {
      return cached;
    }

    // If no API key, return default weather
    if (!this.apiKey) {
      return this.getDefaultWeather(location);
    }

    try {
      // Determine if location is coordinates (lat,lon) or city name
      const isCoordinates = /^-?\d+\.?\d*,-?\d+\.?\d*$/.test(location);
      const params: any = {
        appid: this.apiKey,
        units: 'metric', // Celsius
      };

      if (isCoordinates) {
        const [lat, lon] = location.split(',').map((s) => s.trim());
        params.lat = lat;
        params.lon = lon;
      } else {
        params.q = location;
      }

      const response = await axios.get(this.baseUrl, { params });

      const weatherData: WeatherData = {
        temperature: Math.round(response.data.main.temp * 10) / 10,
        humidity: response.data.main.humidity,
        pressure: response.data.main.pressure,
        location: response.data.name || location,
        description: response.data.weather[0]?.description,
        timestamp: new Date(),
      };

      // Cache the result
      await this.cacheWeather(location, weatherData);

      return weatherData;
    } catch (error) {
      console.error('Weather API error:', error);
      // Fallback to default weather on error
      return this.getDefaultWeather(location);
    }
  }

  /**
   * Get default weather when API is unavailable
   */
  private getDefaultWeather(location: string): WeatherData {
    return {
      temperature: 21, // Default comfortable room temp
      humidity: 50,
      pressure: 1013,
      location,
      description: 'Default weather (API unavailable)',
      timestamp: new Date(),
    };
  }

  /**
   * Get cached weather data
   */
  private async getCachedWeather(
    location: string
  ): Promise<WeatherData | null> {
    if (!redisClient.isOpen) return null;

    try {
      const cacheKey = `weather:${location.toLowerCase()}`;
      const cached = await redisClient.get(cacheKey);

      if (cached) {
        const data = JSON.parse(cached);
        data.timestamp = new Date(data.timestamp);
        return data;
      }
    } catch (error) {
      console.error('Redis cache read error:', error);
    }

    return null;
  }

  /**
   * Cache weather data
   */
  private async cacheWeather(
    location: string,
    data: WeatherData
  ): Promise<void> {
    if (!redisClient.isOpen) return;

    try {
      const cacheKey = `weather:${location.toLowerCase()}`;
      await redisClient.setEx(cacheKey, this.cacheTTL, JSON.stringify(data));
    } catch (error) {
      console.error('Redis cache write error:', error);
    }
  }

  /**
   * Log weather data to database
   */
  async logWeather(userId: string, weatherData: WeatherData): Promise<void> {
    try {
      await prisma.weatherLog.create({
        data: {
          userId,
          temperature: weatherData.temperature,
          humidity: weatherData.humidity,
          pressure: weatherData.pressure,
          location: weatherData.location,
          timestamp: weatherData.timestamp,
        },
      });
    } catch (error) {
      console.error('Failed to log weather:', error);
      // Don't throw - logging is optional
    }
  }

  /**
   * Calculate proofing time adjustments based on temperature
   * Based on fermentation science:
   * - 18-20°C: +20% time (slower fermentation)
   * - 21-24°C: Base time (ideal range)
   * - 25-28°C: -15% time (faster fermentation)
   * - 29°C+: -25% time (very fast fermentation)
   */
  calculateProofingAdjustment(temperature: number): WeatherAdjustments {
    let multiplier = 1.0;
    let recommendation = '';

    if (temperature < 18) {
      multiplier = 1.25;
      recommendation =
        'Very slow fermentation. Consider using a proofing box or warmer location.';
    } else if (temperature >= 18 && temperature <= 20) {
      multiplier = 1.2;
      recommendation =
        'Cooler temperature - expect longer proofing times. Dough will develop more complex flavors.';
    } else if (temperature >= 21 && temperature <= 24) {
      multiplier = 1.0;
      recommendation =
        'Ideal temperature range for predictable fermentation.';
    } else if (temperature >= 25 && temperature <= 28) {
      multiplier = 0.85;
      recommendation =
        'Warm temperature - proofing will be faster. Watch for over-proofing.';
    } else if (temperature >= 29 && temperature <= 32) {
      multiplier = 0.75;
      recommendation =
        'Very warm - fermentation will be rapid. Monitor closely to avoid over-proofing.';
    } else {
      multiplier = 0.7;
      recommendation =
        'Extremely warm - consider cooling location. Risk of over-proofing and off-flavors.';
    }

    return { proofingMultiplier: multiplier, recommendation };
  }

  /**
   * Get hydration adjustment based on humidity
   * High humidity = reduce hydration slightly
   * Low humidity = increase hydration slightly
   */
  getHydrationAdjustment(humidity: number): {
    adjustment: number;
    recommendation: string;
  } {
    let adjustment = 0;
    let recommendation = '';

    if (humidity < 30) {
      adjustment = 2;
      recommendation =
        'Very dry air - consider adding 2% more water to prevent dough from drying out.';
    } else if (humidity >= 30 && humidity < 40) {
      adjustment = 1;
      recommendation =
        'Low humidity - consider adding 1% more water. Cover dough well.';
    } else if (humidity >= 40 && humidity <= 70) {
      adjustment = 0;
      recommendation = 'Humidity is ideal for baking.';
    } else if (humidity > 70 && humidity <= 80) {
      adjustment = -1;
      recommendation =
        'High humidity - consider reducing water by 1%. Dough may be stickier.';
    } else {
      adjustment = -2;
      recommendation =
        'Very high humidity - reduce water by 2%. Dough will be very sticky.';
    }

    return { adjustment, recommendation };
  }
}

// Export singleton instance
export const weatherService = new WeatherService();
