'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface VolunteerApplication {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  name: string;
  email: string;
  motivation: string;
  submittedAt: string;
}

interface Opportunity {
  id: string;
  title: string;
  organizationEmail: string;
}

export default function OpportunityApplicationsPage() {
  const router = useRouter();
  const params = useParams();
  const opportunityId = params.id as string;
  
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [opportunity, setOpportunity] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in as organization
    const user = localStorage.getItem('user');
    const userType = localStorage.getItem('userType');
    
    if (!user || userType !== 'social-organization') {
      setError('Access denied. Please log in as an organization.');
      setLoading(false);
      return;
    }

    // Load opportunity details
    const storedOpportunities = localStorage.getItem('opportunities');
    if (storedOpportunities) {
      const opportunities = JSON.parse(storedOpportunities);
      const foundOpportunity = opportunities.find((opp: any) => opp.id === opportunityId);
      
      if (foundOpportunity) {
        setOpportunity(foundOpportunity);
      } else {
        setError('Opportunity not found');
        setLoading(false);
        return;
      }
    } else {
      setError('No opportunities found');
      setLoading(false);
      return;
    }

    // Load volunteer applications
    const storedApplications = localStorage.getItem('volunteerSubmissions');
    if (storedApplications) {
      const allApplications = JSON.parse(storedApplications);
      const opportunityApplications = allApplications.filter(
        (app: VolunteerApplication) => app.opportunityId === opportunityId
      );
      setApplications(opportunityApplications);
    }

    setLoading(false);
  }, [opportunityId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/home')}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black mb-2">Volunteer Applications</h1>
            <p className="text-gray-600">For: {opportunity?.title}</p>
          </div>
          <Link href="/home">
            <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
              Back to Home
            </button>
          </Link>
        </div>

        {applications.length > 0 ? (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">
                <strong>{applications.length}</strong> volunteer{applications.length !== 1 ? 's have' : ' has'} applied for this opportunity
              </p>
            </div>

            {applications.map((application) => (
              <div key={application.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-xl font-semibold text-black">{application.name}</h3>
                      <span className="text-sm text-gray-500">
                        Applied on {new Date(application.submittedAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <p className="text-gray-600">
                        <strong>Email:</strong> {application.email}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-black mb-2">Motivation:</h4>
                      <p className="text-gray-700 leading-relaxed">{application.motivation}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:items-end">
                    <a
                      href={`mailto:${application.email}?subject=Re: Your application for ${opportunity?.title}`}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      Contact Volunteer
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-black mb-2">No applications yet</h3>
            <p className="text-gray-600 mb-6">
              No volunteers have applied for this opportunity yet.
            </p>
            <Link href="/home">
              <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
                Back to Home
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 