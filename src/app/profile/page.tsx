'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import { getTypeColor } from '../../components/OpportunityCard';
import { opportunities as mockOpportunities, Opportunity } from '../../data/opportunities';

interface VolunteerSubmission {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  name: string;
  email: string;
  motivation: string;
  submittedAt: string;
}

interface OrganizationData {
  id: string;
  organizationName: string;
  email: string;
  phoneNumber: string;
  websiteUrl: string;
  shortDescription: string;
  aboutUs: string;
  causeAreas: string[];
  address: string;
  contactName: string;
  contactRole: string;
  contactEmail: string;
  contactPhone: string;
  userType: string;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [preferences, setPreferences] = useState<any>(null);
  const [organizationData, setOrganizationData] = useState<OrganizationData | null>(null);
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

    // Load data based on user type
    if (userTypeFromStorage === 'social-organization') {
      const storedOrgData = localStorage.getItem('organizationData');
      if (storedOrgData) {
        setOrganizationData(JSON.parse(storedOrgData));
      }
    } else {
      // Load volunteer data
      const storedPreferences = localStorage.getItem('volunteerPreferences');
      if (storedPreferences) {
        setPreferences(JSON.parse(storedPreferences));
      }
    }

    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    router.push('/login');
  };

  const handleDeleteOpportunity = (opportunityId: string) => {
    if (confirm('Are you sure you want to delete this opportunity? This action cannot be undone.')) {
      // Get current opportunities
      const stored = localStorage.getItem('opportunities');
      if (stored) {
        const opportunities = JSON.parse(stored);
        const updatedOpportunities = opportunities.filter((opp: any) => opp.id !== opportunityId);
        localStorage.setItem('opportunities', JSON.stringify(updatedOpportunities));
        
        // Refresh the page to show updated list
        window.location.reload();
      }
    }
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

  // Organization Profile
  if (userType === 'social-organization' && organizationData) {
    // Load all opportunities from localStorage (if any), fallback to mock data
    let allOpportunities: Opportunity[] = [];
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('opportunities');
      if (stored) {
        allOpportunities = JSON.parse(stored);
      } else {
        // fallback to mock data
        allOpportunities = mockOpportunities;
      }
    }
    // Filter opportunities by organization email
    const orgOpportunities = allOpportunities.filter(
      (opp) => opp.organizationEmail === organizationData.email
    );

    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-black">Organization Profile</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Organization Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">{organizationData.organizationName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-black mb-2">Contact Information</h3>
                  <p className="text-gray-600">Email: {organizationData.email}</p>
                  {organizationData.phoneNumber && (
                    <p className="text-gray-600">Phone: {organizationData.phoneNumber}</p>
                  )}
                  {organizationData.websiteUrl && (
                    <p className="text-gray-600">
                      Website: <a href={organizationData.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700">{organizationData.websiteUrl}</a>
                    </p>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-black mb-2">Address</h3>
                  <p className="text-gray-600">{organizationData.address}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-black mb-2">Contact Person</h3>
                  <p className="text-gray-600">{organizationData.contactName}</p>
                  <p className="text-gray-600">{organizationData.contactRole}</p>
                  <p className="text-gray-600">Email: {organizationData.contactEmail}</p>
                  {organizationData.contactPhone && (
                    <p className="text-gray-600">Phone: {organizationData.contactPhone}</p>
                  )}
                </div>
              </div>
              {/* Description & Cause Areas */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-black mb-2">Description</h3>
                  <p className="text-gray-600">{organizationData.shortDescription}</p>
                </div>
                {organizationData.aboutUs && (
                  <div>
                    <h3 className="font-semibold text-black mb-2">About Us</h3>
                    <p className="text-gray-600">{organizationData.aboutUs}</p>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-black mb-2">Cause Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {organizationData.causeAreas.map((cause) => {
                      const typeColors = getTypeColor(cause);
                      return (
                        <span key={cause} className={`px-3 py-1 rounded-full text-sm font-medium ${typeColors.bg} ${typeColors.text}`}>
                          {cause}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Your Opportunities Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-black">Your Opportunities</h2>
              <Link href="/organization/opportunity/new">
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                  Post New Opportunity
                </button>
              </Link>
            </div>
            {orgOpportunities.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {orgOpportunities.map((opp) => (
                  <li key={opp.id} className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <span className="font-semibold text-black">{opp.title}</span>
                      <span className="ml-2 text-sm text-gray-500">({opp.type}, {opp.location})</span>
                    </div>
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <Link href={`/opportunity/${opp.id}`} className="text-red-600 hover:text-red-700 text-sm font-medium">View</Link>
                      <Link href={`/organization/opportunity/${opp.id}/edit`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">Edit</Link>
                      <Link href={`/organization/opportunity/${opp.id}/applications`} className="text-green-600 hover:text-green-700 text-sm font-medium">Applications</Link>
                      <button 
                        onClick={() => handleDeleteOpportunity(opp.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">You haven't posted any opportunities yet.</p>
            )}
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
              <p className="text-gray-600">Volunteer</p>
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
                    <span key={day} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </span>
                  ))}
                </div>
              </div>


            </div>
          ) : (
            <p className="text-gray-600">No preferences set. <Link href="/onboarding" className="text-red-600 hover:text-red-700">Set your preferences</Link></p>
          )}
        </div>
      </div>
    </div>
  );
} 