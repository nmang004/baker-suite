import { currentUser } from '@clerk/nextjs';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calculator, Sparkles, Calendar, Clock, Sun, Target, Wheat, TrendingUp, Lightbulb } from 'lucide-react';
import { WhatToMakeNextWidget } from '@/components/features/discovery/WhatToMakeNextWidget';
import { TrendingRecipesWidget } from '@/components/features/discovery/TrendingRecipesWidget';

export default async function DashboardPage() {
  const user = await currentUser();
  const firstName = user?.firstName || 'Baker';

  // Get time of day for greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? 'Good morning'
      : hour < 18
      ? 'Good afternoon'
      : 'Good evening';

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="font-serif text-4xl font-bold text-chocolate-brown mb-2 flex items-center gap-2">
          {greeting}, {firstName}!
          <Sun className="h-9 w-9 text-yellow-500" />
        </h1>
        <p className="text-warm-gray-600 text-lg">
          Perfect baking weather today • 72°F • 55% humidity
        </p>
      </div>

      {/* Active Bakes Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl font-semibold text-chocolate-brown flex items-center gap-2">
            <Target className="h-6 w-6" />
            Active Bakes
          </h2>
          <Button>
            <Plus className="h-4 w-4" />
            Start New Bake
          </Button>
        </div>

        {/* Empty State */}
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex flex-col items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-warm-gray-100 flex items-center justify-center">
                <Clock className="h-8 w-8 text-warm-gray-400" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-chocolate-brown mb-1">
                  No active bakes yet
                </h3>
                <p className="text-sm text-warm-gray-600 max-w-md mx-auto">
                  Start your first bake by creating a timeline from one of your recipes.
                </p>
              </div>
              <Button>Start Your First Bake</Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Quick Tools Grid */}
      <section>
        <h2 className="font-serif text-2xl font-semibold text-chocolate-brown mb-4 flex items-center gap-2">
          <Calculator className="h-6 w-6" />
          Quick Tools
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Ratio Calculator */}
          <Link href="/calculator">
            <Card hoverable className="cursor-pointer h-full">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-sunset-orange/10 flex items-center justify-center mb-3">
                  <Calculator className="h-6 w-6 text-sunset-orange" />
                </div>
                <CardTitle>Ratio Calculator</CardTitle>
                <CardDescription>
                  Scale recipes intelligently using baker&apos;s percentages
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* Flavor Pairing */}
          <Link href="/discover/pairings">
            <Card hoverable className="cursor-pointer h-full">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-sunset-orange/10 flex items-center justify-center mb-3">
                  <Sparkles className="h-6 w-6 text-sunset-orange" />
                </div>
                <CardTitle>Flavor Pairing</CardTitle>
                <CardDescription>
                  Discover unexpected ingredient combinations
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          {/* Schedule Maker */}
          <Card hoverable className="cursor-pointer">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-sunset-orange/10 flex items-center justify-center mb-3">
                <Calendar className="h-6 w-6 text-sunset-orange" />
              </div>
              <CardTitle>Schedule Optimizer</CardTitle>
              <CardDescription>
                Weather-aware timeline planning for perfect bakes
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Starter Tracker */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl font-semibold text-chocolate-brown flex items-center gap-2">
            <Wheat className="h-6 w-6" />
            My Starters
          </h2>
          <Link href="/starters">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-sm text-warm-gray-600 mb-4">
                Track your sourdough starters&apos; health and feeding schedules
              </p>
              <Link href="/starters/new">
                <Button variant="outline">Create Your First Starter</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Discovery: What to Bake Next */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl font-semibold text-chocolate-brown flex items-center gap-2">
            <Lightbulb className="h-6 w-6" />
            What to Bake Next
          </h2>
          <Link href="/discover">
            <Button variant="outline">Explore More</Button>
          </Link>
        </div>
        <WhatToMakeNextWidget />
      </section>

      {/* Trending Recipes */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-2xl font-semibold text-chocolate-brown flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Trending This Week
          </h2>
          <Link href="/discover?tab=trending">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        <TrendingRecipesWidget />
      </section>
    </div>
  );
}
