import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  Mail,
  Clock,
  Home,
  Building2,
  BedDouble,
  PartyPopper,
  ArrowLeft,
  BadgeCheck,
  Info
} from 'lucide-react';
import { api } from '@/utils/api';
import { Booking } from '@/types';

const BookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await api.getAllBookings(); // get everything
        const found = data.find((b: Booking) => b._id === id);
        if (!found) {
          setError('Booking not found');
        } else {
          setBooking(found);
        }
      } catch (err) {
        setError('Failed to load booking');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  if (loading)
    return <div className="p-10 text-center text-gray-500">Loading booking details...</div>;

  if (error || !booking)
    return <div className="p-10 text-center text-red-500">{error}</div>;

  const isRoom = booking.type === 'room';

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full bg-white shadow hover:bg-gray-100"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-3xl font-serif font-bold text-vp-dark">
          Booking Details
        </h1>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border overflow-hidden">
        <div className="p-8 space-y-8">
          {/* Status */}
          <div className="flex justify-between items-center">
            <span className="text-sm uppercase tracking-widest text-gray-400">
              Booking ID
            </span>
            <span className="font-mono text-xs text-gray-500">
              {booking._id}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              {isRoom ? <Home size={20} /> : <Building2 size={20} />}
              {isRoom ? booking.room?.name : booking.banquetHall?.name}
            </h2>
            <span className="px-4 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-700">
              {booking.status.toUpperCase()}
            </span>
          </div>

          {/* User */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">
              Guest Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users size={14} /> {booking.user.name}
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} /> {booking.user.email}
              </div>
            </div>
          </section>

          {/* Dates */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">
              Schedule
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                From: {new Date(booking.fromDate).toDateString()}
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                To: {new Date(booking.toDate).toDateString()}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                Check-in: {booking.checkInTime}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                Check-out: {booking.checkOutTime}
              </div>
            </div>
          </section>

          {/* Booking Info */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">
              Booking Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users size={14} />
                Guests: {booking.numberOfGuests}
              </div>

              {isRoom && (
                <div className="flex items-center gap-2">
                  <BedDouble size={14} />
                  Extra Beds: {booking.extraBeds}
                </div>
              )}

              {!isRoom && (
                <div className="flex items-center gap-2">
                  <PartyPopper size={14} />
                  Event Type: {booking.eventType}
                </div>
              )}

              <div className="flex items-center gap-2">
                <BadgeCheck size={14} />
                Type: {booking.type.toUpperCase()}
              </div>
            </div>
          </section>

          {/* Requests */}
          <section>
            <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-3">
              Special Requests
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg text-sm">
              {booking.specialRequests || 'No special requests'}
            </div>
          </section>

          {/* Price */}
          <section className="border-t pt-6 flex justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-400">
                Total Price
              </p>
              <p className="text-3xl font-bold text-vp-gold">
                ₹{booking.totalPrice}
              </p>
            </div>
              <div>
                <button
                      onClick={() => navigate(`/admin/users/${booking.user._id}`)}
                      className="px-3 py-1 text-xs font-semibold rounded bg-vp-dark text-white hover:opacity-90"
                    >
                      User Details
                    </button>
              </div>
            <div className="text-right text-xs text-gray-400">
              <p>Created: {new Date(booking.createdAt).toLocaleString()}</p>
              <p>Updated: {new Date(booking.updatedAt).toLocaleString()}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;