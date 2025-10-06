'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Calculator,
  Clock,
  BookOpen,
  Calendar,
  Sprout,
  Settings,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Recipes',
    href: '/recipes',
    icon: BookOpen,
  },
  {
    title: 'Calculator',
    href: '/calculator',
    icon: Calculator,
  },
  {
    title: 'Timelines',
    href: '/timelines',
    icon: Clock,
  },
  {
    title: 'Schedule',
    href: '/schedule',
    icon: Calendar,
  },
  {
    title: 'Flavor Pairing',
    href: '/flavor-pairing',
    icon: Sparkles,
  },
  {
    title: 'Starters',
    href: '/starters',
    icon: Sprout,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'hidden md:flex w-64 flex-col bg-white border-r border-warm-gray-200',
        className
      )}
    >
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all',
                'hover:bg-warm-gray-100',
                isActive
                  ? 'bg-sunset-orange/10 text-sunset-orange'
                  : 'text-warm-gray-700 hover:text-chocolate-brown'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
