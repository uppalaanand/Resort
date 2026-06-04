import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { Eye, DollarSign, TrendingUp, Clock, Bed, Users as UsersIcon } from "lucide-react";

const Dashboard = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await api.getAllBookings();
        setBookings(data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // 🔢 Calculations
  const totalBookings = bookings.length;
  const totalRevenue = bookings.reduce(
    (sum, b) => sum + (b.totalAmount || 0),
    0
  );
  const pendingBookings = bookings.filter((b) => b.status === "Pending").length;
  const confirmedBookings = bookings.filter((b) => b.status === "Confirmed").length;

  const recentBookings = bookings.slice(0, 7);

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (loading) {
    return (
      <div className="animate-admin-fadeIn space-y-6">
        {/* Skeleton Header */}
        <div className="space-y-2">
          <div className="skeleton-pulse h-8 w-48 rounded-lg" />
          <div className="skeleton-pulse h-4 w-72 rounded-lg" />
        </div>

        {/* Skeleton Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
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

        {/* Skeleton Table */}
        <div className="bg-admin-card rounded-xl border border-admin-border/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-admin-border/30">
            <div className="skeleton-pulse h-6 w-40 rounded" />
          </div>
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="skeleton-pulse h-4 w-32 rounded" />
                <div className="skeleton-pulse h-4 w-28 rounded" />
                <div className="skeleton-pulse h-4 w-20 rounded" />
                <div className="skeleton-pulse h-6 w-20 rounded-full" />
                <div className="skeleton-pulse h-8 w-16 rounded-lg ml-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Bookings",
      value: totalBookings,
      icon: TrendingUp,
      gradient: "from-blue-500/20 to-indigo-500/20",
      borderColor: "border-blue-500",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
    },
    {
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      gradient: "from-vp-gold/20 to-amber-500/20",
      borderColor: "border-vp-gold",
      iconBg: "bg-vp-gold/10",
      iconColor: "text-vp-gold",
    },
    {
      label: "Pending Bookings",
      value: pendingBookings,
      icon: Clock,
      gradient: "from-yellow-500/20 to-orange-500/20",
      borderColor: "border-yellow-500",
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-400",
    },
    {
      label: "Confirmed Bookings",
      value: confirmedBookings,
      icon: Bed,
      gradient: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-500",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-400",
    },
  ];

  return (
    <div className="animate-admin-fadeIn space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-admin-heading">Dashboard</h1>
        <p className="text-admin-text text-sm mt-1">
          Monitor your room listings, track bookings and analyze revenue—all in one place.
        </p>
        <p className="text-admin-text/60 text-xs mt-1">{currentDate}</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`bg-admin-card rounded-xl border border-admin-border/50 p-6 border-l-4 ${card.borderColor} bg-gradient-to-r ${card.gradient}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-admin-text text-xs uppercase tracking-wider font-medium">
                    {card.label}
                  </p>
                  <p className="text-2xl font-bold text-admin-heading mt-2">
                    {card.value}
                  </p>
                </div>
                <div
                  className={`${card.iconBg} ${card.iconColor} h-12 w-12 rounded-xl flex items-center justify-center`}
                >
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-admin-card rounded-xl border border-admin-border/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-admin-border/30 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-admin-heading">Recent Bookings</h2>
          <button
            onClick={() => navigate("/admin/bookings")}
            className="bg-admin-surface text-admin-text hover:bg-admin-hover border border-admin-border rounded-lg px-4 py-1.5 text-xs font-medium transition-all"
          >
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-admin-surface text-admin-text text-xs uppercase tracking-wider">
                <th className="px-6 py-3 text-left font-medium">User Name</th>
                <th className="px-6 py-3 text-left font-medium">Room Name</th>
                <th className="px-6 py-3 text-left font-medium">Total Amount</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-admin-text">
                    No bookings found
                  </td>
                </tr>
              ) : (
                recentBookings.map((b) => (
                  <tr
                    key={b._id}
                    className="border-b border-admin-border/30 hover:bg-admin-hover/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-admin-heading font-medium">
                      {b.user?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-admin-text">
                      {b.room?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-admin-heading font-medium">
                      ₹{b.totalPrice || 0}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                        <Eye size={14} /> View
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
