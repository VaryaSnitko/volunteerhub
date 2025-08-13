'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import OpportunityCard, { getTypeColor } from '../../components/OpportunityCard';
import { opportunities as mockOpportunities, Opportunity } from '../../data/opportunities';

export default function HomePage() {
  const router = useRouter();
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([]);
  const [preferences, setPreferences] = useState<any>(null);
  const [userType, setUserType] = useState<string>('');
  const [organizationData, setOrganizationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key

  // Function to refresh opportunities based on current preferences
  const refreshOpportunities = () => {
    const storedPreferences = localStorage.getItem('volunteerPreferences');
    if (storedPreferences) {
      const userPreferences = JSON.parse(storedPreferences);
      setPreferences(userPreferences);

      // Load all opportunities (from localStorage or mock data)
      let allOpportunities: Opportunity[] = [];
      const stored = localStorage.getItem('opportunities');
      if (stored) {
        const postedOpportunities = JSON.parse(stored);
        // Combine posted opportunities with mock opportunities
        allOpportunities = [...mockOpportunities, ...postedOpportunities];
      } else {
        allOpportunities = mockOpportunities;
      }

      // Apply filtering with priority: types -> days -> location
      let filtered = allOpportunities;

      // Priority 1: Filter by volunteering types (highest priority)
      if (userPreferences.volunteeringTypes && userPreferences.volunteeringTypes.length > 0) {
        filtered = filtered.filter(opp => 
          userPreferences.volunteeringTypes.includes(opp.type)
        );
      }

      // Priority 2: Filter by preferred days (if types filtering didn't eliminate all)
      if (filtered.length > 0 && userPreferences.preferredDays && userPreferences.preferredDays.length > 0) {
        // For now, we'll show opportunities regardless of days since we don't have day-specific data
        // In a real app, opportunities would have day information
        // This is a placeholder for future enhancement
        console.log('Preferred days:', userPreferences.preferredDays);
      }

      // Priority 3: Filter by location preference (lowest priority)
      if (filtered.length > 0 && userPreferences.locationPreference) {
        filtered = filtered.filter(opp => 
          opp.location === userPreferences.locationPreference || 
          opp.location === 'hybrid'
        );
      }

      // If no matches after all filters, show all opportunities
      if (filtered.length === 0) {
        filtered = allOpportunities;
      }

      setFilteredOpportunities(filtered);
    }
  };

  useEffect(() => {
    // Check user type
    const user = localStorage.getItem('user');
    const userTypeFromStorage = localStorage.getItem('userType');
    
    if (user) {
      const userData = JSON.parse(user);
      setUserType(userData.userType || userTypeFromStorage || 'volunteer');
    } else {
      // If no user data, check userType directly
      setUserType(userTypeFromStorage || 'volunteer');
    }

    if (userTypeFromStorage === 'social-organization') {
      // Load organization data
      const storedOrgData = localStorage.getItem('organizationData');
      if (storedOrgData) {
        setOrganizationData(JSON.parse(storedOrgData));
      }
      
      // Load organization's opportunities
      const storedOpportunities = localStorage.getItem('opportunities');
      if (storedOpportunities) {
        const allOpportunities = JSON.parse(storedOpportunities);
        const orgOpportunities = allOpportunities.filter(
          (opp: Opportunity) => opp.organizationEmail === JSON.parse(storedOrgData).email
        );
        setFilteredOpportunities(orgOpportunities);
      } else {
        setFilteredOpportunities([]);
      }
      
      setLoading(false);
    } else {
      // Volunteer flow - check if user has completed onboarding
      const storedPreferences = localStorage.getItem('volunteerPreferences');
      
      if (!storedPreferences) {
        // Redirect to onboarding if no preferences found
        router.push('/onboarding');
        return;
      }

      refreshOpportunities();
      setLoading(false);
    }
  }, [router, refreshKey]); // Add refreshKey as dependency

  // Add focus event listener to refresh opportunities when returning from profile
  useEffect(() => {
    const handleFocus = () => {
      if (userType === 'volunteer') {
        refreshOpportunities();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [userType]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading opportunities...</p>
          </div>
        </div>
      </div>
    );
  }

  // Organization Home Page
  if (userType === 'social-organization' && organizationData) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">
                Your Opportunities
              </h1>
              <p className="text-gray-600 text-lg">
                Manage and track your posted volunteering opportunities
              </p>
            </div>
            <Link href="/organization/opportunity/new">
              <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold">
                Post New Opportunity
              </button>
            </Link>
          </div>

          {/* Organization Info */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-black mb-3">{organizationData.organizationName}</h2>
            <p className="text-gray-600 mb-2">{organizationData.shortDescription}</p>
            <div className="flex flex-wrap gap-2">
              {organizationData.causeAreas?.map((cause: string) => {
                const typeColors = getTypeColor(cause);
                return (
                  <span key={cause} className={`px-3 py-1 rounded-full text-sm font-medium ${typeColors.bg} ${typeColors.text}`}>
                    {cause}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Opportunities Grid */}
          {filteredOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-black mb-2">No opportunities posted yet</h3>
              <p className="text-gray-600 mb-6">
                Start by posting your first volunteering opportunity to connect with volunteers.
              </p>
              <Link href="/organization/opportunity/new">
                <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
                  Post Your First Opportunity
                </button>
              </Link>
            </div>
          )}

          {/* Quick Actions */}
          {filteredOpportunities.length > 0 && (
            <div className="mt-8 text-center">
              <Link href="/profile">
                <button className="text-red-600 hover:text-red-700 font-medium underline">
                  View full profile and manage opportunities
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Volunteer Home Page (existing code)
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-4">
            Volunteering Opportunities
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Based on your preferences, we've found {filteredOpportunities.length} opportunities that match your interests.
          </p>
        </div>

        {/* Filter Summary */}
        {preferences && (
          <div className="bg-gray-50 rounded-lg p-4 mb-8">
            <h2 className="text-lg font-semibold text-black mb-3">Your Preferences:</h2>
            <div className="flex flex-wrap gap-2">
              {preferences.volunteeringTypes?.map((type: string) => {
                const typeColors = getTypeColor(type);
                return (
                  <span key={type} className={`px-3 py-1 rounded-full text-sm font-medium ${typeColors.bg} ${typeColors.text}`}>
                    {type}
                  </span>
                );
              })}
              {preferences.locationPreference && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {preferences.locationPreference}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Opportunities Grid */}
        {filteredOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOpportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-black mb-2">No opportunities found</h3>
            <p className="text-gray-600 mb-6">
              Try updating your preferences to see more opportunities.
            </p>
            <button
              onClick={() => router.push('/onboarding')}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Update Preferences
            </button>
          </div>
        )}

        {/* Show All Opportunities Link */}
        {filteredOpportunities.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={() => {
                const stored = localStorage.getItem('opportunities');
                let allOpportunities = [...mockOpportunities]; // Always start with mock opportunities
                if (stored) {
                  const postedOpportunities = JSON.parse(stored);
                  allOpportunities = [...mockOpportunities, ...postedOpportunities]; // Combine mock + posted
                }
                
                // Show ALL opportunities without any filtering
                setFilteredOpportunities(allOpportunities);
              }}
              className="text-red-600 hover:text-red-700 font-medium underline"
            >
              Show all opportunities
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 