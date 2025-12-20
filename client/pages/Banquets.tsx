
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, CheckCircle } from 'lucide-react';
import { api } from '../utils/api';
import { Banquet } from '../types';
import { getImageUrl } from '../utils/images';

const Banquets = () => {
  const [banquets, setBanquets] = useState<Banquet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBanquets().then(setBanquets).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="pt-32 text-center text-vp-gold font-serif">Loading Venues...</div>;

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-slideUp">
          <span className="text-vp-gold font-bold uppercase tracking-widest text-sm">Weddings, Conferences & Galas</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-vp-dark mt-2 mb-4">World-Class Venues</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg font-light">
            Host your dream wedding, corporate conference, or private party in our stunning venues equipped with state-of-the-art facilities and dedicated support teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {banquets.map((hall) => (
            <div key={hall._id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 group flex flex-col h-full">
              <div className="h-72 overflow-hidden relative">
                <img src={getImageUrl(hall.images[0])} alt={hall.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full">
                    <h3 className="text-3xl font-serif font-bold mb-2 text-white">{hall.name}</h3>
                    <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider text-vp-gold">
                        {hall.supportedEvents.slice(0,3).map(e => <span key={e} className="bg-white/20 px-2 py-1 rounded backdrop-blur-md border border-white/10">{e}</span>)}
                    </div>
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-3 text-gray-700">
                        <div className="bg-gray-50 p-2 rounded-full"><Users className="text-vp-gold" size={18} /></div>
                        <span className="font-bold text-lg">{hall.capacity} <span className="text-sm font-normal text-gray-400">Guests</span></span>
                    </div>
                    {/* Price section removed as requested */}
                </div>

                <p className="text-gray-600 mb-8 leading-relaxed font-light">{hall.description}</p>

                <h4 className="font-bold text-vp-dark mb-4 text-xs uppercase tracking-widest flex items-center gap-2">
                    Premium Amenities
                </h4>
                <ul className="grid grid-cols-2 gap-y-3 gap-x-4 mb-8">
                    {hall.amenities.slice(0, 6).map(am => (
                        <li key={am} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle size={14} className="text-vp-gold shrink-0" /> {am}
                        </li>
                    ))}
                </ul>

                <div className="mt-auto flex items-center justify-between gap-4 pt-6 border-t border-gray-100">
                    <Link 
                        to={`/banquets/${hall._id}`}
                        className="text-vp-dark font-bold uppercase tracking-widest text-xs hover:text-vp-gold transition-colors relative group"
                    >
                        View Details
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-vp-gold transition-all duration-300 group-hover:w-full"></span>
                    </Link>
                    <Link 
                        to={`/book/banquet/${hall._id}`}
                        className="bg-vp-dark text-white px-8 py-4 font-bold uppercase tracking-widest text-xs hover:bg-vp-gold hover:text-vp-dark transition-all shadow-lg hover:shadow-xl rounded-sm transform hover:-translate-y-0.5"
                    >
                        Request Proposal
                    </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banquets;
