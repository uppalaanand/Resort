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
    return <div className="pt-32 text-center">Loading user details...</div>;
  }

  if (!user) {
    return <div className="pt-32 text-center">User not found</div>;
  }

  const statusColors: any = {
    Pending: "bg-yellow-100 text-yellow-800",
    Confirmed: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
    Completed: "bg-blue-100 text-blue-800",
  };

  return (
    <div className="pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">

        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-vp-dark"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex flex-col md:flex-row gap-8">

          {/* ---------------- SIDEBAR ---------------- */}
          <div className="md:w-1/4">
            <div className="bg-white p-6 rounded-xl shadow border text-center">
              <div className="w-24 h-24 bg-vp-dark text-vp-gold rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                {user.name.charAt(0)}
              </div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
              <p className="text-gray-400 text-xs mt-2">
                Role: <span className="font-bold">{user.role}</span>
              </p>
            </div>
          </div>

          {/* ---------------- MAIN CONTENT ---------------- */}
          <div className="md:w-3/4">

            {/* USER DETAILS */}
            <div className="bg-white p-6 rounded-xl shadow mb-8">
              <h2 className="text-xl font-bold mb-4">User Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Name</span>
                  <p className="font-semibold">{user.name}</p>
                </div>

                <div>
                  <span className="text-gray-400">Email</span>
                  <p className="font-semibold">{user.email}</p>
                </div>

                <div>
                  <span className="text-gray-400">Phone</span>
                  <p className="font-semibold">{user.phone || "—"}</p>
                </div>

                <div>
                  <span className="text-gray-400">Joined On</span>
                  <p className="font-semibold">
                    {new Date(user.createdAt!).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* BOOKINGS */}
            <h2 className="text-2xl font-bold mb-6">User Bookings</h2>

            {bookings.length === 0 ? (
              <div className="bg-white p-12 rounded-xl text-center border border-dashed">
                <p className="text-gray-500">No bookings found for this user.</p>
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
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[bk.status]}`}
                          >
                            {bk.status}
                          </span>
                        </div>

                        <div className="text-sm text-gray-600 mt-3 space-y-1">
                          <div className="flex gap-2">
                            <Calendar size={14} />
                            {new Date(bk.fromDate).toLocaleDateString()} -{" "}
                            {new Date(bk.toDate).toLocaleDateString()}
                          </div>

                          <div className="flex gap-2">
                            <MapPin size={14} /> Four Leaf Main Wing
                          </div>

                          <div className="flex gap-2">
                            <Clock size={14} /> Check-in: 2:00 PM
                          </div>
                        </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;