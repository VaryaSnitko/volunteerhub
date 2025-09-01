'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import { opportunities, Opportunity } from '../../../data/opportunities';

interface VolunteerSubmission {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  name: string;
  email: string;
  motivation: string;
  submittedAt: string;
  status?: 'active' | 'completed' | 'cancelled';
}

export default function OpportunityDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [attendees, setAttendees] = useState<VolunteerSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    
    // Load opportunity from both mock data and localStorage
    let foundOpportunity = opportunities.find(opp => opp.id === id);
    
    if (!foundOpportunity) {
      // Check localStorage for posted opportunities
      const storedOpportunities = localStorage.getItem('opportunities');
      if (storedOpportunities) {
        const postedOpportunities = JSON.parse(storedOpportunities);
        foundOpportunity = postedOpportunities.find((opp: Opportunity) => opp.id === id);
      }
    }
    
    if (!foundOpportunity) {
      router.push('/home');
      return;
    }

    setOpportunity(foundOpportunity);

    // Load attendees (volunteers who signed up)
    const storedSubmissions = localStorage.getItem('volunteerSubmissions');
    if (storedSubmissions) {
      const allSubmissions = JSON.parse(storedSubmissions);
      const opportunityAttendees = allSubmissions.filter(
        (submission: VolunteerSubmission) => submission.opportunityId === id
      );
      setAttendees(opportunityAttendees);
    }

    setLoading(false);
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading opportunity...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return null;
  }

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      environment: 'bg-green-100 text-green-800',
      education: 'bg-blue-100 text-blue-800',
      elderly: 'bg-purple-100 text-purple-800',
      healthcare: 'bg-red-100 text-red-800',
      animals: 'bg-orange-100 text-orange-800',
      community: 'bg-indigo-100 text-indigo-800',
      youth: 'bg-pink-100 text-pink-800',
      food: 'bg-yellow-100 text-yellow-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getLocationIcon = (location: string) => {
    switch (location) {
      case 'in-person':
        return '📍';
      case 'online':
        return '💻';
      case 'hybrid':
        return '🔄';
      default:
        return '📍';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/home"
          className="inline-flex items-center text-red-600 hover:text-red-700 mb-6"
        >
          ← Back to Opportunities
        </Link>

        {/* Sticky Header */}
        <div className="sticky top-16 bg-white border-b border-gray-200 z-40 shadow-sm -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(opportunity.type)}`}>
                  {opportunity.type.charAt(0).toUpperCase() + opportunity.type.slice(1)}
                </span>
                <span className="flex items-center text-sm text-gray-600">
                  {getLocationIcon(opportunity.location)} {opportunity.location}
                </span>
              </div>
              
              <h1 className="text-xl font-bold text-black mb-1 truncate">
                {opportunity.title}
              </h1>
              
              <p className="text-sm text-gray-500 truncate">
                Posted by {opportunity.organizationEmail || opportunity.organization}
              </p>
            </div>
            <div className="flex items-center space-x-3 ml-4">
              {/* Contact Icons */}
              <a 
                href={`mailto:${opportunity.contactEmail}`}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                title="Email"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
              {opportunity.contactPhone && (
                <a 
                  href={`tel:${opportunity.contactPhone}`}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                  title="Phone"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </a>
              )}
              {/* Sign Up Button */}
              <Link
                href={`/signup/${opportunity.id}`}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors text-sm whitespace-nowrap"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="relative h-64 sm:h-80 w-full mb-8 rounded-lg overflow-hidden">
          <Image
            src={opportunity.image}
            alt={opportunity.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">📅</div>
            <h3 className="font-semibold text-black">Date</h3>
            <p className="text-gray-600">{formatDate(opportunity.date)}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">🕒</div>
            <h3 className="font-semibold text-black">Time</h3>
            <p className="text-gray-600">{opportunity.time}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">📍</div>
            <h3 className="font-semibold text-black">Location</h3>
            <p className="text-gray-600">{opportunity.address}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">👥</div>
            <h3 className="font-semibold text-black">Capacity</h3>
            <p className="text-gray-600">{opportunity.currentSignups}/{opportunity.capacity} volunteers</p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black mb-4">About This Opportunity</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            {opportunity.description}
          </p>
          {opportunity.fullDescription && opportunity.fullDescription !== opportunity.description && (
            <p className="text-gray-700 leading-relaxed">
              {opportunity.fullDescription}
            </p>
          )}
        </div>

        {/* Required Skills */}
        {opportunity.requirements && opportunity.requirements.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-black mb-4">Required Skills</h2>
            <ul className="space-y-2">
              {opportunity.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-red-600 mr-3 mt-1">•</span>
                  <span className="text-gray-700">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Attendees */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black mb-4">Attendees ({attendees.length})</h2>
          {attendees.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {attendees.map((attendee, index) => (
                <div key={attendee.id} className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center border-2 border-red-200">
                    <span className="text-red-600 font-semibold text-sm">
                      {attendee.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 font-medium">
                    {attendee.name}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No volunteers have signed up yet. Be the first!</p>
          )}
        </div>

        {/* Contact Information */}
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold text-black mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-black mb-2">Email</h3>
              <a 
                href={`mailto:${opportunity.contactEmail}`}
                className="text-red-600 hover:text-red-700"
              >
                {opportunity.contactEmail}
              </a>
            </div>
            {opportunity.contactPhone && (
              <div>
                <h3 className="font-semibold text-black mb-2">Phone</h3>
                <a 
                  href={`tel:${opportunity.contactPhone}`}
                  className="text-red-600 hover:text-red-700"
                >
                  {opportunity.contactPhone}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Sign Up Button */}
        <div className="text-center">
          <Link
            href={`/signup/${opportunity.id}`}
            className="inline-block bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Sign Up to Volunteer
          </Link>
        </div>
      </div>
    </div>
  );
} 