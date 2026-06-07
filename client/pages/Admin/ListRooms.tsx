import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { useNavigate } from "react-router-dom";
import ConfirmToggleModal from "@/components/ConfirmToggleModal";
import { Pencil, Plus } from "lucide-react";

const ListRooms = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const fetchRooms = async () => {
    try {
      const data = await api.getRooms(); // already exists in your project
      setRooms(data);
    } catch (error) {
      console.error("Failed to fetch rooms", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const openToggleModal = (room: any) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  const handleToggleConfirm = async () => {
    try {
      await api.toggleRoomActive(selectedRoom._id);
      fetchRooms();
    } catch (error) {
      console.error("Failed to update availability");
    } finally {
      setShowModal(false);
      setSelectedRoom(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3 py-10">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton-pulse h-12 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
      <h1 className="text-2xl font-bold text-admin-heading mb-1">Rooms</h1>
      <p className="text-admin-text text-sm">
        Monitor room availability and manage room details.
      </p>
      </div>
      <button
          onClick={() => navigate("/admin/add-room")}
          className="flex items-center gap-2 bg-vp-gold text-vp-dark px-5 py-2 rounded-lg font-semibold hover:bg-amber-400 transition-all"
        >
          <Plus size={18} />
          Add New Room
        </button>
        </div>

      {/* ROOMS TABLE */}
      <div className="bg-admin-card rounded-xl border border-admin-border/50 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-admin-surface">
              <th className="px-6 py-3 text-left text-admin-text text-xs uppercase tracking-wider">Room</th>
              <th className="px-6 py-3 hidden md:table-cell text-admin-text text-xs uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 hidden md:table-cell text-admin-text text-xs uppercase tracking-wider">Guests</th>
              <th className="px-6 py-3 hidden md:table-cell text-admin-text text-xs uppercase tracking-wider">Size</th>
              <th className="px-6 py-3 text-admin-text text-xs uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-admin-text text-xs uppercase tracking-wider">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rooms.map((room) => (
              <tr key={room._id} className="border-b border-admin-border/30 hover:bg-admin-hover/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-admin-heading">{room.name}</p>
                  <p className="text-xs text-admin-text line-clamp-1">
                    {room.description}
                  </p>

                  {/* AMENITIES */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {room.amenities?.map(
                      (event: string, idx: number) => (
                        <span
                          key={idx}
                          className="bg-vp-gold/10 text-vp-gold text-[10px] rounded-full px-2.5 py-0.5"
                        >
                          {event}
                        </span>
                      )
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 hidden md:table-cell text-admin-text">
                  ₹{room.pricePerNight}
                </td>

                <td className="px-6 py-4 hidden md:table-cell text-admin-text">
                  {room.maxGuests}
                </td>

                {/* RATING */}
                <td className="px-6 py-4 hidden md:table-cell text-admin-text">
                  ⭐ {room.averageRating} ({room.reviewCount})
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`rounded-full text-xs font-medium px-3 py-1 ${
                      room.isActive
                        ? "bg-green-500/10 text-green-400"
                        : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    {room.isActive ? "Available" : "Not Available"}
                  </span>
                </td>

                <td className="px-6 py-4 text-right flex justify-end gap-3">
                  {/* TOGGLE */}
                  <button
                    onClick={() => openToggleModal(room)}
                    className="bg-admin-surface text-admin-text hover:bg-admin-hover border border-admin-border rounded-lg px-3 py-1 text-xs transition-all"
                  >
                    Toggle
                  </button>

                  {/* UPDATE */}
                  <button
                    onClick={() =>
                      navigate(`/admin/update-room/${room._id}`)
                    }
                    className="p-2 rounded-lg bg-admin-surface hover:bg-admin-hover hover:text-vp-gold border border-admin-border transition-all"
                  >
                    <Pencil size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CONFIRM MODAL */}
      <ConfirmToggleModal
        open={showModal}
        title="Change Room Availability"
        description={`Are you sure you want to mark "${selectedRoom?.name}" as ${
          selectedRoom?.isActive ? "Not Available" : "Available"
        }?`}
        onConfirm={handleToggleConfirm}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
};

export default ListRooms;