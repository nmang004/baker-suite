import Link from 'next/link';
import { RatioCalculator } from '@/components/features/calculator/RatioCalculator';
import { Button } from '@/components/ui/button';
import { Calculator, Droplet } from 'lucide-react';

export const metadata = {
  title: 'Free Ratio Calculator | Baker\'s Suite',
  description: 'Scale recipes intelligently using baker\'s percentages - Free tool, no sign-up required',
};

export default function CalculatorPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-4xl font-bold text-chocolate-brown mb-2 flex items-center gap-2">
            <Calculator className="h-9 w-9" />
            Free Ratio Calculator
          </h1>
          <p className="text-lg text-warm-gray-600">
            Scale recipes intelligently using baker&apos;s percentages
          </p>
          <p className="text-sm text-warm-gray-500 mt-1">
            No sign-up required • Use it anytime, anywhere
          </p>
        </div>
        <Link href="/sign-up">
          <Button>
            Save Recipes →
          </Button>
        </Link>
      </div>

      {/* Info Card */}
      <div className="p-4 bg-info-light border-l-4 border-info rounded-md space-y-2">
        <div>
          <h3 className="font-semibold text-info-dark mb-1">
            How Baker&apos;s Percentages Work
          </h3>
          <p className="text-sm text-info-dark/80">
            In baker&apos;s percentages, flour is always 100%. All other ingredients
            are expressed as a percentage of the flour weight. For example, 70%
            hydration means 70g water per 100g flour.
          </p>
        </div>
        <div className="pt-2 border-t border-info/20">
          <h3 className="font-semibold text-info-dark mb-1 flex items-center gap-2">
            <Droplet className="h-5 w-5" />
            Smart Hydration Calculation
          </h3>
          <p className="text-sm text-info-dark/80">
            Our calculator accounts for all liquid sources! We automatically calculate
            hydration from water (100%), milk (87%), eggs (75%), and other ingredients
            based on their actual liquid content. Hover over the hydration badge to see
            the breakdown.
          </p>
        </div>
      </div>

      {/* Calculator Component */}
      <RatioCalculator />

      {/* CTA Banner */}
      <div className="mt-12 p-8 bg-gradient-to-r from-sunset-orange/10 to-coral-peach/10 rounded-lg border-2 border-sunset-orange/20 text-center">
        <h3 className="font-serif text-2xl font-bold text-chocolate-brown mb-2">
          Want to save your recipes?
        </h3>
        <p className="text-warm-gray-600 mb-4">
          Create a free account to save unlimited recipes, track your bakes, and access weather-aware timeline planning.
        </p>
        <Link href="/sign-up">
          <Button size="lg">
            Get Started Free
          </Button>
        </Link>
      </div>
    </div>
  );
}
