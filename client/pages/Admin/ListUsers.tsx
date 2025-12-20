//original
// import { useEffect, useState } from "react";
// import { api } from "@/utils/api";
// import { Search } from "lucide-react";

// const ListUsers = () => {
//   const [users, setUsers] = useState<any[]>([]);
//   const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const data = await api.getAllUsers();
//         setUsers(data);
//         setFilteredUsers(data);
//       } catch (error) {
//         console.error("Failed to fetch users", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   // 🔍 Search handler
//   useEffect(() => {
//     const value = search.toLowerCase();

//     const filtered = users.filter((user) =>
//       user.name?.toLowerCase().includes(value) ||
//       user.email?.toLowerCase().includes(value) ||
//       user.phone?.toString().includes(value)
//     );

//     setFilteredUsers(filtered);
//   }, [search, users]);

//   if (loading) {
//     return <div className="text-center py-10">Loading Users...</div>;
//   }

//   return (
//     <div>
//       {/* PAGE TITLE */}
//       <h1 className="text-3xl font-bold mb-2">Users</h1>
//       <p className="text-gray-500 mb-8">
//         View and manage all registered users in the system.
//       </p>

//       {/* SEARCH BAR */}
//       <div className="bg-white p-3 rounded-xl shadow mb-6">
//         <div className="relative">
//             <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
//             <input type="text" placeholder="Search by name, email or phone..." value={search} onChange={(e) => setSearch(e.target.value)}
//             className="w-full border pl-11 pr-4 py-2 rounded-lg"  />
//         </div>
//       </div>

//       {/* USERS TABLE */}
//       <div className="bg-white rounded-xl shadow p-6">
//         <table className="w-full text-sm">
//           <thead className="text-left text-gray-500 border-b">
//             <tr>
//               <th className="py-2">S.No</th>
//               <th className="py-2">Name</th>
//               <th className="py-2">Email</th>
//               <th className="py-2">Ph. No</th>
//               <th className="py-2">Last Login</th>
//               <th className="py-2">Created On</th>
//             </tr>
//           </thead>

//           <tbody className="divide-y">
//             {filteredUsers.length === 0 ? (
//               <tr>
//                 <td colSpan={6} className="py-6 text-center text-gray-500">
//                   No users found
//                 </td>
//               </tr>
//             ) : (
//               filteredUsers.map((user, index) => (
//                 <tr key={user._id} className="hover:bg-gray-50">
//                   <td className="py-3">{index + 1}</td>
//                   <td className="py-3 font-medium">{user.name || "N/A"}</td>
//                   <td className="py-3">{user.email || "N/A"}</td>
//                   <td className="py-3">{user.phone || "—"}</td>
//                   <td className="py-3">
//                     {user.lastLogin
//                       ? new Date(user.lastLogin).toLocaleDateString()
//                       : "—"}
//                   </td>
//                   <td className="py-3">
//                     {user.createdAt
//                       ? new Date(user.createdAt).toLocaleDateString()
//                       : "—"}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ListUsers;


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
    return <div className="text-center py-10">Loading Users...</div>;
  }

  return (
    <div>
      {/* PAGE TITLE */}
      <h1 className="text-3xl font-bold mb-2">Users</h1>
      <p className="text-gray-500 mb-8">
        View and manage all registered users in the system.
      </p>

      {/* SEARCH BAR */}
      <div className="bg-white p-3 rounded-xl shadow mb-6">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border pl-11 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-500 border-b">
            <tr>
              <th className="py-2">S.No</th>
              <th className="py-2">Name</th>
              <th className="py-2 hidden md:table-cell">Email</th>
              <th className="py-2">Ph. No</th>
              <th className="py-2 hidden md:table-cell">Last Login</th>
              <th className="py-2 hidden md:table-cell">Created On</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, index) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="py-3">{index + 1}</td>

                  <td className="py-3 font-medium">
                    {user.name || "N/A"}
                  </td>

                  <td className="py-3 hidden md:table-cell">
                    {user.email || "N/A"}
                  </td>

                  <td className="py-3">
                    {user.phone || "—"}
                  </td>

                  <td className="py-3 hidden md:table-cell">
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="py-3 hidden md:table-cell">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => navigate(`/admin/users/${user._id}`)}
                      className="px-3 py-1 text-xs font-semibold rounded bg-vp-dark text-white hover:opacity-90"
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
