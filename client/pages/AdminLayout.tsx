import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const NAVBAR_HEIGHT = "4rem";

const AdminLayout = () => {
  return (
    <div className='flex flex-col h-screen' style={{ marginTop: NAVBAR_HEIGHT }}>
    <div className="flex h-full">
      <Sidebar />
      <div className="flex-1 p-4 pt-10 md:px-10 h-fill overflow-y-auto">
        <Outlet />
      </div>
    </div>
    </div>
  );
};

export default AdminLayout;