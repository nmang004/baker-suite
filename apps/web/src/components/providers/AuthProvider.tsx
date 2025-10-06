'use client';

import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

/**
 * AuthProvider sets up the API client with Clerk authentication
 * This ensures the token getter is available before any API calls
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();

  useEffect(() => {
    // Set up the API client's token getter globally
    if (getToken) {
      apiClient.setTokenGetter(getToken);
    }
  }, [getToken]);

  return <>{children}</>;
}
