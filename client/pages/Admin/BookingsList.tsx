import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  Search,
  Filter,
  Eye,
  CheckCircle,
  XCircle,
  FileText,
  UserCheck,
  Plus
} from 'lucide-react';
import { api } from '@/utils/api';
import { Booking } from '@/types';

const BookingsList = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await api.getAllBookings();
      // Sort by createdAt descending
      const sorted = [...data].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setBookings(sorted);
      setFilteredBookings(sorted);
    } catch (err) {
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    let result = bookings;

    // Search query (guest name, guest email, guest phone, or booking ID)
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter((b) => {
        const guestName = (b.user?.name || b.guestName || '').toLowerCase();
        const guestEmail = (b.user?.email || b.guestEmail || '').toLowerCase();
        const guestPhone = (b.user?.phone || b.guestPhone || '').toLowerCase();
        const bookingId = b._id.toLowerCase();
        return (
          guestName.includes(q) ||
          guestEmail.includes(q) ||
          guestPhone.includes(q) ||
          bookingId.includes(q)
        );
      });
    }

    // Status filter
    if (statusFilter !== 'All') {
      result = result.filter((b) => b.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'All') {
      result = result.filter((b) => b.type === typeFilter);
    }

    // Source filter
    if (sourceFilter !== 'All') {
      result = result.filter((b) => (b.source || 'ONLINE') === sourceFilter);
    }

    setFilteredBookings(result);
  }, [searchQuery, statusFilter, typeFilter, sourceFilter, bookings]);

  const handleApprove = async (id: string) => {
    if (!window.confirm('Are you sure you want to approve this reservation?')) return;
    try {
      await api.approveBooking(id);
      await fetchBookings();
    } catch (err: any) {
      alert(err.message || 'Failed to approve booking');
    }
  };

  if (loading) {
    return (
      <div className="p-8 min-h-screen space-y-6 animate-admin-fadeIn">
        <div className="skeleton-pulse h-8 w-64 rounded-lg mb-8" />
        <div className="skeleton-pulse h-12 w-full rounded-lg" />
        <div className="bg-admin-card rounded-xl border border-admin-border/50 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-pulse h-16 border-b border-admin-border/30 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 min-h-screen animate-admin-fadeIn text-admin-heading">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-admin-heading mb-1">Bookings Manager</h1>
          <p className="text-admin-text text-sm">
            View, search, and manage guest reservations, check-ins, and checkout operations.
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/offline-booking')}
          className="flex items-center gap-2 bg-vp-gold text-vp-dark px-5 py-2.5 rounded-lg font-semibold hover:bg-amber-400 transition-all text-sm shadow-lg shadow-vp-gold/10"
        >
          <Plus size={16} />
          Offline Booking
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-admin-card rounded-xl border border-admin-border/50 p-4 md:p-6 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-admin-text" size={18} />
          <input
            type="text"
            placeholder="Search guest name, ID, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-admin-surface border border-admin-border rounded-lg pl-10 pr-4 py-2.5 text-xs text-admin-heading focus:outline-none focus:border-vp-gold placeholder-admin-text/60"
          />
        </div>

        {/* Status */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-admin-surface border border-admin-border rounded-lg px-4 py-2.5 text-xs text-admin-heading focus:outline-none focus:border-vp-gold appearance-none"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Type */}
        <div className="relative">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full bg-admin-surface border border-admin-border rounded-lg px-4 py-2.5 text-xs text-admin-heading focus:outline-none focus:border-vp-gold appearance-none"
          >
            <option value="All">All Types</option>
            <option value="room">Rooms</option>
            <option value="banquet">Banquets</option>
          </select>
        </div>

        {/* Source */}
        <div className="relative">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="w-full bg-admin-surface border border-admin-border rounded-lg px-4 py-2.5 text-xs text-admin-heading focus:outline-none focus:border-vp-gold appearance-none"
          >
            <option value="All">All Sources</option>
            <option value="ONLINE">Online Booking</option>
            <option value="OFFLINE">Offline Booking</option>
          </select>
        </div>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm">{error}</div>}

      {/* Bookings Table */}
      <div className="bg-admin-card rounded-xl border border-admin-border/50 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto admin-scroll">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-admin-surface border-b border-admin-border/50 text-admin-text uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Guest</th>
                <th className="px-6 py-4">Stay / Hall</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Source</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-admin-text text-sm">
                    No reservations found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const guestName = b.user?.name || b.guestName || 'Offline Walk-in';
                  const guestEmail = b.user?.email || b.guestEmail || 'N/A';
                  const entityName = b.type === 'room' ? (b.room?.name || 'Deleted Room') : (b.banquetHall?.name || 'Deleted Banquet');
                  const statusBg =
                    b.status === 'Confirmed'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : b.status === 'Pending'
                      ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      : b.status === 'Completed'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20';

                  return (
                    <tr
                      key={b._id}
                      className="border-b border-admin-border/30 hover:bg-admin-hover/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-admin-heading text-sm">{guestName}</p>
                        <p className="text-[10px] text-admin-text mt-0.5">{guestEmail}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 font-medium text-admin-heading">
                          <span className="capitalize">{b.type}:</span> {entityName}
                        </div>
                        {b.type === 'room' && b.room?.roomNumber && (
                          <span className="text-[10px] text-vp-gold font-bold">Room No: {b.room.roomNumber}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-admin-text">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} className="text-vp-gold/70" />
                          <span>
                            {new Date(b.fromDate).toLocaleDateString()} - {new Date(b.toDate).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-vp-gold">
                        ₹{b.totalPrice?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${b.source === 'OFFLINE' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-teal-500/10 text-teal-400'}`}>
                          {b.source || 'ONLINE'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusBg}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2.5">
                        {/* Approve Quick Action */}
                        {b.status === 'Pending' && (
                          <button
                            onClick={() => handleApprove(b._id)}
                            className="p-1.5 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white border border-green-500/20 transition-all"
                            title="Approve Reservation"
                          >
                            <CheckCircle size={14} />
                          </button>
                        )}

                        {/* View Invoice/Details */}
                        <button
                          onClick={() => navigate(`/admin/bookig-details/${b._id}`)}
                          className="p-1.5 rounded-lg bg-admin-surface hover:bg-admin-hover text-admin-text hover:text-vp-gold border border-admin-border transition-all"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookingsList;
