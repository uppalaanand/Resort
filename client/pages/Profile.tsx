// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { api } from '../utils/api';
// import { Booking, Room, Banquet } from '../types';
// import { Calendar, MapPin, Clock, XCircle } from 'lucide-react';
// import { Link, Navigate } from 'react-router-dom';
// import { getImageUrl } from '../utils/images';

// const Profile = () => {
//   const { user, logout } = useAuth();
//   const [bookings, setBookings] = useState<Booking[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (user) {
//       api.getMyBookings().then(setBookings).catch(console.error).finally(() => setLoading(false));
//     }
//   }, [user]);

//   if (!user) return <Navigate to="/auth" />;

//   const handleCancel = async (id: string) => {
//     if (window.confirm('Are you sure you want to cancel this booking?')) {
//         try {
//             await api.cancelBooking(id);
//             // refresh
//             const updated = await api.getMyBookings();
//             setBookings(updated);
//         } catch (e) {
//             alert('Failed to cancel');
//         }
//     }
//   };

//   const statusColors = {
//     'Pending': 'bg-yellow-100 text-yellow-800',
//     'Confirmed': 'bg-green-100 text-green-800',
//     'Cancelled': 'bg-red-100 text-red-800',
//     'Completed': 'bg-blue-100 text-blue-800',
//   };

//   return (
//     <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//             <div className="flex flex-col md:flex-row gap-8">
//                 {/* Sidebar */}
//                 <div className="md:w-1/4">
//                     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
//                         <div className="w-24 h-24 bg-vp-dark text-vp-gold rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
//                             {user.name.charAt(0)}
//                         </div>
//                         <h2 className="text-xl font-bold text-vp-dark">{user.name}</h2>
//                         <p className="text-gray-500 text-sm mb-6">{user.email}</p>
//                         <div className="space-y-2">
//                             <button className="w-full text-left px-4 py-2 bg-vp-cream text-vp-dark font-bold rounded">My Bookings</button>
//                             <button className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded text-gray-600 transition-colors">Settings</button>
//                             <button onClick={logout} className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 rounded transition-colors">Sign Out</button>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Main Content */}
//                 <div className="md:w-3/4">
//                     <h1 className="text-2xl font-serif font-bold text-vp-dark mb-6">My Reservations</h1>
//                     {loading ? <div className="text-center py-10">Loading...</div> : bookings.length === 0 ? (
//                         <div className="bg-white p-12 rounded-xl text-center border border-dashed">
//                             <p className="text-gray-500 mb-4">You haven't made any bookings yet.</p>
//                             <Link to="/rooms" className="text-vp-gold font-bold underline">Explore Rooms</Link>
//                         </div>
//                     ) : (
//                         <div className="space-y-6">
//                             {bookings.map((bk) => {
//                                 const item = bk.type === 'room' ? (bk.room as Room) : (bk.banquetHall as Banquet);
//                                 if (!item) return null; // Handle deleted items
//                                 return (
//                                     <div key={bk._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
//                                         <div className="md:w-1/4 h-32 rounded-lg overflow-hidden bg-gray-200">
//                                             <img src={getImageUrl(item.images?.[0])} alt="Booking" className="w-full h-full object-cover" />
//                                         </div>
//                                         <div className="flex-grow">
//                                             <div className="flex justify-between items-start mb-2">
//                                                 <h3 className="text-lg font-bold text-vp-dark">{item.name}</h3>
//                                                 <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${statusColors[bk.status]}`}>
//                                                     {bk.status}
//                                                 </span>
//                                             </div>
//                                             <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">{bk.type === 'room' ? 'Room Stay' : 'Event Booking'}</p>
                                            
//                                             <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
//                                                 <div className="flex items-center gap-2">
//                                                     <Calendar size={16} className="text-vp-gold" />
//                                                     <span>{new Date(bk.fromDate).toLocaleDateString()} - {new Date(bk.toDate).toLocaleDateString()}</span>
//                                                 </div>
//                                                 <div className="flex items-center gap-2">
//                                                     <MapPin size={16} className="text-vp-gold" />
//                                                     <span>Four Leaf Main Wing</span>
//                                                 </div>
//                                                 <div className="flex items-center gap-2">
//                                                     <Clock size={16} className="text-vp-gold" />
//                                                     <span>Check-in: 2:00 PM</span>
//                                                 </div>
//                                             </div>

//                                             {(bk.status === 'Pending' || bk.status === 'Confirmed') && (
//                                                 <button 
//                                                     onClick={() => handleCancel(bk._id)}
//                                                     className="text-red-500 text-xs font-bold flex items-center gap-1 hover:text-red-700 transition-colors"
//                                                 >
//                                                     <XCircle size={14} /> Cancel Booking
//                                                 </button>
//                                             )}
//                                         </div>
//                                         <div className="md:w-1/6 flex flex-col justify-center items-end border-l border-gray-100 pl-6">
//                                             <span className="text-gray-400 text-xs">Total</span>
//                                             <span className="text-xl font-bold text-vp-dark">${bk.totalPrice}</span>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     </div>
//   );
// };

// export default Profile;


import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";
import { Booking, Room, Banquet } from "../types";
import { Calendar, MapPin, Clock, XCircle } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { getImageUrl } from "../utils/images";

