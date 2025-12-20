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
          name: banquet.name,
          description: banquet.description,
          capacity: banquet.capacity,
          pricePerPlate: banquet.pricePerPlate,
          averageRating: banquet.averageRating,
          reviewCount: banquet.reviewCount,
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

    //   formData.append("amenities", amenities.join(", "));
    //   formData.append("supportedEvents", supportedEvents.join(", "));
    amenities.forEach((item) => { 
        formData.append("amenities", item);
    });

    supportedEvents.forEach((event) => {
        formData.append("supportedEvents", event);
    });


      images.forEach((img) => formData.append("images", img));

      await api.updateBanquet(banquetId, formData);

      setSuccessOpen(true);
    //   alert("Banquet updated successfully!");
    //   navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to update banquet");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async () => {
    try {
      await api.deleteBanquete(banquetId); // DELETE /api/rooms/:id
      setDeleteOpen(false);
      navigate("/admin/dashboard");
    } catch (error) {
      console.error(error);
      alert("Failed to delete room");
    }
    };

  /* ---------------- UI ---------------- */
  return (
    <div className="px-4 max-w-5xl">
      <h1 className="text-3xl font-semibold mb-2">Update Banquet</h1>
      <p className="text-gray-500 mb-8">
        Update banquet details, pricing, capacity, supported events, and
        amenities carefully.
      </p>

      <form onSubmit={handleSubmit}>
        {/* IMAGES */}
        <div className="mb-8">
          <label className="block font-medium mb-2">Images</label>
          <div className="flex gap-4 items-center mb-4 flex-wrap">
            {/* {existingImages.map((img, i) => (
              <img
                key={i}
                src={getImageUrl(img)}
                className="w-20 h-16 object-cover rounded border"
              />
            ))} */}
            {existingImages.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={getImageUrl(img)}
                  className="w-20 h-16 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(img)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            ))}
            {/* {images.map((img, i) => (
              <img
                key={i + existingImages.length}
                src={getImageUrl(img)}
                className="w-20 h-16 object-cover rounded border"
              />
            ))} */}
            {images.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={URL.createObjectURL(img)}
                  className="w-20 h-16 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(i)}
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            ))}
            <label className="w-20 h-16 border border-dashed flex items-center justify-center cursor-pointer">
              +
              <input type="file" multiple hidden onChange={handleImageUpload} />
            </label>
          </div>
        </div>

        {/* NAME + PRICE */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm mb-1">Banquet Name</label>
            <input
              type="text"
              value={banquetData.name}
              disabled
              className="w-full border px-3 py-2 rounded bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Price / Plate</label>
            <input
              type="number"
              name="pricePerPlate"
              value={banquetData.pricePerPlate}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <div className="mb-6">
          <label className="block text-sm mb-1">Description</label>
          <textarea
            name="description"
            rows={3}
            value={banquetData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* SUPPORTED EVENTS */}
        <div className="mb-8">
          <label className="block font-medium mb-2">Supported Events</label>

          <div className="space-y-2 mb-4">
            {predefinedEvents.map((event) => (
              <label key={event} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={supportedEvents.includes(event)}
                  onChange={() => toggleEvent(event)}
                />
                {event}
              </label>
            ))}
          </div>

          {/* SELECTED EVENTS */}
          <div className="flex flex-wrap gap-2 mb-3">
            {supportedEvents.map((event) => (
              <div
                key={event}
                className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                <span>{event}</span>
                <button
                  type="button"
                  onClick={() => removeEvent(event)}
                  className="text-red-500 font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 max-w-sm">
            <input
              type="text"
              placeholder="Add custom event"
              value={customEvent}
              onChange={(e) => setCustomEvent(e.target.value)}
              className="border px-3 py-2 rounded w-full"
            />
            <button
              type="button"
              onClick={addCustomEvent}
              className="bg-blue-600 text-white px-4 rounded"
            >
              Add
            </button>
          </div>
        </div>

        {/* AMENITIES */}
        <div className="mb-8">
          <label className="block font-medium mb-2">Amenities</label>

          <div className="space-y-2 mb-4">
            {predefinedAmenities.map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={amenities.includes(item)}
                  onChange={() => toggleAmenity(item)}
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
                className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                <span>{item}</span>
                <button
                  type="button"
                  onClick={() => removeAmenity(item)}
                  className="text-red-500 font-bold"
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
              className="border px-3 py-2 rounded w-full"
            />
            <button
              type="button"
              onClick={addCustomAmenity}
              className="bg-blue-600 text-white px-4 rounded"
            >
              Add
            </button>
          </div>
        </div>

        {/* META */}
        <div className="grid grid-cols-2 gap-6 mb-10">
          <div>
            <label className="block text-sm mb-1">Capacity</label>
            <input
              type="number"
              name="capacity"
              value={banquetData.capacity}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Average Rating</label>
            <input
              type="number"
              step="0.1"
              name="averageRating"
              value={banquetData.averageRating}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        </div>
        <div className="flex gap-4 mt-8">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          {loading ? "Updating..." : "Update Banquet"}
        </button>
        <button type="button"
          onClick={() => setDeleteOpen(true)}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
        > Delete Banquete
        </button>
        </div>
      </form>


      <SuccessModal open={successOpen}
        title="Banquet Updated Successfully 🎉"
        description={`"${banquetData.name}" has been updated and changes are now live.`}
        onClose={() => {
            setSuccessOpen(false);
            navigate("/admin/dashboard");
        }}/>

        <ConfirmDeleteModal open={deleteOpen} 
            title="Delete Banqute"
            description={`Are you sure you want to delete "${banquetData.name}"? This action cannot be undone.`}
            onConfirm={handleDeleteRoom}
            onCancel={() => setDeleteOpen(false)}
        />
    </div>
  );
};

export default UpdateBanquet;