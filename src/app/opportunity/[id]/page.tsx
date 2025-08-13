'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../../components/Navbar';
import { opportunities, Opportunity } from '../../../data/opportunities';

export default function OpportunityDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    const foundOpportunity = opportunities.find(opp => opp.id === id);
    
    if (!foundOpportunity) {
      router.push('/home');
      return;
    }

    setOpportunity(foundOpportunity);
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

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(opportunity.type)}`}>
              {opportunity.type}
            </span>
            <span className="flex items-center text-sm text-gray-600">
              {getLocationIcon(opportunity.location)} {opportunity.location}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-black mb-4">
            {opportunity.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            {opportunity.organization}
          </p>
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

        {/* Quick Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">⏱️</div>
            <h3 className="font-semibold text-black">Duration</h3>
            <p className="text-gray-600">{opportunity.duration}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">📅</div>
            <h3 className="font-semibold text-black">Commitment</h3>
            <p className="text-gray-600">{opportunity.commitment}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl mb-2">🏢</div>
            <h3 className="font-semibold text-black">Organization</h3>
            <p className="text-gray-600">{opportunity.organization}</p>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black mb-4">About This Opportunity</h2>
          <p className="text-gray-700 leading-relaxed">
            {opportunity.fullDescription}
          </p>
        </div>

        {/* Requirements */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black mb-4">Requirements</h2>
          <ul className="space-y-2">
            {opportunity.requirements.map((requirement, index) => (
              <li key={index} className="flex items-start">
                <span className="text-red-600 mr-3 mt-1">•</span>
                <span className="text-gray-700">{requirement}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Benefits */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black mb-4">Benefits</h2>
          <ul className="space-y-2">
            {opportunity.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <span className="text-green-600 mr-3 mt-1">✓</span>
                <span className="text-gray-700">{benefit}</span>
              </li>
            ))}
          </ul>
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
            <div>
              <h3 className="font-semibold text-black mb-2">Phone</h3>
              <a 
                href={`tel:${opportunity.contactPhone}`}
                className="text-red-600 hover:text-red-700"
              >
                {opportunity.contactPhone}
              </a>
            </div>
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