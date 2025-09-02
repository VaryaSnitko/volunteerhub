// API configuration and utility functions

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

// Helper function to make API calls
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Specific API functions for your volunteering app
export const api = {
  // Opportunities
  getOpportunities: () => apiCall('/api/opportunities'),
  getOpportunity: (id: string) => apiCall(`/api/opportunities/${id}`),
  createOpportunity: (data: any) => apiCall('/api/opportunities', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateOpportunity: (id: string, data: any) => apiCall(`/api/opportunities/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteOpportunity: (id: string) => apiCall(`/api/opportunities/${id}`, {
    method: 'DELETE',
  }),

  // Users
  getUsers: () => apiCall('/api/users'),
  getUser: (id: string) => apiCall(`/api/users/${id}`),
  createUser: (data: any) => apiCall('/api/users', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateUser: (id: string, data: any) => apiCall(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Volunteer Submissions
  getSubmissions: () => apiCall('/api/submissions'),
  getSubmission: (id: string) => apiCall(`/api/submissions/${id}`),
  createSubmission: (data: any) => apiCall('/api/submissions', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateSubmission: (id: string, data: any) => apiCall(`/api/submissions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // Notifications
  getNotifications: () => apiCall('/api/notifications'),
  createNotification: (data: any) => apiCall('/api/notifications', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  markNotificationAsRead: (id: string) => apiCall(`/api/notifications/${id}/read`, {
    method: 'PUT',
  }),

  // Auth
  login: (credentials: any) => apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: (userData: any) => apiCall('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  logout: () => apiCall('/api/auth/logout', {
    method: 'POST',
  }),
};
