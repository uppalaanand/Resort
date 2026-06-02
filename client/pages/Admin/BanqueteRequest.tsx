import React, { useEffect, useState } from 'react';
import {
  Calendar,
  Users,
  Mail,
  Clock,
  Building2,
  Eye,
  PartyPopper,
  Phone
} from 'lucide-react';
import { api } from '@/utils/api';
import { Booking } from '@/types';
import { useNavigate } from 'react-router-dom';

const BanquetRequests = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await api.getAllBookings(); // 🔥 get everything
        setBookings(data);
    } catch (err) {
        setError('Failed to load banquet bookings');
    } finally {
        setLoading(false);
    }
};

fetchBookings();
}, []);

// ✅ FILTER ONLY BANQUET BOOKINGS
const banquetBookings = bookings.filter(
    (b) => b.type === 'banquet'
);

// 🔥 filter out expired room requests
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeBanqueteRequests = banquetBookings.filter(
    (booking) => new Date(booking.toDate) >= today && new Date(booking.fromDate) >= today
  );


  if (loading)
    return (
      <div className="p-10 text-center text-gray-500">
        Loading banquet bookings...
      </div>
    );

  if (error)
    return (
      <div className="p-10 text-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-serif font-bold text-vp-dark mb-8">
        Banquet Booking Requests
      </h1>

      {banquetBookings.length === 0 && (
        <p className="text-gray-500">
          No banquet bookings found.
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeBanqueteRequests.map((booking) => (
          <div
            key={booking._id}
            className="bg-white rounded-2xl shadow-md border overflow-hidden"
          >
            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Building2 size={18} />
                  {booking.banquetHall?.name}
                </h2>
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-700">
                  BANQUET
                </span>
              </div>

              {/* User Info */}
              <div className="text-sm text-gray-700 space-y-1">
                <div className="flex items-center gap-2">
                  <Users size={14} /> {booking.user.name}
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={14} /> {booking.user.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} /> {booking.user.email}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  {new Date(booking.fromDate).toDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  {new Date(booking.toDate).toDateString()}
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={14} />
                {booking.checkInTime} → {booking.checkOutTime}
              </div>

              {/* Event Info */}
              <div className="flex flex-wrap gap-6 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Users size={14} /> {booking.numberOfGuests} Guests
                </span>
                <span className="flex items-center gap-1">
                  <PartyPopper size={14} /> {booking.eventType}
                </span>
              </div>

              {/* Special Requests */}
              {booking.specialRequests && (
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <strong>Special Request:</strong> {booking.specialRequests}
                </div>
              )}
              Status:
              <span
                      className={`px-3 py-1 rounded-full ${
                        booking.status === "Confirmed"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {booking.status}
                    </span>

              {/* Footer */}
              <div className="flex justify-between items-center pt-4 border-t">
                {/* <span className="text-lg font-bold text-vp-gold">
                  ₹{booking.totalPrice}
                </span> */}
                <button
                      onClick={() => navigate(`/admin/users/${booking.user._id}`)}
                      className="px-3 py-1 text-xs font-semibold rounded bg-vp-dark text-white hover:opacity-90"
                    >
                      User Details
                    </button>
                <button
                  onClick={() =>
                    navigate(`/admin/banquet-bookings/${booking._id}`)
                  }
                  className="flex items-center gap-2 px-5 py-2 bg-vp-dark text-white text-sm rounded-full hover:bg-vp-gold hover:text-vp-dark transition"
                >
                  <Eye size={14} /> View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BanquetRequests;