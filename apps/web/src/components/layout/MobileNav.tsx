'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Clock, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  {
    title: 'Home',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Recipes',
    href: '/recipes',
    icon: BookOpen,
  },
  {
    title: 'Timelines',
    href: '/timelines',
    icon: Clock,
  },
  {
    title: 'Profile',
    href: '/settings',
    icon: User,
  },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden border-t border-warm-gray-200 bg-white">
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 text-xs font-medium transition-colors min-w-[64px]',
                isActive
                  ? 'text-sunset-orange'
                  : 'text-warm-gray-600 hover:text-chocolate-brown'
              )}
            >
              <Icon className={cn('h-6 w-6', isActive && 'fill-sunset-orange/20')} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
