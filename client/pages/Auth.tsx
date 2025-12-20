

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { UserRole } from '../types';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // @ts-ignore
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;
      if (isLogin) {
        response = await api.login({ email: formData.email, password: formData.password });
      } else {
        response = await api.register(formData);
      }
      
      login(response);
      
      // Redirect based on role
      if (response.role === UserRole.ADMIN) {
        navigate('/admin');
      } else {
        navigate(from === '/auth' ? '/profile' : from);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex pt-20 bg-vp-cream">
      {/* Image Side */}
      <div className="hidden md:block w-1/2 bg-cover bg-center relative" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80")'}}>
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-white text-center p-12">
            <h2 className="text-5xl font-serif font-bold mb-6">Welcome to Paradise</h2>
            <p className="text-lg font-light max-w-md mx-auto">Join our exclusive community to unlock special offers, manage your bookings, and experience luxury like never before.</p>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 animate-fadeIn">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-serif font-bold text-vp-dark mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h3>
            <p className="text-gray-500 text-sm">
              {isLogin ? 'Enter your details to access your account' : 'Begin your journey with Four Leaf Resort today'}
            </p>
          </div>

          {/* Toggle */}
          <div className="flex bg-gray-100 p-1 rounded-lg mb-8">
            <button 
              onClick={() => {setIsLogin(true); setError('')}}
              className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${isLogin ? 'bg-white shadow text-vp-dark' : 'text-gray-400 hover:text-gray-600'}`}
            >
              LOGIN
            </button>
            <button 
              onClick={() => {setIsLogin(false); setError('')}}
              className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${!isLogin ? 'bg-white shadow text-vp-dark' : 'text-gray-400 hover:text-gray-600'}`}
            >
              SIGN UP
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 text-sm" role="alert">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Full Name</label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-vp-gold focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Phone (Optional)</label>
                  <input
                    name="phone"
                    type="tel"
                    className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-vp-gold focus:border-transparent outline-none transition-all"
                    placeholder="+1 234 567 890"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Email Address</label>
              <input
                name="email"
                type="email"
                required
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-vp-gold focus:border-transparent outline-none transition-all"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Password</label>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-vp-gold focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-vp-dark text-white py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-vp-gold hover:text-vp-dark transition-all shadow-lg disabled:opacity-70"
            >
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center">
             <p className="text-xs text-gray-400">By continuing, you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;