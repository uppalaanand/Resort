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
    <div className="p-6 animate-admin-fadeIn">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-admin-heading">
            Gallery Management
          </h1>
          <p className="text-admin-text text-sm mt-1">Upload and manage resort photo gallery</p>
        </div>

        <button
          onClick={() => navigate("/admin/gallery/create")}
          className="flex items-center gap-2 bg-vp-gold text-vp-dark px-5 py-2 rounded-lg font-semibold hover:bg-amber-400 transition-all"
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
          className="bg-admin-surface border border-admin-border text-admin-heading rounded-lg px-4 py-2 text-sm w-full md:w-56 focus:ring-2 focus:ring-vp-gold/40 focus:border-vp-gold/60 outline-none"
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
          className="bg-admin-surface border border-admin-border text-admin-heading placeholder-admin-text/40 rounded-lg px-4 py-2 text-sm w-full md:w-80 focus:ring-2 focus:ring-vp-gold/40 focus:border-vp-gold/60 outline-none"
        />
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-admin-card rounded-xl border border-admin-border/50 overflow-hidden">
              <div className="w-full h-56 skeleton-pulse" />
              <div className="p-3">
                <div className="h-3 w-3/4 rounded skeleton-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredGallery.length === 0 ? (
        <p className="text-admin-text">No gallery images found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredGallery.flatMap((item) =>
            item.images.map((img, index) => (
              <div
                key={`${item._id}-${index}`}
                className="bg-admin-card rounded-xl border border-admin-border/50 overflow-hidden group hover:border-admin-border transition-all"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={getImageUrl(img)}
                    alt={item.alt}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
                    <button
                      onClick={() =>
                        navigate(`/admin/gallery/edit/${item._id}`)
                      }
                      className="bg-admin-surface text-admin-text hover:text-vp-gold hover:bg-admin-hover border border-admin-border p-2.5 rounded-lg transition-all"
                    >
                      <Edit size={18} />
                    </button>

                    <button
                      onClick={() => {setSelectedGallery(item);
                                  setDeleteOpen(true);}}
                      className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 p-2.5 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* CATEGORY TAG */}
                  <span className="absolute top-2 left-2 bg-vp-gold/90 text-vp-dark text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                    {item.category}
                  </span>
                </div>

                {/* Alt text */}
                <p className="text-admin-text text-xs p-3 truncate">{item.alt}</p>
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