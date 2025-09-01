import { Notification } from '../components/NotificationBell';

// Notification types
export const NOTIFICATION_TYPES = {
  OPPORTUNITY_APPROVED: 'opportunity_approved',
  SIGNUP_CONFIRMATION: 'signup_confirmation',
  SIGNUP_CANCELLATION: 'signup_cancellation',
  EVENT_REMINDER: 'event_reminder',
  EVENT_UPDATE: 'event_update',
  EVENT_CANCELLED: 'event_cancelled',
  POST_EVENT_FEEDBACK: 'post_event_feedback'
} as const;

// Create notification functions
export const createNotification = (
  type: string,
  title: string,
  message: string,
  opportunityId?: string
): Notification => {
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    type: getNotificationType(type),
    title,
    message,
    timestamp: new Date(),
    read: false,
    opportunityId
  };
};

// Helper function to determine notification type based on action
const getNotificationType = (type: string): 'success' | 'info' | 'warning' | 'error' => {
  switch (type) {
    case NOTIFICATION_TYPES.OPPORTUNITY_APPROVED:
    case NOTIFICATION_TYPES.SIGNUP_CONFIRMATION:
      return 'success';
    case NOTIFICATION_TYPES.EVENT_REMINDER:
    case NOTIFICATION_TYPES.EVENT_UPDATE:
    case NOTIFICATION_TYPES.POST_EVENT_FEEDBACK:
      return 'info';
    case NOTIFICATION_TYPES.SIGNUP_CANCELLATION:
      return 'warning';
    case NOTIFICATION_TYPES.EVENT_CANCELLED:
      return 'error';
    default:
      return 'info';
  }
};

// Specific notification creators
export const createOpportunityApprovedNotification = (opportunityTitle: string): Notification => {
  return createNotification(
    NOTIFICATION_TYPES.OPPORTUNITY_APPROVED,
    'Opportunity Approved',
    `Your volunteering opportunity "${opportunityTitle}" was approved by the admin.`
  );
};

export const createSignupConfirmationNotification = (opportunityTitle: string): Notification => {
  return createNotification(
    NOTIFICATION_TYPES.SIGNUP_CONFIRMATION,
    'Signup Confirmation',
    `You successfully signed up for "${opportunityTitle}".`
  );
};

export const createSignupCancellationNotification = (opportunityTitle: string): Notification => {
  return createNotification(
    NOTIFICATION_TYPES.SIGNUP_CANCELLATION,
    'Signup Cancelled',
    `You have cancelled your signup for "${opportunityTitle}".`
  );
};

export const createEventReminderNotification = (opportunityTitle: string, time: string): Notification => {
  return createNotification(
    NOTIFICATION_TYPES.EVENT_REMINDER,
    'Event Reminder',
    `Reminder: "${opportunityTitle}" starts tomorrow at ${time}.`
  );
};

export const createEventUpdateNotification = (opportunityTitle: string): Notification => {
  return createNotification(
    NOTIFICATION_TYPES.EVENT_UPDATE,
    'Event Updated',
    `The details of "${opportunityTitle}" have changed.`
  );
};

export const createEventCancelledNotification = (opportunityTitle: string): Notification => {
  return createNotification(
    NOTIFICATION_TYPES.EVENT_CANCELLED,
    'Event Cancelled',
    `The opportunity "${opportunityTitle}" has been cancelled.`
  );
};

export const createPostEventFeedbackNotification = (opportunityTitle: string): Notification => {
  return createNotification(
    NOTIFICATION_TYPES.POST_EVENT_FEEDBACK,
    'Thank You for Volunteering',
    `Thank you for volunteering at "${opportunityTitle}"! Please share feedback.`
  );
};

// Local storage management
export const getNotifications = (): Notification[] => {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem('notifications');
  if (!stored) return [];
  
  try {
    const notifications = JSON.parse(stored);
    return notifications.map((n: any) => ({
      ...n,
      timestamp: new Date(n.timestamp)
    }));
  } catch (error) {
    console.error('Error parsing notifications:', error);
    return [];
  }
};

export const saveNotifications = (notifications: Notification[]): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('notifications', JSON.stringify(notifications));
};

export const addNotification = (notification: Notification): void => {
  const notifications = getNotifications();
  notifications.unshift(notification); // Add to beginning
  
  // Keep only last 50 notifications
  if (notifications.length > 50) {
    notifications.splice(50);
  }
  
  saveNotifications(notifications);
};

export const markNotificationAsRead = (id: string): void => {
  const notifications = getNotifications();
  const updated = notifications.map(n => 
    n.id === id ? { ...n, read: true } : n
  );
  saveNotifications(updated);
};

export const markAllNotificationsAsRead = (): void => {
  const notifications = getNotifications();
  const updated = notifications.map(n => ({ ...n, read: true }));
  saveNotifications(updated);
};

export const deleteNotification = (id: string): void => {
  const notifications = getNotifications();
  const updated = notifications.filter(n => n.id !== id);
  saveNotifications(updated);
};

export const clearAllNotifications = (): void => {
  saveNotifications([]);
};
