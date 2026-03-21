import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Room, Banquet } from '../types';
import { Calendar, Clock, Users, Info, User, Phone, CheckCircle, Star } from 'lucide-react';
import { getImageUrl } from '../utils/images';
import SuccessModal from "../components/SuccessModal";

const Booking = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  
  const [item, setItem] = useState<Room | Banquet | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [eventType, setEventType] = useState('Wedding');
  const [requests, setRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [extraBeds, setExtraBeds] = useState(0);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [checkingAvailability, setCheckingAvailability] = useState(false);
    const [requested, setRequested] = useState(false);
    // const [totalPrice, setTotalPrice] = useState(0);
    const [successOpen, setSuccessOpen] = useState(false);




  const EXTRA_BED_COST = 1000;
    const MAX_EXTRA_BEDS = 3; 

  useEffect(() => {
    if (user) {
        setName(user.name);
        setPhone(user.phone || '');
    }
  }, [user]);

  useEffect(() => {
    if (!id || !type) return;
    const fetchItem = async () => {
      try {
        const data = type === 'room' ? await api.getRoom(id) : await api.getBanquet(id);
        setItem(data);
      } catch (err) {
        console.error(err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, type, navigate]);

  const calculateTotal = () => {
    if (!fromDate || !toDate || !item) return 0;
    const start = new Date(fromDate);
    const end = new Date(toDate);
    
    if (type === 'room') {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const extraBedCharge = extraBeds==0?1:extraBeds * EXTRA_BED_COST;
        return diffDays * (item as Room).pricePerNight + extraBedCharge;
    } else {
        return (item as Banquet);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Auth Check
    if (!isAuthenticated) {
        navigate('/auth', { state: { from: location } });
        return;
    }

    if (new Date(toDate) <= new Date(fromDate)) {
        setError('End date must be after start date.');
        return;
    }
    

    setIsSubmitting(true);
    try {
        const bookingData = {
             // We pass these purely for the "request proposal" context, 
             // even if the mock backend creates the booking attached to the User ID.
            contactName: name,
            contactPhone: phone,
            fromDate,
            toDate,
            numberOfGuests: guestCount,
            specialRequests: requests,
            name,
            ...(type === 'room' ? { roomId: id, extraBeds, requested } : { banquetHallId: id, eventType })
        };

        if (type === 'room') {
            // await api.createRoomBooking(bookingData);
            if (requested) {
                await api.createRoomRequest(bookingData);
            } else {
                await api.createRoomBooking(bookingData);
            }
        } else {
            await api.createBanquetBooking(bookingData);
        }
        setSuccessOpen(true);
        // navigate('/profile');
    } catch (err: any) {
        setError(err.message || 'Booking failed');
    } finally {
        setIsSubmitting(false);
    }
  };

  const checkAvailability = async () => {
  if (!fromDate || !toDate || !id || type !== 'room') return;

  setCheckingAvailability(true);
  try {
    const res = await api.checkRoomAvailability({
      roomId: id,
      fromDate,
      toDate,
    });

    setIsAvailable(res.available);

    // 👇 if NOT available → mark as request
    if (!res.available) {
      setRequested(true);
    }
  } catch (err) {
    setIsAvailable(false);
    setRequested(true);
  } finally {
    setCheckingAvailability(false);
  }
};


useEffect(() => {
  if (type === 'room' && fromDate && toDate) {
    checkAvailability();
  }
}, [fromDate, toDate]);



  if (loading || !item) return <div className="pt-32 text-center text-vp-gold font-serif text-xl">Loading your experience...</div>;

  const isRoom = type === 'room';

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-6xl bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* Left: Summary Panel (Dark) */}
        <div className="lg:w-1/3 bg-vp-dark text-white p-8 lg:p-12 relative flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-32 bg-vp-gold/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="relative z-10">
                <div className="inline-block bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-vp-gold mb-6 border border-white/10">
                    {isRoom ? 'Accommodation' : 'Event Proposal'}
                </div>
                
                <h2 className="text-3xl lg:text-4xl font-serif font-bold mb-2">{item.name}</h2>
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-8">
                     <Star size={14} className="text-vp-gold fill-current"/>
                     <span>{item.averageRating} (Top Rated)</span>
                </div>

                <div className="aspect-video rounded-lg overflow-hidden mb-6 shadow-2xl border-2 border-white/10">
                    <img src={getImageUrl(item.images[0])} alt={item.name} className="w-full h-full object-cover" />
                </div>

                <div className="space-y-4 text-sm border-t border-white/10 pt-6">
                    {/* <div className="flex justify-between items-center">
                        <span className="text-gray-400">Base Rate</span>
                        <span className="font-mono text-lg">${isRoom ? (item as Room).pricePerNight : (item as Banquet).pricePerPlate} <span className="text-xs text-gray-500">/{isRoom ? 'night' : 'pp'}</span></span>
                    </div> */}
                    {isRoom && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Occupancy</span>
                            <span>Max {(item as Room).maxGuests} Guests</span>
                        </div>
                    )}
                    {!isRoom && (
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">Capacity</span>
                            <span>Up to {(item as Banquet).capacity} Guests</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="relative z-10 mt-12 bg-vp-gold/10 p-4 rounded-lg border border-vp-gold/20">
                <h4 className="text-vp-gold font-bold uppercase tracking-widest text-xs mb-2 flex items-center gap-2">
                    <Info size={14}/> Need Assistance?
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                    Our concierge team is available 24/7 to assist with special arrangements. Call us directly at +1 (555) 123-4567.
                </p>
            </div>
        </div>

        {/* Right: Input Form (Light) */}
        <div className="lg:w-2/3 p-8 lg:p-12 bg-white">
            <div className="mb-8">
                <h1 className="text-3xl font-serif font-bold text-vp-dark mb-2">
                    {isRoom ? 'Secure Your Stay' : 'Request Event Proposal'}
                </h1>
                <p className="text-gray-500">Please fill in the details below. We will confirm your reservation shortly.</p>
            </div>
            
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 text-sm border border-red-200 flex items-start gap-3">
                   <div className="mt-0.5"><Info size={16}/></div>
                   <div><span className="font-bold">Error:</span> {error}</div>
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Section 1: Contact Info */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-vp-dark uppercase tracking-widest border-b border-gray-100 pb-2">Guest Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 group-focus-within:text-vp-gold transition-colors">Full Name</label>
                            <div className="relative">
                                <User className="absolute top-3.5 left-3 text-gray-400 group-focus-within:text-vp-dark transition-colors" size={18}/>
                                <input 
                                    type="text" 
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 pl-10 p-3 rounded-lg focus:bg-white focus:outline-none focus:border-vp-gold focus:ring-1 focus:ring-vp-gold transition-all font-medium text-gray-800"
                                    placeholder="e.g. Alexander Hamilton"
                                />
                            </div>
                        </div>
                        <div className="group">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 group-focus-within:text-vp-gold transition-colors">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute top-3.5 left-3 text-gray-400 group-focus-within:text-vp-dark transition-colors" size={18}/>
                                <input 
                                    type="tel" 
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 pl-10 p-3 rounded-lg focus:bg-white focus:outline-none focus:border-vp-gold focus:ring-1 focus:ring-vp-gold transition-all font-medium text-gray-800"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Reservation Details */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-vp-dark uppercase tracking-widest border-b border-gray-100 pb-2">
                        {isRoom ? 'Stay Details' : 'Event Details'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 group-focus-within:text-vp-gold transition-colors">
                                {isRoom ? 'Check-in Date' : 'Event Date'}
                            </label>
                            <div className="relative">
                                <Calendar className="absolute top-3.5 left-3 text-gray-400 group-focus-within:text-vp-dark transition-colors" size={18}/>
                                <input 
                                    type="date" 
                                    required
                                    value={fromDate}
                                    onChange={(e) => setFromDate(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 pl-10 p-3 rounded-lg focus:bg-white focus:outline-none focus:border-vp-gold focus:ring-1 focus:ring-vp-gold transition-all font-medium text-gray-800"
                                />
                            </div>
                        </div>
                        <div className="group">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 group-focus-within:text-vp-gold transition-colors">
                                {isRoom ? 'Check-out Date' : 'Event End Date'}
                            </label>
                            <div className="relative">
                                <Clock className="absolute top-3.5 left-3 text-gray-400 group-focus-within:text-vp-dark transition-colors" size={18}/>
                                <input 
                                    type="date" 
                                    required
                                    value={toDate}
                                    onChange={(e) => setToDate(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 pl-10 p-3 rounded-lg focus:bg-white focus:outline-none focus:border-vp-gold focus:ring-1 focus:ring-vp-gold transition-all font-medium text-gray-800"
                                />
                            </div>
                        </div>
                    </div>
                    {isRoom && fromDate && toDate && (
                        <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                            <Clock size={16} className="text-vp-gold" />
                            <span>
                            Check-in: <strong>12:00 PM</strong> &nbsp;|&nbsp; Check-out: <strong>10:00 AM</strong>
                            </span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 group-focus-within:text-vp-gold transition-colors">
                                Number of Guests
                            </label>
                            <div className="relative">
                                <Users className="absolute top-3.5 left-3 text-gray-400 group-focus-within:text-vp-dark transition-colors" size={18}/>
                                <input 
                                    type="number" 
                                    min="1"
                                    max={isRoom ? (item as Room).maxGuests : (item as Banquet).capacity}
                                    value={guestCount}
                                    onChange={(e) => setGuestCount(parseInt(e.target.value))}
                                    className="w-full bg-gray-50 border border-gray-200 pl-10 p-3 rounded-lg focus:bg-white focus:outline-none focus:border-vp-gold focus:ring-1 focus:ring-vp-gold transition-all font-medium text-gray-800"
                                />
                            </div>
                        </div>
                        
                        {isRoom && (
                            <div className="group">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                                Extra Beds
                                </label>

                                <div className="flex items-center gap-3">
                                {/* Minus */}
                                <button
                                    type="button"
                                    onClick={() => setExtraBeds((prev) => Math.max(0, prev - 1))}
                                    className="w-10 h-10 flex items-center justify-center 
                                            rounded-full border border-gray-300 
                                            text-lg font-bold text-gray-600 
                                            hover:bg-gray-200 active:scale-90 transition"
                                >
                                    −
                                </button>

                                {/* Input */}
                                <input
                                    type="number"
                                    min="0"
                                    max="3"
                                    value={extraBeds}
                                    onChange={(e) =>
                                    setExtraBeds(Math.min(item.maxBeds, Math.max(0, Number(e.target.value))))
                                    }
                                    className="w-12 h-12 text-center 
                                            rounded-full border border-gray-300 
                                            bg-gray-50 font-semibold 
                                            focus:outline-none focus:bg-white"
                                />

                                {/* Plus */}
                                <button
                                    type="button"
                                    onClick={() => setExtraBeds((prev) => Math.min(item.maxBeds?item.maxBeds:5, prev + 1))}
                                    className="w-10 h-10 flex items-center justify-center 
                                            rounded-full border border-gray-300 
                                            text-lg font-bold text-gray-600 
                                            hover:bg-gray-200 active:scale-90 transition"
                                >
                                    +
                                </button>
                                </div>

                                <p className="text-[11px] text-gray-500 mt-2">
                                ₹1000 per extra bed (max {item.maxBeds?item.maxBeds:5})
                                </p>
                            </div>
                            )}
                        {!isRoom && (
                             <div className="group">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 group-focus-within:text-vp-gold transition-colors">
                                    Event Type
                                </label>
                                <div className="relative">
                                    <div className="absolute top-3.5 left-3 text-gray-400 group-focus-within:text-vp-dark transition-colors"><CheckCircle size={18}/></div>
                                    <select 
                                        value={eventType}
                                        onChange={(e) => setEventType(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-200 pl-10 p-3 rounded-lg focus:bg-white focus:outline-none focus:border-vp-gold focus:ring-1 focus:ring-vp-gold transition-all font-medium text-gray-800 appearance-none"
                                    >
                                        {(item as Banquet).supportedEvents?.map(evt => <option key={evt} value={evt}>{evt}</option>)}
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Section 3: Notes */}
                <div className="space-y-4">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Special Requests</label>
                    <textarea 
                        rows={3}
                        value={requests}
                        onChange={(e) => setRequests(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 p-4 rounded-lg focus:bg-white focus:outline-none focus:border-vp-gold focus:ring-1 focus:ring-vp-gold transition-all text-sm"
                        placeholder="Dietary restrictions, early check-in, room preferences, etc."
                    ></textarea>
                </div>

                {/* Footer Action */}
                <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6 ">
                    {isRoom && <div className="text-center md:text-left">
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Estimated Total</p>
                        <p className="text-3xl font-serif font-bold text-vp-dark">${calculateTotal().toLocaleString()}</p>
                    </div>}
                    {/* <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full md:w-auto px-10 py-4 bg-vp-gold text-vp-dark font-bold uppercase tracking-widest hover:bg-yellow-500 hover:shadow-lg transition-all rounded-full transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? 'Processing...' : 'Submit'}
                    </button> */}
                    {isRoom && isAvailable === false ? (
                        <button onClick={handleSubmit}
    type="submit"
    className="w-full md:w-auto px-10 py-4 bg-vp-dark text-white font-bold uppercase tracking-widest rounded-full hover:opacity-90"
  >
    Request Booking
  </button>
                        ) : (
                        <button 
                            type="submit" 
                            disabled={isSubmitting || checkingAvailability}
                            className="w-full md:w-auto px-10 py-4 bg-vp-gold text-vp-dark font-bold uppercase tracking-widest hover:bg-yellow-500 hover:shadow-lg transition-all rounded-full transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {checkingAvailability ? 'Checking...' : isSubmitting ? 'Processing...' : 'Submit'}
                        </button>
                        )}

                </div>

            </form>
        </div>
      </div>
      <SuccessModal
            open={successOpen}
            title={
                requested
                ? "Request Submitted!"
                : "Booking Confirmed!"
            }
            description={
                requested
                ? "Your booking request has been sent. Our team will contact you shortly."
                : "Your booking was successful. We look forward to hosting you!"
            }
            onClose={() => {
                setSuccessOpen(false);
                navigate("/profile");
            }}
            />
    </div>
  );
};

export default Booking;
