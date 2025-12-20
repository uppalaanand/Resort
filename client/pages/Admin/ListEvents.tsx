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
    <div className="px-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="All">All Events</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <button
          onClick={() => navigate("/admin/add-event")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add New Event
        </button>
      </div>

      {loading ? (
        <p>Loading events...</p>
      ) : filteredEvents.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <div key={event._id} className="border rounded shadow p-4 flex flex-col">
              {event.images.length > 0 && (
                <img
                  src={getImageUrl(event.images[0]) }
                  alt={event.title}
                  className="w-full h-40 object-cover rounded mb-4"
                />
              )}
              <h2 className="text-xl font-semibold mb-1">{event.title}</h2>
              <p className="text-gray-500 text-sm mb-2">
                {new Date(event.startDate).toLocaleDateString()} -{" "}
                {new Date(event.endDate).toLocaleDateString()}
              </p>
              <p className="text-gray-700 mb-4">{event.description}</p>
              <div className="flex gap-2 mt-auto">
                <button
                  onClick={() => navigate(`/admin/events/edit/${event._id}`)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button onClick={() => { setSelectedEvent(event);
                                    setDeleteOpen(true);}} className="bg-red-600 text-white px-3 py-1 rounded">
                    Delete
                </button>
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