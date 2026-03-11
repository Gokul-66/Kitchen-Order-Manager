'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const baseClass =
  'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium leading-none transition-colors';

const activeClass = 'bg-slate-900 text-white';

const inactiveClass = 'text-slate-700 hover:bg-slate-100';

export function DashboardTabs() {
  const pathname = usePathname();

  return (
    <div className="inline-flex items-center gap-2">
      <Link
        href="/"
        className={`${baseClass} ${pathname === '/' ? activeClass : inactiveClass}`}
      >
        Active Orders
      </Link>

      <Link
        href="/history"
        className={`${baseClass} ${
          pathname === '/history' ? activeClass : inactiveClass
        }`}
      >
        History
      </Link>
    </div>
  );
}