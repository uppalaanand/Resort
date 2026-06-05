import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { admin } from "@/utils/admin";
import SuccessModal from "@/components/SuccessModal";
import { getImageUrl } from "@/utils/images";
import { api } from "@/utils/api";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

interface Event {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  images: string[];
}

const ListEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("All");
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
   const [deleteOpen, setDeleteOpen] = useState(false);
   const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  /* ------------------ FETCH EVENTS ------------------ */
  const fetchEvents = async () => {
  try {
    const data = await api.getEvents(); // Fetch all events from your api module
    setEvents(data);
  } catch (err) {
    console.error("Failed to fetch events", err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchEvents();
}, []);

const handleDeleteEvent = async (eventId: string) => {
  try {
    await api.deleteEvent(eventId);
    setEvents((prev) => prev.filter((e) => e._id !== eventId));
    setSuccessMsg("Event deleted successfully 🎉");
    setSuccessOpen(true);
  } catch (err) {
    alert("Failed to delete event");
    console.error(err);
  } finally {
    setDeleteOpen(false);
    setSelectedEvent(null);
  }
};


  /* ------------------ FILTER EVENTS ------------------ */
  const getFilteredEvents = () => {
    const now = new Date();
    switch (filter) {
      case "Ongoing":
        return events.filter(
          (e) => new Date(e.startDate) <= now && now <= new Date(e.endDate)
        );
      case "Upcoming":
        return events.filter((e) => new Date(e.startDate) > now);
      case "Completed":
        return events.filter((e) => new Date(e.endDate) < now);
      default:
        return events;
    }
  };

  const filteredEvents = getFilteredEvents();

  return (
    <div className="px-4 max-w-6xl mx-auto animate-admin-fadeIn">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-admin-heading">Events</h1>
        <p className="text-admin-text text-sm mt-1">Manage and organize resort events</p>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-admin-surface border border-admin-border text-admin-heading rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-vp-gold/40 focus:border-vp-gold/60 outline-none"
          >
            <option value="All">All Events</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <button
          onClick={() => navigate("/admin/add-event")}
          className="bg-vp-gold text-vp-dark font-semibold px-4 py-2 rounded-lg hover:bg-amber-400 transition-all"
        >
          Add New Event
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-admin-card rounded-xl border border-admin-border/50 overflow-hidden">
              <div className="w-full h-40 skeleton-pulse" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 rounded skeleton-pulse" />
                <div className="h-3 w-1/2 rounded skeleton-pulse" />
                <div className="h-3 w-full rounded skeleton-pulse" />
                <div className="flex gap-2 mt-2">
                  <div className="h-7 w-14 rounded-lg skeleton-pulse" />
                  <div className="h-7 w-16 rounded-lg skeleton-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredEvents.length === 0 ? (
        <p className="text-admin-text">No events found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <div key={event._id} className="bg-admin-card rounded-xl border border-admin-border/50 overflow-hidden group hover:border-admin-border transition-all flex flex-col">
              {event.images.length > 0 && (
                <div className="overflow-hidden">
                  <img
                    src={getImageUrl(event.images[0]) }
                    alt={event.title}
                    className="w-full h-40 object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                <h2 className="text-admin-heading font-semibold text-lg mb-1">{event.title}</h2>
                <p className="text-admin-text text-xs mb-2">
                  {new Date(event.startDate).toLocaleDateString()} -{" "}
                  {new Date(event.endDate).toLocaleDateString()}
                </p>
                <p className="text-admin-text text-sm mb-4 line-clamp-2">{event.description}</p>
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => navigate(`/admin/events/edit/${event._id}`)}
                    className="bg-admin-surface text-admin-text hover:text-vp-gold hover:bg-admin-hover border border-admin-border text-xs rounded-lg px-3 py-1.5 transition-all"
                  >
                    Edit
                  </button>
                  <button onClick={() => { setSelectedEvent(event);
                                      setDeleteOpen(true);}} className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 text-xs rounded-lg px-3 py-1.5 transition-all">
                      Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <SuccessModal
        open={successOpen}
        title={successMsg}
        description=""
        onClose={() => setSuccessOpen(false)}
      />

      <ConfirmDeleteModal open={deleteOpen} title="Delete Event" description={
            selectedEvent? `Are you sure you want to delete the event "${selectedEvent.title}"? This action cannot be undone.`: ""
            }
        onConfirm={() => selectedEvent && handleDeleteEvent(selectedEvent._id)}
        onCancel={() => setDeleteOpen(false)}
    />
    </div>
  );
};

export default ListEvents;