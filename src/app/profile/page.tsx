'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { getTypeColor } from '../../components/OpportunityCard';

export default function ProfilePage() {
  const router = useRouter();
  const [preferences, setPreferences] = useState<any>(null);
  const [userType, setUserType] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);

  useEffect(() => {
    // Load user type and info
    const user = localStorage.getItem('user');
    const userTypeFromStorage = localStorage.getItem('userType');
    
    if (user) {
      const userData = JSON.parse(user);
      setUserType(userData.userType || userTypeFromStorage || 'volunteer');
      setUserInfo(userData);
    }

    // Load volunteer data
    const storedPreferences = localStorage.getItem('volunteerPreferences');
    if (storedPreferences) {
      setPreferences(JSON.parse(storedPreferences));
    }

    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Volunteer Profile
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-black">Your Profile</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* User Information Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-black mb-4">Account Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-black mb-2">Email</h3>
              <p className="text-gray-600">{userInfo?.email || 'volunteer@example.com'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-2">Account Type</h3>
              <p className="text-gray-600">{userType === 'admin' ? 'Admin' : 'Volunteer'}</p>
            </div>
            <div>
              <h3 className="font-semibold text-black mb-2">Member Since</h3>
              <p className="text-gray-600">{userInfo?.createdAt ? new Date(userInfo.createdAt).toLocaleDateString() : 'Recently'}</p>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-black">Volunteering Preferences</h2>
            <Link href="/update-preferences">
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                Update Preferences
              </button>
            </Link>
          </div>

          {preferences ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-black mb-2">Volunteering Types:</h3>
                <div className="flex flex-wrap gap-2">
                  {preferences.volunteeringTypes?.map((type: string) => {
                    const typeColors = getTypeColor(type);
                    return (
                      <span key={type} className={`px-3 py-1 rounded-full text-sm font-medium ${typeColors.bg} ${typeColors.text}`}>
                        {type}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-black mb-2">Preferred Days:</h3>
                <div className="flex flex-wrap gap-2">
                  {preferences.preferredDays?.map((day: string) => (
                    <span key={day} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                      {day}
                    </span>
                  ))}
                </div>
              </div>

              {preferences.phoneNumber && (
                <div>
                  <h3 className="font-semibold text-black mb-2">Phone Number:</h3>
                  <p className="text-gray-600">{preferences.phoneNumber}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No preferences set yet</h3>
              <p className="text-gray-500 mb-6">
                Set your volunteering preferences to get personalized recommendations.
              </p>
              <Link href="/update-preferences">
                <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium">
                  Set Preferences
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-black mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/home">
              <button className="w-full bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium">
                Browse Opportunities
              </button>
            </Link>
            <Link href="/my-opportunities">
              <button className="w-full border-2 border-red-600 text-red-600 py-3 px-6 rounded-lg hover:bg-red-50 transition-colors font-medium">
                My Opportunities
              </button>
            </Link>
            {userType === 'admin' && (
              <Link href="/admin">
                <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Admin Dashboard
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 