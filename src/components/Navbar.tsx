'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/home" className="flex-shrink-0">
              <h1 className="text-xl font-bold text-black">
                VolunteerHub
              </h1>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              href="/home"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/home'
                  ? 'bg-red-600 text-white'
                  : 'text-black hover:bg-red-50 hover:text-red-600'
              }`}
            >
              Home
            </Link>
            <Link
              href="/profile"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/profile'
                  ? 'bg-red-600 text-white'
                  : 'text-black hover:bg-red-50 hover:text-red-600'
              }`}
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 