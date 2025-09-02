'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import OpportunityCard, { getTypeColor } from '../../components/OpportunityCard';
import { opportunities as mockOpportunities, Opportunity } from '../../data/opportunities';
import { 
  addNotification
} from '../../services/notificationService';

export default function HomePage() {
  const router = useRouter();
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([]);
  const [allOpportunities, setAllOpportunities] = useState<Opportunity[]>([]);
  const [preferences, setPreferences] = useState<any>(null);
  const [userType, setUserType] = useState<string>('');
  const [organizationData, setOrganizationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // New state for tab and filtering
  const [activeTab, setActiveTab] = useState<'recommended' | 'all'>('recommended');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  // Available options for filtering
  const volunteeringTypes = ['environment', 'education', 'elderly', 'healthcare', 'animals', 'community', 'youth', 'food'];
  const daysOptions = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  // Function to load and filter opportunities
  const loadOpportunities = () => {
    // Load all opportunities (from localStorage or mock data)
    let opportunities: Opportunity[] = [];
    const stored = localStorage.getItem('opportunities');
    if (stored) {
      const postedOpportunities = JSON.parse(stored);
      opportunities = [...mockOpportunities, ...postedOpportunities];
    } else {
      opportunities = mockOpportunities;
    }
    setAllOpportunities(opportunities);
    return opportunities;
  };

  // Function to get recommended opportunities based on preferences
  const getRecommendedOpportunities = (opportunities: Opportunity[]) => {
    const storedPreferences = localStorage.getItem('volunteerPreferences');
    if (!storedPreferences) return opportunities;

    const userPreferences = JSON.parse(storedPreferences);
    setPreferences(userPreferences);

    let filtered = opportunities;

    // Apply preference-based filtering
    if (userPreferences.volunteeringTypes && userPreferences.volunteeringTypes.length > 0) {
      filtered = filtered.filter(opp => 
        userPreferences.volunteeringTypes.includes(opp.type)
      );
    }



    // If no matches, show all opportunities
    if (filtered.length === 0) {
      filtered = opportunities;
    }

    return filtered;
  };

  // Function to get filtered opportunities for "All Opportunities" tab
  const getFilteredOpportunities = () => {
    let filtered = allOpportunities;

    // Filter by selected types
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(opp => selectedTypes.includes(opp.type));
    }

    // Note: Day filtering would require opportunity data to include day information
    // For now, we'll skip day filtering as the current data doesn't include this

    return filtered;
  };

  // Filter change handlers
  const handleTypeChange = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleDayChange = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleResetFilters = () => {
    setSelectedTypes([]);
    setSelectedDays([]);
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

    // Check if user has completed onboarding
    const storedPreferences = localStorage.getItem('volunteerPreferences');
    
    if (!storedPreferences) {
      // Redirect to onboarding if no preferences found
      router.push('/onboarding');
      return;
    }

    // Load opportunities and set initial filtered opportunities
    const opportunities = loadOpportunities();
    const recommended = getRecommendedOpportunities(opportunities);
    setFilteredOpportunities(recommended);
    setLoading(false);
  }, [router, refreshKey]);

  // Update filtered opportunities when tab or filters change
  useEffect(() => {
    if (userType === 'volunteer' && !loading && allOpportunities.length > 0) {
      if (activeTab === 'recommended') {
        const recommended = getRecommendedOpportunities(allOpportunities);
        setFilteredOpportunities(recommended);
      } else {
        const filtered = getFilteredOpportunities();
        setFilteredOpportunities(filtered);
      }
    }
  }, [activeTab, selectedTypes, selectedDays, allOpportunities]);

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
            {activeTab === 'recommended' 
              ? `Based on your preferences, we've found ${filteredOpportunities.length} opportunities that match your interests.`
              : `Explore all ${filteredOpportunities.length} opportunities available.`
            }
          </p>
          

        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-col sm:flex-row bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('recommended')}
              className={`px-4 sm:px-6 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${
                activeTab === 'recommended'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Recommended for You
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 sm:px-6 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${
                activeTab === 'all'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              All Opportunities
            </button>
          </div>
        </div>

        {/* Filter Bar - Only show for "All Opportunities" tab */}
        {activeTab === 'all' && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
              <h2 className="text-lg font-semibold text-black">Filter Opportunities</h2>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors w-full sm:w-auto"
              >
                Reset Filters
              </button>
            </div>

          {/* Filter Dropdowns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Volunteering Types</label>
              <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedTypes.length === 0}
                    onChange={() => setSelectedTypes([])}
                    className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">All Types</span>
                </label>
                {volunteeringTypes.map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() => handleTypeChange(type)}
                      className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Day Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Days</label>
              <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedDays.length === 0}
                    onChange={() => setSelectedDays([])}
                    className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">All Days</span>
                </label>
                {daysOptions.map((day) => (
                  <label key={day} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedDays.includes(day)}
                      onChange={() => handleDayChange(day)}
                      className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
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


      </div>
    </div>
  );
} 