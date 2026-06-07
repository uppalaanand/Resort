import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BedDouble,
  Building2,
  Users,
  Image,
  Calendar as CalendarIcon,
  Star,
  ClipboardList,
  PartyPopper,
  ChevronRight,
  Activity,
  PlusCircle,
  Search,
  History,
  LayoutGrid
} from "lucide-react";

interface SidebarProps {
  onNavigate?: () => void;
}

const sidebarSections = [
  {
    label: "Overview",
    links: [
      { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Room Status Grid", path: "/admin/occupancy", icon: LayoutGrid },
      { name: "Booking Calendar", path: "/admin/calendar", icon: CalendarIcon },
    ],
  },
  {
    label: "Operations",
    links: [
      { name: "Bookings", path: "/admin/bookings", icon: ClipboardList },
      { name: "Offline Booking", path: "/admin/offline-booking", icon: PlusCircle },
      { name: "Room History", path: "/admin/room-history", icon: History },
    ],
  },
  {
    label: "Management",
    links: [
      { name: "Rooms List", path: "/admin/list-rooms", icon: BedDouble },
      { name: "Banquets List", path: "/admin/list-banquets", icon: Building2 },
      { name: "Guest Profiles", path: "/admin/list-users", icon: Users },
    ],
  },
  {
    label: "Content",
    links: [
      { name: "Gallery", path: "/admin/gallery", icon: Image },
      { name: "Events", path: "/admin/list-events", icon: CalendarIcon },
      { name: "Reviews", path: "/admin/list-reviews", icon: Star },
    ],
  },
  {
    label: "Requests",
    links: [
      { name: "Room Requests", path: "/admin/room-request", icon: ClipboardList },
      { name: "Banquet Requests", path: "/admin/banquete-request", icon: PartyPopper },
    ],
  },
  {
    label: "Audits & Search",
    links: [
      { name: "Global Search", path: "/admin/search", icon: Search },
      { name: "Activity Logs", path: "/admin/activity-logs", icon: Activity },
    ],
  },
];

const Sidebar = ({ onNavigate }: SidebarProps) => {
  return (
    <aside className="w-64 h-full bg-admin-card/80 backdrop-blur-xl border-r border-admin-border/50 flex flex-col overflow-y-auto admin-scroll">
      {/* Admin Brand */}
      <div className="px-5 pt-6 pb-4 border-b border-admin-border/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-vp-gold/90 to-amber-600 flex items-center justify-center shadow-lg shadow-vp-gold/20">
            <LayoutDashboard size={18} className="text-vp-dark" />
          </div>
          <div>
            <p className="text-sm font-bold text-admin-heading tracking-wide">Ojas Resort</p>
            <p className="text-[10px] text-admin-text uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-5">
        {sidebarSections.map((section) => (
          <div key={section.label}>
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-admin-text/60">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.links.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    to={item.path}
                    key={item.path}
                    end={item.path === "/admin/dashboard"}
                    onClick={onNavigate}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                      transition-all duration-200 group relative
                      ${isActive
                        ? "bg-vp-gold/10 text-vp-gold border-l-[3px] border-vp-gold shadow-sm shadow-vp-gold/5"
                        : "text-admin-text hover:text-admin-heading hover:bg-admin-hover border-l-[3px] border-transparent"
                      }
                    `}
                  >
                    <Icon size={17} className="shrink-0 transition-transform duration-200 group-hover:scale-110" />
                    <span className="truncate">{item.name}</span>
                    <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-60 transition-opacity shrink-0" />
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-admin-border/50">
        <p className="text-[10px] text-admin-text/40 text-center">© 2026 Ojas Resort</p>
      </div>
    </aside>
  );
};

export default Sidebar;