
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User as UserIcon, LogOut, Shield, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Rooms', path: '/rooms' },
    { name: 'Banquets', path: '/banquets' },
    { name: 'Events', path: '/events' },
    { name: 'Activities', path: '/activities' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Contact', path: '/contact' },
  ];

  const isHome = location.pathname === '/';
  // Dark background if scrolled OR not on home page
  const navClass = `fixed w-full z-50 transition-all duration-300 ${
    scrolled || !isHome ? 'bg-vp-dark/95 backdrop-blur-md shadow-md py-2' : 'bg-transparent py-6'
  }`;

  return (
    <nav className={navClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center group select-none transition-transform duration-300 hover:scale-[1.02]">
            <img 
              src="/ojas-logo.png" 
              alt="Ojas Resort Logo" 
              className="h-12 md:h-19 w-auto object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
            />
          </Link>
          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm uppercase tracking-wider font-medium transition-colors hover:text-vp-gold ${
                   isHome && !scrolled ? 'text-gray-200' : 'text-gray-300'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <Link 
                to="/rooms" 
                className="bg-vp-gold text-vp-dark px-5 py-2 uppercase text-xs font-bold tracking-widest hover:bg-white transition-all shadow-lg transform hover:-translate-y-0.5"
            >
                Book Now
            </Link>
            
            {user ? (
              <div className="relative group">
                 <button className="flex items-center space-x-2 text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all border border-white/10">
                    <UserIcon size={16} />
                    <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
                 </button>
                 <div className="absolute right-0 top-full pt-2 w-48 bg-white rounded-lg shadow-xl py-2 hidden group-hover:block border border-gray-100 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-gray-100 mb-2">
                        <p className="text-xs text-gray-500">Signed in as</p>
                        <p className="text-sm font-bold text-vp-dark truncate">{user.email}</p>
                    </div>
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-vp-cream hover:text-vp-gold transition-colors flex items-center gap-2">
                        <UserIcon size={14}/> My Profile
                    </Link>
                    {user.role === UserRole.ADMIN && (
                      <Link to="/admin" className="block px-4 py-2 text-sm text-vp-gold font-bold hover:bg-vp-cream flex items-center gap-2">
                        <Shield size={14} /> Admin Dashboard
                      </Link>
                    )}
                    <div className="border-t border-gray-100 my-1"></div>
                    <button onClick={() => { logout(); navigate('/'); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors">
                      <LogOut size={14} /> Logout
                    </button>
                 </div>
              </div>

            ) : (
              // Replaced Login button with Admin link
              <Link to="/auth" className="text-gray-400 hover:text-white transition-colors text-xs uppercase tracking-wide">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Button */}
          <div className="lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white hover:text-vp-gold transition-colors">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-vp-dark/95 backdrop-blur-xl absolute w-full border-t border-gray-800 shadow-2xl h-screen animate-slideDown">
          <div className="px-4 pt-8 pb-3 space-y-4 flex flex-col items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-vp-gold text-xl font-serif font-medium"
              >
                {link.name}
              </Link>
            ))}
             <div className="w-20 h-1 bg-gray-800 rounded-full my-4"></div>
             {user ? (
               <div className="flex flex-col items-center gap-4 w-full">
                <Link to="/profile" onClick={() => setIsOpen(false)} className="text-white text-lg">My Profile</Link>
                {user.role === UserRole.ADMIN && <Link to="/admin" onClick={() => setIsOpen(false)} className="text-vp-gold font-bold">Admin Dashboard</Link>}
                <button onClick={() => {logout(); setIsOpen(false)}} className="text-red-400">Logout</button>
               </div>
             ) : (
               <Link to="/auth" onClick={() => setIsOpen(false)} className="text-gray-400 uppercase tracking-widest text-sm">Admin Access</Link>
             )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
