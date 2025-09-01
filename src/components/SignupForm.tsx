'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addNotification, createSignupConfirmationNotification } from '../services/notificationService';
import { useToast } from '../contexts/ToastContext';
import { createSignupSuccessToast } from '../services/toastService';

interface SignupFormProps {
  opportunityId: string;
  opportunityTitle: string;
}

export default function SignupForm({ opportunityId, opportunityTitle }: SignupFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    motivation: ''
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.motivation.trim()) {
      newErrors.motivation = 'Please tell us why you want to volunteer';
    } else if (formData.motivation.trim().length < 10) {
      newErrors.motivation = 'Motivation must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Get existing submissions or create new array
      const existingSubmissions = JSON.parse(localStorage.getItem('volunteerSubmissions') || '[]');
      
      const submission = {
        id: Date.now().toString(),
        opportunityId,
        opportunityTitle,
        ...formData,
        submittedAt: new Date().toISOString()
      };

      // Update user info with name if not already set
      const existingUser = localStorage.getItem('user');
      if (existingUser) {
        const userData = JSON.parse(existingUser);
        if (!userData.name && formData.name) {
          userData.name = formData.name;
          localStorage.setItem('user', JSON.stringify(userData));
        }
      }

      // Add new submission
      existingSubmissions.push(submission);
      localStorage.setItem('volunteerSubmissions', JSON.stringify(existingSubmissions));

      // Add notification
      const notification = createSignupConfirmationNotification(opportunityTitle);
      addNotification(notification);

      // Show toast notification
      const toast = createSignupSuccessToast(opportunityTitle);
      showToast(toast);

      // Redirect after a short delay to show the toast
      setTimeout(() => {
        router.push('/home');
      }, 1000);
    } catch (error) {
      console.error('Error saving submission:', error);
      alert('There was an error saving your submission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-4">
            Sign Up to Volunteer
          </h1>
          <p className="text-gray-600 text-lg">
            Join us in making a difference
          </p>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h2 className="font-semibold text-black">{opportunityTitle}</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Motivation Field */}
          <div>
            <label htmlFor="motivation" className="block text-sm font-medium text-black mb-2">
              Why do you want to volunteer for this opportunity? *
            </label>
            <textarea
              id="motivation"
              name="motivation"
              value={formData.motivation}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                errors.motivation ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Tell us about your motivation and what you hope to contribute..."
            />
            {errors.motivation && (
              <p className="mt-1 text-sm text-red-600">{errors.motivation}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Sign Up to Volunteer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 