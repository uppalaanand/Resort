

import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { UserRole } from '../types';
import { signInWithGoogle } from '../utils/firebase';

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

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      // @ts-ignore
      const idToken = await result.user.getIdToken();
      const response = await api.googleLogin(idToken);

      if (response.requiresProfileCompletion) {
        navigate('/complete-profile', { 
          state: { 
            tempToken: response.tempToken, 
            user: response.user 
          } 
        });
      } else {
        login(response);
        if (response.role === UserRole.ADMIN) {
          navigate('/admin');
        } else {
          navigate(from === '/auth' ? '/profile' : from);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Google Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
              {isLogin && (
                <div className="flex justify-end mt-1.5">
                  <Link to="/forgot-password" className="text-xs font-semibold text-vp-gold hover:underline">
                    Forgot Password?
                  </Link>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-vp-dark text-white py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-vp-gold hover:text-vp-dark transition-all shadow-lg disabled:opacity-70"
            >
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
            </button>
          </form>

          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <span className="relative px-3 bg-white text-xs text-gray-400 uppercase font-bold tracking-wide">Or</span>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 py-3.5 rounded-lg font-bold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-70 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.54 14.98 1 12 1 7.35 1 3.37 3.65 1.39 7.56l3.89 3.02C6.2 7.74 8.89 5.04 12 5.04z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.42 3.57v2.97h3.91c2.28-2.1 3.54-5.19 3.54-8.69z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.78a7.07 7.07 0 0 1-.37-2.22c0-.77.13-1.52.37-2.22L1.39 7.32a11.96 11.96 0 0 0 0 9.36l3.89-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.91-2.97c-1.08.72-2.48 1.16-4.05 1.16-3.11 0-5.8-2.7-6.72-5.54l-3.89 3.02C3.37 20.35 7.35 23 12 23z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="mt-6 text-center">
             <p className="text-xs text-gray-400">By continuing, you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;