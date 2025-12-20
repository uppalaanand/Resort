import React, { useState } from "react";
import { admin } from "@/utils/admin";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AddBanquet = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [banquetData, setBanquetData] = useState({
    name: "Sunset Terrace",
    description:
      "An open-air venue overlooking the horizon. Ideal for cocktail parties and intimate receptions.",
    capacity: "150",
    pricePerPlate: "60",
    supportedEvents: "Cocktail, Reception",
    amenities: "Bar, Music System, Outdoor, Heaters",
  });

  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setBanquetData({ ...banquetData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: any) => {
    setImages([...e.target.files]);
  };

  const validateForm = () => {
    if (!banquetData.name.trim()) return false;
    if (!banquetData.description.trim()) return false;
    if (!banquetData.capacity || Number(banquetData.capacity) <= 0) return false;
    if (!banquetData.pricePerPlate || Number(banquetData.pricePerPlate) <= 0)
      return false;
    if (!banquetData.supportedEvents.trim()) return false;
    if (!banquetData.amenities.trim()) return false;

    if (images.length === 0) return false;

    return true;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fill all fields correctly!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", banquetData.name);
      formData.append("description", banquetData.description);
      formData.append("capacity", banquetData.capacity);
      formData.append("pricePerPlate", banquetData.pricePerPlate);
      formData.append("supportedEvents", banquetData.supportedEvents); // comma separated string
      formData.append("amenities", banquetData.amenities); // comma separated

      images.forEach((img) => {
        formData.append("images", img);
      });

      await admin.uploadBanquete(formData);

      alert("Banquet Created Successfully!");
      navigate("/admin");
    } catch (error) {
      console.error(error);
      alert("Failed to create banquet");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-12 max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8 text-vp-dark">Add New Banquet</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl p-8 rounded-2xl space-y-8 border border-gray-200"
      >
        {/* BASIC INFO */}
        <div>
          <h2 className="text-xl font-bold text-vp-dark mb-4">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-1">Banquet Name</label>
              <input
                type="text"
                name="name"
                required
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-vp-gold"
                value={banquetData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Capacity</label>
              <input
                type="number"
                name="capacity"
                required
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-vp-gold"
                value={banquetData.capacity}
                onChange={handleChange}
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-1">Price Per Plate (₹)</label>
              <input
                type="number"
                name="pricePerPlate"
                required
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-vp-gold"
                value={banquetData.pricePerPlate}
                onChange={handleChange}
                min="1"
              />
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-semibold mb-1">Description</label>
          <textarea
            name="description"
            required
            className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-vp-gold"
            rows={3}
            value={banquetData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* SUPPORTED EVENTS */}
        <div>
          <label className="block text-sm font-semibold mb-1">Supported Events</label>
          <input
            type="text"
            name="supportedEvents"
            placeholder="Cocktail, Reception"
            required
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-vp-gold"
            value={banquetData.supportedEvents}
            onChange={handleChange}
          />
        </div>

        {/* AMENITIES */}
        <div>
          <label className="block text-sm font-semibold mb-1">Amenities</label>
          <input
            type="text"
            name="amenities"
            placeholder="Bar, Music System, Outdoor, Heaters"
            required
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-vp-gold"
            value={banquetData.amenities}
            onChange={handleChange}
          />
        </div>

        {/* IMAGE UPLOAD */}
        <div>
          <label className="block text-sm font-semibold mb-1">Upload Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-gray-50"
          />
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="bg-vp-dark text-white px-8 py-3 w-full rounded-xl font-bold uppercase tracking-wide hover:bg-black transition"
        >
          {loading ? "Creating..." : "Create Banquet"}
        </button>
      </form>
    </div>
  );
};

export default AddBanquet;