'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import NotificationBell, { Notification } from './NotificationBell';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../services/notificationService';

export default function Navbar() {
  const pathname = usePathname();
  const [userType, setUserType] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userProfilePicture, setUserProfilePicture] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const user = localStorage.getItem('user');
    const userTypeFromStorage = localStorage.getItem('userType');
    
    if (user) {
      const userData = JSON.parse(user);
      setUserType(userData.userType || userTypeFromStorage || 'volunteer');
      setUserProfilePicture(userData.profilePicture || '');
      setUserName(userData.name || userData.email || 'User');
    } else {
      setUserType(userTypeFromStorage || 'volunteer');
      setUserProfilePicture('');
      setUserName('User');
    }

    // Load notifications
    setNotifications(getNotifications());

    // Listen for storage changes to update notifications
    const handleStorageChange = () => {
      setNotifications(getNotifications());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id);
    setNotifications(getNotifications());
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
    setNotifications(getNotifications());
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/home" className="text-xl font-bold text-red-600">
              VolunteerHub
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/home"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/home')
                  ? 'bg-red-100 text-red-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Home
            </Link>
            
            {userType === 'volunteer' && (
              <Link
                href="/my-opportunities"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/my-opportunities')
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                My Opportunities
              </Link>
            )}
            
            <Link
              href="/profile"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/profile')
                  ? 'bg-red-100 text-red-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Profile
            </Link>

            {/* Notification Bell */}
            <NotificationBell
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
            />

            {/* User Profile Picture */}
            <div className="flex items-center">
              <div className="relative">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 hover:border-red-300 transition-colors cursor-pointer">
                  {userProfilePicture ? (
                    <img
                      src={userProfilePicture}
                      alt={userName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full bg-red-100 flex items-center justify-center text-red-600 font-semibold text-sm ${userProfilePicture ? 'hidden' : ''}`}>
                    {userName.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Notification Bell for Mobile */}
            <NotificationBell
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onMarkAllAsRead={handleMarkAllAsRead}
            />

            {/* User Profile Picture for Mobile */}
            <div className="flex items-center">
              <div className="relative">
                <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 hover:border-red-300 transition-colors cursor-pointer">
                  {userProfilePicture ? (
                    <img
                      src={userProfilePicture}
                      alt={userName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full bg-red-100 flex items-center justify-center text-red-600 font-semibold text-sm ${userProfilePicture ? 'hidden' : ''}`}>
                    {userName.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <Link
                href="/home"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/home')
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              {userType === 'volunteer' && (
                <Link
                  href="/my-opportunities"
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive('/my-opportunities')
                      ? 'bg-red-100 text-red-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Opportunities
                </Link>
              )}
              
              <Link
                href="/profile"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive('/profile')
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 