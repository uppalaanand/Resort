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
    return (
      <div className="p-10 space-y-6 max-w-4xl mx-auto animate-admin-fadeIn">
        <div className="skeleton-pulse h-8 w-48 rounded-lg" />
        <div className="bg-admin-card rounded-2xl border border-admin-border/50 p-8 space-y-6">
          <div className="skeleton-pulse h-5 w-32 rounded" />
          <div className="skeleton-pulse h-7 w-64 rounded" />
          <div className="grid grid-cols-2 gap-4">
            <div className="skeleton-pulse h-4 w-full rounded" />
            <div className="skeleton-pulse h-4 w-full rounded" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="skeleton-pulse h-4 w-full rounded" />
            <div className="skeleton-pulse h-4 w-full rounded" />
          </div>
          <div className="skeleton-pulse h-10 w-40 rounded" />
        </div>
      </div>
    );

  if (error || !booking)
    return <div className="p-10 text-center text-red-400">{error}</div>;

  const isRoom = booking.type === 'room';

  const statusColor =
    booking.status === 'Confirmed'
      ? 'bg-green-500/10 text-green-400'
      : booking.status === 'Pending'
      ? 'bg-yellow-500/10 text-yellow-400'
      : 'bg-red-500/10 text-red-400';

  return (
    <div className="p-8 min-h-screen animate-admin-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="bg-admin-surface text-admin-text hover:bg-admin-hover border border-admin-border rounded-lg px-4 py-2 flex items-center gap-2 transition-all"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-2xl font-bold text-admin-heading">
          Booking Details
        </h1>
      </div>

      <div className="bg-admin-card rounded-2xl border border-admin-border/50 shadow-2xl max-w-4xl mx-auto overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          {/* Status */}
          <div className="flex justify-between items-center">
            <span className="text-admin-text text-xs uppercase tracking-widest">
              Booking ID
            </span>
            <span className="font-mono text-xs text-admin-text/70">
              {booking._id}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-admin-heading flex items-center gap-2">
              {isRoom ? <Home size={20} className="text-vp-gold/70" /> : <Building2 size={20} className="text-vp-gold/70" />}
              {isRoom ? booking.room?.name : booking.banquetHall?.name}
            </h2>
            <span className={`px-4 py-1 text-xs font-bold rounded-full ${statusColor}`}>
              {booking.status.toUpperCase()}
            </span>
          </div>

          {/* User */}
          <section className="bg-admin-surface rounded-xl border border-admin-border/30 p-5">
            <h3 className="text-admin-heading font-semibold text-sm uppercase tracking-wider mb-3">
              Guest Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-admin-text">
                <Users size={14} className="text-vp-gold/70" /> <span className="text-admin-heading font-medium">{booking.user.name}</span>
              </div>
              <div className="flex items-center gap-2 text-admin-text">
                <Mail size={14} className="text-vp-gold/70" /> <span className="text-admin-heading font-medium">{booking.user.email}</span>
              </div>
            </div>
          </section>

          {/* Dates */}
          <section className="bg-admin-surface rounded-xl border border-admin-border/30 p-5">
            <h3 className="text-admin-heading font-semibold text-sm uppercase tracking-wider mb-3">
              Schedule
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-admin-text">
                <Calendar size={14} className="text-vp-gold/70" />
                <span className="text-admin-text text-xs">From:</span> <span className="text-admin-heading font-medium">{new Date(booking.fromDate).toDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-admin-text">
                <Calendar size={14} className="text-vp-gold/70" />
                <span className="text-admin-text text-xs">To:</span> <span className="text-admin-heading font-medium">{new Date(booking.toDate).toDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-admin-text">
                <Clock size={14} className="text-vp-gold/70" />
                <span className="text-admin-text text-xs">Check-in:</span> <span className="text-admin-heading font-medium">{booking.checkInTime}</span>
              </div>
              <div className="flex items-center gap-2 text-admin-text">
                <Clock size={14} className="text-vp-gold/70" />
                <span className="text-admin-text text-xs">Check-out:</span> <span className="text-admin-heading font-medium">{booking.checkOutTime}</span>
              </div>
            </div>
          </section>

          {/* Booking Info */}
          <section className="bg-admin-surface rounded-xl border border-admin-border/30 p-5">
            <h3 className="text-admin-heading font-semibold text-sm uppercase tracking-wider mb-3">
              Booking Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-admin-text">
                <Users size={14} className="text-vp-gold/70" />
                <span className="text-admin-text text-xs">Guests:</span> <span className="text-admin-heading font-medium">{booking.numberOfGuests}</span>
              </div>

              {isRoom && (
                <div className="flex items-center gap-2 text-admin-text">
                  <BedDouble size={14} className="text-vp-gold/70" />
                  <span className="text-admin-text text-xs">Extra Beds:</span> <span className="text-admin-heading font-medium">{booking.extraBeds}</span>
                </div>
              )}

              {!isRoom && (
                <div className="flex items-center gap-2 text-admin-text">
                  <PartyPopper size={14} className="text-vp-gold/70" />
                  <span className="text-admin-text text-xs">Event Type:</span> <span className="text-admin-heading font-medium">{booking.eventType}</span>
                </div>
              )}

              <div className="flex items-center gap-2 text-admin-text">
                <BadgeCheck size={14} className="text-vp-gold/70" />
                <span className="text-admin-text text-xs">Type:</span> <span className="text-admin-heading font-medium">{booking.type.toUpperCase()}</span>
              </div>
            </div>
          </section>

          {/* Requests */}
          <section className="bg-admin-surface rounded-xl border border-admin-border/30 p-5">
            <h3 className="text-admin-heading font-semibold text-sm uppercase tracking-wider mb-3">
              Special Requests
            </h3>
            <div className="bg-admin-card p-4 rounded-lg text-sm text-admin-text border border-admin-border/20">
              {booking.specialRequests || 'No special requests'}
            </div>
          </section>

          {/* Price */}
          <section className="border-t border-admin-border/30 pt-6 flex justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-admin-text">
                Total Price
              </p>
              <p className="text-3xl font-bold text-vp-gold">
                ₹{booking.totalPrice}
              </p>
            </div>
              <div>
                <button
                      onClick={() => navigate(`/admin/users/${booking.user._id}`)}
                      className="bg-vp-gold text-vp-dark font-semibold hover:bg-amber-400 transition-all px-4 py-2 text-xs rounded-lg"
                    >
                      User Details
                    </button>
              </div>
            <div className="text-right text-xs text-admin-text/70">
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