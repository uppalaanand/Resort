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
  Info,
  DollarSign,
  UserCheck,
  LogOut,
  MapPin,
  AlertTriangle,
  CreditCard
} from 'lucide-react';
import { api } from '@/utils/api';
import { Booking } from '@/types';
import { useAuth } from '@/context/AuthContext';

const BookingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBooking = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await api.getBookingById(id);
      setBooking(data);
    } catch (err) {
      setError('Failed to load booking');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  const handleApprove = async () => {
    if (!booking) return;
    setActionLoading(true);
    try {
      await api.approveBooking(booking._id);
      await fetchBooking();
    } catch (err: any) {
      alert(err.message || 'Failed to approve booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking || !rejectionReason.trim()) return;
    setActionLoading(true);
    try {
      await api.rejectBooking(booking._id, rejectionReason);
      setShowRejectModal(false);
      setRejectionReason('');
      await fetchBooking();
    } catch (err: any) {
      alert(err.message || 'Failed to reject booking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!booking) return;
    setActionLoading(true);
    try {
      await api.checkInGuest(booking._id);
      await fetchBooking();
    } catch (err: any) {
      alert(err.message || 'Failed to check-in guest');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!booking) return;
    setActionLoading(true);
    try {
      await api.checkOutGuest(booking._id);
      await fetchBooking();
    } catch (err: any) {
      alert(err.message || 'Failed to check-out guest');
    } finally {
      setActionLoading(false);
    }
  };

  const handlePaymentStatusChange = async (status: string) => {
    if (!booking) return;
    setActionLoading(true);
    try {
      await api.updatePaymentStatus(booking._id, status);
      await fetchBooking();
    } catch (err: any) {
      alert(err.message || 'Failed to update payment status');
    } finally {
      setActionLoading(false);
    }
  };

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
          <div className="skeleton-pulse h-10 w-40 rounded" />
        </div>
      </div>
    );

  if (error || !booking)
    return <div className="p-10 text-center text-red-400">{error}</div>;

  const isRoom = booking.type === 'room';

  // Guest fields fallbacks (User vs Offline Guest fields)
  const guestName = booking.user?.name || booking.guestName || 'Offline Walk-in';
  const guestEmail = booking.user?.email || booking.guestEmail || 'N/A';
  const guestPhone = booking.user?.phone || booking.guestPhone || 'N/A';
  const guestAddress = booking.user?.address || booking.guestAddress || 'N/A';
  const idProofType = booking.user?.idProofType || booking.idProofType || 'N/A';
  const idProofNumber = booking.user?.idProofNumber || booking.idProofNumber || 'N/A';

  const statusColor =
    booking.status === 'Confirmed'
      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
      : booking.status === 'Pending'
      ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
      : booking.status === 'Completed'
      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
      : 'bg-red-500/10 text-red-400 border border-red-500/20';

  const paymentStatusColor =
    booking.paymentStatus === 'Paid'
      ? 'bg-green-500/10 text-green-400'
      : booking.paymentStatus === 'Partial'
      ? 'bg-yellow-500/10 text-yellow-400'
      : 'bg-red-500/10 text-red-400';

  const isStaff = currentUser?.role === 'admin' || currentUser?.role === 'receptionist' || currentUser?.role === 'manager';
  const isAdminOrManager = currentUser?.role === 'admin' || currentUser?.role === 'manager';

  return (
    <div className="p-6 md:p-8 min-h-screen text-admin-heading animate-admin-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-admin-surface text-admin-text hover:bg-admin-hover border border-admin-border rounded-lg p-2.5 flex items-center transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-admin-heading">
              Booking Invoice & Details
            </h1>
            <p className="text-admin-text text-xs">
              Source: <span className="text-vp-gold font-semibold">{booking.source || 'ONLINE'}</span>
            </p>
          </div>
        </div>
        <span className={`px-4 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${statusColor}`}>
          {booking.status}
        </span>
      </div>

      <div className="bg-admin-card rounded-2xl border border-admin-border/50 shadow-2xl max-w-4xl mx-auto overflow-hidden">
        {/* PMS OPERATIONS CONTROL PANEL */}
        {isStaff && (
          <div className="bg-admin-surface border-b border-admin-border/50 p-6">
            <h3 className="text-xs font-bold text-vp-gold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Info size={14} /> Receptionist & Admin Operations Control
            </h3>
            <div className="flex flex-wrap gap-4 items-center">
              {/* Approval Buttons */}
              {booking.status === 'Pending' && isAdminOrManager && (
                <>
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-all"
                  >
                    Approve Reservation
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    disabled={actionLoading}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-all"
                  >
                    Reject Booking
                  </button>
                </>
              )}

              {/* Check In / Out Buttons */}
              {booking.status === 'Confirmed' && isRoom && (
                <>
                  {!booking.checkedInAt ? (
                    <button
                      onClick={handleCheckIn}
                      disabled={actionLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all"
                    >
                      <UserCheck size={14} /> Check In Guest
                    </button>
                  ) : !booking.checkedOutAt ? (
                    <button
                      onClick={handleCheckOut}
                      disabled={actionLoading}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-all"
                    >
                      <LogOut size={14} /> Check Out Guest
                    </button>
                  ) : null}
                </>
              )}

              {/* Payment Status Dropdown */}
              {isAdminOrManager && (
                <div className="flex items-center gap-2 ml-auto">
                  <span className="text-xs text-admin-text font-medium">Payment Status:</span>
                  <select
                    value={booking.paymentStatus || 'Pending'}
                    disabled={actionLoading}
                    onChange={(e) => handlePaymentStatusChange(e.target.value)}
                    className="bg-admin-card text-admin-heading border border-admin-border rounded-lg text-xs p-2 focus:outline-none focus:border-vp-gold"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Partial">Partial</option>
                    <option value="Refunded">Refunded</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="p-6 md:p-8 space-y-8">
          {/* Top details */}
          <div className="flex justify-between items-start border-b border-admin-border/30 pb-6">
            <div>
              <span className="text-admin-text text-xs uppercase tracking-widest block mb-1">
                Booking Reference
              </span>
              <span className="font-mono text-sm text-vp-gold">
                {booking._id}
              </span>
            </div>
            <div className="text-right">
              <span className="text-admin-text text-xs uppercase tracking-widest block mb-1">
                Stay Type
              </span>
              <span className="text-sm font-semibold uppercase tracking-wider text-admin-heading">
                {booking.type}
              </span>
            </div>
          </div>

          {/* Room / Hall info */}
          <div className="flex justify-between items-center bg-admin-surface rounded-xl border border-admin-border/30 p-5">
            <h2 className="text-lg font-bold text-admin-heading flex items-center gap-3">
              {isRoom ? <Home size={22} className="text-vp-gold" /> : <Building2 size={22} className="text-vp-gold" />}
              {isRoom ? (booking.room?.name || 'Deleted Room') : (booking.banquetHall?.name || 'Deleted Banquet Hall')}
            </h2>
            {isRoom && booking.room?.roomNumber && (
              <span className="bg-vp-gold/20 text-vp-gold border border-vp-gold/30 text-xs font-bold px-3 py-1 rounded-lg">
                Room No: {booking.room.roomNumber}
              </span>
            )}
          </div>

          {/* Guest and Verification Info */}
          <section className="bg-admin-surface rounded-xl border border-admin-border/30 p-5 space-y-4">
            <h3 className="text-admin-heading font-semibold text-xs uppercase tracking-wider border-b border-admin-border/20 pb-2">
              Guest & Verification Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-2.5">
                <p className="flex items-center gap-2.5 text-admin-text">
                  <Users size={15} className="text-vp-gold/70" /> 
                  <span className="text-admin-heading font-medium">{guestName}</span>
                </p>
                <p className="flex items-center gap-2.5 text-admin-text">
                  <Mail size={15} className="text-vp-gold/70" /> 
                  <span className="text-admin-heading font-medium">{guestEmail}</span>
                </p>
                <p className="flex items-center gap-2.5 text-admin-text">
                  <Clock size={15} className="text-vp-gold/70" /> 
                  <span className="text-admin-heading font-medium">{guestPhone}</span>
                </p>
              </div>

              <div className="space-y-2.5 border-t md:border-t-0 md:border-l border-admin-border/30 pt-4 md:pt-0 md:pl-6">
                <p className="flex items-center gap-2.5 text-admin-text">
                  <MapPin size={15} className="text-vp-gold/70" /> 
                  <span className="text-admin-heading font-medium">{guestAddress}</span>
                </p>
                <p className="flex items-center gap-2.5 text-admin-text">
                  <BadgeCheck size={15} className="text-vp-gold/70" /> 
                  <span className="text-admin-heading font-medium">ID Proof: {idProofType} ({idProofNumber})</span>
                </p>
                {booking.user?._id && (
                  <button
                    onClick={() => navigate(`/admin/users/${booking.user._id}`)}
                    className="text-xs text-vp-gold hover:underline font-semibold mt-1"
                  >
                    View Guest Profile & History →
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Schedule */}
          <section className="bg-admin-surface rounded-xl border border-admin-border/30 p-5">
            <h3 className="text-admin-heading font-semibold text-xs uppercase tracking-wider border-b border-admin-border/20 pb-2 mb-3">
              Schedule & Dates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-admin-text">
                <Calendar size={15} className="text-vp-gold/70" />
                <span className="text-admin-text text-xs">Check-in:</span> 
                <span className="text-admin-heading font-semibold">
                  {booking.fromDate ? new Date(booking.fromDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-admin-text">
                <Calendar size={15} className="text-vp-gold/70" />
                <span className="text-admin-text text-xs">Check-out:</span> 
                <span className="text-admin-heading font-semibold">
                  {booking.toDate ? new Date(booking.toDate).toLocaleDateString() : 'N/A'}
                </span>
              </div>

              {booking.checkedInAt && (
                <div className="flex items-center gap-2 text-admin-text">
                  <Clock size={15} className="text-green-400" />
                  <span className="text-admin-text text-xs">Actual Check-in:</span> 
                  <span className="text-green-400 font-semibold">
                    {new Date(booking.checkedInAt).toLocaleString()}
                  </span>
                </div>
              )}
              {booking.checkedOutAt && (
                <div className="flex items-center gap-2 text-admin-text">
                  <Clock size={15} className="text-blue-400" />
                  <span className="text-admin-text text-xs">Actual Check-out:</span> 
                  <span className="text-blue-400 font-semibold">
                    {new Date(booking.checkedOutAt).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </section>

          {/* Rejection reason if rejected */}
          {booking.status === 'Rejected' && booking.rejectionReason && (
            <section className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-5 flex gap-3 items-start">
              <AlertTriangle className="mt-0.5" size={18} />
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider">Rejection Reason</h4>
                <p className="text-sm mt-1">{booking.rejectionReason}</p>
              </div>
            </section>
          )}

          {/* Booking Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-admin-surface rounded-xl border border-admin-border/30 p-5">
              <h3 className="text-admin-heading font-semibold text-xs uppercase tracking-wider border-b border-admin-border/20 pb-2 mb-3">
                Occupants Info
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-admin-text">Guests Count:</span>
                  <span className="font-semibold text-admin-heading">{booking.numberOfGuests}</span>
                </div>
                {isRoom && (
                  <div className="flex justify-between">
                    <span className="text-admin-text">Extra Beds:</span>
                    <span className="font-semibold text-admin-heading">{booking.extraBeds || 0}</span>
                  </div>
                )}
                {!isRoom && (
                  <div className="flex justify-between">
                    <span className="text-admin-text">Event Type:</span>
                    <span className="font-semibold text-admin-heading">{booking.eventType || 'N/A'}</span>
                  </div>
                )}
              </div>
            </section>

            <section className="bg-admin-surface rounded-xl border border-admin-border/30 p-5">
              <h3 className="text-admin-heading font-semibold text-xs uppercase tracking-wider border-b border-admin-border/20 pb-2 mb-3">
                Payment Info
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-admin-text">Payment Method:</span>
                  <span className="font-semibold text-admin-heading flex items-center gap-1">
                    <CreditCard size={14} className="text-vp-gold/70" />
                    {booking.paymentMethod || 'Online'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-admin-text">Payment Status:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${paymentStatusColor}`}>
                    {booking.paymentStatus || 'Pending'}
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* Special Requests */}
          <section className="bg-admin-surface rounded-xl border border-admin-border/30 p-5">
            <h3 className="text-admin-heading font-semibold text-xs uppercase tracking-wider mb-2.5">
              Special Requests & Notes
            </h3>
            <div className="bg-admin-card p-4 rounded-lg text-sm text-admin-text border border-admin-border/20">
              {booking.specialRequests || booking.notes || 'No special requests / notes'}
            </div>
          </section>

          {/* Price */}
          <section className="border-t border-admin-border/30 pt-6 flex justify-between items-center">
            <div>
              <p className="text-xs uppercase tracking-widest text-admin-text">
                Invoice Amount
              </p>
              <p className="text-3xl font-bold text-vp-gold flex items-center gap-1">
                <DollarSign size={24} className="mt-1" />
                {booking.totalPrice?.toLocaleString()}
              </p>
            </div>
            <div className="text-right text-[11px] text-admin-text/70">
              <p>Requested: {booking.createdAt ? new Date(booking.createdAt).toLocaleString() : 'N/A'}</p>
              {booking.updatedAt && <p>Updated: {new Date(booking.updatedAt).toLocaleString()}</p>}
            </div>
          </section>
        </div>
      </div>

      {/* REJECT MODAL */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleRejectSubmit}
            className="bg-admin-card border border-admin-border rounded-2xl w-full max-w-md p-6 space-y-4 animate-admin-scaleIn"
          >
            <h3 className="text-lg font-bold text-admin-heading">Reject Booking Request</h3>
            <p className="text-xs text-admin-text">
              Please enter the reason for declining this reservation. This reason will be emailed to the guest.
            </p>
            <div>
              <label className="block text-xs font-bold text-admin-text uppercase mb-2">Rejection Reason</label>
              <textarea
                required
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full bg-admin-surface border border-admin-border rounded-lg p-3 text-admin-heading text-sm focus:outline-none focus:border-vp-gold"
                placeholder="e.g. Overbooked, Room maintenance, or Banquet hall reserved for corporate cleaning."
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                className="bg-admin-surface text-admin-text border border-admin-border px-4 py-2 text-xs font-bold rounded-lg hover:bg-admin-hover"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-xs font-bold rounded-lg"
              >
                Submit Rejection
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default BookingDetails;