'use client';

import Link from 'next/link';
import { useAuth, UserButton } from '@clerk/nextjs';
import { Menu, Bell, Wheat } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { isSignedIn } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-warm-gray-200 bg-warm-cream backdrop-blur supports-[backdrop-filter]:bg-warm-cream/95">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Mobile menu button - only show if signed in */}
        {isSignedIn && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        {/* Logo */}
        <Link
          href={isSignedIn ? "/dashboard" : "/"}
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <Wheat className="h-6 w-6 text-sunset-orange" aria-hidden="true" />
          <span className="font-serif text-xl font-bold text-chocolate-brown hidden sm:inline-block">
            Baker&apos;s Suite
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {isSignedIn ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" className="text-chocolate-brown">
                  Dashboard
                </Button>
              </Link>
              <Link href="/recipes">
                <Button variant="ghost" className="text-chocolate-brown">
                  Recipes
                </Button>
              </Link>
              <Link href="/timelines">
                <Button variant="ghost" className="text-chocolate-brown">
                  Timelines
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/calculator">
                <Button variant="ghost" className="text-chocolate-brown">
                  Calculator
                </Button>
              </Link>
            </>
          )}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-2">
          {isSignedIn ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-sunset-orange"></span>
              </Button>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: 'h-9 w-9',
                  },
                }}
              />
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
