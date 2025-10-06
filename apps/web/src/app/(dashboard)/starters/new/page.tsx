'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { StarterForm } from '@/components/features/starter/StarterForm';

export default function NewStarterPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto max-w-2xl p-6 space-y-6">
      {/* Header */}
      <div>
        <Button variant="ghost" onClick={() => router.back()}>
          ← Back
        </Button>
        <h1 className="text-3xl font-bold mt-4">Create New Starter</h1>
        <p className="text-muted-foreground">
          Add a new sourdough starter to your collection
        </p>
      </div>

      {/* Form */}
      <StarterForm onCancel={() => router.back()} />
    </div>
  );
}
