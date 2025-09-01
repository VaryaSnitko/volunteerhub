'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const volunteeringTypes = [
  { id: 'environment', label: 'Environment & Conservation' },
  { id: 'education', label: 'Education & Tutoring' },
  { id: 'elderly', label: 'Elderly Care' },
  { id: 'healthcare', label: 'Healthcare & Medical' },
  { id: 'animals', label: 'Animal Welfare' },
  { id: 'community', label: 'Community Service' },
  { id: 'youth', label: 'Youth Development' },
  { id: 'food', label: 'Food Security & Hunger' }
];

const daysOptions = [
  { id: 'monday', label: 'Monday' },
  { id: 'tuesday', label: 'Tuesday' },
  { id: 'wednesday', label: 'Wednesday' },
  { id: 'thursday', label: 'Thursday' },
  { id: 'friday', label: 'Friday' },
  { id: 'saturday', label: 'Saturday' },
  { id: 'sunday', label: 'Sunday' }
];

interface OnboardingFormProps {
  isUpdateMode?: boolean;
}

export default function OnboardingForm({ isUpdateMode = false }: OnboardingFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    volunteeringTypes: [] as string[],
    preferredDays: [] as string[]
  });

  // Load existing preferences only if in update mode
  useEffect(() => {
    if (isUpdateMode) {
      const existingPreferences = localStorage.getItem('volunteerPreferences');
      if (existingPreferences) {
        const preferences = JSON.parse(existingPreferences);
        setFormData(preferences);
      }
    }
  }, [isUpdateMode]);

  const handleTypeChange = (typeId: string) => {
    setFormData(prev => ({
      ...prev,
      volunteeringTypes: prev.volunteeringTypes.includes(typeId)
        ? prev.volunteeringTypes.filter(id => id !== typeId)
        : [...prev.volunteeringTypes, typeId]
    }));
  };

  const handleDayChange = (dayId: string) => {
    setFormData(prev => ({
      ...prev,
      preferredDays: prev.preferredDays.includes(dayId)
        ? prev.preferredDays.filter(id => id !== dayId)
        : [...prev.preferredDays, dayId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to localStorage
    localStorage.setItem('volunteerPreferences', JSON.stringify(formData));
    
    if (!isUpdateMode) {
      // Set user type as volunteer (only for new signups)
      localStorage.setItem('userType', 'volunteer');
      
      // Create user object if it doesn't exist
      const existingUser = localStorage.getItem('user');
      if (!existingUser) {
        localStorage.setItem('user', JSON.stringify({ 
          userType: 'volunteer',
          email: 'volunteer@example.com', // placeholder
          name: 'Volunteer',
          profilePicture: '' // Will show initials by default
        }));
      }
      
      // Redirect to home for new signups
      router.push('/home');
    } else {
      // For update mode, go back to profile
      router.push('/profile');
    }
  };

  return (
    <div className="min-h-screen bg-white py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-3 sm:mb-4">
            {isUpdateMode ? 'Update Your Preferences' : 'Welcome to VolunteerHub'}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {isUpdateMode 
              ? 'Update your volunteering preferences to get better recommendations.'
              : 'Tell us about your volunteering preferences to get personalized recommendations.'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          {/* Volunteering Types */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-black mb-4">
              What types of volunteering interest you?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {volunteeringTypes.map((type) => (
                <label
                  key={type.id}
                  className={`flex items-center p-3 sm:p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.volunteeringTypes.includes(type.id)
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.volunteeringTypes.includes(type.id)}
                    onChange={() => handleTypeChange(type.id)}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${
                      formData.volunteeringTypes.includes(type.id)
                        ? 'border-red-500 bg-red-500'
                        : 'border-gray-300'
                    }`}>
                      {formData.volunteeringTypes.includes(type.id) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm sm:text-base text-black">{type.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Preferred Days */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-black mb-4">
              When are you available to volunteer?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {daysOptions.map((day) => (
                <label
                  key={day.id}
                  className={`flex items-center p-3 sm:p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.preferredDays.includes(day.id)
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.preferredDays.includes(day.id)}
                    onChange={() => handleDayChange(day.id)}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${
                      formData.preferredDays.includes(day.id)
                        ? 'border-red-500 bg-red-500'
                        : 'border-gray-300'
                    }`}>
                      {formData.preferredDays.includes(day.id) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm sm:text-base text-black">{day.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 sm:py-4 px-6 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              {isUpdateMode ? 'Update Preferences' : 'Get Started'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 