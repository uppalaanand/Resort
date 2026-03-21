import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Edit, Plus } from "lucide-react";
import { api } from "../../utils/api";
import { getImageUrl } from "@/utils/images";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

type GalleryItem = {
  _id: string;
  images: string[];
  category: "rooms" | "dining" | "events" | "surroundings";
  alt: string;
};

const AdminGallery = () => {
  const navigate = useNavigate();
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
const [selectedGallery, setSelectedGallery] = useState<GalleryItem | null>(null);

  const categories = ["all", "rooms", "dining", "events", "surroundings"];

  const fetchGallery = async () => {
    try {
      const data = await api.getGallery();
      setGallery(data as any[]);
    } catch (err) {
      console.error("Failed to fetch gallery", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleDeleteGallery = async () => {
  if (!selectedGallery) return;

  try {
    await api.deleteGallery(selectedGallery._id);
    setGallery((prev) =>
      prev.filter((g) => g._id !== selectedGallery._id)
    );
  } catch (error) {
    alert("Failed to delete gallery image");
  } finally {
    setDeleteOpen(false);
    setSelectedGallery(null);
  }
};


  const filteredGallery = gallery.filter((item) => {
    const matchCategory = category === "all" || item.category === category;
    const matchSearch = item.alt
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Gallery Management
        </h1>

        <button
          onClick={() => navigate("/admin/gallery/create")}
          className="flex items-center gap-2 bg-vp-gold text-vp-dark px-5 py-2 rounded-lg font-semibold hover:opacity-90 transition"
        >
          <Plus size={18} />
          Add Gallery Photo
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-56"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.toUpperCase()}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by alt text..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-80"
        />
      </div>

      {/* CONTENT */}
      {loading ? (
        <p className="text-gray-500">Loading gallery...</p>
      ) : filteredGallery.length === 0 ? (
        <p className="text-gray-500">No gallery images found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGallery.flatMap((item) =>
            item.images.map((img, index) => (
              <div
                key={`${item._id}-${index}`}
                className="relative group rounded-xl overflow-hidden shadow-md bg-white"
              >
                <img
                  src={getImageUrl(img)}
                  alt={item.alt}
                  className="w-full h-56 object-cover"
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
                  <button
                    onClick={() =>
                      navigate(`/admin/gallery/edit/${item._id}`)
                    }
                    className="bg-white p-2 rounded-full hover:bg-gray-100"
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    onClick={() => {setSelectedGallery(item);
                                setDeleteOpen(true);}}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {/* CATEGORY TAG */}
                <span className="absolute top-2 left-2 bg-vp-gold text-vp-dark text-xs font-bold px-3 py-1 rounded-full uppercase">
                  {item.category}
                </span>
              </div>
            ))
          )}
        </div>
      )}


      <ConfirmDeleteModal open={deleteOpen} title="Delete Gallery Photo"
            description={ selectedGallery ? `Are you sure you want to delete this gallery photo (${selectedGallery.category})? This action cannot be undone.`
                : ""}
            onConfirm={handleDeleteGallery}
            onCancel={() => setDeleteOpen(false)}
        />
    </div>
  );
};

export default AdminGallery;