import React, { useEffect, useState } from 'react';
import { ACTIVITIES } from '../constants';
import { api } from '../utils/api';
import { Activity } from '../types';
import { CheckCircle, Clock, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

const Activities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await api.getActivities();
        setActivities(data);
      } catch (err) {
        // Fallback to constants if API fails or mock isn't sufficient
        setActivities(ACTIVITIES);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  if (loading) return <div className="pt-32 text-center text-vp-gold font-serif">Loading Adventures...</div>;

  return (
    <div className="pt-24 pb-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-slideUp">
          <span className="text-vp-gold font-bold uppercase tracking-widest text-sm">Adventure & Relaxation</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-vp-dark mt-2 mb-4">Resort Activities</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg font-light">
            From adrenaline-pumping sports to serene nature walks, discover the endless possibilities at Four Leaf Resort.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((act) => (
            <div key={act._id} className="bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 flex flex-col h-full animate-fadeIn">
              <div className="h-56 overflow-hidden relative">
                <img 
                    src={act.image} 
                    alt={act.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                {/* {act.price === 0 && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                        Free Entry
                    </div>
                )} */}
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-serif font-bold text-vp-dark mb-2">{act.name}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{act.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                    {act.amenities.map(am => (
                        <span key={am} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-1 rounded font-bold uppercase border border-gray-200">
                            {am}
                        </span>
                    ))}
                </div>

                <div className="flex items-center justify-between mt-auto border-t border-gray-100 pt-4">
                    <div>
                         {act.price > 0 ? (
                             <>
                                <span className="block text-xl font-bold text-vp-gold">₹{act.price}</span>
                                <span className="text-xs text-gray-400 capitalize">{act.priceUnit.replace('_', ' ')}</span>
                             </>
                         ) : (
                             <span className="block text-xl font-bold text-vp-gold">Open</span>
                         )}
                    </div>
                    {/* Placeholder for future activity booking implementation */}
                    <button className="text-vp-dark font-bold uppercase tracking-widest text-xs border-b-2 border-transparent hover:border-vp-gold transition-all">
                        More Info
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Activities;