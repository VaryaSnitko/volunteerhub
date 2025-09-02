# API Integration Guide

This directory contains utilities for integrating with your backend API.

## Environment Setup

The API base URL is configured in `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

## Usage

### Basic API Call
```typescript
import { api } from '../utils/api';

// Get all opportunities
const opportunities = await api.getOpportunities();

// Create a new opportunity
const newOpportunity = await api.createOpportunity({
  title: 'Beach Cleanup',
  description: 'Help clean the local beach',
  // ... other fields
});
```

### Error Handling
```typescript
import { api } from '../utils/api';

try {
  const opportunities = await api.getOpportunities();
  // Handle success
} catch (error) {
  console.error('Failed to fetch opportunities:', error);
  // Handle error
}
```

### Available API Functions

#### Opportunities
- `api.getOpportunities()` - Get all opportunities
- `api.getOpportunity(id)` - Get specific opportunity
- `api.createOpportunity(data)` - Create new opportunity
- `api.updateOpportunity(id, data)` - Update opportunity
- `api.deleteOpportunity(id)` - Delete opportunity

#### Users
- `api.getUsers()` - Get all users
- `api.getUser(id)` - Get specific user
- `api.createUser(data)` - Create new user
- `api.updateUser(id, data)` - Update user

#### Submissions
- `api.getSubmissions()` - Get all submissions
- `api.getSubmission(id)` - Get specific submission
- `api.createSubmission(data)` - Create new submission
- `api.updateSubmission(id, data)` - Update submission

#### Notifications
- `api.getNotifications()` - Get all notifications
- `api.createNotification(data)` - Create new notification
- `api.markNotificationAsRead(id)` - Mark notification as read

#### Authentication
- `api.login(credentials)` - User login
- `api.register(userData)` - User registration
- `api.logout()` - User logout

## Migration from localStorage

To migrate from localStorage to API calls:

1. Replace localStorage operations with API calls
2. Add proper error handling
3. Update loading states
4. Handle authentication tokens

Example migration:
```typescript
// Before (localStorage)
const opportunities = JSON.parse(localStorage.getItem('opportunities') || '[]');

// After (API)
const opportunities = await api.getOpportunities();
```
