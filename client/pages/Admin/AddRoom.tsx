import React, { useState } from "react";
import { admin } from "@/utils/admin";
import { useNavigate } from "react-router-dom";
import SuccessModal from "@/components/SuccessModal";

const AddRoom = () => {
  const navigate = useNavigate();
  const [successOpen, setSuccessOpen] = useState(false);

  /* ------------------ ROOM DATA (PRE-FILLED) ------------------ */
  const [roomData, setRoomData] = useState({
    name: "Luxury Suite",
    description:
      "Experience the ultimate luxury with panoramic ocean views, a private jacuzzi, and king-sized comfort.",
    pricePerNight: "355",
    maxGuests: "2",
    roomSize: "550 sq ft",
    averageRating: "4.8",
    reviewCount: "10",
    maxBeds: 3,
    discountPrice: 300
  });

  /* ------------------ AMENITIES ------------------ */
  const predefinedAmenities = [
    "WiFi",
    "AC",
    "Breakfast",
    "Jacuzzi",
    "Ocean View",
    "Mini Bar",
    "Smart TV",
  ];

  const [amenities, setAmenities] = useState<string[]>([
    "WiFi",
    "AC",
    "Breakfast",
    "Jacuzzi",
    "Ocean View",
    "Mini Bar",
    "Smart TV",
  ]);

  const [customAmenity, setCustomAmenity] = useState("");

  /* ------------------ IMAGES ------------------ */
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  /* ------------------ HANDLERS ------------------ */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRoomData({ ...roomData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
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

      formData.append("name", roomData.name);
      formData.append("description", roomData.description);
      formData.append("pricePerNight", roomData.pricePerNight);
      formData.append("maxGuests", roomData.maxGuests);
      formData.append("roomSize", roomData.roomSize);
      formData.append("averageRating", roomData.averageRating);
      formData.append("reviewCount", roomData.reviewCount);
      // formData.append("amenities", amenities.join(", "));
      formData.append("maxBeds", roomData.maxBeds);
      formData.append("discountPrice", roomData.discountPrice);

      images.forEach((img) => {
        formData.append("images", img);
      });

      /* ✅ SEND MULTIPLE AMENITIES */
      amenities.forEach((a) => {
        formData.append("amenities", a);
      });

      await admin.uploadRoom(formData);
      setSuccessOpen(true);
      // alert("Room added successfully!");
      // navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to add room");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <div className="px-4 max-w-5xl animate-admin-fadeIn">
      <h1 className="text-2xl font-bold text-admin-heading mb-2">Add Room</h1>
      <p className="text-admin-text text-sm mb-8">
        Fill in the details carefully and accurate room details, pricing, and amenities,
        to enhance the user booking experience.
      </p>

      <form onSubmit={handleSubmit} className="bg-admin-card rounded-xl border border-admin-border/50 p-6 md:p-8 space-y-8">
        {/* IMAGES */}
        <div>
          <label className="block text-sm font-medium text-admin-heading mb-1.5">Images</label>
          <div className="flex gap-4 items-center flex-wrap">
            {images.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={URL.createObjectURL(img)}
                  className="w-20 h-16 object-cover rounded-lg border border-admin-border"
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(i)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
            <label className="w-20 h-16 border-2 border-dashed border-admin-border hover:border-vp-gold/60 rounded-xl bg-admin-surface/50 flex items-center justify-center cursor-pointer transition-colors text-admin-text hover:text-vp-gold">
              +
              <input type="file" multiple hidden onChange={handleImageUpload} />
            </label>
          </div>
        </div>

        <div className="border-t border-admin-border/30 my-6" />

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
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-admin-heading mb-1.5">Price / night</label>
            <input
              type="number"
              name="pricePerNight"
              value={roomData.pricePerNight}
              onChange={handleChange}
              className="w-full bg-admin-surface border border-admin-border text-admin-heading placeholder-admin-text/40 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-vp-gold/40 focus:border-vp-gold/60 transition-colors"
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium text-admin-heading mb-1.5">Description</label>
          <textarea
            name="description"
            rows={3}
            value={roomData.description}
            onChange={handleChange}
            className="w-full bg-admin-surface border border-admin-border text-admin-heading placeholder-admin-text/40 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-vp-gold/40 focus:border-vp-gold/60 transition-colors"
          />
        </div>

        <div className="border-t border-admin-border/30 my-6" />

        {/* AMENITIES */}
        <div>
          <label className="block text-sm font-medium text-admin-heading mb-1.5">Amenities</label>

          <div className="space-y-2 mb-4">
            {predefinedAmenities.map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm text-admin-text cursor-pointer">
                <input
                  type="checkbox"
                  checked={amenities.includes(item)}
                  onChange={() => toggleAmenity(item)}
                  className="accent-vp-gold"
                />
                {item}
              </label>
            ))}
          </div>

          {/* SELECTED AMENITIES */}
          <div className="flex flex-wrap gap-2 mb-3">
            {amenities.map((item) => (
              <div
                key={item}
                className="bg-vp-gold/10 text-vp-gold rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeAmenity(item)}
                  className="text-red-400 hover:text-red-300 font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 max-w-sm">
            <input
              type="text"
              placeholder="Add custom amenity"
              value={customAmenity}
              onChange={(e) => setCustomAmenity(e.target.value)}
              className="w-full bg-admin-surface border border-admin-border text-admin-heading placeholder-admin-text/40 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-vp-gold/40 focus:border-vp-gold/60 transition-colors"
            />
            <button
              type="button"
              onClick={addCustomAmenity}
              className="bg-admin-surface text-admin-text hover:bg-admin-hover border border-admin-border rounded-lg px-4 py-2.5 transition-colors hover:text-vp-gold"
            >
              Add
            </button>
          </div>
        </div>

        <div className="border-t border-admin-border/30 my-6" />

        {/* META */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-admin-heading mb-1.5">Max Guests</label>
            <input
              type="number"
              name="maxGuests"
              value={roomData.maxGuests}
              onChange={handleChange}
              className="w-full bg-admin-surface border border-admin-border text-admin-heading placeholder-admin-text/40 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-vp-gold/40 focus:border-vp-gold/60 transition-colors"
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
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-admin-heading mb-1.5">Max Beds</label>
            <input
              type="text"
              name="maxBeds"
              value={roomData.maxBeds}
              onChange={handleChange}
              className="w-full bg-admin-surface border border-admin-border text-admin-heading placeholder-admin-text/40 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-vp-gold/40 focus:border-vp-gold/60 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-admin-heading mb-1.5">Discount Price (optional)</label>
            <input
              type="text"
              name="discountPrice"
              value={roomData.discountPrice}
              onChange={handleChange}
              className="w-full bg-admin-surface border border-admin-border text-admin-heading placeholder-admin-text/40 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-vp-gold/40 focus:border-vp-gold/60 transition-colors"
            />
          </div>
        </div>

        <div className="border-t border-admin-border/30 my-6" />

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-vp-gold text-vp-dark font-bold hover:bg-amber-400 rounded-lg px-6 py-3 transition-all shadow-lg shadow-vp-gold/20 w-full md:w-auto disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Room"}
          </button>
        </div>
      </form>

      <SuccessModal open={successOpen}
          title="Room Added Successfully 🎉"
          description="The room has been added and is now available for booking."
          onClose={() => {
          setSuccessOpen(false);
          navigate("/admin/dashboard");
      }}/>
    </div>
  );
};

export default AddRoom;