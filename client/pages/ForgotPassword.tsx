import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../utils/api";
import { resetPasswordEmail } from "../utils/firebase";
import Toast from "../components/Toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isGoogleAlert, setIsGoogleAlert] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setTimeout(() => {
        setCooldown(cooldown - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cooldown > 0) return;
    setError("");
    setMessage("");
    setIsGoogleAlert(false);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError("Email address is required");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(cleanEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const response = await api.forgotPassword(cleanEmail);

      if (!response.success && response.isGoogleUser) {
        setIsGoogleAlert(true);
        setError(response.message);
      } else {
        if (response.triggerClientReset) {
          await resetPasswordEmail(cleanEmail);
        }
        setMessage("If an account exists for this email, a password reset link has been sent.");
        setToast({
          message: "A password reset link has been sent to your email.",
          type: "success",
        });
        setEmail("");
        setCooldown(60); // Start 60 second cooldown on success
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while requesting password reset. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-vp-cream flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl animate-fadeIn">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-vp-dark mb-2">Forgot Password</h2>
          <p className="text-gray-500 text-sm">
            Enter your registered email address and we will send you a link to reset your password.
          </p>
        </div>

        {error && (
          <div className={`border-l-4 p-4 mb-6 text-sm rounded-r ${
            isGoogleAlert 
              ? "bg-blue-50 border-blue-500 text-blue-700" 
              : "bg-red-50 border-red-500 text-red-700"
          }`} role="alert">
            <p>{error}</p>
          </div>
        )}

        {message && (
          <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 p-4 mb-6 text-sm rounded-r" role="alert">
            <p>{message}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-vp-gold focus:border-transparent outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={cooldown > 0}
            />
          </div>

          <button
            type="submit"
            disabled={loading || cooldown > 0}
            className="w-full bg-vp-dark text-white py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-vp-gold hover:text-vp-dark transition-all shadow-lg disabled:opacity-70 mt-2"
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : (loading ? "Sending..." : "Send Reset Link")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/auth" className="text-sm font-semibold text-vp-gold hover:underline">
            Back to Login
          </Link>
        </div>
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

export default ForgotPassword;
