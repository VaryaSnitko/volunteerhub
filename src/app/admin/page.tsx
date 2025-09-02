'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import OpportunityCard from '../../components/OpportunityCard';
import { opportunities as mockOpportunities, Opportunity } from '../../data/opportunities';

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

export default function AdminDashboardPage() {
  const router = useRouter();
  const [allOpportunities, setAllOpportunities] = useState<Opportunity[]>([]);
  const [pendingOpportunities, setPendingOpportunities] = useState<Opportunity[]>([]);
  const [approvedOpportunities, setApprovedOpportunities] = useState<Opportunity[]>([]);
  const [userSubmissions, setUserSubmissions] = useState<VolunteerSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'volunteer' | 'overview'>('overview');

  useEffect(() => {
    // Check if user is logged in as admin
    const user = localStorage.getItem('user');
    const userType = localStorage.getItem('userType');
    
    if (!user || userType !== 'admin') {
      router.push('/login');
      return;
    }

    // Load all opportunities (mock + posted)
    let opportunities = [...mockOpportunities];
    const storedOpportunities = localStorage.getItem('opportunities');
    if (storedOpportunities) {
      const postedOpportunities = JSON.parse(storedOpportunities);
      opportunities = [...mockOpportunities, ...postedOpportunities];
    }
    setAllOpportunities(opportunities);

    // Separate pending and approved opportunities
    const pending = opportunities.filter(opp => 
      opp.organizationEmail && opp.organizationEmail !== 'admin@volunteerhub.com'
    );
    const approved = opportunities.filter(opp => 
      !opp.organizationEmail || opp.organizationEmail === 'admin@volunteerhub.com'
    );
    
    setPendingOpportunities(pending);
    setApprovedOpportunities(approved);

    // Load user's volunteer submissions
    const storedSubmissions = localStorage.getItem('volunteerSubmissions');
    if (storedSubmissions) {
      const submissions = JSON.parse(storedSubmissions);
      const adminSubmissions = submissions.filter((sub: VolunteerSubmission) => 
        sub.email === 'admin@volunteerhub.com' || sub.email === 'admin@example.com'
      );
      setUserSubmissions(adminSubmissions);
    }

    setLoading(false);
  }, [router]);

  const handleApproveOpportunity = (opportunityId: string) => {
    // Update the opportunity status to approved
    const updatedOpportunities = allOpportunities.map(opp => {
      if (opp.id === opportunityId) {
        return { ...opp, organizationEmail: 'admin@volunteerhub.com' };
      }
      return opp;
    });

    // Update localStorage
    const stored = localStorage.getItem('opportunities');
    if (stored) {
      const postedOpportunities = JSON.parse(stored);
      const updatedPosted = postedOpportunities.map((opp: Opportunity) => {
        if (opp.id === opportunityId) {
          return { ...opp, organizationEmail: 'admin@volunteerhub.com' };
        }
        return opp;
      });
      localStorage.setItem('opportunities', JSON.stringify(updatedPosted));
    }

    // Update state
    setAllOpportunities(updatedOpportunities);
    
    // Re-categorize opportunities
    const pending = updatedOpportunities.filter(opp => 
      opp.organizationEmail && opp.organizationEmail !== 'admin@volunteerhub.com'
    );
    const approved = updatedOpportunities.filter(opp => 
      !opp.organizationEmail || opp.organizationEmail === 'admin@volunteerhub.com'
    );
    
    setPendingOpportunities(pending);
    setApprovedOpportunities(approved);
  };

  const handleRejectOpportunity = (opportunityId: string) => {
    // Remove the opportunity from localStorage
    const stored = localStorage.getItem('opportunities');
    if (stored) {
      const postedOpportunities = JSON.parse(stored);
      const filtered = postedOpportunities.filter((opp: Opportunity) => opp.id !== opportunityId);
      localStorage.setItem('opportunities', JSON.stringify(filtered));
    }

    // Remove from all opportunities
    const updatedOpportunities = allOpportunities.filter(opp => opp.id !== opportunityId);
    setAllOpportunities(updatedOpportunities);

    // Re-categorize opportunities
    const pending = updatedOpportunities.filter(opp => 
      opp.organizationEmail && opp.organizationEmail !== 'admin@volunteerhub.com'
    );
    const approved = updatedOpportunities.filter(opp => 
      !opp.organizationEmail || opp.organizationEmail === 'admin@volunteerhub.com'
    );
    
    setPendingOpportunities(pending);
    setApprovedOpportunities(approved);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-4">Admin Dashboard</h1>
          <p className="text-gray-600 text-lg">Manage opportunities and volunteer like everyone else</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-col sm:flex-row bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 sm:px-6 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${
                activeTab === 'overview'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 sm:px-6 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${
                activeTab === 'pending'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Pending Approval ({pendingOpportunities.length})
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-4 sm:px-6 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${
                activeTab === 'approved'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Approved ({approvedOpportunities.length})
            </button>
            <button
              onClick={() => setActiveTab('volunteer')}
              className={`px-4 sm:px-6 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${
                activeTab === 'volunteer'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              My Volunteering ({userSubmissions.length})
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-red-600 mb-2">{pendingOpportunities.length}</div>
                <div className="text-gray-600">Pending Approval</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{approvedOpportunities.length}</div>
                <div className="text-gray-600">Approved Opportunities</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{userSubmissions.length}</div>
                <div className="text-gray-600">My Signups</div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{allOpportunities.length}</div>
                <div className="text-gray-600">Total Opportunities</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-black mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/home">
                  <button className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors">
                    Browse All Opportunities
                  </button>
                </Link>
                <button
                  onClick={() => setActiveTab('pending')}
                  className="w-full bg-yellow-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-yellow-700 transition-colors"
                >
                  Review Pending Approvals
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pending' && (
          <div>
            <h2 className="text-2xl font-bold text-black mb-6">Opportunities Pending Approval</h2>
            {pendingOpportunities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingOpportunities.map((opportunity) => (
                  <div key={opportunity.id} className="relative">
                    <OpportunityCard opportunity={opportunity} />
                    
                    {/* Admin Actions Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleApproveOpportunity(opportunity.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectOpportunity(opportunity.id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Pending Approvals</h3>
                <p className="text-gray-500">All opportunities have been reviewed.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'approved' && (
          <div>
            <h2 className="text-2xl font-bold text-black mb-6">Approved Opportunities</h2>
            {approvedOpportunities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {approvedOpportunities.map((opportunity) => (
                  <div key={opportunity.id} className="relative">
                    <OpportunityCard opportunity={opportunity} />
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Approved
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Approved Opportunities</h3>
                <p className="text-gray-500">No opportunities have been approved yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'volunteer' && (
          <div>
            <h2 className="text-2xl font-bold text-black mb-6">My Volunteering</h2>
            {userSubmissions.length > 0 ? (
              <div className="space-y-4">
                {userSubmissions.map((submission) => {
                  const opportunity = allOpportunities.find(opp => opp.id === submission.opportunityId);
                  if (!opportunity) return null;
                  
                  return (
                    <div key={submission.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-black">{opportunity.title}</h3>
                          <p className="text-sm text-gray-600">Signed up on {new Date(submission.submittedAt).toLocaleDateString()}</p>
                        </div>
                        <Link href={`/opportunity/${opportunity.id}`}>
                          <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
                            View Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Volunteer Signups Yet</h3>
                <p className="text-gray-500 mb-6">Start volunteering by browsing opportunities!</p>
                <Link href="/home">
                  <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
                    Browse Opportunities
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
