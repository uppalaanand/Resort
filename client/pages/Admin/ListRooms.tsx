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
    //   await api.updateRoomAvailability(
    //     selectedRoom._id,
    //     !selectedRoom.isAvailable
    //   );
      fetchRooms();
    } catch (error) {
      console.error("Failed to update availability");
    } finally {
      setShowModal(false);
      setSelectedRoom(null);
    }
  };

  if (loading) {
    return <div className="py-10 text-center">Loading Rooms...</div>;
  }

  return (
    <div>
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
      <h1 className="text-3xl font-bold mb-1">Rooms</h1>
      <p className="text-gray-500 mb-8">
        Monitor room availability and manage room details.
      </p>
      </div>
      <button
          onClick={() => navigate("/admin/add-room")}
          className="flex items-center gap-2 bg-vp-gold text-vp-dark px-5 py-2 rounded-lg font-semibold hover:opacity-90 transition"
        >
          <Plus size={18} />
          Add New Room
        </button>
        </div>

      {/* ROOMS TABLE */}
      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="py-2 text-left">Room</th>
              <th className="py-2 hidden md:table-cell">Price</th>
              <th className="py-2 hidden md:table-cell">Guests</th>
              <th className="py-2 hidden md:table-cell">Size</th>
              <th className="py-2">Status</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {rooms.map((room) => (
              <tr key={room._id} className="hover:bg-gray-50">
                <td className="py-5">
                  <p className="font-semibold">{room.name}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {room.description}
                  </p>

                  {/* AMENITIES */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {room.amenities?.map(
                      (event: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-[10px] rounded-full bg-gray-100 text-gray-700"
                        >
                          {event}
                        </span>
                      )
                    )}
                  </div>
                </td>

                <td className="py-5 hidden md:table-cell">
                  ₹{room.pricePerNight}
                </td>

                <td className="py-5 hidden md:table-cell">
                  {room.maxGuests}
                </td>

                {/* RATING */}
                <td className="py-5 hidden md:table-cell">
                  ⭐ {room.averageRating} ({room.reviewCount})
                </td>

                <td className="py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      room.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {room.isActive ? "Available" : "Not Available"}
                  </span>
                </td>

                <td className="py-3 text-right flex justify-end gap-3">
                  {/* TOGGLE */}
                  <button
                    onClick={() => openToggleModal(room)}
                    className="px-3 py-1 rounded-lg border text-xs hover:bg-gray-100"
                  >
                    Toggle
                  </button>

                  {/* UPDATE */}
                  <button
                    onClick={() =>
                      navigate(`/admin/update-room/${room._id}`)
                    }
                    className="p-2 rounded-lg hover:bg-gray-100"
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