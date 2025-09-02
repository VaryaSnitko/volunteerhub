'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingForm from '../../components/OnboardingForm';

type UserType = 'volunteer' | 'admin';

type ViewState = 'welcome' | 'login' | 'signup' | 'onboarding';

export default function LoginPage() {
  const router = useRouter();
  const [viewState, setViewState] = useState<ViewState>('welcome');
  const [form, setForm] = useState({ 
    email: '', 
    password: '', 
    userType: 'volunteer' as UserType 
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user type is stored
    const userType = localStorage.getItem('userType');
    
    if (userType === 'admin') {
      // For admins, check if they have preferences
      const onboarding = localStorage.getItem('volunteerPreferences');
      if (onboarding) {
        localStorage.setItem('user', JSON.stringify({ 
          email: form.email,
          userType: 'admin'
        }));
        // Ensure userType is set
        localStorage.setItem('userType', 'admin');
        router.push('/admin'); // Admins go to admin dashboard
      } else {
        // Admin needs to complete onboarding
        setViewState('onboarding');
      }
    } else {
      // For volunteers, check if they have preferences
      const onboarding = localStorage.getItem('volunteerPreferences');
      if (onboarding) {
        localStorage.setItem('user', JSON.stringify({ 
          email: form.email,
          userType: 'volunteer'
        }));
        // Ensure userType is set
        localStorage.setItem('userType', 'volunteer');
        router.push('/home'); // Volunteers go to home
      } else {
        // Volunteer needs to complete onboarding
        setViewState('onboarding');
      }
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Store user type and redirect to appropriate onboarding
    localStorage.setItem('userType', form.userType);
    setViewState('onboarding');
  };

  const goToLogin = () => {
    setViewState('login');
    setForm({ ...form, email: '', password: '' });
    setError('');
  };

  const goToSignup = () => {
    setViewState('signup');
    setForm({ ...form, email: '', password: '', userType: 'volunteer' });
    setError('');
  };

  const goBack = () => {
    setViewState('welcome');
    setForm({ email: '', password: '', userType: 'volunteer' });
    setError('');
  };

  if (viewState === 'onboarding') {
    return <OnboardingForm />;
  }



  if (viewState === 'welcome') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <div className="max-w-md w-full space-y-6 sm:space-y-8 p-6 sm:p-8 border border-gray-200 rounded-lg shadow-md">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-black mb-3 sm:mb-4">Welcome to VolunteerHub</h1>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              Connect with your community and make a difference. Find volunteering opportunities 
              that match your interests and skills, or join organizations making positive change.
            </p>
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            <button
              onClick={goToLogin}
              className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-semibold text-base sm:text-lg hover:bg-red-700 transition-colors"
            >
              Log In
            </button>
            <button
              onClick={goToSignup}
              className="w-full border-2 border-red-600 text-red-600 py-3 px-6 rounded-lg font-semibold text-base sm:text-lg hover:bg-red-50 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full space-y-6 sm:space-y-8 p-6 sm:p-8 border border-gray-200 rounded-lg shadow-md">
        <div className="text-center mb-6">
          <button
            onClick={goBack}
            className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
          >
            ← Back
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
            {viewState === 'login' ? 'Welcome Back' : 'Join VolunteerHub'}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {viewState === 'login' 
              ? 'Log in to your account to continue' 
              : 'Create your account to get started'
            }
          </p>
        </div>
        
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-black mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={viewState === 'login' ? 'current-password' : 'new-password'}
              required
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          {viewState === 'signup' && (
            <div>
              <label htmlFor="userType" className="block text-sm font-medium text-black mb-1">
                I am a...
              </label>
              <select
                id="userType"
                name="userType"
                value={form.userType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="volunteer">Volunteer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          )}

          {error && <p className="text-red-600 text-sm">{error}</p>}
          
          <div className="pt-2">
            <button
              type="submit"
              onClick={viewState === 'login' ? handleLogin : handleSignup}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors"
            >
              {viewState === 'login' ? 'Log In' : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 