import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Users,
  Home,
  FileText,
  Building2,
  ArrowRight,
  Eye,
  Info,
  Calendar
} from 'lucide-react';
import { api } from '@/utils/api';

interface SearchResults {
  users: any[];
  rooms: any[];
  bookings: any[];
  banquets: any[];
  totalResults: number;
}

const GlobalSearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'users' | 'bookings' | 'rooms' | 'banquets'>('all');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length < 2) {
      setError('Search query must be at least 2 characters');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await api.globalSearch(query);
      setResults(res);
    } catch (err: any) {
      setError(err.message || 'Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 min-h-screen text-admin-heading animate-admin-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-admin-heading mb-1">Global Database Search</h1>
        <p className="text-admin-text text-sm">
          Run instant cross-entity queries on guests, rooms, banquet halls, and active booking invoices.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex bg-admin-card border border-admin-border rounded-2xl p-2 shadow-2xl">
          <div className="flex items-center pl-3 flex-grow">
            <Search className="text-admin-text mr-3" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type guest name, phone, room number, or email..."
              className="w-full bg-transparent border-none text-sm text-admin-heading focus:outline-none focus:ring-0 placeholder-admin-text/60"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-vp-gold hover:bg-amber-400 text-vp-dark font-bold text-xs px-6 py-3 rounded-xl transition-all uppercase tracking-wider disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Run Search'}
          </button>
        </div>
        {error && <p className="text-red-400 text-xs mt-2 pl-2 flex items-center gap-1"><Info size={12}/> {error}</p>}
      </form>

      {/* Results Section */}
      {results ? (
        <div className="space-y-6">
          {/* Tabs header */}
          <div className="flex border-b border-admin-border/30 overflow-x-auto pb-0.5 scrollbar-none gap-2">
            {[
              { id: 'all', label: 'All Results', count: results.totalResults },
              { id: 'users', label: 'Guests', count: results.users.length },
              { id: 'bookings', label: 'Bookings', count: results.bookings.length },
              { id: 'rooms', label: 'Rooms', count: results.rooms.length },
              { id: 'banquets', label: 'Banquets', count: results.banquets.length }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-vp-gold text-vp-gold'
                    : 'border-transparent text-admin-text hover:text-admin-heading'
                }`}
              >
                {tab.label} <span className="ml-1 px-1.5 py-0.5 rounded bg-admin-surface text-[10px] text-admin-text font-normal">{tab.count}</span>
              </button>
            ))}
          </div>

          {/* Users Matches */}
          {(activeTab === 'all' || activeTab === 'users') && results.users.length > 0 && (
            <div className="bg-admin-card border border-admin-border/50 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold text-vp-gold uppercase tracking-wider flex items-center gap-2">
                <Users size={16} /> Guest Accounts ({results.users.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.users.map(u => (
                  <div
                    key={u._id}
                    className="bg-admin-surface border border-admin-border/30 rounded-xl p-4 flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-semibold text-sm text-admin-heading">{u.name}</h4>
                      <p className="text-[10px] text-admin-text mt-0.5">{u.email} | {u.phone || 'No phone'}</p>
                      <p className="text-[9px] text-vp-gold font-semibold uppercase mt-1">Role: {u.role}</p>
                    </div>
                    <button
                      onClick={() => navigate(`/admin/users/${u._id}`)}
                      className="p-2 bg-admin-card rounded-lg hover:bg-admin-hover text-admin-text hover:text-white border border-admin-border transition-all"
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bookings Matches */}
          {(activeTab === 'all' || activeTab === 'bookings') && results.bookings.length > 0 && (
            <div className="bg-admin-card border border-admin-border/50 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold text-vp-gold uppercase tracking-wider flex items-center gap-2">
                <FileText size={16} /> Reservation Bookings ({results.bookings.length})
              </h3>
              <div className="divide-y divide-admin-border/20">
                {results.bookings.map(b => {
                  const guest = b.guestName || b.user?.name || 'Walk-in';
                  const label = b.type === 'room' ? (b.room?.name || 'Deleted Room') : (b.banquetHall?.name || 'Deleted Banquet');

                  return (
                    <div
                      key={b._id}
                      className="py-3 flex justify-between items-center text-xs"
                    >
                      <div>
                        <h4 className="font-semibold text-sm text-admin-heading">{guest}</h4>
                        <p className="text-admin-text mt-1">
                          <span className="capitalize font-medium text-admin-heading">{b.type}:</span> {label}
                        </p>
                        <p className="text-admin-text mt-0.5 flex items-center gap-1.5 text-[10px]">
                          <Calendar size={11} />
                          {b.fromDate} to {b.toDate}
                        </p>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div>
                          <p className="font-bold text-vp-gold text-sm">₹{b.totalPrice?.toLocaleString()}</p>
                          <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-admin-surface border border-admin-border text-admin-text mt-1">
                            {b.status}
                          </span>
                        </div>
                        <button
                          onClick={() => navigate(`/admin/bookig-details/${b._id}`)}
                          className="p-2 bg-admin-surface rounded-lg hover:bg-admin-hover text-admin-text hover:text-white border border-admin-border transition-all"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Rooms Matches */}
          {(activeTab === 'all' || activeTab === 'rooms') && results.rooms.length > 0 && (
            <div className="bg-admin-card border border-admin-border/50 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold text-vp-gold uppercase tracking-wider flex items-center gap-2">
                <Home size={16} /> Resort Rooms ({results.rooms.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.rooms.map(r => (
                  <div
                    key={r._id}
                    className="bg-admin-surface border border-admin-border/30 rounded-xl p-4 flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-admin-heading">Room {r.roomNumber}</h4>
                      <p className="text-xs text-admin-text">{r.name}</p>
                      <span className="inline-block px-2 py-0.5 text-[9px] font-semibold tracking-wide uppercase bg-admin-card border border-admin-border text-admin-text mt-2 rounded">
                        Status: {r.status || 'Available'}
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(`/admin/update-room/${r._id}`)}
                      className="p-2 bg-admin-card rounded-lg hover:bg-admin-hover text-admin-text hover:text-vp-gold border border-admin-border transition-all flex items-center gap-1 text-[10px] font-bold"
                    >
                      Edit room <ArrowRight size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Banquets Matches */}
          {(activeTab === 'all' || activeTab === 'banquets') && results.banquets.length > 0 && (
            <div className="bg-admin-card border border-admin-border/50 rounded-2xl p-6 space-y-4">
              <h3 className="text-xs font-bold text-vp-gold uppercase tracking-wider flex items-center gap-2">
                <Building2 size={16} /> Banquet Halls ({results.banquets.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.banquets.map(b => (
                  <div
                    key={b._id}
                    className="bg-admin-surface border border-admin-border/30 rounded-xl p-4 flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-admin-heading">{b.name}</h4>
                      <p className="text-xs text-admin-text">Capacity: {b.capacity} guests</p>
                    </div>
                    <button
                      onClick={() => navigate(`/admin/update-banquet/${b._id}`)}
                      className="p-2 bg-admin-card rounded-lg hover:bg-admin-hover text-admin-text hover:text-vp-gold border border-admin-border transition-all flex items-center gap-1 text-[10px] font-bold"
                    >
                      Edit Banquet <ArrowRight size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.totalResults === 0 && (
            <div className="py-16 text-center text-admin-text bg-admin-card rounded-2xl border border-admin-border/50">
              <Info className="mx-auto mb-2 text-vp-gold/70" size={24} />
              <span>No results found matching "{query}".</span>
            </div>
          )}
        </div>
      ) : (
        <div className="py-16 text-center text-admin-text bg-admin-card rounded-2xl border border-admin-border/50">
          <Info className="mx-auto mb-2 text-vp-gold/70" size={24} />
          <span>Type search query and run lookup to see database matches.</span>
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
