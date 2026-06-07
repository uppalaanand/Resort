
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Rooms from './pages/Rooms';
import RoomDetails from './pages/RoomDetails';
import Banquets from './pages/Banquets';
import BanquetDetails from './pages/BanquetDetails';
import Booking from './pages/Booking';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import Gallery from './pages/Gallery';
import Events from './pages/Events';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { UserRole } from './types';
import AddRoom from './pages/Admin/AddRoom';
import AddBanquete from './pages/Admin/AddBanquete';
import Activities from './pages/Activities';
import Contact from './pages/Contact';
import CompleteProfile from './pages/CompleteProfile';
import ForgotPassword from './pages/ForgotPassword';
import AdminLayout from './pages/AdminLayout';
import Dashboard from './pages/Admin/Dashbourd';
import ListUsers from './pages/Admin/ListUsers';
import ListRooms from './pages/Admin/ListRooms';
import UpdateRoom from './pages/Admin/UpdateRoom';
import ListBanquets from './pages/Admin/ListBanquets';
import UpdateBanquet from './pages/Admin/UpdateBanquet';
import AdminGallery from './pages/Admin/AdminGallery';
import AddGallery from './pages/Admin/AddGallery';
import UpdateGallery from './pages/Admin/UpdatePhoto';
import AddEvent from './pages/Admin/AddEvent';
import ListEvents from './pages/Admin/ListEvents';
import UpdateEvent from './pages/Admin/UpdateEvent';
import ListReviews from './pages/Admin/ListReviews';
import UserProfile from './pages/Admin/UserProfile';
import RoomRequests from './pages/Admin/RoomRequests';
import BanquetRequests from './pages/Admin/BanqueteRequest';
import BookingDetails from './pages/Admin/BookingDetails';
import PolicyPage from './pages/PolicyPage';

// PMS pages
import BookingsList from './pages/Admin/BookingsList';
import OfflineBooking from './pages/Admin/OfflineBooking';
import RoomOccupancy from './pages/Admin/RoomOccupancy';
import RoomHistory from './pages/Admin/RoomHistory';
import BookingCalendar from './pages/Admin/BookingCalendar';
import GlobalSearch from './pages/Admin/GlobalSearch';
import ActivityLogs from './pages/Admin/ActivityLogs';

const ScrollToTopHandler = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTopHandler />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/rooms/:id" element={<RoomDetails />} />
            <Route path="/banquets" element={<Banquets />} />
            <Route path="/banquets/:id" element={<BanquetDetails />} />
            <Route path="/events" element={<Events />} />
            <Route path="/book/:type/:id" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path='/activities' element={<Activities />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/policies" element={<PolicyPage />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin" element={<ProtectedRoute requiredRole={UserRole.ADMIN}><AdminLayout /></ProtectedRoute>} >
              <Route index element={<Navigate to="dashboard" />} />
              <Route path='/admin/dashboard' element={<Dashboard />} />
              <Route path="/admin/add-room" element={<AddRoom />} />
              <Route path="/admin/list-users" element={<ListUsers />} />
              <Route path="/admin/list-rooms" element={<ListRooms />} />
              <Route path="/admin/update-room/:roomId" element={<UpdateRoom />} />
              <Route path="/admin/list-banquets" element={<ListBanquets />} />
              <Route path='/admin/update-banquet/:banquetId' element={<UpdateBanquet />} />
              <Route path="/admin/add-banquete" element={<AddBanquete />} />
              <Route path='/admin/gallery' element={<AdminGallery />} />
              <Route path='/admin/gallery/create' element={<AddGallery />} />
              <Route path='/admin/gallery/edit/:id' element={<UpdateGallery />} />
              <Route path='/admin/add-event' element={<AddEvent />} />
              <Route path='/admin/list-events' element={<ListEvents />} />
              <Route path="/admin/events/edit/:id" element={<UpdateEvent />} />
              <Route path='/admin/list-reviews' element={<ListReviews />} />
              <Route path="/admin/users/:id" element={<UserProfile />} />
              <Route path='/admin/room-request' element={<RoomRequests />} />
              <Route path='/admin/banquete-request' element={<BanquetRequests /> } />
              <Route path='/admin/bookig-details/:id' element={<BookingDetails />} />
              <Route path="/admin/bookings" element={<BookingsList />} />
              <Route path="/admin/offline-booking" element={<OfflineBooking />} />
              <Route path="/admin/occupancy" element={<RoomOccupancy />} />
              <Route path="/admin/room-history" element={<RoomHistory />} />
              <Route path="/admin/calendar" element={<BookingCalendar />} />
              <Route path="/admin/search" element={<GlobalSearch />} />
              <Route path="/admin/activity-logs" element={<ActivityLogs />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
};

export default App;
