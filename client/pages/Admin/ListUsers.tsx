import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";


const ListUsers = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api.getAllUsers();
        console.log("Fetched users:", data);
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 🔍 Search handler
  useEffect(() => {
    const value = search.toLowerCase();

    const filtered = users.filter(
      (user) =>
        user.name?.toLowerCase().includes(value) ||
        user.email?.toLowerCase().includes(value) ||
        user.phone?.toString().includes(value)
    );

    setFilteredUsers(filtered);
  }, [search, users]);

  if (loading) {
    return (
      <div className="space-y-3 py-10">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton-pulse h-12 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* PAGE TITLE */}
      <h1 className="text-2xl font-bold text-admin-heading mb-1">Users</h1>
      <p className="text-admin-text text-sm mb-6">
        View and manage all registered users in the system.
      </p>

      {/* SEARCH BAR */}
      <div className="bg-admin-card rounded-xl border border-admin-border/50 p-3 mb-6">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-admin-text/60"
          />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-admin-surface border border-admin-border text-admin-heading placeholder-admin-text/40 rounded-lg w-full pl-11 pr-4 py-2.5 focus:ring-2 focus:ring-vp-gold/40 focus:border-vp-gold/60 transition-all"
          />
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="bg-admin-card rounded-xl border border-admin-border/50 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-admin-surface">
              <th className="px-6 py-3 text-left text-admin-text text-xs uppercase tracking-wider">S.No</th>
              <th className="px-6 py-3 text-left text-admin-text text-xs uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left hidden md:table-cell text-admin-text text-xs uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-admin-text text-xs uppercase tracking-wider">Ph. No</th>
              <th className="px-6 py-3 text-left hidden md:table-cell text-admin-text text-xs uppercase tracking-wider">Last Login</th>
              <th className="px-6 py-3 text-left hidden md:table-cell text-admin-text text-xs uppercase tracking-wider">Created On</th>
              <th className="px-6 py-3 text-right text-admin-text text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-6 text-center text-admin-text">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, index) => (
                <tr key={user._id} className="border-b border-admin-border/30 hover:bg-admin-hover/50 transition-colors">
                  <td className="px-6 py-4 text-admin-text">{index + 1}</td>

                  <td className="px-6 py-4 font-semibold text-admin-heading">
                    {user.name || "N/A"}
                  </td>

                  <td className="px-6 py-4 hidden md:table-cell text-admin-text">
                    {user.email || "N/A"}
                  </td>

                  <td className="px-6 py-4 text-admin-text">
                    {user.phone || "—"}
                  </td>

                  <td className="px-6 py-4 hidden md:table-cell text-admin-text">
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="px-6 py-4 hidden md:table-cell text-admin-text">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => navigate(`/admin/users/${user._id}`)}
                      className="bg-admin-surface text-admin-text hover:text-vp-gold hover:bg-admin-hover border border-admin-border rounded-lg px-3 py-1 text-xs font-semibold transition-all"
                    >
                      View
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

export default ListUsers;
