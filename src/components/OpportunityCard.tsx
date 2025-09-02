'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface Opportunity {
  id: string;
  title: string;
  image: string;
  type: string;
  location: string;
  address: string;
  description: string;
  organization: string;
  duration: string;
  commitment: string;
  date: string;
  time: string;
  capacity: number;
  currentSignups: number;
}

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

export interface OpportunityCardProps {
  opportunity: Opportunity;
}

// Centralized color mapping for volunteering types
export const getTypeColor = (type: string) => {
  const colors: { [key: string]: { bg: string; text: string } } = {
    environment: { bg: 'bg-green-100', text: 'text-green-800' },
    education: { bg: 'bg-blue-100', text: 'text-blue-800' },
    elderly: { bg: 'bg-purple-100', text: 'text-purple-800' },
    healthcare: { bg: 'bg-red-100', text: 'text-red-800' },
    animals: { bg: 'bg-orange-100', text: 'text-orange-800' },
    community: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
    youth: { bg: 'bg-pink-100', text: 'text-pink-800' },
    food: { bg: 'bg-yellow-100', text: 'text-yellow-800' }
  };
  return colors[type] || { bg: 'bg-gray-100', text: 'text-gray-800' };
};

export default function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const [attendees, setAttendees] = useState<VolunteerSubmission[]>([]);

  useEffect(() => {
    // Load attendees for this opportunity
    const storedSubmissions = localStorage.getItem('volunteerSubmissions');
    if (storedSubmissions) {
      const allSubmissions = JSON.parse(storedSubmissions);
      const opportunityAttendees = allSubmissions.filter(
        (submission: VolunteerSubmission) => submission.opportunityId === opportunity.id
      );
      setAttendees(opportunityAttendees);
    }
  }, [opportunity.id]);

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
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getCapacityStatus = () => {
    const percentage = (opportunity.currentSignups / opportunity.capacity) * 100;
    if (percentage >= 90) {
      return { text: 'Almost Full', color: 'text-red-600' };
    } else if (percentage >= 70) {
      return { text: 'Filling Up', color: 'text-orange-600' };
    } else {
      return { text: 'Open', color: 'text-green-600' };
    }
  };

  const typeColors = getTypeColor(opportunity.type);
  const capacityStatus = getCapacityStatus();

  // Show up to 4 attendees + count indicator if more
  const displayAttendees = attendees.slice(0, 4);
  const remainingCount = attendees.length - 4;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      {/* Image */}
      <div className="relative h-48 w-full">
        {opportunity.image && opportunity.image.trim() !== '' ? (
          opportunity.image.startsWith('/') ? (
            // Local image - use regular img tag
            <img
              src={opportunity.image}
              alt={opportunity.title}
              className="w-full h-full object-cover"
            />
          ) : (
            // External image - use next/image
            <Image
              src={opportunity.image}
              alt={opportunity.title}
              fill
              className="object-cover"
            />
          )
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="text-gray-400 text-4xl">📋</div>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${typeColors.bg} ${typeColors.text}`}>
            {opportunity.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-black mb-2 line-clamp-2">
          {opportunity.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {opportunity.description}
        </p>

        <div className="space-y-2 mb-4 flex-1">
          {/* Date and Time */}
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">📅</span>
            <span>{formatDate(opportunity.date)}</span>
            <span className="mx-2">•</span>
            <span>🕒</span>
            <span className="ml-1">{opportunity.time}</span>
          </div>

          {/* Location */}
          <div className="flex items-center text-sm text-gray-600">
            <span className="mr-2">📍</span>
            <span>{opportunity.address}</span>
          </div>

          {/* Attendees */}
          {attendees.length > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-600">👥</span>
                <div className="flex -space-x-2">
                  {displayAttendees.map((attendee, index) => (
                    <div
                      key={attendee.id}
                      className="w-6 h-6 rounded-full border-1 border-red bg-red-100 flex items-center justify-center text-xs font-medium text-red-600 shadow-sm"
                      title={attendee.name}
                    >
                      {attendee.name.charAt(0).toUpperCase()}
                    </div>
                  ))}
                  {remainingCount > 0 && (
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white bg-purple-500 flex items-center justify-center text-xs font-medium text-white shadow-sm"
                      title={`${remainingCount} more volunteers`}
                    >
                      +{remainingCount}
                    </div>
                  )}
                </div>
              </div>
              <span className={`text-xs font-medium ${capacityStatus.color}`}>
                {capacityStatus.text}
              </span>
            </div>
          )}

          {/* Capacity (only show if no attendees) */}
          {attendees.length === 0 && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-600">
                <span className="mr-2">👥</span>
                <span>{opportunity.currentSignups}/{opportunity.capacity} volunteers</span>
              </div>
              <span className={`font-medium ${capacityStatus.color}`}>
                {capacityStatus.text}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <Link href={`/opportunity/${opportunity.id}`} className="mt-auto">
          <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors">
            Learn More
          </button>
        </Link>
      </div>
    </div>
  );
} 