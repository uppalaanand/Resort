import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { UserRole } from '../types';
import { api } from '../utils/api';
import { Check, X, Trash2, Plus } from 'lucide-react';
import { getImageUrl } from '../utils/images';
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'bookings' | 'rooms' | 'banquets'>('bookings');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            let res;
            if (activeTab === 'bookings') res = await api.getAllBookings();
            else if (activeTab === 'rooms') res = await api.getRooms();
            else res = await api.getBanquets();
            setData(res);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [activeTab]);

  if (!user || user.role !== UserRole.ADMIN) {
    return <Navigate to="/" />;
  }

  const updateStatus = async (id: string, status: string) => {
    await api.updateBookingStatus(id, status);
    const res = await api.getAllBookings();
    setData(res);
  };

  const deleteItem = async (id: string) => {
      if (activeTab === 'rooms') {
          await api.deleteRoom(id);
          setData(data.filter(d => d._id !== id));
      }
      // Implement banquet delete similarly
  };

  return (
    <div className="pt-24 pb-12 min-h-screen bg-gray-100 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-vp-dark">Admin Dashboard</h1>
            <span className="bg-vp-dark text-vp-gold px-4 py-2 rounded text-xs font-bold uppercase tracking-wider">Administrator</span>
        </div>

        <div className="bg-white shadow rounded-lg p-1 mb-8 inline-flex">
            {['bookings', 'rooms', 'banquets'].map(tab => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-6 py-3 rounded-md text-sm font-bold uppercase tracking-wide transition-all ${
                        activeTab === tab ? 'bg-vp-gold text-vp-dark shadow-sm' : 'text-gray-400 hover:text-vp-dark'
                    }`}
                >
                    {tab}
                </button>
            ))}
        </div>

        <div className="bg-white shadow-xl rounded-xl overflow-hidden min-h-[500px]">
            {loading ? <div className="p-10 text-center">Loading Data...</div> : (
                activeTab === 'bookings' ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Guest</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Item</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Dates</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.map((bk) => (
                                    <tr key={bk._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{bk.user?.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {bk.room?.name || bk.banquetHall?.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(bk.fromDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase ${
                                                bk.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                                                bk.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {bk.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button onClick={() => updateStatus(bk._id, 'Confirmed')} className="text-green-600 hover:bg-green-50 p-1 rounded"><Check size={18} /></button>
                                            <button onClick={() => updateStatus(bk._id, 'Cancelled')} className="text-red-600 hover:bg-red-50 p-1 rounded"><X size={18} /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-6">
                        <div className="flex justify-end mb-6">
                            <button onClick={() => navigate(activeTab === "rooms"? "/admin/add-room": "/admin/add-banquet")} className="bg-vp-dark text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-bold uppercase hover:bg-gray-800">
                                <Plus size={16} /> Add New
                            </button>
                        </div>
                        <div className="grid gap-4">
                            {data.map(item => (
                                <div key={item._id} className="border p-4 rounded flex justify-between items-center hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4">
                                        <img src={getImageUrl(item.images?.[0])} className="w-16 h-16 object-cover rounded" alt={item.name} />
                                        <div>
                                            <h4 className="font-bold text-vp-dark">{item.name}</h4>
                                            <p className="text-sm text-gray-500">${item.pricePerNight || item.pricePerPlate}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => deleteItem(item._id)} className="text-red-600 hover:bg-red-50 p-2 rounded"><Trash2 size={18}/></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
