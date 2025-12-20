

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock authentication logic
    if (email.includes('admin')) {
        login({
            _id: 'a1',
            name: 'Admin User',
            email: email,
            role: UserRole.ADMIN,
            token: 'mock-token-admin'
        });
        navigate('/admin');
    } else {
        login({
            _id: 'u1',
            name: 'Demo User',
            email: email,
            role: UserRole.USER,
            token: 'mock-token-user'
        });
        navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-vp-dark">Welcome Back</h2>
            <p className="text-gray-500 mt-2">Sign in to manage your bookings</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-vp-gold focus:outline-none"
                    placeholder="user@example.com"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-vp-gold focus:outline-none"
                    placeholder="••••••••"
                />
            </div>
            
            <button type="submit" className="w-full bg-vp-dark text-white py-3 rounded font-bold uppercase tracking-wider hover:bg-vp-blue transition-colors">
                Sign In
            </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
            <p className="mb-2">Demo Credentials:</p>
            <div className="bg-gray-50 p-2 rounded border border-gray-200 inline-block text-left text-xs">
                <p><span className="font-bold">User:</span> any email / any pass</p>
                <p><span className="font-bold">Admin:</span> admin@fourleafvenue.com / any pass</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Login;