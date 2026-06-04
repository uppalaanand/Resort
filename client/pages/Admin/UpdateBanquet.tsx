import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/utils/api";
import { getImageUrl } from "@/utils/images";
import SuccessModal from "@/components/SuccessModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

const UpdateBanquet = () => {
  const navigate = useNavigate();
  const { banquetId } = useParams<{ banquetId: string }>();
  const [successOpen, setSuccessOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [banquetData, setBanquetData] = useState({
    name: "",
    description: "",
    capacity: "",
    pricePerPlate: "",
    averageRating: "",
    reviewCount: "",
  });

  /* ---------- PREDEFINED OPTIONS ---------- */
  const predefinedAmenities = [
    "Private Pool",
    "Kitchen",
    "BBQ Grill",
    "DJ Setup",
    "Stage",
    "Parking",
    "Power Backup",
  ];

  const predefinedEvents = [
    "Private Party",
    "Staycation",
    "Reception",
    "Concert",
    "Wedding",
    "Corporate Event",
  ];

  const [amenities, setAmenities] = useState<string[]>([]);
  const [supportedEvents, setSupportedEvents] = useState<string[]>([]);

  const [customAmenity, setCustomAmenity] = useState("");
  const [customEvent, setCustomEvent] = useState("");

  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH BANQUET ---------------- */
  useEffect(() => {
    const fetchBanquet = async () => {
      try {
        const banquet = await api.getBanquet(banquetId);

        setBanquetData({
          name: banquet.name || "",
          description: banquet.description || "",
          capacity: banquet.capacity || "",
          pricePerPlate: banquet.pricePerPlate || "",
          averageRating: banquet.averageRating || "",
          reviewCount: banquet.reviewCount || "",
        });

        setAmenities(banquet.amenities || []);
        setSupportedEvents(banquet.supportedEvents || []);
        setExistingImages(banquet.images || []);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch banquet details");
      }
    };

    fetchBanquet();
  }, [banquetId]);

  /* ---------------- HANDLERS ---------------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setBanquetData({ ...banquetData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const removeExistingImage = (img: string) => {
    setExistingImages((prev) => prev.filter((i) => i !== img));
  };

  const removeNewImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleAmenity = (item: string) => {
    setAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const toggleEvent = (item: string) => {
    setSupportedEvents((prev) =>
      prev.includes(item) ? prev.filter((e) => e !== item) : [...prev, item]
    );
  };

  const addCustomAmenity = () => {
    if (customAmenity.trim() && !amenities.includes(customAmenity.trim())) {
      setAmenities([...amenities, customAmenity.trim()]);
      setCustomAmenity("");
    }
  };

  const removeAmenity = (amenity: string) => {
    setAmenities((prev) => prev.filter((a) => a !== amenity));
  };

  const addCustomEvent = () => {
    if (
      customEvent.trim() &&
      !supportedEvents.includes(customEvent.trim())
    ) {
      setSupportedEvents([...supportedEvents, customEvent.trim()]);
      setCustomEvent("");
    }
  };

  const removeEvent = (event: string) => {
    setSupportedEvents((prev) => prev.filter((e) => e !== event));
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries(banquetData).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      amenities.forEach((item) => {
        formData.append("amenities", item);
      });

      supportedEvents.forEach((event) => {
        formData.append("supportedEvents", event);
      });

      images.forEach((img) => formData.append("images", img));

      await api.updateBanquet(banquetId, formData);
      setSuccessOpen(true);
    } catch (err) {
      console.error(err);
      alert("Failed to update banquet");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBanquete = async () => {
    try {
      await api.deleteBanquete(banquetId);
      setDeleteOpen(false);
      navigate("/admin/dashboard");
    } catch (error) {
      console.error(error);
      alert("Failed to delete banquet");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="p-6 max-w-5xl animate-admin-fadeIn">
      <h1 className="text-2xl font-bold text-admin-heading mb-1.5">Update Banquet</h1>
      <p className="text-admin-text text-sm mb-8">
        Update banquet details, pricing, capacity, supported events, and amenities carefully.
      </p>

      <form onSubmit={handleSubmit} className="bg-admin-card rounded-xl border border-admin-border/50 p-6 md:p-8 space-y-6">
        {/* IMAGES */}
        <div>
          <label className="block text-sm font-medium text-admin-heading mb-1.5">Banquet Images</label>
          <div className="flex flex-wrap gap-4 items-center">
            {existingImages.map((img, i) => (
              <div key={i} className="relative group">
                <img
                  src={getImageUrl(img)}
                  className="w-24 h-20 object-cover rounded-lg border border-admin-border"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(img)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600 shadow-md transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
            {images.map((img, i) => (
              <div key={i} className="relative group">
                <img
                  src={URL.createObjectURL(img)}
                  className="w-24 h-20 object-cover rounded-lg border border-admin-border"
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(i)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600 shadow-md transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
            <label className="w-24 h-20 border-2 border-dashed border-admin-border hover:border-vp-gold/60 rounded-xl bg-admin-surface/50 transition-colors cursor-pointer flex flex-col items-center justify-center text-admin-text hover:text-vp-gold">
              <span className="text-xl font-light">+</span>
              <span className="text-[10px] uppercase tracking-wider font-semibold">Upload</span>
              <input type="file" multiple hidden onChange={handleImageUpload} />
            </label>
          </div>
        </div>

        {/* NAME + PRICE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-admin-heading mb-1.5">Banquet Name</label>
            <input
              type="text"
              value={banquetData.name}
              disabled
              className="w-full bg-admin-surface border border-admin-border text-admin-heading placeholder-admin-text/40 rounded-lg px-4 py-2.5 opacity-60 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-admin-heading mb-1.5">Price / Plate ($)</label>
            <input
              type="number"
              name="pricePerPlate"
              value={banquetData.pricePerPlate}
              onChange={handleChange}
              className="w-full bg-admin-surface border border-admin-border text-admin-heading placeholder-admin-text/40 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-vp-gold/40 focus:border-vp-gold/60 transition-colors"
              required
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium text-admin-heading mb-1.5">Description</label>
          <textarea
            name="description"
            rows={4}
            value={banquetData.description}
            onChange={handleChange}
            className="w-full bg-admin-surface border border-admin-border text-admin-heading placeholder-admin-text/40 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-vp-gold/40 focus:border-vp-gold/60 transition-colors resize-none"
            required
          />
        </div>

        {/* SUPPORTED EVENTS */}
        <div>
          <label className="block text-sm font-medium text-admin-heading mb-2">Supported Events</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-4">
            {predefinedEvents.map((event) => (
              <label key={event} className="flex items-center gap-2 text-sm text-admin-text cursor-pointer hover:text-admin-heading select-none">
                <input
                  type="checkbox"
                  checked={supportedEvents.includes(event)}
                  onChange={() => toggleEvent(event)}
                  className="rounded border-admin-border text-vp-gold focus:ring-vp-gold/40 accent-vp-gold bg-admin-surface"
                />
                {event}
              </label>
            ))}
          </div>

          {/* SELECTED EVENTS CHIPS */}
          <div className="flex flex-wrap gap-2 mb-4">
            {supportedEvents.map((event) => (
              <div
                key={event}
                className="flex items-center gap-1.5 bg-vp-gold/10 text-vp-gold rounded-full px-3 py-1 text-xs font-medium border border-vp-gold/20"
              >
                <span>{event}</span>
                <button
                  type="button"
                  onClick={() => removeEvent(event)}
                  className="text-red-400 hover:text-red-500 font-bold ml-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* CUSTOM EVENT INPUT */}
          <div className="flex gap-2 max-w-sm">
            <input
              type="text"
              placeholder="Add custom event"
              value={customEvent}
              onChange={(e) => setCustomEvent(e.target.value)}
              className="bg-admin-surface border border-admin-border text-admin-heading placeholder-admin-text/40 rounded-lg px-3 py-2 focus:ring-2 focus:ring-vp-gold/40 focus:border-vp-gold/60 transition-colors w-full text-sm"
            />
            <button
              type="button"
              onClick={addCustomEvent}
              className="bg-vp-gold text-vp-dark font-semibold hover:bg-amber-400 rounded-lg px-4 text-sm transition-all shadow-md shadow-vp-gold/10"
            >
              Add
            </button>
          </div>
        </div>

        {/* AMENITIES */}
        <div>
          <label className="block text-sm font-medium text-admin-heading mb-2">Amenities</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {predefinedAmenities.map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm text-admin-text cursor-pointer hover:text-admin-heading select-none">
                <input
                  type="checkbox"
                  checked={amenities.includes(item)}
                  onChange={() => toggleAmenity(item)}
                  className="rounded border-admin-border text-vp-gold focus:ring-vp-gold/40 accent-vp-gold bg-admin-surface"
                />
                {item}
              </label>
            ))}
          </div>

          {/* SELECTED AMENITIES CHIPS */}
          <div className="flex flex-wrap gap-2 mb-4">
            {amenities.map((item) => (
              <div
                key={item}
                className="flex items-center gap-1.5 bg-vp-gold/10 text-vp-gold rounded-full px-3 py-1 text-xs font-medium border border-vp-gold/20"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeAmenity(item)}
                  className="text-red-400 hover:text-red-500 font-bold ml-1"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* CUSTOM AMENITY INPUT */}
          <div className="flex gap-2 max-w-sm">
            <input
              type="text"
              placeholder="Add custom amenity"
              value={customAmenity}
              onChange={(e) => setCustomAmenity(e.target.value)}
              className="bg-admin-surface border border-admin-border text-admin-heading placeholder-admin-text/40 rounded-lg px-3 py-2 focus:ring-2 focus:ring-vp-gold/40 focus:border-vp-gold/60 transition-colors w-full text-sm"
            />
            <button
              type="button"
              onClick={addCustomAmenity}
              className="bg-vp-gold text-vp-dark font-semibold hover:bg-amber-400 rounded-lg px-4 text-sm transition-all shadow-md shadow-vp-gold/10"
            >
              Add
            </button>
          </div>
        </div>

        {/* META GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-admin-heading mb-1.5">Capacity</label>
            <input
              type="number"
              name="capacity"
              value={banquetData.capacity}
              onChange={handleChange}
              className="w-full bg-admin-surface border border-admin-border text-admin-heading placeholder-admin-text/40 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-vp-gold/40 focus:border-vp-gold/60 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-admin-heading mb-1.5">Average Rating</label>
            <input
              type="number"
              step="0.1"
              name="averageRating"
              value={banquetData.averageRating}
              onChange={handleChange}
              className="w-full bg-admin-surface border border-admin-border text-admin-heading placeholder-admin-text/40 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-vp-gold/40 focus:border-vp-gold/60 transition-colors"
              required
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-admin-border/30">
          <button
            type="submit"
            disabled={loading}
            className="bg-vp-gold text-vp-dark font-bold hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg px-6 py-3 transition-all shadow-lg shadow-vp-gold/20 flex-1 sm:flex-none text-center"
          >
            {loading ? "Updating..." : "Update Banquet"}
          </button>
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-lg px-6 py-3 transition-all font-semibold"
          >
            Delete Banquet
          </button>
        </div>
      </form>

      {/* SUCCESS MODAL */}
      <SuccessModal
        open={successOpen}
        title="Banquet Updated Successfully 🎉"
        description={`"${banquetData.name}" has been updated and changes are now live.`}
        onClose={() => {
          setSuccessOpen(false);
          navigate("/admin/dashboard");
        }}
      />

      {/* DELETE MODAL */}
      <ConfirmDeleteModal
        open={deleteOpen}
        title="Delete Banquet"
        description={`Are you sure you want to delete "${banquetData.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteBanquete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
};

export default UpdateBanquet;