import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History,
  Search,
  Filter,
  Info,
  Calendar,
  Clock,
  Eye,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { api } from '@/utils/api';
import { ActivityLog } from '@/types';

const ActivityLogs = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [actionFilter, setActionFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params = {
        ...(actionFilter ? { action: actionFilter } : {}),
        ...(entityFilter ? { entityType: entityFilter } : {})
      };
      const res = await api.getActivityLogs(params);
      console.log("Activity Logs Response:", res);
      setLogs(res || []);
    } catch (err) {
      setError('Failed to fetch activity logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter, entityFilter]);

  const formatDetails = (details: any) => {
    if (!details) return 'N/A';
    if (typeof details === 'string') return details;
    return Object.entries(details)
      .map(([key, val]) => `${key}: ${typeof val === 'object' ? JSON.stringify(val) : val}`)
      .join(', ');
  };

  if (loading) {
    return (
      <div className="p-8 min-h-screen space-y-6 animate-admin-fadeIn">
        <div className="skeleton-pulse h-8 w-64 rounded-lg mb-8" />
        <div className="skeleton-pulse h-12 w-full rounded-lg" />
        <div className="bg-admin-card rounded-xl border border-admin-border/50 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-pulse h-16 border-b border-admin-border/30 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 min-h-screen text-admin-heading animate-admin-fadeIn max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-admin-heading mb-1">System Activity Audit Log</h1>
          <p className="text-admin-text text-sm">
            Security audit logs tracking front-desk check-ins, invoice status changes, and administrator operations.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="flex items-center gap-2 bg-admin-surface hover:bg-admin-hover text-admin-text border border-admin-border px-4 py-2 rounded-lg text-xs font-semibold transition-all"
        >
          <RefreshCw size={14} /> Refresh Audit Trail
        </button>
      </div>

      {/* Filters bar */}
      <div className="bg-admin-card border border-admin-border/50 rounded-xl p-4 md:p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Action Filter */}
        <div>
          <label className="block text-[10px] font-bold text-admin-text uppercase mb-2">Filter Action Type</label>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="w-full bg-admin-surface border border-admin-border rounded-lg p-2.5 text-xs text-admin-heading focus:outline-none focus:border-vp-gold"
          >
            <option value="">-- All Actions --</option>
            <option value="BOOKING_CREATED">Booking Created</option>
            <option value="BOOKING_APPROVED">Booking Approved</option>
            <option value="BOOKING_REJECTED">Booking Rejected</option>
            <option value="GUEST_CHECKIN">Guest Check-In</option>
            <option value="GUEST_CHECKOUT">Guest Check-Out</option>
            <option value="ROOM_TOGGLED">Room Toggle Active</option>
            <option value="BANQUET_TOGGLED">Banquet Toggle Active</option>
            <option value="STAFF_CREATED">Staff Account Created</option>
            <option value="USER_TOGGLED">User Toggle Active</option>
            <option value="PAYMENT_UPDATED">Payment Status Updated</option>
          </select>
        </div>

        {/* Entity type Filter */}
        <div>
          <label className="block text-[10px] font-bold text-admin-text uppercase mb-2">Filter Entity Category</label>
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="w-full bg-admin-surface border border-admin-border rounded-lg p-2.5 text-xs text-admin-heading focus:outline-none focus:border-vp-gold"
          >
            <option value="">-- All Entities --</option>
            <option value="booking">Booking</option>
            <option value="room">Room</option>
            <option value="banquet">Banquet Hall</option>
            <option value="user">User / Staff</option>
            <option value="payment">Payment Settlement</option>
            <option value="otp">OTP Verification</option>
          </select>
        </div>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm">{error}</div>}

      {/* Logs Table */}
      <div className="bg-admin-card rounded-2xl border border-admin-border/50 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto admin-scroll">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-admin-surface border-b border-admin-border/50 text-admin-text uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Event Action</th>
                <th className="px-6 py-4">Entity Type</th>
                <th className="px-6 py-4">Performed By</th>
                <th className="px-6 py-4">IP Address</th>
                <th className="px-6 py-4">Details Summary</th>
                <th className="px-6 py-4">Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-admin-text text-sm">
                    No activity logs found.
                  </td>
                </tr>
              ) : (
                logs.logs.map((log) => {
                  return (
                    <tr
                      key={log._id}
                      className="border-b border-admin-border/30 hover:bg-admin-hover/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="bg-vp-gold/10 text-vp-gold px-2 py-0.5 rounded font-mono font-bold text-[10px]">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize font-medium text-admin-heading">{log.entityType}</span>
                      </td>
                      <td className="px-6 py-4 text-admin-text">
                        {log.performedBy ? (
                          <div>
                            <p className="font-semibold text-admin-heading">{log.performedBy.name}</p>
                            <p className="text-[9px] text-admin-text/80">{log.performedBy.email}</p>
                          </div>
                        ) : (
                          <span className="italic text-admin-text/60">Anonymous / System</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono text-admin-text">
                        {log.ipAddress || '127.0.0.1'}
                      </td>
                      <td className="px-6 py-4 text-admin-text max-w-xs truncate" title={formatDetails(log.details)}>
                        {formatDetails(log.details)}
                      </td>
                      <td className="px-6 py-4 text-admin-text">
                        <div className="flex items-center gap-1">
                          <Clock size={11} className="text-vp-gold/70" />
                          <span>{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
