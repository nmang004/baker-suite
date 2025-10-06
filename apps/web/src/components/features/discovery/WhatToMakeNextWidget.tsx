'use client';

import { useRouter } from 'next/navigation';
import { WhatToMakeNext } from './WhatToMakeNext';

export function WhatToMakeNextWidget() {
  const router = useRouter();

  const handleStartBaking = (recipeId: string) => {
    router.push(`/timelines/new?recipeId=${recipeId}`);
  };

  const handleSaveForLater = (recipeId: string) => {
    // TODO: Implement save functionality
    console.log('Save recipe:', recipeId);
  };

  return (
    <WhatToMakeNext
      onStartBaking={handleStartBaking}
      onSaveForLater={handleSaveForLater}
    />
  );
}
