import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  Search,
  Eye,
  ArrowLeft,
  Home,
  Info,
  Clock,
  CheckCircle,
  FileText
} from 'lucide-react';
import { api } from '@/utils/api';
import { Room } from '@/types';

const RoomHistory = () => {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [roomHistory, setRoomHistory] = useState<any[]>([]);
  const [selectedRoomMeta, setSelectedRoomMeta] = useState<any>(null);

  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoadingRooms(true);
        const data = await api.getRooms();
        setRooms(data);
      } catch (err) {
        setError('Failed to load rooms list');
      } finally {
        setLoadingRooms(false);
      }
    };
    fetchRooms();
  }, []);

  const handleRoomChange = async (roomId: string) => {
    setSelectedRoomId(roomId);
    if (!roomId) {
      setRoomHistory([]);
      setSelectedRoomMeta(null);
      return;
    }

    setLoadingHistory(true);
    try {
      const res = await api.getRoomHistory(roomId);
      setRoomHistory(res.history || []);
      setSelectedRoomMeta(res.room);
    } catch (err) {
      console.error('Failed to load room history', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <div className="p-6 md:p-8 min-h-screen text-admin-heading animate-admin-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="bg-admin-surface text-admin-text hover:bg-admin-hover border border-admin-border rounded-lg p-2.5 flex items-center transition-all"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-admin-heading">Room Guest History</h1>
          <p className="text-admin-text text-sm">
            Lookup previous guests, stays, and check-out logs for any room in the property.
          </p>
        </div>
      </div>

      {/* Select Room */}
      <div className="bg-admin-card border border-admin-border/50 rounded-2xl p-6 mb-6">
        <label className="block text-xs font-bold text-admin-text uppercase mb-2">Select Resort Room</label>
        <select
          value={selectedRoomId}
          onChange={(e) => handleRoomChange(e.target.value)}
          disabled={loadingRooms}
          className="w-full bg-admin-surface border border-admin-border rounded-lg p-3 text-sm focus:outline-none focus:border-vp-gold"
        >
          <option value="">-- Choose Room --</option>
          {rooms.map((room) => (
            <option key={room._id} value={room._id}>
              Room {room.roomNumber || 'N/A'} - {room.name}
            </option>
          ))}
        </select>
      </div>

      {/* Room metadata panel if selected */}
      {selectedRoomMeta && (
        <div className="bg-admin-card border border-admin-border/50 rounded-2xl p-6 mb-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-vp-gold/15 text-vp-gold border border-vp-gold/20 p-2.5 rounded-xl">
              <Home size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-admin-heading">{selectedRoomMeta.name}</h2>
              <p className="text-xs text-admin-text">
                Property Room No: <strong className="text-vp-gold">Room {selectedRoomMeta.roomNumber}</strong>
              </p>
            </div>
          </div>
          <span className="text-xs text-admin-text bg-admin-surface border border-admin-border px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
            {roomHistory.length} Previous stays
          </span>
        </div>
      )}

      {/* History table list */}
      {loadingHistory ? (
        <div className="bg-admin-card rounded-2xl border border-admin-border/50 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton-pulse h-16 border-b border-admin-border/30 w-full" />
          ))}
        </div>
      ) : selectedRoomId ? (
        <div className="bg-admin-card rounded-2xl border border-admin-border/50 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto admin-scroll">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-admin-surface border-b border-admin-border/50 text-admin-text uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4">Guest Info</th>
                  <th className="px-6 py-4">Dates</th>
                  <th className="px-6 py-4">Stay Duration</th>
                  <th className="px-6 py-4">Total Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {roomHistory.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-admin-text text-sm">
                      No guest stay history recorded for this room.
                    </td>
                  </tr>
                ) : (
                  roomHistory.map((b) => {
                    const guestName = b.user?.name || b.guestName || 'Walk-in Guest';
                    const guestPhone = b.user?.phone || b.guestPhone || 'N/A';
                    const guestEmail = b.user?.email || b.guestEmail || 'N/A';

                    // Calculate stay nights
                    const start = new Date(b.fromDate);
                    const end = new Date(b.toDate);
                    const diff = Math.abs(end.getTime() - start.getTime());
                    const nights = Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;

                    return (
                      <tr
                        key={b._id}
                        className="border-b border-admin-border/30 hover:bg-admin-hover/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <p className="font-semibold text-admin-heading text-sm">{guestName}</p>
                          <p className="text-[10px] text-admin-text mt-0.5">{guestEmail} | {guestPhone}</p>
                        </td>
                        <td className="px-6 py-4 text-admin-text">
                          <div className="flex items-center gap-1.5 font-medium">
                            <Calendar size={12} className="text-vp-gold/70" />
                            <span>
                              {new Date(b.fromDate).toLocaleDateString()} - {new Date(b.toDate).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-admin-text">
                          <div className="flex items-center gap-1.5 font-medium">
                            <Clock size={12} className="text-vp-gold/70" />
                            <span>{nights} Nights stay</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-vp-gold">
                          ₹{b.totalPrice?.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              b.status === 'Completed'
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : 'bg-green-500/10 text-green-400 border border-green-500/20'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => navigate(`/admin/bookig-details/${b._id}`)}
                            className="p-1.5 rounded-lg bg-admin-surface hover:bg-admin-hover text-admin-text hover:text-vp-gold border border-admin-border transition-all inline-flex items-center"
                            title="View Booking Invoice"
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
      ) : (
        <div className="py-16 text-center text-admin-text bg-admin-card rounded-2xl border border-admin-border/50">
          <Info className="mx-auto mb-2 text-vp-gold/70" size={24} />
          <span>Please select a room to view guest logs.</span>
        </div>
      )}
    </div>
  );
};

export default RoomHistory;
