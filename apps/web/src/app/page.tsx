export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-4">
          🍞 Baker&apos;s Suite
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Your intelligent baking companion
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">🧮 Ratio Calculator</h2>
            <p className="text-sm text-muted-foreground">
              Scale recipes intelligently using baker&apos;s percentages
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">⏰ Schedule Optimizer</h2>
            <p className="text-sm text-muted-foreground">
              Weather-aware timeline planning for perfect bakes
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">🌈 Flavor Pairing</h2>
            <p className="text-sm text-muted-foreground">
              Discover unexpected ingredient combinations
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
