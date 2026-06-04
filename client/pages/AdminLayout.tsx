import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const NAVBAR_HEIGHT = "4rem";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className='flex flex-col h-screen bg-admin-bg' style={{ marginTop: NAVBAR_HEIGHT }}>
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center px-4 py-3 bg-admin-card border-b border-admin-border">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg text-admin-text hover:text-vp-gold hover:bg-admin-hover transition-colors"
        >
          <Menu size={22} />
        </button>
        <span className="ml-3 text-sm font-semibold text-admin-heading tracking-wide uppercase">Admin Panel</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        {/* <div className={`
          fixed lg:relative z-50 lg:z-auto h-full
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}> */}
        <div className={`
          fixed top-0 left-0 h-screen
          lg:relative lg:h-auto
          z-50 lg:z-auto
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden absolute top-3 right-3 z-10 p-1.5 rounded-lg text-admin-text hover:text-white hover:bg-admin-hover transition-colors"
          >
            <X size={18} />
          </button>
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto admin-scroll p-4 pt-8 md:px-8 lg:px-10">
          <div className="max-w-7xl mx-auto animate-admin-fadeIn">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;