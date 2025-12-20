import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { useNavigate } from "react-router-dom";
import ConfirmToggleModal from "@/components/ConfirmToggleModal";
import { Pencil } from "lucide-react";

const ListBanquets = () => {
  const [banquets, setBanquets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedBanquet, setSelectedBanquet] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  /* ---------------- FETCH BANQUETS ---------------- */
  const fetchBanquets = async () => {
    try {
      const data = await api.getBanquets(); // backend API
      setBanquets(data);
    } catch (error) {
      console.error("Failed to fetch banquets", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanquets();
  }, []);

  /* ---------------- TOGGLE MODAL ---------------- */
  const openToggleModal = (banquet: any) => {
    setSelectedBanquet(banquet);
    setShowModal(true);
  };

  const handleToggleConfirm = async () => {
    try {
      // await api.updateBanquetAvailability(
      //   selectedBanquet._id,
      //   !selectedBanquet.isActive
      // );

      fetchBanquets();
    } catch (error) {
      console.error("Failed to update banquet availability");
    } finally {
      setShowModal(false);
      setSelectedBanquet(null);
    }
  };

  if (loading) {
    return <div className="py-10 text-center">Loading Banquets...</div>;
  }

  return (
    <div>
      {/* PAGE HEADER */}
      <h1 className="text-3xl font-bold mb-2">Banquets</h1>
      <p className="text-gray-500 mb-8">
        Manage banquet halls, pricing, capacity, and availability.
      </p>

      {/* BANQUETS TABLE */}
      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="py-2 text-left">Banquet</th>
              <th className="py-2 hidden md:table-cell">Capacity</th>
              <th className="py-2 hidden md:table-cell">Price / Plate</th>
              <th className="py-2 hidden md:table-cell">Rating</th>
              <th className="py-2">Status</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {banquets.map((banquet) => (
              <tr key={banquet._id} className="hover:bg-gray-50">
                {/* NAME + DESC */}
                <td className="py-5">
                  <p className="font-semibold">{banquet.name}</p>
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {banquet.description}
                  </p>

                  {/* EVENTS */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {banquet.supportedEvents?.map(
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

                {/* CAPACITY */}
                <td className="py-5 hidden md:table-cell">
                  {banquet.capacity} Guests
                </td>

                {/* PRICE */}
                <td className="py-5 hidden md:table-cell">
                  ₹{banquet.pricePerPlate}
                </td>

                {/* RATING */}
                <td className="py-5 hidden md:table-cell">
                  ⭐ {banquet.averageRating} ({banquet.reviewCount})
                </td>

                {/* STATUS */}
                <td className="py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      banquet.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {banquet.isActive ? "Available" : "Not Available"}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="py-3 text-right flex justify-end gap-3">
                  {/* TOGGLE */}
                  <button
                    onClick={() => openToggleModal(banquet)}
                    className="px-3 py-1 rounded-lg border text-xs hover:bg-gray-100"
                  >
                    Toggle
                  </button>

                  {/* UPDATE */}
                  <button
                    onClick={() =>
                      navigate(`/admin/update-banquet/${banquet._id}`)
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
        title="Change Banquet Availability"
        description={`Are you sure you want to mark "${
          selectedBanquet?.name
        }" as ${
          selectedBanquet?.isActive ? "Not Available" : "Available"
        }?`}
        onConfirm={handleToggleConfirm}
        onCancel={() => setShowModal(false)}
      />
    </div>
  );
};

export default ListBanquets;