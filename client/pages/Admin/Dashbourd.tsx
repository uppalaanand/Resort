import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  DollarSign,
  TrendingUp,
  Clock,
  Bed,
  Users as UsersIcon,
  Percent,
  Calendar,
  LogOut,
  UserCheck
} from "lucide-react";
import { DashboardStats } from "../../types";

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (loading || !stats) {
    return (
      <div className="animate-admin-fadeIn space-y-6">
        {/* Skeleton Header */}
        <div className="space-y-2">
          <div className="skeleton-pulse h-8 w-48 rounded-lg" />
          <div className="skeleton-pulse h-4 w-72 rounded-lg" />
        </div>

        {/* Skeleton Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-admin-card rounded-xl border border-admin-border/50 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-3">
                  <div className="skeleton-pulse h-4 w-24 rounded" />
                  <div className="skeleton-pulse h-8 w-16 rounded" />
                </div>
                <div className="skeleton-pulse h-12 w-12 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  console.log("Dashboard stats:", stats);
  const statCards = [
    {
      label: "Occupancy Rate",
      value: `${stats.rooms.occupancyRate}%`,
      icon: Percent,
      gradient: "from-blue-500/20 to-indigo-500/20",
      borderColor: "border-blue-500",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
    },
    {
      label: "Available Rooms",
      value: stats.rooms.available,
      icon: Bed,
      gradient: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-500",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-400",
    },
    {
      label: "Occupied Rooms",
      value: stats.rooms.occupied,
      icon: Bed,
      gradient: "from-red-500/20 to-rose-500/20",
      borderColor: "border-red-500",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-400",
    },
    {
      label: "Total Revenue",
      value: `₹${stats.revenue?.total?.toLocaleString()}`,
      icon: DollarSign,
      gradient: "from-vp-gold/20 to-amber-500/20",
      borderColor: "border-vp-gold",
      iconBg: "bg-vp-gold/10",
      iconColor: "text-vp-gold",
    },
    {
      label: "Total Guests Registered",
      value: stats.users.total,
      icon: UsersIcon,
      gradient: "from-indigo-500/20 to-purple-500/20",
      borderColor: "border-indigo-500",
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-400",
    },
    {
      label: "Pending Invoices",
      value: stats.bookings.pending,
      icon: Clock,
      gradient: "from-yellow-500/20 to-orange-500/20",
      borderColor: "border-yellow-500",
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-400",
    },
    {
      label: "Today's Check-ins",
      value: stats.today.checkIns.length,
      icon: UserCheck,
      gradient: "from-teal-500/20 to-cyan-500/20",
      borderColor: "border-teal-500",
      iconBg: "bg-teal-500/10",
      iconColor: "text-teal-400",
    },
    {
      label: "Today's Check-outs",
      value: stats.today.checkOuts.length,
      icon: LogOut,
      gradient: "from-fuchsia-500/20 to-pink-500/20",
      borderColor: "border-fuchsia-500",
      iconBg: "bg-fuchsia-500/10",
      iconColor: "text-fuchsia-400",
    },
  ];

  return (
    <div className="animate-admin-fadeIn space-y-6 text-admin-heading">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-admin-heading">PMS Dashboard</h1>
          <p className="text-admin-text text-sm mt-1">
            Real-time resort operations: monitor guest status, check-ins, cleanups, and billing totals.
          </p>
          <p className="text-admin-text/60 text-xs mt-1">{currentDate}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/admin/offline-booking")}
            className="bg-vp-gold text-vp-dark font-semibold px-4 py-2.5 text-xs rounded-lg shadow-lg hover:bg-amber-400 transition-all"
          >
            Offline Registration
          </button>
          <button
            onClick={() => navigate("/admin/calendar")}
            className="bg-admin-surface text-admin-heading border border-admin-border font-semibold px-4 py-2.5 text-xs rounded-lg hover:bg-admin-hover transition-all"
          >
            Occupancy Calendar
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`bg-admin-card rounded-xl border border-admin-border/50 p-5 border-l-4 ${card.borderColor} bg-gradient-to-r ${card.gradient}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-admin-text text-[10px] uppercase tracking-wider font-semibold">
                    {card.label}
                  </p>
                  <p className="text-2xl font-bold text-admin-heading mt-2">
                    {card.value}
                  </p>
                </div>
                <div
                  className={`${card.iconBg} ${card.iconColor} h-11 w-11 rounded-xl flex items-center justify-center`}
                >
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Checkins & Checkouts Split panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Check-ins */}
        <div className="bg-admin-card rounded-xl border border-admin-border/50 p-6 space-y-4">
          <h3 className="text-sm font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2">
            <UserCheck size={16} /> Today's Check-ins ({stats.today.checkIns?.length || 0})
          </h3>
          <div className="divide-y divide-admin-border/20 max-h-72 overflow-y-auto admin-scroll">
            {(!stats.todayCheckinList || stats.todayCheckinList.length === 0) ? (
              <p className="text-xs text-admin-text py-4">No check-ins scheduled for today.</p>
            ) : (
              stats.stats.today.checkIns.map((b) => (
                <div key={b._id} className="py-2.5 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-semibold text-admin-heading">{b.guestName || b.user?.name || 'Walk-in'}</p>
                    <p className="text-[10px] text-admin-text mt-0.5">
                      Room: {b.room?.roomNumber || b.room?.name || 'N/A'}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/bookig-details/${b._id}`)}
                    className="p-1.5 bg-admin-surface hover:bg-admin-hover rounded-lg border border-admin-border transition-all"
                  >
                    <Eye size={12} className="text-admin-text" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Today's Check-outs */}
        <div className="bg-admin-card rounded-xl border border-admin-border/50 p-6 space-y-4">
          <h3 className="text-sm font-bold text-fuchsia-400 uppercase tracking-wider flex items-center gap-2">
            <LogOut size={16} /> Today's Check-outs ({stats.todayCheckoutList?.length || 0})
          </h3>
          <div className="divide-y divide-admin-border/20 max-h-72 overflow-y-auto admin-scroll">
            {(!stats.today.checkOuts || stats.today.checkOuts.length === 0) ? (
              <p className="text-xs text-admin-text py-4">No check-outs scheduled for today.</p>
            ) : (
              stats.today.checkOuts.map((b) => (
                <div key={b._id} className="py-2.5 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-semibold text-admin-heading">{b.guestName || b.user?.name || 'Walk-in'}</p>
                    <p className="text-[10px] text-admin-text mt-0.5">
                      Room: {b.room?.roomNumber || b.room?.name || 'N/A'}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/bookig-details/${b._id}`)}
                    className="p-1.5 bg-admin-surface hover:bg-admin-hover rounded-lg border border-admin-border transition-all"
                  >
                    <Eye size={12} className="text-admin-text" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Reservations Table */}
      <div className="bg-admin-card rounded-xl border border-admin-border/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-admin-border/30 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-admin-heading">Recent Booking Requests</h2>
          <button
            onClick={() => navigate("/admin/bookings")}
            className="bg-admin-surface text-admin-text hover:bg-admin-hover border border-admin-border rounded-lg px-4 py-1.5 text-xs font-medium transition-all"
          >
            View All Bookings
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-admin-surface text-admin-text text-xs uppercase tracking-wider">
                <th className="px-6 py-3 text-left font-medium">Guest Name</th>
                <th className="px-6 py-3 text-left font-medium">Unit booked</th>
                <th className="px-6 py-3 text-left font-medium">Total Price</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {!stats.recentBookings || stats.recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-admin-text">
                    No bookings found
                  </td>
                </tr>
              ) : (
                stats.recentBookings.map((b) => (
                  <tr
                    key={b._id}
                    className="border-b border-admin-border/30 hover:bg-admin-hover/50 transition-colors text-xs"
                  >
                    <td className="px-6 py-4 text-admin-heading font-medium">
                      {b.guestName || b.user?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-admin-text">
                      {b.type === 'room' ? (b.room?.name || 'Deleted Room') : (b.banquetHall?.name || 'Deleted Banquet')}
                    </td>
                    <td className="px-6 py-4 text-admin-heading font-medium">
                      ₹{b.totalPrice || 0}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          b.status === "Confirmed"
                            ? "bg-green-500/10 text-green-400"
                            : b.status === "Pending"
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() =>
                          navigate(`/admin/bookig-details/${b._id}`)
                        }
                        className="bg-admin-surface text-admin-text hover:text-vp-gold hover:bg-admin-hover border border-admin-border rounded-lg px-3 py-1.5 text-xs flex items-center gap-1.5 transition-all"
                      >
                        <Eye size={14} /> View Invoice
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
