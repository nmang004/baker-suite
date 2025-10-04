/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate temperature is within reasonable baking range
 */
export function isValidBakingTemperature(celsius: number): boolean {
  return celsius >= 0 && celsius <= 300;
}

/**
 * Validate hydration percentage
 */
export function isValidHydration(percentage: number): boolean {
  return percentage >= 30 && percentage <= 200;
}

/**
 * Validate rating (1-5 stars)
 */
export function isValidRating(rating: number): boolean {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}
