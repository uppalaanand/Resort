import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";

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

  const recentBookings = bookings.slice(0, 7);

  if (loading) {
    return <div className="text-center py-10">Loading Dashboard...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-8">
        Monitor your room listings, track bookings and analyze revenue—all in one place.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Total Bookings</h3>
          <p className="text-3xl font-bold mt-2">{totalBookings}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-sm text-gray-500">Total Revenue</h3>
          <p className="text-3xl font-bold mt-2">₹{totalRevenue}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-bold mb-4">Recent Bookings</h2>

        <table className="w-full text-sm">
          <thead className="text-left text-gray-500">
            <tr>
              <th>User Name</th>
              <th>Room Name</th>
              <th>Total Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {recentBookings.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-500">
                  No bookings found
                </td>
              </tr>
            ) : (
              recentBookings.map((b) => (
                <tr key={b._id}>
                  <td>{b.user?.name || "N/A"}</td>
                  <td>{b.room?.name || "N/A"}</td>
                  <td>₹{b.totalPrice || 0}</td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full ${
                        b.status === "Confirmed"
                          ? "bg-green-100 text-green-700"
                          : b.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td>
                    <button
                  onClick={() =>
                    navigate(`/admin/bookig-details/${b._id}`)
                  }
                  className="flex items-center gap-2 px-5 py-2 bg-vp-dark text-white text-sm rounded-full hover:bg-vp-gold hover:text-vp-dark transition"
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
  );
};

export default Dashboard;
