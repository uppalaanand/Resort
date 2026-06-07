import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Users,
  Calendar,
  Eye,
  Info,
  Clock
} from 'lucide-react';
import { api } from '@/utils/api';
import { Room, Booking } from '@/types';

const BookingCalendar = () => {
  const navigate = useNavigate();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Tooltip/Highlight Detail state
  const [selectedCellBooking, setSelectedCellBooking] = useState<Booking | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const roomsData = await api.getRooms();
        const bookingsData = await api.getAllBookings();
        setRooms(roomsData.filter(r => r.isActive));
        setBookings(bookingsData.filter(b => b.status !== 'Cancelled' && b.status !== 'Rejected'));
      } catch (err) {
        console.error('Failed to load calendar data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Days in month calculation
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedCellBooking(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedCellBooking(null);
  };

  // Find booking for room on specific day
  const getBookingForDay = (roomId: string, dayNum: number) => {
    const checkDate = new Date(year, month, dayNum);
    checkDate.setHours(12, 0, 0, 0); // Mid-day check

    return bookings.find((b) => {
      if (b.type !== 'room' || !b.room) return false;
      const bRoomId = typeof b.room === 'object' ? b.room._id : b.room;
      if (bRoomId !== roomId) return false;

      const start = new Date(b.fromDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(b.toDate);
      end.setHours(23, 59, 59, 999);

      return checkDate >= start && checkDate <= end;
    });
  };

  if (loading) {
    return (
      <div className="p-8 min-h-screen space-y-6 animate-admin-fadeIn">
        <div className="skeleton-pulse h-8 w-64 rounded-lg mb-8" />
        <div className="skeleton-pulse h-48 w-full rounded-xl" />
        <div className="skeleton-pulse h-96 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 min-h-screen text-admin-heading animate-admin-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-admin-heading mb-1">Occupancy Calendar</h1>
          <p className="text-admin-text text-sm">
            Monthly Gantt dashboard showing room bookings and reservation overlaps.
          </p>
        </div>

        {/* Month Selector controls */}
        <div className="flex items-center bg-admin-card border border-admin-border/50 rounded-xl px-2 py-1.5 shadow-lg">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg hover:bg-admin-hover text-admin-text hover:text-white transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="px-4 text-xs font-bold text-admin-heading uppercase tracking-wider min-w-32 text-center">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg hover:bg-admin-hover text-admin-text hover:text-white transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 bg-admin-card border border-admin-border/50 p-4 rounded-xl text-xs text-admin-text">
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-green-500/10 border border-green-500/30"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-blue-500 border border-blue-600"></div>
          <span>Confirmed stay</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-yellow-500 border border-yellow-600"></div>
          <span>Pending stay</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 rounded bg-purple-500 border border-purple-600"></div>
          <span>Completed stay</span>
        </div>
        <div className="ml-auto text-[10px] text-vp-gold font-bold uppercase tracking-wider">
          💡 Click on booked cells to view stay details
        </div>
      </div>

      {/* Gantt Timeline Grid */}
      <div className="bg-admin-card border border-admin-border/50 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto admin-scroll">
          <table className="w-full text-center border-collapse">
            <thead>
              <tr className="bg-admin-surface border-b border-admin-border/50 text-[10px] font-bold text-admin-text uppercase">
                <th className="px-4 py-3.5 text-left min-w-48 sticky left-0 bg-admin-surface border-r border-admin-border/50 z-10">
                  Room / ID No.
                </th>
                {daysArray.map((day) => (
                  <th key={day} className="px-2.5 py-3.5 min-w-10 border-r border-admin-border/30">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room._id} className="border-b border-admin-border/30 hover:bg-admin-hover/10 transition-colors">
                  {/* Sticky left Room column */}
                  <td className="px-4 py-3 text-left font-semibold text-admin-heading sticky left-0 bg-admin-card border-r border-admin-border/50 z-10 flex items-center gap-2">
                    <Home size={13} className="text-vp-gold/70" />
                    <div>
                      <span className="text-vp-gold font-bold block text-[11px]">No. {room.roomNumber}</span>
                      <span className="text-[10px] text-admin-text block font-normal line-clamp-1">{room.name}</span>
                    </div>
                  </td>

                  {/* Calendar day columns */}
                  {daysArray.map((day) => {
                    const booking = getBookingForDay(room._id, day);
                    let cellClass = 'bg-transparent border-r border-admin-border/20';

                    if (booking) {
                      if (booking.status === 'Pending') {
                        cellClass = 'bg-yellow-500/80 border-yellow-600 border-r border-b hover:bg-yellow-500 transition-all cursor-pointer';
                      } else if (booking.status === 'Confirmed') {
                        cellClass = 'bg-blue-500 border-blue-600 border-r border-b hover:bg-blue-600 transition-all cursor-pointer';
                      } else if (booking.status === 'Completed') {
                        cellClass = 'bg-purple-500 border-purple-600 border-r border-b hover:bg-purple-600 transition-all cursor-pointer';
                      }
                    } else {
                      cellClass = 'hover:bg-green-500/10 border-r border-admin-border/20';
                    }

                    return (
                      <td
                        key={day}
                        onClick={() => booking && setSelectedCellBooking(booking)}
                        className={`h-11 ${cellClass}`}
                        title={booking ? `Booked for ${booking.guestName || 'Guest'}` : 'Room Available'}
                      />
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Cell Booking Tooltip Info bar */}
      {selectedCellBooking && (
        <div className="bg-admin-card border border-admin-border/50 rounded-2xl p-6 mt-6 max-w-lg mx-auto flex items-start gap-4 shadow-xl animate-admin-slideDown relative">
          <button
            onClick={() => setSelectedCellBooking(null)}
            className="absolute top-4 right-4 text-admin-text hover:text-white text-sm"
          >
            ✕
          </button>
          <div className="bg-vp-gold/15 text-vp-gold p-2.5 rounded-xl border border-vp-gold/20 flex-shrink-0">
            <Calendar size={24} />
          </div>
          <div className="flex-grow space-y-2.5 text-xs text-admin-text">
            <h3 className="font-bold text-admin-heading text-sm uppercase tracking-wider text-vp-gold">
              Stay Reservation Overview
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-[10px] uppercase">Guest</span>
                <span className="font-semibold text-admin-heading text-sm">
                  {selectedCellBooking.guestName || selectedCellBooking.user?.name || 'Walk-in'}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase">Dates</span>
                <span className="font-semibold text-admin-heading">
                  {selectedCellBooking.fromDate} to {selectedCellBooking.toDate}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase">Payment Status</span>
                <span className="font-semibold text-vp-gold uppercase">
                  {selectedCellBooking.paymentStatus || 'Pending'}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase">Booking Status</span>
                <span className="font-semibold text-admin-heading uppercase">
                  {selectedCellBooking.status}
                </span>
              </div>
            </div>
            <div className="pt-2 flex gap-3 border-t border-admin-border/30">
              <button
                onClick={() => navigate(`/admin/bookig-details/${selectedCellBooking._id}`)}
                className="bg-vp-gold hover:bg-amber-400 text-vp-dark font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all"
              >
                <Eye size={12} /> View Full Invoice
              </button>
              <button
                onClick={() => setSelectedCellBooking(null)}
                className="bg-admin-surface text-admin-text hover:bg-admin-hover border border-admin-border px-4 py-2 rounded-lg"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;
