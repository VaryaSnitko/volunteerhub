'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const causeAreas = [
  { id: 'environment', label: 'Environment & Conservation' },
  { id: 'education', label: 'Education & Tutoring' },
  { id: 'elderly', label: 'Elderly Care' },
  { id: 'healthcare', label: 'Healthcare & Medical' },
  { id: 'animals', label: 'Animal Welfare' },
  { id: 'community', label: 'Community Service' },
  { id: 'youth', label: 'Youth Development' },
  { id: 'food', label: 'Food Security & Hunger' }
];

export default function OrganizationOnboardingForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    // Account Information
    organizationName: '',
    email: '',
    password: '',
    phoneNumber: '',
    
    // Verification
    websiteUrl: '',
    
    // Profile & Branding
    logo: null as File | null,
    shortDescription: '',
    aboutUs: '',
    causeAreas: [] as string[],
    
    // Location
    address: '',
    
    // Contact Person
    contactName: '',
    contactRole: '',
    contactEmail: '',
    contactPhone: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({
      ...prev,
      logo: file
    }));
  };

  const handleCauseAreaChange = (causeId: string) => {
    setFormData(prev => ({
      ...prev,
      causeAreas: prev.causeAreas.includes(causeId)
        ? prev.causeAreas.filter(id => id !== causeId)
        : [...prev.causeAreas, causeId]
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    // Required fields validation
    if (!formData.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.contactName.trim()) {
      newErrors.contactName = 'Contact person name is required';
    }

    if (!formData.contactRole.trim()) {
      newErrors.contactRole = 'Contact person role is required';
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid contact email address';
    }

    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'Short description is required';
    }

    if (formData.causeAreas.length === 0) {
      newErrors.causeAreas = 'Please select at least one cause area';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Store organization data
      const organizationData = {
        ...formData,
        id: Date.now().toString(),
        userType: 'social-organization',
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('organizationData', JSON.stringify(organizationData));
      localStorage.setItem('user', JSON.stringify({ 
        email: formData.email, 
        userType: 'social-organization' 
      }));

      // Show success message and redirect
      alert('Organization registered successfully! Welcome to VolunteerHub.');
      router.push('/home');
    } catch (error) {
      console.error('Error saving organization data:', error);
      alert('There was an error saving your organization data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-4">
            Organization Registration
          </h1>
          <p className="text-gray-600 text-lg">
            Complete your organization profile to start posting volunteering opportunities
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Account Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-black mb-4">1. Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="organizationName" className="block text-sm font-medium text-black mb-2">
                  Organization Name *
                </label>
                <input
                  type="text"
                  id="organizationName"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.organizationName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter organization name"
                />
                {errors.organizationName && (
                  <p className="mt-1 text-sm text-red-600">{errors.organizationName}</p>
                )}
              </div>

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
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-black mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </div>

          {/* Verification */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-black mb-4">2. Verification / Legitimacy</h2>
            <div>
              <label htmlFor="websiteUrl" className="block text-sm font-medium text-black mb-2">
                Website URL
              </label>
              <input
                type="url"
                id="websiteUrl"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="https://your-organization.org"
              />
              <p className="mt-1 text-sm text-gray-500">Optional but builds trust</p>
            </div>
          </div>

          {/* Profile & Branding */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-black mb-4">3. Profile & Branding</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="logo" className="block text-sm font-medium text-black mb-2">
                  Organization Logo
                </label>
                <input
                  type="file"
                  id="logo"
                  name="logo"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label htmlFor="shortDescription" className="block text-sm font-medium text-black mb-2">
                  Short Description *
                </label>
                <textarea
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.shortDescription ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Brief description of your organization's mission (1-2 sentences)"
                />
                {errors.shortDescription && (
                  <p className="mt-1 text-sm text-red-600">{errors.shortDescription}</p>
                )}
              </div>

              <div>
                <label htmlFor="aboutUs" className="block text-sm font-medium text-black mb-2">
                  About Us
                </label>
                <textarea
                  id="aboutUs"
                  name="aboutUs"
                  value={formData.aboutUs}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Tell us more about your organization's story, history, and impact..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Main Cause Areas *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {causeAreas.map((cause) => (
                    <label
                      key={cause.id}
                      className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.causeAreas.includes(cause.id)}
                        onChange={() => handleCauseAreaChange(cause.id)}
                        className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      />
                      <span className="ml-3 text-black">{cause.label}</span>
                    </label>
                  ))}
                </div>
                {errors.causeAreas && (
                  <p className="mt-1 text-sm text-red-600">{errors.causeAreas}</p>
                )}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-black mb-4">4. Location & Reach</h2>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-black mb-2">
                Address *
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your organization's address"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>
          </div>

          {/* Contact Person */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-black mb-4">5. Contact Person</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-black mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.contactName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter contact person's full name"
                />
                {errors.contactName && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactName}</p>
                )}
              </div>

              <div>
                <label htmlFor="contactRole" className="block text-sm font-medium text-black mb-2">
                  Role/Position *
                </label>
                <input
                  type="text"
                  id="contactRole"
                  name="contactRole"
                  value={formData.contactRole}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.contactRole ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Volunteer Coordinator"
                />
                {errors.contactRole && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactRole}</p>
                )}
              </div>

              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-black mb-2">
                  Contact Email *
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.contactEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter contact email"
                />
                {errors.contactEmail && (
                  <p className="mt-1 text-sm text-red-600">{errors.contactEmail}</p>
                )}
              </div>

              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-black mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Enter contact phone"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full max-w-md bg-red-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Registering...' : 'Register Organization'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 