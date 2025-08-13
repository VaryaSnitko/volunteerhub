'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

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

const locationOptions = [
  { id: 'in-person', label: 'In-person' },
  { id: 'online', label: 'Online' },
  { id: 'hybrid', label: 'Hybrid' }
];

export default function EditOpportunityPage() {
  const router = useRouter();
  const params = useParams();
  const opportunityId = params.id as string;
  
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    type: '',
    location: '',
    description: '',
    organization: '',
    duration: '',
    commitment: '',
    fullDescription: '',
    requirements: '',
    benefits: '',
    contactEmail: '',
    contactPhone: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load opportunity data
    const stored = localStorage.getItem('opportunities');
    if (stored) {
      const opportunities = JSON.parse(stored);
      const opportunity = opportunities.find((opp: any) => opp.id === opportunityId);
      
      if (opportunity) {
        setFormData({
          title: opportunity.title || '',
          image: opportunity.image || '',
          type: opportunity.type || '',
          location: opportunity.location || '',
          description: opportunity.description || '',
          organization: opportunity.organization || '',
          duration: opportunity.duration || '',
          commitment: opportunity.commitment || '',
          fullDescription: opportunity.fullDescription || '',
          requirements: Array.isArray(opportunity.requirements) ? opportunity.requirements.join('\n') : '',
          benefits: Array.isArray(opportunity.benefits) ? opportunity.benefits.join('\n') : '',
          contactEmail: opportunity.contactEmail || '',
          contactPhone: opportunity.contactPhone || ''
        });
      } else {
        setError('Opportunity not found');
      }
    } else {
      setError('No opportunities found');
    }
    setLoading(false);
  }, [opportunityId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.title || !formData.type || !formData.location || !formData.description) {
      setError('Please fill in all required fields.');
      setIsSubmitting(false);
      return;
    }

    // Get current opportunities
    const stored = localStorage.getItem('opportunities');
    if (!stored) {
      setError('No opportunities found');
      setIsSubmitting(false);
      return;
    }

    const opportunities = JSON.parse(stored);
    const opportunityIndex = opportunities.findIndex((opp: any) => opp.id === opportunityId);
    
    if (opportunityIndex === -1) {
      setError('Opportunity not found');
      setIsSubmitting(false);
      return;
    }

    // Update the opportunity
    opportunities[opportunityIndex] = {
      ...opportunities[opportunityIndex],
      ...formData,
      requirements: formData.requirements.split('\n').filter(Boolean),
      benefits: formData.benefits.split('\n').filter(Boolean),
      updatedAt: new Date().toISOString(),
    };

    // Save back to localStorage
    localStorage.setItem('opportunities', JSON.stringify(opportunities));

    // Redirect to home
    router.push('/home');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading opportunity...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/home')}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-4">Edit Opportunity</h1>
          <p className="text-gray-600 text-lg">Update the details of your volunteering opportunity</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-black mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">Image URL (optional)</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="/volunteering.jpg or https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="">Select type</option>
              {volunteeringTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">Location *</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="">Select location</option>
              {locationOptions.map((loc) => (
                <option key={loc.id} value={loc.id}>{loc.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">Short Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">Full Description</label>
            <textarea
              name="fullDescription"
              value={formData.fullDescription}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">Requirements (one per line)</label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black mb-2">Benefits (one per line)</label>
            <textarea
              name="benefits"
              value={formData.benefits}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Contact Phone</label>
              <input
                type="text"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div className="pt-6 flex gap-4">
            <button
              type="button"
              onClick={() => router.push('/home')}
              className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Updating...' : 'Update Opportunity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 