import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Info,
  ChevronRight,
  Eye,
  RefreshCw,
  SlidersHorizontal,
  User
} from 'lucide-react';
import { api } from '@/utils/api';

interface OccupancySummary {
  total: number;
  available: number;
  reserved: number;
  occupied: number;
  maintenance: number;
  cleaning: number;
  rooms: any[];
}

const RoomOccupancy = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<OccupancySummary | null>(null);
  const [filteredRooms, setFilteredRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Status Filter State
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchOccupancy = async () => {
    try {
      setLoading(true);
      const res = await api.getRoomOccupancy();
      setData(res);
      setFilteredRooms(res.rooms || []);
    } catch (err) {
      setError('Failed to fetch occupancy tracker data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOccupancy();
  }, []);

  useEffect(() => {
    if (!data) return;
    if (statusFilter === 'All') {
      setFilteredRooms(data.rooms);
    } else {
      setFilteredRooms(data.rooms.filter(r => r.status === statusFilter));
    }
  }, [statusFilter, data]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!selectedRoom) return;
    setStatusUpdating(true);
    try {
      await api.updateRoomStatus(selectedRoom._id, newStatus);
      setSelectedRoom(null);
      await fetchOccupancy();
    } catch (err: any) {
      alert(err.message || 'Status update failed');
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 min-h-screen space-y-6 animate-admin-fadeIn">
        <div className="skeleton-pulse h-8 w-64 rounded-lg mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-pulse h-24 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skeleton-pulse h-48 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data)
    return <div className="p-10 text-center text-red-400">{error}</div>;

  // Colors for each status
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Available':
        return {
          cardBorder: 'border-green-500/30 hover:border-green-500',
          badge: 'bg-green-500/10 text-green-400 border border-green-500/20',
          barColor: 'bg-green-500'
        };
      case 'Reserved':
        return {
          cardBorder: 'border-blue-500/30 hover:border-blue-500',
          badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
          barColor: 'bg-blue-500'
        };
      case 'Occupied':
        return {
          cardBorder: 'border-red-500/30 hover:border-red-500',
          badge: 'bg-red-500/10 text-red-400 border border-red-500/20',
          barColor: 'bg-red-500'
        };
      case 'Maintenance':
        return {
          cardBorder: 'border-yellow-500/30 hover:border-yellow-500',
          badge: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
          barColor: 'bg-yellow-500'
        };
      case 'Cleaning':
      default:
        return {
          cardBorder: 'border-slate-500/30 hover:border-slate-500',
          badge: 'bg-slate-500/10 text-slate-400 border border-slate-500/20',
          barColor: 'bg-slate-400'
        };
    }
  };

  return (
    <div className="p-6 md:p-8 min-h-screen text-admin-heading animate-admin-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-admin-heading mb-1">Room Occupancy Tracker</h1>
          <p className="text-admin-text text-sm">
            Monitor real-time room availability, reservations, maintenance actions, and cleanliness status.
          </p>
        </div>
        <button
          onClick={fetchOccupancy}
          className="flex items-center gap-2 bg-admin-surface hover:bg-admin-hover text-admin-text border border-admin-border px-4 py-2 rounded-lg text-xs font-semibold transition-all"
        >
          <RefreshCw size={14} /> Refresh Tracker
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-admin-card rounded-xl border border-admin-border/50 p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
          <span className="text-[10px] font-bold text-admin-text uppercase block">Available</span>
          <span className="text-2xl font-bold text-green-400 block mt-1">{data.available}</span>
        </div>
        <div className="bg-admin-card rounded-xl border border-admin-border/50 p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
          <span className="text-[10px] font-bold text-admin-text uppercase block">Occupied</span>
          <span className="text-2xl font-bold text-red-400 block mt-1">{data.occupied}</span>
        </div>
        <div className="bg-admin-card rounded-xl border border-admin-border/50 p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
          <span className="text-[10px] font-bold text-admin-text uppercase block">Reserved</span>
          <span className="text-2xl font-bold text-blue-400 block mt-1">{data.reserved}</span>
        </div>
        <div className="bg-admin-card rounded-xl border border-admin-border/50 p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500"></div>
          <span className="text-[10px] font-bold text-admin-text uppercase block">Maintenance</span>
          <span className="text-2xl font-bold text-yellow-400 block mt-1">{data.maintenance}</span>
        </div>
        <div className="bg-admin-card rounded-xl border border-admin-border/50 p-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-slate-400"></div>
          <span className="text-[10px] font-bold text-admin-text uppercase block">Cleaning</span>
          <span className="text-2xl font-bold text-slate-400 block mt-1">{data.cleaning}</span>
        </div>
      </div>

      {/* Grid Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <SlidersHorizontal size={14} className="text-admin-text" />
        <span className="text-xs text-admin-text font-bold mr-2">Filter Grid:</span>
        {['All', 'Available', 'Occupied', 'Reserved', 'Maintenance', 'Cleaning'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              statusFilter === status
                ? 'bg-vp-gold border-vp-gold text-vp-dark shadow-md shadow-vp-gold/10'
                : 'bg-admin-surface border-admin-border text-admin-text hover:bg-admin-hover'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {filteredRooms.length === 0 ? (
          <div className="col-span-full py-16 text-center text-admin-text bg-admin-card rounded-2xl border border-admin-border/50">
            No rooms found matching this status.
          </div>
        ) : (
          filteredRooms.map((room) => {
            const styles = getStatusStyle(room.status);
            const booking = room.currentBooking;
            const guestName = booking?.guestName || booking?.user?.name || 'Walk-in';

            return (
              <div
                key={room._id}
                onClick={() => setSelectedRoom(room)}
                className={`bg-admin-card rounded-2xl border ${styles.cardBorder} p-5 flex flex-col justify-between cursor-pointer transition-all shadow-lg hover:shadow-2xl`}
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-bold text-admin-text bg-admin-surface border border-admin-border px-2 py-0.5 rounded uppercase">
                      Floor {room.floor || 1}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${styles.badge}`}>
                      {room.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-admin-heading flex items-baseline gap-1.5">
                    <span className="text-vp-gold">Room {room.roomNumber || 'N/A'}</span>
                  </h3>
                  <p className="text-[11px] text-admin-text truncate mt-1">{room.name}</p>
                </div>

                {/* Occupancy Mini Panel */}
                <div className="mt-5 pt-3 border-t border-admin-border/30">
                  {room.status === 'Occupied' || room.status === 'Reserved' ? (
                    <div className="space-y-1.5 text-[10px] text-admin-text">
                      <p className="flex items-center gap-1.5 font-medium text-admin-heading">
                        <User size={12} className="text-vp-gold/70" />
                        <span>{guestName}</span>
                      </p>
                      <p>Out: <span className="font-semibold">{booking?.toDate ? new Date(booking.toDate).toLocaleDateString() : 'N/A'}</span></p>
                    </div>
                  ) : (
                    <p className="text-[9px] text-admin-text/60 italic">Room is currently empty.</p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* QUICK STATUS UPDATE MODAL */}
      {selectedRoom && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-admin-card border border-admin-border rounded-2xl w-full max-w-md p-6 space-y-5 animate-admin-scaleIn">
            <div className="flex justify-between items-center border-b border-admin-border/30 pb-3">
              <h3 className="text-lg font-bold text-admin-heading">Room {selectedRoom.roomNumber} Dashboard</h3>
              <button
                onClick={() => setSelectedRoom(null)}
                className="text-admin-text hover:text-white"
              >
                ✕
              </button>
            </div>

            <div>
              <p className="text-xs text-admin-text">Room Name:</p>
              <h4 className="text-sm font-bold text-vp-gold mt-0.5">{selectedRoom.name}</h4>
              <p className="text-xs text-admin-text mt-3">Current Status:</p>
              <span className={`inline-block px-3 py-1 rounded text-xs font-bold uppercase mt-1 ${getStatusStyle(selectedRoom.status).badge}`}>
                {selectedRoom.status}
              </span>
            </div>

            {/* If there is active booking, show invoice details */}
            {selectedRoom.currentBooking && (
              <div className="bg-admin-surface border border-admin-border/50 rounded-xl p-4 space-y-2 text-xs">
                <h5 className="font-bold text-admin-heading uppercase tracking-wider text-[10px] text-vp-gold flex justify-between">
                  <span>Current Stay Details</span>
                  <button
                    onClick={() => {
                      setSelectedRoom(null);
                      navigate(`/admin/bookig-details/${selectedRoom.currentBooking._id}`);
                    }}
                    className="underline hover:text-white flex items-center gap-0.5"
                  >
                    <Eye size={10} /> View Invoice
                  </button>
                </h5>
                <p>Guest Name: <span className="font-semibold text-admin-heading">{selectedRoom.currentBooking.guestName || selectedRoom.currentBooking.user?.name || 'Walk-in'}</span></p>
                <p>Nights Stay: <span className="font-semibold text-admin-heading">{selectedRoom.currentBooking.fromDate} to {selectedRoom.currentBooking.toDate}</span></p>
                <p>Payment: <span className="font-semibold text-vp-gold">{selectedRoom.currentBooking.status} | {selectedRoom.currentBooking.paymentStatus || 'Pending'}</span></p>
              </div>
            )}

            {/* Status updates button group */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-admin-text uppercase">Assign Status</label>
              <div className="grid grid-cols-2 gap-3">
                {['Available', 'Maintenance', 'Cleaning', 'Reserved', 'Occupied'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={statusUpdating}
                    onClick={() => handleStatusUpdate(status)}
                    className="bg-admin-surface hover:bg-admin-hover border border-admin-border text-admin-heading rounded-xl py-2.5 text-xs font-semibold transition-all hover:border-vp-gold active:scale-95"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedRoom(null)}
                className="bg-admin-surface text-admin-text border border-admin-border px-4 py-2 text-xs font-bold rounded-lg hover:bg-admin-hover"
              >
                Close Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomOccupancy;
