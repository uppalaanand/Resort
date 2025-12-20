import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-vp-dark text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-sans font-bold text-white mb-4 uppercase tracking-widest">Four Leaf Resort</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Escape to the extraordinary. Experience luxury accommodation, exquisite dining, and nature's beauty all in one place.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-gray-400 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="mt-1 text-vp-gold" />
                <span>123 Paradise Road, Coastal Valley,<br />California, USA 90210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-vp-gold" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-vp-gold" />
                <span>reservations@fourleafresort.com</span>
              </div>
            </div>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Stay Connected</h4>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-vp-gold hover:text-vp-dark transition-colors"><Facebook size={20} /></a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-vp-gold hover:text-vp-dark transition-colors"><Instagram size={20} /></a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-vp-gold hover:text-vp-dark transition-colors"><Twitter size={20} /></a>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="flex">
              <input 
                type="email" 
                placeholder="Your Email" 
                className="bg-gray-800 text-white px-4 py-2 w-full focus:outline-none focus:ring-1 focus:ring-vp-gold"
              />
              <button className="bg-vp-gold text-vp-dark px-4 py-2 font-bold hover:bg-yellow-500">
                JOIN
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Four Leaf Resort. All rights reserved. Built with React & MERN Concepts.
        </div>
      </div>
    </footer>
  );
};

export default Footer;