const Profile = () => {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<"bookings" | "settings">("bookings");

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- SETTINGS FORM STATE ---------------- */
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    currentPassword: "",
    newPassword: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      api
        .getMyBookings()
        .then(setBookings)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user) return <Navigate to="/auth" />;

  /* ---------------- CANCEL BOOKING ---------------- */
  const handleCancel = async (id: string) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await api.cancelBooking(id);
        const updated = await api.getMyBookings();
        setBookings(updated);
      } catch {
        alert("Failed to cancel booking");
      }
    }
  };

  /* ---------------- UPDATE PROFILE ---------------- */
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateProfile(formData);
      alert("Profile updated successfully");
    } catch {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- CHANGE PASSWORD ---------------- */
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateProfile(formData);
      alert("Password changed successfully");
      setFormData({ currentPassword: "", newPassword: "" });
    } catch {
      alert("Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const statusColors: any = {
    Pending: "bg-yellow-100 text-yellow-800",
    Confirmed: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
    Completed: "bg-blue-100 text-blue-800",
  };

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* ---------------- SIDEBAR ---------------- */}
          <div className="md:w-1/4">
            <div className="bg-white p-6 rounded-xl shadow border text-center">
              <div className="w-24 h-24 bg-vp-dark text-vp-gold rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                {user.name.charAt(0)}
              </div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-gray-500 text-sm mb-6">{user.email}</p>

              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab("bookings")}
                  className={`w-full text-left px-4 py-2 rounded font-semibold ${
                    activeTab === "bookings"
                      ? "bg-vp-cream text-vp-dark"
                      : "hover:bg-gray-100"
                  }`}
                >
                  My Bookings
                </button>

                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full text-left px-4 py-2 rounded font-semibold ${
                    activeTab === "settings"
                      ? "bg-vp-cream text-vp-dark"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Settings
                </button>

                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-50 rounded"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>

          {/* ---------------- MAIN CONTENT ---------------- */}
          <div className="md:w-3/4">
            
            {/* ========== BOOKINGS TAB ========== */}
            {activeTab === "bookings" && (
              <>
                <h1 className="text-2xl font-bold mb-6">My Reservations</h1>

                {loading ? (
                  <div className="text-center py-10">Loading...</div>
                ) : bookings.length === 0 ? (
                  <div className="bg-white p-12 rounded-xl text-center border border-dashed">
                    <p className="text-gray-500 mb-4">
                      You haven't made any bookings yet.
                    </p>
                    <Link to="/rooms" className="text-vp-gold font-bold underline">
                      Explore Rooms
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {bookings.map((bk) => {
                      const item =
                        bk.type === "room"
                          ? (bk.room as Room)
                          : (bk.banquetHall as Banquet);

                      if (!item) return null;

                      return (
                        <div key={bk._id} className="bg-white p-6 rounded-xl shadow flex gap-6">
                          <img
                            src={getImageUrl(item.images?.[0])}
                            className="w-40 h-28 object-cover rounded"
                          />

                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className="font-bold">{item.name}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[bk.status]}`}>
                                {bk.status}
                              </span>
                            </div>

                            <div className="text-sm text-gray-600 mt-3 space-y-1">
                              <div className="flex gap-2">
                                <Calendar size={14} /> {new Date(bk.fromDate).toLocaleDateString()} - {new Date(bk.toDate).toLocaleDateString()}
                              </div>
                              <div className="flex gap-2">
                                <MapPin size={14} /> Four Leaf Main Wing
                              </div>
                              <div className="flex gap-2">
                                <Clock size={14} /> Check-in: 2:00 PM
                              </div>
                            </div>

                            {(bk.status === "Pending" || bk.status === "Confirmed") && (
                              <button
                                onClick={() => handleCancel(bk._id)}
                                className="text-red-500 text-xs mt-3 flex items-center gap-1"
                              >
                                <XCircle size={14} /> Cancel Booking
                              </button>
                            )}
                          </div>

                          <div className="text-right">
                            <span className="text-xs text-gray-400">Total</span>
                            <div className="text-xl font-bold">${bk.totalPrice}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* ========== SETTINGS TAB ========== */}
            {activeTab === "settings" && (
              <>
                <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

                {/* Profile Update */}
                <form onSubmit={handleProfileUpdate} className="bg-white p-6 rounded-xl shadow mb-6 space-y-4">
                  <h2 className="font-bold text-lg">Personal Details</h2>

                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border rounded px-4 py-2"
                  />

                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border rounded px-4 py-2"
                  />

                  <input
                    type="text"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border rounded px-4 py-2"
                  />

                  <button
                    disabled={saving}
                    className="bg-vp-dark text-white px-6 py-2 rounded"
                  >
                    Save Changes
                  </button>
                </form>

                {/* Password Change */}
                <form onSubmit={handlePasswordChange} className="bg-white p-6 rounded-xl shadow space-y-4">
                  <h2 className="font-bold text-lg">Change Password</h2>

                  <input
                    type="password"
                    placeholder="Current Password"
                    value={passwords.currentPassword}
                    onChange={(e) =>
                      setPasswords({ ...passwords, currentPassword: e.target.value })
                    }
                    className="w-full border rounded px-4 py-2"
                  />

                  <input
                    type="password"
                    placeholder="New Password"
                    value={passwords.newPassword}
                    onChange={(e) =>
                      setPasswords({ ...passwords, newPassword: e.target.value })
                    }
                    className="w-full border rounded px-4 py-2"
                  />

                  <button
                    disabled={saving}
                    className="bg-vp-gold text-vp-dark px-6 py-2 rounded"
                  >
                    Change Password
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;