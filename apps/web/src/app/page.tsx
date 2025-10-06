import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Wheat, Clock, Palette, Calculator } from 'lucide-react';

export default async function Home() {
  const user = await currentUser();

  // If user is signed in, redirect to dashboard
  if (user) {
    redirect('/dashboard');
  }

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 py-24 md:py-32 text-center">
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-chocolate-brown mb-4 flex items-center gap-3 justify-center">
          <Wheat className="h-12 w-12 md:h-14 md:w-14" />
          Baker&apos;s Suite
        </h1>
        <p className="text-xl md:text-2xl text-warm-gray-600 mb-8 max-w-2xl">
          Your Intelligent Baking Companion
        </p>
        <p className="text-lg text-warm-gray-600 mb-8 max-w-2xl">
          Achieve professional consistency with ratio-perfect recipes, weather-smart timelines, and flavor discovery.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/calculator">
            <Button size="lg" variant="outline">
              Try Calculator (Free)
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button size="lg">Get Started Free</Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-chocolate-brown text-center mb-12">
            Trusted by 1,000+ Bakers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <div className="h-16 w-16 rounded-full bg-sunset-orange/10 flex items-center justify-center mx-auto mb-4">
                  <Calculator className="h-8 w-8 text-sunset-orange" />
                </div>
                <CardTitle>Ratio Calculator</CardTitle>
                <CardDescription>
                  Scale recipes intelligently using baker&apos;s percentages
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="h-16 w-16 rounded-full bg-sunset-orange/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-sunset-orange" />
                </div>
                <CardTitle>Schedule Optimizer</CardTitle>
                <CardDescription>
                  Weather-aware timeline planning for perfect bakes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="h-16 w-16 rounded-full bg-sunset-orange/10 flex items-center justify-center mx-auto mb-4">
                  <Palette className="h-8 w-8 text-sunset-orange" />
                </div>
                <CardTitle>Flavor Pairing</CardTitle>
                <CardDescription>
                  Discover unexpected ingredient combinations
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
