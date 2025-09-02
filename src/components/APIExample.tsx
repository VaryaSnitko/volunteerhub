'use client';

import { useState } from 'react';
import { 
  causeAPI, 
  opportunityAPI, 
  userAPI, 
  volunteerSubmissionAPI,
  notificationAPI,
  authAPI,
  preferencesAPI,
  type OpportunityCreate,
  type User
} from '../utils/api';

export default function APIExample() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleAPICall = async (apiFunction: () => Promise<any>, description: string) => {
    setLoading(true);
    setError('');
    setResult('');
    
    try {
      const data = await apiFunction();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Example API calls
  const examples = [
    {
      name: 'Get All Causes',
      function: () => causeAPI.getAll(),
      description: 'Retrieve all available causes from the master data'
    },
    {
      name: 'Create Cause',
      function: () => causeAPI.insert({ code: 'TEST', description: 'Test Cause' }),
      description: 'Insert a new cause into the system'
    },
    {
      name: 'Get Opportunities',
      function: () => opportunityAPI.retrieve(),
      description: 'Retrieve all volunteering opportunities'
    },
    {
      name: 'Create Opportunity',
      function: () => {
        const opportunityData: OpportunityCreate = {
          title: 'Test Event',
          type: 'ENVIRONMENT',
          eventDate: '2024-01-15',
          capacity: 10,
          startTime: '09:00',
          endTime: '12:00',
          address: '123 Test St',
          shortDescription: 'Test description',
          fullDescription: 'Full test description',
          email: 'test@example.com',
          phone: '+1234567890'
        };
        return opportunityAPI.insert(opportunityData);
      },
      description: 'Create a new volunteering opportunity'
    },
    {
      name: 'Get User',
      function: () => userAPI.getById('user-123'),
      description: 'Retrieve user information by ID'
    },
    {
      name: 'Create User',
      function: () => {
        const userData: Omit<User, 'id'> = {
          email: 'test@example.com',
          userType: 'volunteer',
          name: 'Test User',
          phoneNumber: '+1234567890'
        };
        return userAPI.create(userData);
      },
      description: 'Create a new user account'
    },
    {
      name: 'Get Submissions',
      function: () => volunteerSubmissionAPI.getByOpportunity('opp-123'),
      description: 'Get volunteer submissions for an opportunity'
    },
    {
      name: 'Get Notifications',
      function: () => notificationAPI.getUserNotifications('user-123'),
      description: 'Get notifications for a specific user'
    },
    {
      name: 'Get Preferences',
      function: () => preferencesAPI.getUserPreferences('user-123'),
      description: 'Get volunteer preferences for a user'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-black mb-6">API Function Examples</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-3">Available API Functions</h2>
        <p className="text-gray-600 mb-4">
          Click on any function below to test it. The result will be displayed below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {examples.map((example, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-black mb-2">{example.name}</h3>
            <p className="text-sm text-gray-600 mb-3">{example.description}</p>
            <button
              onClick={() => handleAPICall(example.function, example.name)}
              disabled={loading}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Loading...' : 'Test Function'}
            </button>
          </div>
        ))}
      </div>

      {/* Results Section */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Making API call...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {result && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">API Response</h3>
          <pre className="bg-white border border-gray-200 rounded p-3 overflow-x-auto text-sm text-gray-800">
            {result}
          </pre>
        </div>
      )}

      {/* Usage Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">How to Use These Functions</h3>
        <div className="text-blue-700 space-y-2">
          <p>1. <strong>Import the functions</strong> you need in your component</p>
          <p>2. <strong>Call them asynchronously</strong> using await or .then()</p>
          <p>3. <strong>Handle errors</strong> with try-catch blocks</p>
          <p>4. <strong>Update your state</strong> with the API response</p>
        </div>
        
        <div className="mt-4">
          <h4 className="font-semibold text-blue-800 mb-2">Example Usage in Component:</h4>
          <pre className="bg-white border border-blue-200 rounded p-3 overflow-x-auto text-sm text-blue-800">
{`import { opportunityAPI } from '@/utils/api';

const [opportunities, setOpportunities] = useState([]);
const [loading, setLoading] = useState(false);

const fetchOpportunities = async () => {
  setLoading(true);
  try {
    const data = await opportunityAPI.retrieve();
    setOpportunities(data);
  } catch (error) {
    console.error('Failed to fetch opportunities:', error);
  } finally {
    setLoading(false);
  }
};`}
          </pre>
        </div>
      </div>
    </div>
  );
}
