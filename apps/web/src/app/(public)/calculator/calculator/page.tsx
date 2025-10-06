import { RatioCalculator } from '@/components/features/calculator/RatioCalculator';
import { Calculator } from 'lucide-react';

export const metadata = {
  title: 'Ratio Calculator | Baker\'s Suite',
  description: 'Scale recipes intelligently using baker\'s percentages',
};

export default function CalculatorPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-serif text-4xl font-bold text-chocolate-brown mb-2 flex items-center gap-2">
          <Calculator className="h-9 w-9" />
          Ratio Calculator
        </h1>
        <p className="text-lg text-warm-gray-600">
          Scale recipes intelligently using baker&apos;s percentages
        </p>
      </div>

      {/* Info Card */}
      <div className="p-4 bg-info-light border-l-4 border-info rounded-md">
        <h3 className="font-semibold text-info-dark mb-1">
          How Baker&apos;s Percentages Work
        </h3>
        <p className="text-sm text-info-dark/80">
          In baker&apos;s percentages, flour is always 100%. All other ingredients
          are expressed as a percentage of the flour weight. For example, 70%
          hydration means 70g water per 100g flour.
        </p>
      </div>

      {/* Calculator Component */}
      <RatioCalculator />
    </div>
  );
}
