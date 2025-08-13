'use client';

import { useState } from 'react';
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

const locationOptions = [
  { id: 'in-person', label: 'In-person' },
  { id: 'online', label: 'Online' },
  { id: 'hybrid', label: 'Hybrid' }
];

export default function NewOpportunityPage() {
  const router = useRouter();
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

    // Get org info
    const orgData = localStorage.getItem('organizationData');
    if (!orgData) {
      setError('Organization info not found. Please log in again.');
      setIsSubmitting(false);
      return;
    }
    const org = JSON.parse(orgData);

    // Prepare new opportunity
    const newOpportunity = {
      id: Date.now().toString(),
      ...formData,
      requirements: formData.requirements.split('\n').filter(Boolean),
      benefits: formData.benefits.split('\n').filter(Boolean),
      organization: org.organizationName,
      organizationEmail: org.email,
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    let opportunities = [];
    const stored = localStorage.getItem('opportunities');
    if (stored) {
      opportunities = JSON.parse(stored);
    }
    opportunities.push(newOpportunity);
    localStorage.setItem('opportunities', JSON.stringify(opportunities));

    // Show success message and redirect
    alert('Opportunity posted successfully!');
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black mb-4">Post New Opportunity</h1>
          <p className="text-gray-600 text-lg">Fill in the details to post a new volunteering opportunity</p>
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
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Posting...' : 'Post Opportunity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 