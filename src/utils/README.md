# API Integration Guide

This document describes how to use the backend API functions for the VolunteerHub application.

## Setup

### 1. Environment Variables
Create a `.env.local` file in your project root:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

### 2. Staff Headers
The API automatically includes staff headers from localStorage:
- `x-staff-name`: Staff member name (defaults to "Test")
- `x-staff-id`: Staff member ID (defaults to "S482917")

You can set these in localStorage:
```javascript
localStorage.setItem('staffName', 'Your Name');
localStorage.setItem('staffId', 'Your Staff ID');
```

## API Functions

### Master Data Management

#### Cause Management
```typescript
import { causeAPI } from '@/utils/api';

// Insert a new cause
const newCause = await causeAPI.insert({
  code: "SPRINTER",
  description: "Sprinter Cause"
});

// Get all causes
const causes = await causeAPI.getAll();
```

### Opportunity Management

#### Create Opportunity
```typescript
import { opportunityAPI, type OpportunityCreate } from '@/utils/api';

const opportunityData: OpportunityCreate = {
  title: "Community Cleanup",
  type: "ENVIRONMENT",
  eventDate: "2024-01-15",
  capacity: 20,
  startTime: "09:00",
  endTime: "12:00",
  address: "123 Main St, City",
  shortDescription: "Help clean up the local park",
  fullDescription: "Join us for a community cleanup event...",
  email: "contact@example.com",
  phone: "+1234567890"
};

const newOpportunity = await opportunityAPI.insert(opportunityData);
```

#### Retrieve Opportunities
```typescript
// Get all opportunities
const opportunities = await opportunityAPI.retrieve();

// Get opportunity by ID
const opportunity = await opportunityAPI.getById("opp-123");

// Update opportunity
const updated = await opportunityAPI.update("opp-123", {
  capacity: 25,
  startTime: "10:00"
});

// Delete opportunity
await opportunityAPI.delete("opp-123");
```

### User Management

#### User Operations
```typescript
import { userAPI, type User } from '@/utils/api';

// Create new user
const newUser = await userAPI.create({
  email: "volunteer@example.com",
  userType: "volunteer",
  name: "John Doe",
  phoneNumber: "+1234567890"
});

// Get user by ID
const user = await userAPI.getById("user-123");

// Update user
const updatedUser = await userAPI.update("user-123", {
  name: "John Smith",
  profilePicture: "profile.jpg"
});

// Delete user
await userAPI.delete("user-123");
```

### Volunteer Submissions

#### Manage Submissions
```typescript
import { volunteerSubmissionAPI, type VolunteerSubmission } from '@/utils/api';

// Submit volunteer application
const submission = await volunteerSubmissionAPI.submit({
  opportunityId: "opp-123",
  volunteerId: "user-456",
  status: "pending",
  motivation: "I want to help the community"
});

// Get submissions by opportunity
const opportunitySubmissions = await volunteerSubmissionAPI.getByOpportunity("opp-123");

// Get submissions by volunteer
const volunteerSubmissions = await volunteerSubmissionAPI.getByVolunteer("user-456");

// Update submission status
await volunteerSubmissionAPI.updateStatus("sub-789", "approved");

// Delete submission
await volunteerSubmissionAPI.delete("sub-789");
```

### Notifications

#### Notification Management
```typescript
import { notificationAPI, type Notification } from '@/utils/api';

// Get user notifications
const notifications = await notificationAPI.getUserNotifications("user-123");

// Mark notification as read
await notificationAPI.markAsRead("notif-456");

// Mark all notifications as read
await notificationAPI.markAllAsRead("user-123");

// Delete notification
await notificationAPI.delete("notif-456");
```

### Authentication

#### User Authentication
```typescript
import { authAPI, type LoginCredentials, type AuthResponse } from '@/utils/api';

// User login
const authResponse: AuthResponse = await authAPI.login({
  email: "user@example.com",
  password: "password123"
});

// User registration
const newUser = await authAPI.register({
  email: "newuser@example.com",
  password: "password123",
  userType: "volunteer",
  name: "New User"
});

// User logout
await authAPI.logout();

// Refresh token
const refreshResponse = await authAPI.refreshToken();
```

### Preference Management

#### Volunteer Preferences
```typescript
import { preferencesAPI, type VolunteerPreferences } from '@/utils/api';

// Get user preferences
const preferences = await preferencesAPI.getUserPreferences("user-123");

// Create/update preferences
const updatedPreferences = await preferencesAPI.upsert("user-123", {
  volunteeringTypes: ["environment", "education", "healthcare"],
  preferredDays: ["monday", "wednesday", "friday"],
  phoneNumber: "+1234567890"
});

// Delete preferences
await preferencesAPI.delete("user-123");
```

## Error Handling

All API functions include proper error handling:

```typescript
try {
  const opportunities = await opportunityAPI.retrieve();
  console.log('Opportunities:', opportunities);
} catch (error) {
  if (error instanceof Error) {
    console.error('API Error:', error.message);
  } else {
    console.error('Unknown error occurred');
  }
}
```

## TypeScript Support

All functions are fully typed with TypeScript interfaces:

```typescript
// Opportunity creation with full type safety
const opportunity: OpportunityCreate = {
  title: "Event Title",
  type: "ENVIRONMENT",
  eventDate: "2024-01-15",
  capacity: 10,
  startTime: "09:00",
  endTime: "12:00",
  address: "123 Main St",
  shortDescription: "Short description",
  fullDescription: "Full description",
  email: "contact@example.com",
  phone: "+1234567890"
};

const result = await opportunityAPI.insert(opportunity);
```

## Migration from localStorage

To migrate from localStorage to the backend API:

1. **Replace localStorage calls** with API function calls
2. **Update error handling** to use try-catch blocks
3. **Add loading states** for async operations
4. **Update state management** to handle API responses

### Example Migration

**Before (localStorage):**
```typescript
// Old way
const opportunities = JSON.parse(localStorage.getItem('opportunities') || '[]');
localStorage.setItem('opportunities', JSON.stringify(newOpportunities));
```

**After (API):**
```typescript
// New way
const opportunities = await opportunityAPI.retrieve();
const newOpportunity = await opportunityAPI.insert(opportunityData);
```

## Testing

You can test the API endpoints using the provided Postman collection or by calling the functions directly in your components.

## Notes

- All API calls are asynchronous and return Promises
- Staff headers are automatically included in all requests
- Error handling is consistent across all functions
- TypeScript interfaces provide full type safety
- The API client uses axios for HTTP requests
