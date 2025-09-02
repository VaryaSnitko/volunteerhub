'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import OpportunityCard from '../../components/OpportunityCard';
import { opportunities as mockOpportunities, Opportunity } from '../../data/opportunities';
import { addNotification, createOpportunityApprovedNotification, createSignupCancellationNotification } from '../../services/notificationService';
import { useToast } from '../../contexts/ToastContext';
import { createOpportunityApprovedToast, createSignupCancelledToast } from '../../services/toastService';
import PostOpportunityModal from '../../components/PostOpportunityModal';

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

export default function MyOpportunitiesPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [submissions, setSubmissions] = useState<VolunteerSubmission[]>([]);
  const [allOpportunities, setAllOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'signed-up' | 'completed' | 'pending' | 'posted'>('signed-up');
  const [showPostModal, setShowPostModal] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);

  // Helper function to get approval status for an opportunity
  const getApprovalStatus = (opportunity: Opportunity) => {
    // For demo purposes: opportunities posted by volunteers are pending by default
    // Mock opportunities are approved
    if (opportunity.organizationEmail === userInfo?.email) {
      // For demo: make some opportunities approved (every 3rd one to show more pending)
      const opportunityId = parseInt(opportunity.id);
      if (opportunityId % 3 === 0) {
        return 'approved';
      }
      return 'pending';
    }
    return 'approved';
  };

  useEffect(() => {
    // Check if user is logged in as volunteer or admin
    const user = localStorage.getItem('user');
    const userType = localStorage.getItem('userType');
    
    if (!user || (userType !== 'volunteer' && userType !== 'admin')) {
      router.push('/login');
      return;
    }

    // Load user info
    if (user) {
      const userData = JSON.parse(user);
      setUserInfo(userData);
    }

    // Load volunteer submissions
    const storedSubmissions = localStorage.getItem('volunteerSubmissions');
    if (storedSubmissions) {
      const allSubmissions = JSON.parse(storedSubmissions);
      // Add status to submissions (for demo purposes, we'll mark some as completed)
      const submissionsWithStatus = allSubmissions.map((submission: VolunteerSubmission, index: number) => ({
        ...submission,
        status: index % 3 === 0 ? 'completed' : 'active' // Demo: every 3rd submission is completed
      }));
      setSubmissions(submissionsWithStatus);
    }

    // Load all opportunities (mock + posted)
    let opportunities = [...mockOpportunities];
    const storedOpportunities = localStorage.getItem('opportunities');
    if (storedOpportunities) {
      const postedOpportunities = JSON.parse(storedOpportunities);
      opportunities = [...mockOpportunities, ...postedOpportunities];
    }
    setAllOpportunities(opportunities);

    setLoading(false);
  }, [router]);

  const getSignedUpOpportunities = () => {
    const signedUpIds = submissions
      .filter(submission => submission.status === 'active')
      .map(submission => submission.opportunityId);
    
    return allOpportunities.filter(opportunity => 
      signedUpIds.includes(opportunity.id)
    );
  };

  const getCompletedOpportunities = () => {
    const completedIds = submissions
      .filter(submission => submission.status === 'completed')
      .map(submission => submission.opportunityId);
    
    return allOpportunities.filter(opportunity => 
      completedIds.includes(opportunity.id)
    );
  };

  const getPendingOpportunities = () => {
    // Get opportunities posted by the current user that are pending
    return allOpportunities.filter(opportunity => 
      opportunity.organizationEmail === userInfo?.email && getApprovalStatus(opportunity) === 'pending'
    );
  };

  const getPostedOpportunities = () => {
    // Get opportunities posted by the current user that are approved
    return allOpportunities.filter(opportunity => 
      opportunity.organizationEmail === userInfo?.email && getApprovalStatus(opportunity) === 'approved'
    );
  };

  const handlePostOpportunity = (opportunityData: any) => {
    // Create new opportunity object
    const newOpp: Opportunity = {
      id: Date.now().toString(),
      ...opportunityData,
      currentSignups: 0
    };

    // Save to localStorage
    const stored = localStorage.getItem('opportunities');
    let opportunities = stored ? JSON.parse(stored) : [];
    opportunities.push(newOpp);
    localStorage.setItem('opportunities', JSON.stringify(opportunities));

    // Update state
    setAllOpportunities([...allOpportunities, newOpp]);

    // Add notification for opportunity approval (demo: auto-approve after 3 seconds)
    setTimeout(() => {
      const approvalNotification = createOpportunityApprovedNotification(newOpp.title);
      addNotification(approvalNotification);
      
      // Show toast notification
      const toast = createOpportunityApprovedToast(newOpp.title);
      showToast(toast);
    }, 3000);
  };

  const handleWithdraw = (opportunityId: string, opportunityTitle: string) => {
    if (confirm(`Are you sure you want to withdraw from "${opportunityTitle}"? This action cannot be undone.`)) {
      // Get current submissions
      const storedSubmissions = localStorage.getItem('volunteerSubmissions');
      if (storedSubmissions) {
        const submissions = JSON.parse(storedSubmissions);
        
        // Find and remove the submission for this opportunity
        const updatedSubmissions = submissions.filter((submission: VolunteerSubmission) => 
          submission.opportunityId !== opportunityId
        );
        
        // Save updated submissions
        localStorage.setItem('volunteerSubmissions', JSON.stringify(updatedSubmissions));
        
        // Update state
        const submissionsWithStatus = updatedSubmissions.map((submission: VolunteerSubmission, index: number) => ({
          ...submission,
          status: index % 3 === 0 ? 'completed' : 'active'
        }));
        setSubmissions(submissionsWithStatus);
        
        // Add notification
        const notification = createSignupCancellationNotification(opportunityTitle);
        addNotification(notification);
        
        // Show toast notification
        const toast = createSignupCancelledToast(opportunityTitle);
        showToast(toast);
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
            <p className="text-gray-600">Loading your opportunities...</p>
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
          <h1 className="text-3xl font-bold text-black mb-4">My Opportunities</h1>
          <p className="text-gray-600 text-lg">Track your volunteering journey and impact</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex flex-col sm:flex-row bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('signed-up')}
              className={`px-4 sm:px-6 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${
                activeTab === 'signed-up'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Signed Up ({getSignedUpOpportunities().length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 sm:px-6 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${
                activeTab === 'completed'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Completed ({getCompletedOpportunities().length})
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 sm:px-6 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${
                activeTab === 'pending'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Pending ({getPendingOpportunities().length})
            </button>
            <button
              onClick={() => setActiveTab('posted')}
              className={`px-4 sm:px-6 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${
                activeTab === 'posted'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Posted ({getPostedOpportunities().length})
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'signed-up' ? (
          <div>
            <h2 className="text-2xl font-bold text-black mb-6">Active Opportunities</h2>
            {getSignedUpOpportunities().length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getSignedUpOpportunities().map((opportunity) => (
                  <div key={opportunity.id} className="relative group">
                    <OpportunityCard opportunity={opportunity} />
                    
                    {/* Status badge overlay */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium shadow-sm">
                        Active
                      </span>
                    </div>
                    
                    {/* Withdraw button - appears on hover */}
                    <div className="absolute inset-0 bg-black/70 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                      <button
                        onClick={() => handleWithdraw(opportunity.id, opportunity.title)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-lg"
                      >
                        Withdraw from Opportunity
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-black mb-2">No active opportunities</h3>
                <p className="text-gray-600 mb-6">
                  You haven't signed up for any opportunities yet.
                </p>
                <Link href="/home">
                  <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
                    Browse Opportunities
                  </button>
                </Link>
              </div>
            )}
          </div>
        ) : activeTab === 'completed' ? (
          <div>
            <h2 className="text-2xl font-bold text-black mb-6">Completed Opportunities</h2>
            {getCompletedOpportunities().length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getCompletedOpportunities().map((opportunity) => (
                  <div key={opportunity.id} className="relative">
                    <OpportunityCard opportunity={opportunity} />
                    
                    {/* Status badge overlay */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium shadow-sm">
                        Completed
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold text-black mb-2">No completed opportunities yet</h3>
                <p className="text-gray-600 mb-6">
                  Complete your first opportunity to see it here!
                </p>
                <Link href="/home">
                  <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
                    Find Opportunities
                  </button>
                </Link>
              </div>
            )}
          </div>
        ) : activeTab === 'pending' ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">Pending Opportunities</h2>
              <button
                onClick={() => setShowPostModal(true)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Post Opportunity
              </button>
            </div>

            {/* Pending Opportunities */}
            {getPendingOpportunities().length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getPendingOpportunities().map((opportunity) => (
                  <div key={opportunity.id} className="relative">
                    <OpportunityCard opportunity={opportunity} />
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        Pending
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Pending Opportunities</h3>
                <p className="text-gray-500 mb-6">You don't have any pending opportunities.</p>
                <button
                  onClick={() => setShowPostModal(true)}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Post Your Opportunity
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">Posted Opportunities</h2>
            </div>

            {/* Posted Opportunities */}
            {getPostedOpportunities().length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getPostedOpportunities().map((opportunity) => (
                  <div key={opportunity.id} className="relative">
                    <OpportunityCard opportunity={opportunity} />
                    <div className="absolute top-3 right-3">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Posted
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Posted Opportunities</h3>
                <p className="text-gray-500 mb-6">You don't have any approved opportunities yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Post Opportunity Modal */}
        <PostOpportunityModal
          isOpen={showPostModal}
          onClose={() => setShowPostModal(false)}
          onSubmit={handlePostOpportunity}
          userEmail={userInfo?.email || ''}
        />
      </div>
    </div>
  );
} 