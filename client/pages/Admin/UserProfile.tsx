import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../../utils/api";
import { Booking, Room, Banquet, User } from "../../types";
import { Calendar, MapPin, Clock, ArrowLeft } from "lucide-react";
import { getImageUrl } from "../../utils/images";

const UserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const userData = await api.getUserById(id); // ADMIN API
        setUser(userData);

        const userBookings = await api.getBookingsByUser(id); // ADMIN API
        setBookings(userBookings as any[]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="pb-20 min-h-screen animate-admin-fadeIn">
        <div className="max-w-7xl mx-auto px-4 pt-8">
          <div className="skeleton-pulse h-8 w-24 rounded-lg mb-6" />
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/4">
              <div className="bg-admin-card rounded-xl border border-admin-border/50 p-6 flex flex-col items-center">
                <div className="skeleton-pulse w-24 h-24 rounded-full mb-4" />
                <div className="skeleton-pulse h-5 w-32 rounded mb-2" />
                <div className="skeleton-pulse h-4 w-40 rounded" />
              </div>
            </div>
            <div className="md:w-3/4 space-y-6">
              <div className="bg-admin-card rounded-xl border border-admin-border/50 p-6">
                <div className="skeleton-pulse h-6 w-36 rounded mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="skeleton-pulse h-4 w-full rounded" />
                  <div className="skeleton-pulse h-4 w-full rounded" />
                  <div className="skeleton-pulse h-4 w-full rounded" />
                  <div className="skeleton-pulse h-4 w-full rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div className="pt-32 text-center text-admin-text">User not found</div>;
  }

  const statusColors: any = {
    Pending: "bg-yellow-500/10 text-yellow-400",
    Confirmed: "bg-green-500/10 text-green-400",
    Cancelled: "bg-red-500/10 text-red-400",
    Completed: "bg-blue-500/10 text-blue-400",
  };

  return (
    <div className="pb-20 min-h-screen animate-admin-fadeIn">
      <div className="max-w-7xl mx-auto px-4">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 bg-admin-surface text-admin-text hover:bg-admin-hover border border-admin-border rounded-lg px-4 py-2 flex items-center gap-2 text-sm font-semibold transition-all"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex flex-col md:flex-row gap-8">

          {/* ---------------- SIDEBAR ---------------- */}
          <div className="md:w-1/4">
            <div className="bg-admin-card rounded-xl border border-admin-border/50 p-6 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-vp-gold to-amber-600 text-vp-dark rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg shadow-vp-gold/20">
                {user.name.charAt(0)}
              </div>
              <h2 className="text-admin-heading font-bold text-lg">{user.name}</h2>
              <p className="text-admin-text text-sm">{user.email}</p>
              <p className="mt-3">
                <span className="bg-vp-gold/10 text-vp-gold text-xs rounded-full px-3 py-1 font-medium">
                  {user.role}
                </span>
              </p>
            </div>
          </div>

          {/* ---------------- MAIN CONTENT ---------------- */}
          <div className="md:w-3/4">

            {/* USER DETAILS */}
            <div className="bg-admin-card rounded-xl border border-admin-border/50 p-5 mb-8">
              <h2 className="text-admin-heading font-bold text-lg mb-4">User Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-admin-text text-xs">Name</span>
                  <p className="text-admin-heading font-medium">{user.name}</p>
                </div>

                <div>
                  <span className="text-admin-text text-xs">Email</span>
                  <p className="text-admin-heading font-medium">{user.email}</p>
                </div>

                <div>
                  <span className="text-admin-text text-xs">Phone</span>
                  <p className="text-admin-heading font-medium">{user.phone || "—"}</p>
                </div>

                <div>
                  <span className="text-admin-text text-xs">Joined On</span>
                  <p className="text-admin-heading font-medium">
                    {new Date(user.createdAt!).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* BOOKINGS */}
            <h2 className="text-2xl font-bold text-admin-heading mb-6">User Bookings</h2>

            {bookings.length === 0 ? (
              <div className="bg-admin-card rounded-xl border border-dashed border-admin-border p-12 text-center">
                <p className="text-admin-text">No bookings found for this user.</p>
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
                    <div key={bk._id} className="bg-admin-card rounded-xl border border-admin-border/50 overflow-hidden hover:border-admin-border transition-all flex gap-6 p-5">
                      <img
                        src={getImageUrl(item.images?.[0])}
                        className="w-40 h-28 object-cover rounded-lg"
                      />

                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="text-admin-heading font-bold">{item.name}</h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[bk.status]}`}
                          >
                            {bk.status}
                          </span>
                        </div>

                        <div className="text-sm text-admin-text mt-3 space-y-1">
                          <div className="flex gap-2 items-center">
                            <Calendar size={14} className="text-vp-gold/70" />
                            <span className="text-admin-heading font-medium">
                              {new Date(bk.fromDate).toLocaleDateString()} -{" "}
                              {new Date(bk.toDate).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex gap-2 items-center">
                            <MapPin size={14} className="text-vp-gold/70" /> Four Leaf Main Wing
                          </div>

                          <div className="flex gap-2 items-center">
                            <Clock size={14} className="text-vp-gold/70" /> Check-in: 2:00 PM
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-admin-text">Total</span>
                        <div className="text-xl font-bold text-vp-gold">₹{bk.totalPrice}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;