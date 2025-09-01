import { Toast } from '../components/ToastNotification';

// Toast types
export const TOAST_TYPES = {
  SIGNUP_SUCCESS: 'signup_success',
  OPPORTUNITY_APPROVED: 'opportunity_approved',
  SIGNUP_CANCELLED: 'signup_cancelled',
  EVENT_REMINDER: 'event_reminder',
  EVENT_UPDATED: 'event_updated',
  EVENT_CANCELLED: 'event_cancelled',
  FEEDBACK_REQUEST: 'feedback_request'
} as const;

// Create toast functions
export const createToast = (
  type: string,
  title: string,
  message: string,
  duration?: number
): Toast => {
  return {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    type: getToastType(type),
    title,
    message,
    duration
  };
};

// Helper function to determine toast type based on action
const getToastType = (type: string): 'success' | 'info' | 'warning' | 'error' => {
  switch (type) {
    case TOAST_TYPES.SIGNUP_SUCCESS:
    case TOAST_TYPES.OPPORTUNITY_APPROVED:
      return 'success';
    case TOAST_TYPES.EVENT_REMINDER:
    case TOAST_TYPES.EVENT_UPDATED:
    case TOAST_TYPES.FEEDBACK_REQUEST:
      return 'info';
    case TOAST_TYPES.SIGNUP_CANCELLED:
      return 'warning';
    case TOAST_TYPES.EVENT_CANCELLED:
      return 'error';
    default:
      return 'info';
  }
};

// Specific toast creators
export const createSignupSuccessToast = (opportunityTitle: string): Toast => {
  return createToast(
    TOAST_TYPES.SIGNUP_SUCCESS,
    'Signup Successful!',
    `You've successfully signed up for "${opportunityTitle}". We'll be in touch soon!`,
    4000
  );
};

export const createOpportunityApprovedToast = (opportunityTitle: string): Toast => {
  return createToast(
    TOAST_TYPES.OPPORTUNITY_APPROVED,
    'Opportunity Approved!',
    `Your volunteering opportunity "${opportunityTitle}" was approved by the admin.`,
    5000
  );
};

export const createSignupCancelledToast = (opportunityTitle: string): Toast => {
  return createToast(
    TOAST_TYPES.SIGNUP_CANCELLED,
    'Signup Cancelled',
    `You have cancelled your signup for "${opportunityTitle}".`,
    4000
  );
};

export const createEventReminderToast = (opportunityTitle: string, time: string): Toast => {
  return createToast(
    TOAST_TYPES.EVENT_REMINDER,
    'Event Reminder',
    `Reminder: "${opportunityTitle}" starts tomorrow at ${time}.`,
    6000
  );
};

export const createEventUpdatedToast = (opportunityTitle: string): Toast => {
  return createToast(
    TOAST_TYPES.EVENT_UPDATED,
    'Event Updated',
    `The details of "${opportunityTitle}" have changed. Please check the updated information.`,
    5000
  );
};

export const createEventCancelledToast = (opportunityTitle: string): Toast => {
  return createToast(
    TOAST_TYPES.EVENT_CANCELLED,
    'Event Cancelled',
    `The opportunity "${opportunityTitle}" has been cancelled.`,
    6000
  );
};

export const createFeedbackRequestToast = (opportunityTitle: string): Toast => {
  return createToast(
    TOAST_TYPES.FEEDBACK_REQUEST,
    'Thank You for Volunteering!',
    `Thank you for volunteering at "${opportunityTitle}"! Please share your feedback.`,
    7000
  );
};
