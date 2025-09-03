import axios from 'axios';

// API Base URL from environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

// Axios instance with default configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add staff headers
apiClient.interceptors.request.use((config: any) => {
  // Add staff headers from localStorage or environment
  const staffName = localStorage.getItem('staffName') || 'Test';
  const staffId = localStorage.getItem('staffId') || 'S482917';
  
  config.headers['x-staff-name'] = staffName;
  config.headers['x-staff-id'] = staffId;
  
  return config;
});

// Generic API call function
export const apiCall = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  endpoint: string,
  data?: any
): Promise<T> => {
  try {
    const response = await apiClient.request({
      method,
      url: endpoint,
      data,
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || error.message);
    }
    throw error;
  }
};

// ===== MASTER DATA API FUNCTIONS =====

// Cause Management
export const causeAPI = {
  // Insert a new cause
  insert: async (causeData: { code: string; description: string }) => {
    return apiCall('POST', '/cause', causeData);
  },

  // Get all causes
  getAll: async () => {
    return apiCall('GET', '/cause');
  },
};

// ===== OPPORTUNITY API FUNCTIONS =====

// Opportunity interface based on Postman data
export interface OpportunityCreate {
  title: string;
  type: string;
  eventDate: string;
  capacity: number;
  startTime: string;
  endTime: string;
  address: string;
  shortDescription: string;
  fullDescription: string;
  email: string;
  phone: string;
}

export const opportunityAPI = {
  // Insert a new opportunity
  insert: async (opportunityData: OpportunityCreate) => {
    return apiCall('POST', '/opportunity', opportunityData);
  },

  // Retrieve opportunities
  retrieve: async () => {
    return apiCall('GET', '/opportunity');
  },

  // Get opportunity by ID
  getById: async (id: string) => {
    return apiCall('GET', `/opportunity/${id}`);
  },

  // Update opportunity
  update: async (id: string, opportunityData: Partial<OpportunityCreate>) => {
    return apiCall('PUT', `/opportunity/${id}`, opportunityData);
  },

  // Delete opportunity
  delete: async (id: string) => {
    return apiCall('DELETE', `/opportunity/${id}`);
  },
};

// ===== USER MANAGEMENT API FUNCTIONS =====

export interface User {
  id: string;
  email: string;
  userType: 'volunteer' | 'admin';
  name?: string;
  profilePicture?: string;
  phoneNumber?: string;
}

export const userAPI = {
  // Create new user
  create: async (userData: Omit<User, 'id'>) => {
    return apiCall('POST', '/user', userData);
  },

  // Get user by ID
  getById: async (id: string) => {
    return apiCall('GET', `/user/${id}`);
  },

  // Update user
  update: async (id: string, userData: Partial<User>) => {
    return apiCall('PUT', `/user/${id}`, userData);
  },

  // Delete user
  delete: async (id: string) => {
    return apiCall('DELETE', `/user/${id}`);
  },
};

// ===== VOLUNTEER SUBMISSIONS API FUNCTIONS =====

export interface VolunteerSubmission {
  id: string;
  opportunityId: string;
  volunteerId: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  motivation?: string;
}

export const volunteerSubmissionAPI = {
  // Submit volunteer application
  submit: async (submissionData: Omit<VolunteerSubmission, 'id' | 'submittedAt'>) => {
    return apiCall('POST', '/volunteer-submission', submissionData);
  },

  // Get submission by ID
  getById: async (id: string) => {
    return apiCall('GET', `/volunteer-submission/${id}`);
  },

  // Get submissions by opportunity
  getByOpportunity: async (opportunityId: string) => {
    return apiCall('GET', `/volunteer-submission/opportunity/${opportunityId}`);
  },

  // Get submissions by volunteer
  getByVolunteer: async (volunteerId: string) => {
    return apiCall('GET', `/volunteer-submission/volunteer/${volunteerId}`);
  },

  // Update submission status
  updateStatus: async (id: string, status: VolunteerSubmission['status']) => {
    return apiCall('PUT', `/volunteer-submission/${id}/status`, { status });
  },

  // Delete submission
  delete: async (id: string) => {
    return apiCall('DELETE', `/volunteer-submission/${id}`);
  },
};
// ===== NOTIFICATIONS API FUNCTIONS =====

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationAPI = {
  // Get user notifications
  getUserNotifications: async (userId: string) => {
    return apiCall('GET', `/notification/user/${userId}`);
  },

  // Mark notification as read
  markAsRead: async (id: string) => {
    return apiCall('PUT', `/notification/${id}/read`);
  },

  // Mark all notifications as read
  markAllAsRead: async (userId: string) => {
    return apiCall('PUT', `/notification/user/${userId}/read-all`);
  },

  // Delete notification
  delete: async (id: string) => {
    return apiCall('DELETE', `/notification/${id}`);
  },
};

// ===== AUTHENTICATION API FUNCTIONS =====

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authAPI = {
  // User login
  login: async (credentials: LoginCredentials) => {
    return apiCall<AuthResponse>('POST', '/auth/login', credentials);
  },

  // User registration
  register: async (userData: Omit<User, 'id'> & { password: string }) => {
    return apiCall<AuthResponse>('POST', '/auth/register', userData);
  },

  // User logout
  logout: async () => {
    return apiCall('POST', '/auth/logout');
  },

  // Refresh token
  refreshToken: async () => {
    return apiCall<{ token: string }>('POST', '/auth/refresh');
  },
};

// ===== PREFERENCE MANAGEMENT API FUNCTIONS =====

export interface VolunteerPreferences {
  id: string;
  userId: string;
  volunteeringTypes: string[];
  preferredDays: string[];
  phoneNumber?: string;
}

export const preferencesAPI = {
  // Get user preferences
  getUserPreferences: async (userId: string) => {
    return apiCall<VolunteerPreferences>('GET', `/preferences/user/${userId}`);
  },

  // Create/update preferences
  upsert: async (userId: string, preferences: Omit<VolunteerPreferences, 'id' | 'userId'>) => {
    return apiCall('PUT', `/preferences/user/${userId}`, preferences);
  },

  // Delete preferences
  delete: async (userId: string) => {
    return apiCall('DELETE', `/preferences/user/${userId}`);
  },
};

// Export the API client for direct use if needed
export { apiClient };
export { API_BASE_URL };
