'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { StarterDetail } from '@/components/features/starter/StarterDetail';

interface StarterPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function StarterPage({ params }: StarterPageProps) {
  const router = useRouter();
  const { id } = use(params);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.push('/starters')}>
        ← Back to Starters
      </Button>

      {/* Starter Detail */}
      <StarterDetail starterId={id} />
    </div>
  );
}
