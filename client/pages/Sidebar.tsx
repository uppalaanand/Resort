// import { NavLink } from "react-router-dom";
// import { LayoutDashboard, PlusSquare, List, Users } from "lucide-react";


// const Sidebar = () => {
// const linkBase = "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition";


// return (
// <aside className="w-64 min-h-screen bg-white border-r">
// <div className="px-6 py-6 text-2xl font-extrabold text-vp-dark">
// QuickStay
// </div>


// <nav className="px-3 space-y-1">
// <NavLink
// to="/admin/dashboard"
// className={({ isActive }) =>
// `${linkBase} ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`
// }
// >
// <LayoutDashboard size={18} /> Dashboard
// </NavLink>


// <NavLink
// to="/admin/add-room"
// className={({ isActive }) =>
// `${linkBase} ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`
// }
// >
// <PlusSquare size={18} /> Add Room
// </NavLink>


// <NavLink
// to="/admin/rooms"
// className={({ isActive }) =>
// `${linkBase} ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`
// }
// >
// <List size={18} /> Room Listings
// </NavLink>


// <NavLink
// to="/admin/users"
// className={({ isActive }) =>
// `${linkBase} ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"}`
// }
// >
// <Users size={18} /> List Users
// </NavLink>
// </nav>
// </aside>
// );
// };


// export default Sidebar;

// /original2
import { NavLink } from "react-router-dom";
import { LayoutDashboard, PlusSquare, List, Users, Image, Calendar, Star, Bed, BedDouble, Building2, ClipboardList, PartyPopper } from "lucide-react";


const Sidebar = () => {

    const sidebarLinks = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "List Room",
      path: "/admin/list-rooms",
      icon: BedDouble,
    },
    // {
    //   name: "Add Room",
    //   path: "/admin/add-room",
    //   icon: PlusSquare,
    // },
    {
      name: "List Banquets",
      path: "/admin/list-banquets",
      icon: Building2,
    },
    // {
    //   name: "Add Banquete",
    //   path: "/admin/add-banquete",
    //   icon: PlusSquare,
    // },
    {
      name: "List Users",
      path: "/admin/list-users",
      icon: Users,
    },
    {
      name: "Gallery",
      path: "/admin/gallery",
      icon: Image,
    },
    // {
    //   name: "Add Event",
    //   path: "/admin/add-event",
    //   icon: PlusSquare,
    // },
    {
      name: "List Events",
      path: "/admin/list-events",
      icon: Calendar,
    },
    {
      name: "List Reviews",
      path: "/admin/list-reviews",
      icon: Star,
    },
    {
      name: "Room Requests",
      path: "/admin/room-request",
      icon: ClipboardList
    },
    {
      name: "Banquete Requests",
      path: "/admin/banquete-request",
      icon: PartyPopper
    }
  ];
    
    return (
        <aside className='md:w-64 w-16 border-r h-full text-base border-gray-300 pt-4 flex
        flex-col transition-all duration-300'>
            {sidebarLinks.map((item,index) => {
                const Icon = item.icon;
                return (
                    <NavLink to={item.path} key={index} end='admin' className={({isActive}) => `
                    flex items-center py-3 px-4 md:px-8 gap-3 ${isActive ? "border-r-4 md:border-r-[6px] bg-blue-600/10 border-blue-600 text-blue-600" : 
                    "hover:bg-gray-100/90 border-white text-gray-700"}`}>
                    <Icon size={18} />
                    <p className='md:block hidden text-center'>{item.name}</p>
                </NavLink>
                )
            })}
        </aside>
    )
};

export default Sidebar;