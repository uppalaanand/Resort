import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Plus,
  ArrowLeft,
  Info,
  DollarSign,
  Search,
  CheckCircle,
  FileText
} from 'lucide-react';
import { api } from '@/utils/api';
import { Room, Banquet } from '@/types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const OfflineBooking = () => {
  const navigate = useNavigate();

  // Booking Type Toggle
  const [bookingType, setBookingType] = useState<'room' | 'banquet'>('room');

  // Guest Details Form State
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestAddress, setGuestAddress] = useState('');
  const [idProofType, setIdProofType] = useState('Aadhar');
  const [idProofNumber, setIdProofNumber] = useState('');
  const [notes, setNotes] = useState('');

  // Selected Room/Banquet
  const [rooms, setRooms] = useState<Room[]>([]);
  const [banquets, setBanquets] = useState<Banquet[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [selectedBanquetId, setSelectedBanquetId] = useState('');

  // Dates & Occupants
  const [fromDate, setFromDate] = useState<Date | null>(null);
  const [toDate, setToDate] = useState<Date | null>(null);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [extraBeds, setExtraBeds] = useState(0);
  const [eventType, setEventType] = useState('Conference');

  // Billing & Payments
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Card' | 'UPI' | 'BankTransfer' | 'Online'>('Cash');
  const [paymentStatus, setPaymentStatus] = useState<'Pending' | 'Paid' | 'Partial'>('Paid');
  const [paidAmount, setPaidAmount] = useState(0);

  // States
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [guestSearchQuery, setGuestSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        setLoading(true);
        const roomsData = await api.getRooms();
        const activeRooms = roomsData.filter(r => r.isActive && r.status === 'Available');
        setRooms(activeRooms);

        const banquetsData = await api.getBanquets();
        const activeBanquets = banquetsData.filter(b => b.isActive);
        setBanquets(activeBanquets);
      } catch (err) {
        console.error('Failed to load rooms/banquets', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEntities();
  }, []);

  const handleGuestSearch = async () => {
    if (!guestSearchQuery.trim()) return;
    try {
      const usersData = await api.getAllUsers();
      const query = guestSearchQuery.toLowerCase();
      const matches = usersData.filter(
        (u: any) =>
          u.name.toLowerCase().includes(query) ||
          (u.phone && u.phone.includes(query)) ||
          u.email.toLowerCase().includes(query)
      );
      setSearchResults(matches);
    } catch (err) {
      console.error('Failed to search guest', err);
    }
  };

  const handleSelectGuest = (u: any) => {
    setSelectedGuestId(u._id);
    setGuestName(u.name);
    setGuestEmail(u.email);
    setGuestPhone(u.phone || '');
    setGuestAddress(u.address || '');
    setIdProofType(u.idProofType || 'Aadhar');
    setIdProofNumber(u.idProofNumber || '');
    setSearchResults([]);
    setGuestSearchQuery('');
  };

  const calculateTotal = () => {
    if (bookingType === 'room') {
      const selectedRoom = rooms.find(r => r._id === selectedRoomId);
      if (!selectedRoom || !fromDate || !toDate) return 0;
      const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      const base = selectedRoom.discountPrice || selectedRoom.pricePerNight;
      return days * base + extraBeds * 1000 * days;
    } else {
      const selectedBanquet = banquets.find(b => b._id === selectedBanquetId);
      if (!selectedBanquet) return 0;
      return selectedBanquet.pricePerPlate * numberOfGuests;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!guestName.trim() || !guestPhone.trim()) {
      setError('Guest Name and Phone are required.');
      return;
    }

    if (bookingType === 'room' && !selectedRoomId) {
      setError('Please select a room.');
      return;
    }

    if (bookingType === 'banquet' && !selectedBanquetId) {
      setError('Please select a banquet hall.');
      return;
    }

    if (!fromDate || !toDate) {
      setError('Please choose valid reservation dates.');
      return;
    }

    setSubmitting(true);
    try {
      const total = calculateTotal();
      const bookingData = {
        type: bookingType,
        fromDate: fromDate.toISOString().split('T')[0],
        toDate: toDate.toISOString().split('T')[0],
        numberOfGuests,
        specialRequests: notes,
        totalPrice: total,
        guestName,
        guestPhone,
        guestEmail,
        guestAddress,
        idProofType,
        idProofNumber,
        paymentMethod,
        paymentStatus,
        notes,
        ...(selectedGuestId ? { userId: selectedGuestId } : {}),
        ...(bookingType === 'room' ? { roomId: selectedRoomId, extraBeds } : { banquetHallId: selectedBanquetId, eventType })
      };

      await api.createOfflineBooking(bookingData);
      alert('Offline walk-in booking created successfully!');
      navigate('/admin/bookings');
    } catch (err: any) {
      setError(err.message || 'Offline booking creation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const totalCost = calculateTotal();

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
          <h1 className="text-2xl font-bold text-admin-heading">Walk-in Offline Registration</h1>
          <p className="text-admin-text text-sm">
            Create physical reservations for guest check-ins directly on the property.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Input Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          {/* Guest Account Search lookup */}
          <div className="bg-admin-card border border-admin-border/50 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-vp-gold uppercase tracking-wider mb-2 flex items-center gap-2">
              <Search size={16} /> Guest Profile Lookup (Auto-fill)
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={guestSearchQuery}
                onChange={(e) => setGuestSearchQuery(e.target.value)}
                placeholder="Search by existing phone, email, or name..."
                className="flex-grow bg-admin-surface border border-admin-border rounded-lg px-4 py-2.5 text-xs text-admin-heading focus:outline-none focus:border-vp-gold"
              />
              <button
                type="button"
                onClick={handleGuestSearch}
                className="bg-admin-surface text-admin-text hover:bg-admin-hover border border-admin-border px-5 py-2.5 rounded-lg text-xs font-semibold"
              >
                Search
              </button>
            </div>

            {/* Dropdown search results */}
            {searchResults.length > 0 && (
              <div className="bg-admin-surface border border-admin-border rounded-lg divide-y divide-admin-border/30 max-h-48 overflow-y-auto">
                {searchResults.map((u) => (
                  <div
                    key={u._id}
                    onClick={() => handleSelectGuest(u)}
                    className="p-3 text-xs text-admin-heading hover:bg-admin-hover cursor-pointer flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">{u.name}</p>
                      <p className="text-[10px] text-admin-text mt-0.5">{u.email} | {u.phone}</p>
                    </div>
                    <span className="text-[10px] text-vp-gold border border-vp-gold/30 rounded px-1.5 py-0.5 font-bold uppercase">
                      Select
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Guest Personal Information */}
          <div className="bg-admin-card border border-admin-border/50 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-admin-heading uppercase tracking-wider border-b border-admin-border/20 pb-2">
              Guest Identity & Personal Info
            </h3>
            {selectedGuestId && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs p-3 rounded-lg flex items-center justify-between">
                <span>Linked profile: <strong>{guestName}</strong></span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGuestId(null);
                    setGuestName('');
                    setGuestEmail('');
                    setGuestPhone('');
                    setGuestAddress('');
                    setIdProofNumber('');
                  }}
                  className="underline font-bold hover:text-white"
                >
                  Unlink
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-admin-text uppercase mb-2">Guest Name</label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-admin-surface border border-admin-border rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-vp-gold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-admin-text uppercase mb-2">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-admin-surface border border-admin-border rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-vp-gold"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-admin-text uppercase mb-2">Email Address</label>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="e.g. guest@example.com"
                  className="w-full bg-admin-surface border border-admin-border rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-vp-gold"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-admin-text uppercase mb-2">Address</label>
                <input
                  type="text"
                  value={guestAddress}
                  onChange={(e) => setGuestAddress(e.target.value)}
                  placeholder="Street, City, State, ZIP"
                  className="w-full bg-admin-surface border border-admin-border rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-vp-gold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-admin-text uppercase mb-2">ID Proof Type</label>
                <select
                  value={idProofType}
                  onChange={(e) => setIdProofType(e.target.value)}
                  className="w-full bg-admin-surface border border-admin-border rounded-lg p-2.5 text-xs focus:outline-none focus:border-vp-gold"
                >
                  <option value="Aadhar">Aadhar Card</option>
                  <option value="PAN">PAN Card</option>
                  <option value="Passport">Passport</option>
                  <option value="DrivingLicense">Driving License</option>
                  <option value="VoterID">Voter ID</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-admin-text uppercase mb-2">ID Proof Number</label>
                <input
                  type="text"
                  value={idProofNumber}
                  onChange={(e) => setIdProofNumber(e.target.value)}
                  placeholder="ID Proof Registration number"
                  className="w-full bg-admin-surface border border-admin-border rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-vp-gold"
                />
              </div>
            </div>
          </div>

          {/* Room / Banquet Selection & Schedule */}
          <div className="bg-admin-card border border-admin-border/50 rounded-2xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-admin-heading uppercase tracking-wider border-b border-admin-border/20 pb-2 flex items-center justify-between">
              <span>Reservation Details</span>
              <div className="flex bg-admin-surface rounded-lg p-1 border border-admin-border">
                <button
                  type="button"
                  onClick={() => {
                    setBookingType('room');
                    setFromDate(null);
                    setToDate(null);
                  }}
                  className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${bookingType === 'room' ? 'bg-vp-gold text-vp-dark' : 'text-admin-text'}`}
                >
                  Room
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBookingType('banquet');
                    setFromDate(null);
                    setToDate(null);
                  }}
                  className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${bookingType === 'banquet' ? 'bg-vp-gold text-vp-dark' : 'text-admin-text'}`}
                >
                  Banquet
                </button>
              </div>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Entity Selection */}
              {bookingType === 'room' ? (
                <div>
                  <label className="block text-[10px] font-bold text-admin-text uppercase mb-2">Select Available Room</label>
                  <select
                    value={selectedRoomId}
                    onChange={(e) => setSelectedRoomId(e.target.value)}
                    className="w-full bg-admin-surface border border-admin-border rounded-lg p-2.5 text-xs focus:outline-none focus:border-vp-gold"
                  >
                    <option value="">-- Choose Room --</option>
                    {rooms.map(r => (
                      <option key={r._id} value={r._id}>
                        No. {r.roomNumber || 'N/A'} - {r.name} (₹{r.discountPrice || r.pricePerNight}/night)
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-[10px] font-bold text-admin-text uppercase mb-2">Select Banquet Hall</label>
                  <select
                    value={selectedBanquetId}
                    onChange={(e) => setSelectedBanquetId(e.target.value)}
                    className="w-full bg-admin-surface border border-admin-border rounded-lg p-2.5 text-xs focus:outline-none focus:border-vp-gold"
                  >
                    <option value="">-- Choose Banquet --</option>
                    {banquets.map(b => (
                      <option key={b._id} value={b._id}>
                        {b.name} (₹{b.pricePerPlate}/plate)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Number of Guests */}
              <div>
                <label className="block text-[10px] font-bold text-admin-text uppercase mb-2">Number of Guests</label>
                <input
                  type="number"
                  min={1}
                  value={numberOfGuests}
                  onChange={(e) => setNumberOfGuests(parseInt(e.target.value) || 1)}
                  className="w-full bg-admin-surface border border-admin-border rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-vp-gold"
                />
              </div>

              {/* Schedule Dates */}
              <div className="group">
                <label className="block text-[10px] font-bold text-admin-text uppercase mb-2">
                  {bookingType === 'room' ? 'Check-in Date' : 'Event Start Date'}
                </label>
                <div className="relative">
                  <Calendar className="absolute top-2.5 left-3 text-admin-text" size={14} />
                  <DatePicker
                    selected={fromDate}
                    onChange={(date: Date | null) => {
                      setFromDate(date);
                      setToDate(null);
                    }}
                    minDate={new Date()}
                    placeholderText="Choose check-in"
                    className="w-full bg-admin-surface border border-admin-border rounded-lg pl-9 p-2 text-xs text-admin-heading focus:outline-none focus:border-vp-gold"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-[10px] font-bold text-admin-text uppercase mb-2">
                  {bookingType === 'room' ? 'Check-out Date' : 'Event End Date'}
                </label>
                <div className="relative">
                  <Calendar className="absolute top-2.5 left-3 text-admin-text" size={14} />
                  <DatePicker
                    selected={toDate}
                    onChange={(date: Date | null) => setToDate(date)}
                    minDate={fromDate || new Date()}
                    disabled={!fromDate}
                    placeholderText="Choose check-out"
                    className="w-full bg-admin-surface border border-admin-border rounded-lg pl-9 p-2 text-xs text-admin-heading focus:outline-none focus:border-vp-gold"
                  />
                </div>
              </div>

              {/* Additional room parameters */}
              {bookingType === 'room' && (
                <div>
                  <label className="block text-[10px] font-bold text-admin-text uppercase mb-2">Extra Beds Required</label>
                  <input
                    type="number"
                    min={0}
                    max={3}
                    value={extraBeds}
                    onChange={(e) => setExtraBeds(parseInt(e.target.value) || 0)}
                    className="w-full bg-admin-surface border border-admin-border rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-vp-gold"
                  />
                </div>
              )}

              {/* Additional banquet parameters */}
              {bookingType === 'banquet' && (
                <div>
                  <label className="block text-[10px] font-bold text-admin-text uppercase mb-2">Event Type</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full bg-admin-surface border border-admin-border rounded-lg p-2.5 text-xs focus:outline-none focus:border-vp-gold"
                  >
                    <option value="Conference">Conference Meeting</option>
                    <option value="Wedding">Wedding Reception</option>
                    <option value="Birthday">Birthday Celebration</option>
                    <option value="Party">Social Gala / Party</option>
                    <option value="Other">Other Events</option>
                  </select>
                </div>
              )}
            </div>

            {/* Special Request notes */}
            <div>
              <label className="block text-[10px] font-bold text-admin-text uppercase mb-2">Special Notes & Concierge Requests</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Early check-in requested, fruit basket in room, allergic to peanuts."
                className="w-full bg-admin-surface border border-admin-border rounded-lg p-3 text-xs text-admin-heading focus:outline-none focus:border-vp-gold"
              />
            </div>
          </div>

          {/* Billing & Payments config */}
          <div className="bg-admin-card border border-admin-border/50 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-admin-heading uppercase tracking-wider border-b border-admin-border/20 pb-2">
              Payment Settlement
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-admin-text uppercase mb-2">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full bg-admin-surface border border-admin-border rounded-lg p-2.5 text-xs focus:outline-none focus:border-vp-gold"
                >
                  <option value="Cash">Cash Payment</option>
                  <option value="Card">Credit/Debit Card</option>
                  <option value="UPI">UPI (GooglePay/PhonePe/Paytm)</option>
                  <option value="BankTransfer">Direct Bank Transfer</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-admin-text uppercase mb-2">Payment Status</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as any)}
                  className="w-full bg-admin-surface border border-admin-border rounded-lg p-2.5 text-xs focus:outline-none focus:border-vp-gold"
                >
                  <option value="Paid">Fully Settled (Paid)</option>
                  <option value="Partial">Partial Settlement</option>
                  <option value="Pending">Unpaid (Pending)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-admin-text uppercase mb-2">Amount Paid (INR)</label>
                <input
                  type="number"
                  min={0}
                  value={paymentStatus === 'Paid' ? totalCost : paidAmount}
                  disabled={paymentStatus === 'Paid'}
                  onChange={(e) => setPaidAmount(parseInt(e.target.value) || 0)}
                  className="w-full bg-admin-surface border border-admin-border rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-vp-gold disabled:opacity-50"
                />
              </div>
            </div>
          </div>
        </form>

        {/* Right 1 Column: Invoice Summary */}
        <div className="space-y-6">
          <div className="bg-admin-card border border-admin-border/50 rounded-2xl p-6 space-y-6 sticky top-6">
            <h3 className="text-sm font-bold text-admin-heading uppercase tracking-wider border-b border-admin-border/20 pb-2">
              Billing Invoice Details
            </h3>

            {/* Calculations Breakdown */}
            <div className="space-y-3.5 text-xs text-admin-text">
              <div className="flex justify-between">
                <span>Guest Name:</span>
                <span className="font-semibold text-admin-heading">{guestName || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Reservation Type:</span>
                <span className="font-semibold text-admin-heading capitalize">{bookingType} Booking</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-semibold text-admin-heading">{paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-semibold text-vp-gold uppercase">{paymentStatus}</span>
              </div>
              <hr className="border-admin-border/30" />
              <div className="flex justify-between items-center text-sm font-bold pt-2 text-admin-heading">
                <span>Total Amount:</span>
                <span className="text-xl text-vp-gold flex items-center font-bold">
                  <DollarSign size={16} /> {totalCost.toLocaleString()}
                </span>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs p-3 rounded-lg flex items-start gap-2">
                <Info size={14} className="mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-vp-gold hover:bg-amber-400 text-vp-dark font-bold py-3 rounded-xl transition-all uppercase tracking-wider text-xs shadow-lg shadow-vp-gold/15 disabled:opacity-50"
            >
              {submitting ? 'Registering...' : 'Finalize & Check-In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineBooking;
