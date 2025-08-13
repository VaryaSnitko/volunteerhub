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
  { id: 'weekdays', label: 'Weekdays' },
  { id: 'weekends', label: 'Weekends' }
];

const locationOptions = [
  { id: 'in-person', label: 'In-person' },
  { id: 'online', label: 'Online' },
  { id: 'hybrid', label: 'Hybrid' }
];

export default function OnboardingForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    volunteeringTypes: [] as string[],
    preferredDays: [] as string[],
    locationPreference: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  // Load existing preferences if they exist
  useEffect(() => {
    const existingPreferences = localStorage.getItem('volunteerPreferences');
    if (existingPreferences) {
      const preferences = JSON.parse(existingPreferences);
      setFormData(preferences);
      setIsEditing(true);
    }
  }, []);

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

  const handleLocationChange = (locationId: string) => {
    setFormData(prev => ({
      ...prev,
      locationPreference: locationId
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to localStorage
    localStorage.setItem('volunteerPreferences', JSON.stringify(formData));
    
    // Set user type as volunteer
    localStorage.setItem('userType', 'volunteer');
    
    // Create user object if it doesn't exist
    const existingUser = localStorage.getItem('user');
    if (!existingUser) {
      localStorage.setItem('user', JSON.stringify({ 
        userType: 'volunteer',
        email: 'volunteer@example.com' // placeholder
      }));
    }
    
    // Redirect to home
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-4">
            {isEditing ? 'Update Your Preferences' : 'Welcome to VolunteerHub'}
          </h1>
          <p className="text-gray-600 text-lg">
            {isEditing 
              ? 'Update your volunteering preferences to see more relevant opportunities'
              : 'Tell us about your volunteering preferences to find the perfect opportunities'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Volunteering Types */}
          <div>
            <h2 className="text-xl font-semibold text-black mb-4">
              What types of volunteering interest you?
            </h2>
            <p className="text-gray-600 mb-4">Select all that apply</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {volunteeringTypes.map((type) => (
                <label
                  key={type.id}
                  className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.volunteeringTypes.includes(type.id)}
                    onChange={() => handleTypeChange(type.id)}
                    className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="ml-3 text-black">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Preferred Days */}
          <div>
            <h2 className="text-xl font-semibold text-black mb-4">
              When are you available?
            </h2>
            <p className="text-gray-600 mb-4">Select all that apply</p>
            <div className="space-y-3">
              {daysOptions.map((day) => (
                <label
                  key={day.id}
                  className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={formData.preferredDays.includes(day.id)}
                    onChange={() => handleDayChange(day.id)}
                    className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="ml-3 text-black">{day.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Location Preference */}
          <div>
            <h2 className="text-xl font-semibold text-black mb-4">
              What's your preferred location type?
            </h2>
            <div className="space-y-3">
              {locationOptions.map((location) => (
                <label
                  key={location.id}
                  className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="radio"
                    name="location"
                    checked={formData.locationPreference === location.id}
                    onChange={() => handleLocationChange(location.id)}
                    className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                  />
                  <span className="ml-3 text-black">{location.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              {isEditing ? 'Update Preferences' : 'Find Opportunities'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 