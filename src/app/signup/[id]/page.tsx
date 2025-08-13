'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SignupForm from '../../../components/SignupForm';
import { opportunities } from '../../../data/opportunities';

export default function SignupPage() {
  const params = useParams();
  const router = useRouter();
  const [opportunityTitle, setOpportunityTitle] = useState('');

  useEffect(() => {
    const id = params.id as string;
    const opportunity = opportunities.find(opp => opp.id === id);
    
    if (!opportunity) {
      router.push('/home');
      return;
    }

    setOpportunityTitle(opportunity.title);
  }, [params.id, router]);

  if (!opportunityTitle) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <SignupForm 
      opportunityId={params.id as string} 
      opportunityTitle={opportunityTitle} 
    />
  );
} 