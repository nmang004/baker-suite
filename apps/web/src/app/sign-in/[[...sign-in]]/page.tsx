import { SignIn } from '@clerk/nextjs';
import { Wheat } from 'lucide-react';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-12 px-4">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-bold text-chocolate-brown mb-2 flex items-center gap-2 justify-center">
          <Wheat className="h-10 w-10" />
          Baker&apos;s Suite
        </h1>
        <p className="text-warm-gray-600">
          Welcome back! Sign in to continue baking.
        </p>
      </div>
      <SignIn
        appearance={{
          elements: {
            rootBox: 'mx-auto',
            card: 'bg-white shadow-md',
          },
        }}
      />
    </div>
  );
}
