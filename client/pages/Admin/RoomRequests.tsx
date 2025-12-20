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
    return <div className="p-10 text-center text-gray-500">Loading room requests...</div>;

  if (error)
    return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-serif font-bold text-vp-dark mb-8">
        Room Booking Requests
      </h1>

      {roomRequests.length === 0 && (
        <p className="text-gray-500">No room booking requests found.</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {roomRequests.map((booking) => (
          <div
            key={booking._id}
            className="bg-white rounded-2xl shadow-md overflow-hidden border"
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
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Home size={18} /> {booking.room?.name}
                </h2>
                <span className="px-3 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-700">
                  REQUESTED
                </span>
              </div>

              {/* User */}
              <div className="text-sm text-gray-700 space-y-1">
                <div className="flex items-center gap-2">
                  <Users size={14} /> {booking.user.name}
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

              {/* Guests */}
              <div className="flex gap-6 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Users size={14} /> {booking.numberOfGuests} Guests
                </span>
                <span className="flex items-center gap-1">
                  <BedDouble size={14} /> {booking.extraBeds} Beds
                </span>
              </div>

              {/* Special Requests */}
              {booking.specialRequests && (
                <div className="bg-gray-50 p-3 rounded-lg text-sm">
                  <strong>Request:</strong> {booking.specialRequests}
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-lg font-bold text-vp-gold">
                  ${booking.totalPrice}
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
                      className="px-3 py-1 text-xs font-semibold rounded bg-vp-dark text-white hover:opacity-90"
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