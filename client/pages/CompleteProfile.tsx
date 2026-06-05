import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";
import { UserRole } from "../types";
import Toast from "../components/Toast";

const CompleteProfile = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get state passed from Auth page Google login
  const stateData = location.state as {
    tempToken: string;
    user: {
      name: string;
      email: string;
      firebaseUid: string;
      profilePhoto?: string;
    };
  } | null;

  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // If there's no stateData, redirect to auth page
  useEffect(() => {
    if (!stateData) {
      navigate("/auth");
    }
  }, [stateData, navigate]);

  // If already fully authenticated, redirect to profile/home
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate("/profile");
    }
  }, [isAuthenticated, navigate, loading]);

  if (!stateData) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate phone number format (basic format check: digits, space, dashes, plus, parenthesis, between 7 and 15 chars)
    const cleanPhone = phone.trim();
    if (!cleanPhone) {
      setError("Phone number is required");
      return;
    }

    if (cleanPhone.length < 7 || cleanPhone.length > 15 || !/^[+]?[0-9\s\-()]+$/.test(cleanPhone)) {
      setError("Please enter a valid phone number (7 to 15 digits, optionally containing spaces, dashes, or parentheses)");
      return;
    }

    setLoading(true);
    try {
      const response = await api.googleCompleteProfile({
        tempToken: stateData.tempToken,
        phone: cleanPhone,
      });

      setToast({ message: "Profile completed successfully!", type: "success" });
      
      // Delay state login slightly to show toast
      setTimeout(() => {
        login(response);
        if (response.role === UserRole.ADMIN) {
          navigate("/admin");
        } else {
          navigate("/profile");
        }
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to complete profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-vp-cream flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl animate-fadeIn">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-vp-dark mb-2">Complete Your Profile</h2>
          <p className="text-gray-500 text-sm">
            Please verify your details and provide a contact number to complete your reservation setup.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 text-sm rounded-r" role="alert">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Read-only name */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Full Name</label>
            <input
              type="text"
              readOnly
              className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg text-gray-500 outline-none cursor-not-allowed"
              value={stateData.user.name}
            />
          </div>

          {/* Read-only email */}
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Email Address</label>
            <input
              type="text"
              readOnly
              className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-lg text-gray-500 outline-none cursor-not-allowed"
              value={stateData.user.email}
            />
          </div>

          {/* Mandatory, validated Phone number */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              placeholder="+1 (234) 567-8900"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-vp-gold focus:border-transparent outline-none transition-all"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-vp-dark text-white py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-vp-gold hover:text-vp-dark transition-all shadow-lg disabled:opacity-70 mt-2"
          >
            {loading ? "Completing Profile..." : "Complete & Sign In"}
          </button>
        </form>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default CompleteProfile;
