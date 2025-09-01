'use client';

import { useState } from 'react';

interface Opportunity {
  id: string;
  title: string;
  image: string;
  type: string;
  location: string;
  address: string;
  description: string;
  organization: string;
  duration: string;
  commitment: string;
  fullDescription: string;
  requirements: string[];
  benefits: string[];
  contactEmail: string;
  contactPhone: string;
  organizationEmail: string;
  date: string;
  time: string;
  capacity: number;
  currentSignups: number;
}

interface PostOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (opportunity: Omit<Opportunity, 'id' | 'currentSignups'>) => void;
  userEmail: string;
}

// Mapping of opportunity types to images
const getImageForType = (type: string): string => {
  const imageMapping: { [key: string]: string } = {
    environment: '/volunteering.jpg',
    education: '/hand.jpg',
    elderly: '/people.jpg',
    healthcare: '/volunteering.jpg',
    animals: '/hand.jpg',
    community: '/people.jpg',
    youth: '/volunteering.jpg',
    food: '/hand.jpg'
  };
  return imageMapping[type] || '/volunteering.jpg';
};

export default function PostOpportunityModal({ isOpen, onClose, onSubmit, userEmail }: PostOpportunityModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    address: '',
    description: '',
    fullDescription: '',
    requirements: '',
    contactEmail: '',
    contactPhone: '',
    date: '',
    startTime: '',
    endTime: '',
    capacity: 10
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.type) {
      newErrors.type = 'Please select a type';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 200) {
      newErrors.description = 'Description must be 200 characters or less';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
    }

    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'End time must be after start time';
    }

    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Contact email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newOpportunity = {
      title: formData.title,
      image: getImageForType(formData.type),
      type: formData.type,
      location: 'in-person',
      address: formData.address,
      description: formData.description,
      organization: userEmail || 'Volunteer',
      duration: `${formData.startTime} - ${formData.endTime}`,
      commitment: 'Flexible',
      fullDescription: formData.fullDescription || formData.description,
      requirements: formData.requirements.split(',').map(req => req.trim()).filter(req => req),
      benefits: ['Make a difference', 'Gain experience', 'Meet new people'],
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      organizationEmail: userEmail || '',
      date: formData.date,
      time: `${formData.startTime} - ${formData.endTime}`,
      capacity: parseInt(formData.capacity.toString())
    };

    onSubmit(newOpportunity);
    
    // Reset form
    setFormData({
      title: '',
      type: '',
      address: '',
      description: '',
      fullDescription: '',
      requirements: '',
      contactEmail: '',
      contactPhone: '',
      date: '',
      startTime: '',
      endTime: '',
      capacity: 10
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black">Post New Opportunity</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter opportunity title"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.type ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select type</option>
                  {volunteeringTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Capacity *</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  min="1"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Start Time *</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.startTime ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">End Time *</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.endTime ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.endTime && <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter full address"
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Short Description * ({formData.description.length}/200)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                maxLength={200}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Brief description of the opportunity"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">Full Description</label>
              <textarea
                name="fullDescription"
                value={formData.fullDescription}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Detailed description of the opportunity"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">Required Skills (comma-separated)</label>
              <textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g., Comfortable working outdoors, Ability to walk for extended periods"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">Contact Email *</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    errors.contactEmail ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="your@email.com"
                />
                {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">Contact Phone</label>
                <input
                  type="tel"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Post Opportunity
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
