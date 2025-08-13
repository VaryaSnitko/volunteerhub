'use client';

import Link from 'next/link';
import Image from 'next/image';

interface Opportunity {
  id: string;
  title: string;
  image: string;
  type: string;
  location: string;
  description: string;
  organization: string;
  duration: string;
  commitment: string;
}

interface OpportunityCardProps {
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

  const typeColors = getTypeColor(opportunity.type);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
      <div className="p-4">
        <h3 className="text-lg font-semibold text-black mb-2 line-clamp-2">
          {opportunity.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {opportunity.description}
        </p>

        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span className="mr-4">{opportunity.organization}</span>
          <span className="flex items-center">
            {getLocationIcon(opportunity.location)} {opportunity.location}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>⏱️ {opportunity.duration}</span>
          <span>📅 {opportunity.commitment}</span>
        </div>

        <Link
          href={`/opportunity/${opportunity.id}`}
          className="block w-full bg-red-600 text-white text-center py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
} 