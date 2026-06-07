import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/utils/api";
import { getImageUrl } from "@/utils/images";
import SuccessModal from "@/components/SuccessModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

const UpdateRoom = () => {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const [successOpen, setSuccessOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [roomData, setRoomData] = useState({
    name: "",
    description: "",
    pricePerNight: "",
    maxGuests: "",
    roomSize: "",
    averageRating: "",
    reviewCount: "",
    maxBeds: "",
    discountPrice: ""
  });

  const predefinedAmenities = [
    "WiFi",
    "AC",
    "Breakfast",
    "Jacuzzi",
    "Ocean View",
    "Mini Bar",
    "Smart TV",
  ];

  const [amenities, setAmenities] = useState<string[]>([]);
  const [customAmenity, setCustomAmenity] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  /* ------------------ FETCH ROOM DETAILS ------------------ */
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const room = await api.getRoom(roomId);
        setRoomData({
          name: room.name || "",
          description: room.description || "",
          pricePerNight: room.pricePerNight ? room.pricePerNight.toString() : "",
          maxGuests: room.maxGuests ? room.maxGuests.toString() : "",
          roomSize: room.roomSize || "",
          averageRating: room.averageRating ? room.averageRating.toString() : "",
          reviewCount: room.reviewCount ? room.reviewCount.toString() : "",
          maxBeds: room.maxBeds ? room.maxBeds.toString() : "",
          discountPrice: room.discountPrice ? room.discountPrice.toString() : ""
        });
        setAmenities(room.amenities || []);
        setExistingImages(room.images || []);
      } catch (err) {
        console.error(`Failed Error:${err}`);
        alert("Failed to fetch room details");
      }
    };
    fetchRoom();
  }, [roomId]);

  /* ------------------ HANDLERS ------------------ */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRoomData({ ...roomData, [e.target.name]: e.target.value });
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

  const toggleAmenity = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
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

  /* ------------------ SUBMIT ------------------ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries(roomData).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      amenities.forEach((a) => {
        formData.append("amenities", a);
      });

      images.forEach((img) => formData.append("images", img));

      await api.updateRoom(roomId, formData);
      setSuccessOpen(true);
    } catch (err) {
      console.error(err);
      alert("Failed to update room");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async () => {
    try {
      await api.deleteRoom(roomId);
      setDeleteOpen(false);
      navigate("/admin/dashboard");
    } catch (error) {
      console.error(error);
      alert("Failed to delete room");
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <div className="p-6 max-w-5xl animate-admin-fadeIn">
      <h1 className="text-2xl font-bold text-admin-heading mb-1.5">Update Room</h1>
      <p className="text-admin-text text-sm mb-8">
        Update room details, pricing, amenities, and images carefully to maintain an accurate booking experience.
      </p>

      <form onSubmit={handleSubmit} className="bg-admin-card rounded-xl border border-admin-border/50 p-6 md:p-8 space-y-6">
        {/* IMAGES */}
        <div>
          <label className="block text-sm font-medium text-admin-heading mb-1.5">Room Images</label>
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

        {/* ROOM TYPE + PRICE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-admin-heading mb-1.5">Room Type</label>
            <input
              type="text"
              name="name"
              value={roomData.name}
              onChange={handleChange}
              className="w-full bg-admin-surface border border-admin-border text-admin-heading placeholder-admin-text/40 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-vp-gold/40 focus:border-vp-gold/60 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-admin-heading mb-1.5">Price / night ($)</label>
            <input
              type="number"
              name="pricePerNight"
              value={roomData.pricePerNight}
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
            value={roomData.description}
            onChange={handleChange}
            className="w-full bg-admin-surface border border-admin-border text-admin-heading placeholder-admin-text/40 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-vp-gold/40 focus:border-vp-gold/60 transition-colors resize-none"
            required
          />
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

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-admin-heading mb-1.5">Max Guests</label>
            <input
              type="number"
              name="maxGuests"
              value={roomData.maxGuests}
              onChange={handleChange}
              className="w-full bg-admin-surface border border-admin-border text-admin-heading placeholder-admin-text/40 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-vp-gold/40 focus:border-vp-gold/60 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-admin-heading mb-1.5">Room Size</label>
            <input
              type="text"
              name="roomSize"
              value={roomData.roomSize}
              onChange={handleChange}
              className="w-full bg-admin-surface border border-admin-border text-admin-heading placeholder-admin-text/40 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-vp-gold/40 focus:border-vp-gold/60 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-admin-heading mb-1.5">Max Beds</label>
            <input
              type="number"
              name="maxBeds"
              value={roomData.maxBeds}
              onChange={handleChange}
              className="w-full bg-admin-surface border border-admin-border text-admin-heading placeholder-admin-text/40 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-vp-gold/40 focus:border-vp-gold/60 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-admin-heading mb-1.5">Discount Price ($)</label>
            <input
              type="number"
              name="discountPrice"
              value={roomData.discountPrice}
              onChange={handleChange}
              className="w-full bg-admin-surface border border-admin-border text-admin-heading placeholder-admin-text/40 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-vp-gold/40 focus:border-vp-gold/60 transition-colors"
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
            {loading ? "Updating..." : "Update Room"}
          </button>
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-lg px-6 py-3 transition-all font-semibold"
          >
            Delete Room
          </button>
        </div>
      </form>

      {/* SUCCESS MODAL */}
      <SuccessModal
        open={successOpen}
        title="Room Updated Successfully 🎉"
        description={`"${roomData.name}" has been updated and changes are now live.`}
        onClose={() => {
          setSuccessOpen(false);
          navigate("/admin/dashboard");
        }}
      />

      {/* DELETE MODAL */}
      <ConfirmDeleteModal
        open={deleteOpen}
        title="Delete Room"
        description={`Are you sure you want to delete "${roomData.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteRoom}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
};

export default UpdateRoom;
