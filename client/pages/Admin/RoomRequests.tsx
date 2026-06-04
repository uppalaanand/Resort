import React, { useEffect, useState } from 'react';
import { Calendar, Users, BedDouble, Mail, Clock, Home } from 'lucide-react';
import { api } from '@/utils/api';
import { Booking } from '@/types';
import { getImageUrl } from '@/utils/images';
import { useNavigate } from 'react-router-dom';

const RoomRequests = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await api.getAllRoomRequests(); // 🔥 get everything
        setBookings(data);
      } catch (err) {
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // 🔥 filter out expired room requests
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const activeRoomRequests = bookings.filter(
    (booking) => new Date(booking.toDate) >= today && new Date(booking.fromDate) >= today
  );

  // ✅ FILTER LOGIC (IMPORTANT)
  const roomRequests = activeRoomRequests;

  if (loading)
    return (
      <div className="p-8 min-h-screen animate-admin-fadeIn">
        <div className="skeleton-pulse h-8 w-64 rounded-lg mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-admin-card rounded-xl border border-admin-border/50 overflow-hidden">
              <div className="skeleton-pulse h-48 w-full" />
              <div className="p-6 space-y-4">
                <div className="skeleton-pulse h-6 w-48 rounded" />
                <div className="skeleton-pulse h-4 w-36 rounded" />
                <div className="skeleton-pulse h-4 w-full rounded" />
                <div className="skeleton-pulse h-4 w-28 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  if (error)
    return <div className="p-10 text-center text-red-400">{error}</div>;

  return (
    <div className="p-8 min-h-screen animate-admin-fadeIn">
      <h1 className="text-2xl font-bold text-admin-heading mb-8">
        Room Booking Requests
      </h1>

      {roomRequests.length === 0 && (
        <p className="text-admin-text">No room booking requests found.</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {roomRequests.map((booking) => (
          <div
            key={booking._id}
            className="bg-admin-card rounded-xl border border-admin-border/50 overflow-hidden hover:border-admin-border transition-all"
          >
            {/* Room Image */}
            {booking.room?.images?.[0] && (
              <img
                src={getImageUrl(booking.room.images[0])}
                className="h-48 w-full object-cover"
                alt={booking.room.name}
              />
            )}

            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-admin-heading flex items-center gap-2">
                  <Home size={18} className="text-vp-gold/70" /> {booking.room?.name}
                </h2>
                <span className="bg-yellow-500/10 text-yellow-400 rounded-full px-3 py-1 text-xs font-medium">
                  REQUESTED
                </span>
              </div>

              {/* User */}
              <div className="text-sm text-admin-text space-y-1">
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-vp-gold/70" /> <span className="text-admin-heading font-medium">{booking.user.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-admin-text" /> <span className="text-admin-heading font-medium">{booking.user.email}</span>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 text-sm text-admin-text">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-vp-gold/70" />
                  <span className="text-admin-heading font-medium">{new Date(booking.fromDate).toDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-vp-gold/70" />
                  <span className="text-admin-heading font-medium">{new Date(booking.toDate).toDateString()}</span>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center gap-2 text-sm text-admin-text">
                <Clock size={14} className="text-vp-gold/70" />
                <span className="text-admin-heading font-medium">{booking.checkInTime} → {booking.checkOutTime}</span>
              </div>

              {/* Guests */}
              <div className="flex gap-6 text-sm text-admin-text">
                <span className="flex items-center gap-1">
                  <Users size={14} className="text-vp-gold/70" /> <span className="text-admin-heading font-medium">{booking.numberOfGuests} Guests</span>
                </span>
                <span className="flex items-center gap-1">
                  <BedDouble size={14} className="text-vp-gold/70" /> <span className="text-admin-heading font-medium">{booking.extraBeds} Beds</span>
                </span>
              </div>

              {/* Special Requests */}
              {booking.specialRequests && (
                <div className="bg-admin-surface p-3 rounded-lg text-sm text-admin-text border border-admin-border/20">
                  <strong className="text-admin-heading">Request:</strong> {booking.specialRequests}
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-between items-center pt-4 border-t border-admin-border/30">
                <span className="text-lg font-bold text-vp-gold">
                  ₹{booking.totalPrice}
                </span>
                {console.log(booking)}

                <div className="flex gap-2">
                  {/* <button className="px-4 py-2 bg-green-600 text-white text-sm rounded-full hover:bg-green-700">
                    Approve
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white text-sm rounded-full hover:bg-red-700">
                    Reject
                  </button> */}
                  <button
                      onClick={() => navigate(`/admin/users/${booking.user._id}`)}
                      className="bg-vp-gold text-vp-dark font-semibold hover:bg-amber-400 transition-all px-4 py-2 text-xs rounded-lg"
                    >
                      User Details
                    </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomRequests;