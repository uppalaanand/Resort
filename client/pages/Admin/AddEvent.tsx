import React, { useState } from "react";
import { admin } from "@/utils/admin";
import { useNavigate } from "react-router-dom";
import SuccessModal from "@/components/SuccessModal";

const AddEvent = () => {
  const navigate = useNavigate();
  const [successOpen, setSuccessOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ------------------ EVENT DATA ------------------ */
  const [eventData, setEventData] = useState({
    title: "Dhandiya",
    description: "Celebrate in resort",
    startDate: "2025-12-10",
    endDate: "2026-01-15",
  });

  /* ------------------ IMAGES ------------------ */
  const [images, setImages] = useState<File[]>([]);

  /* ------------------ HANDLERS ------------------ */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
  };

  const removeNewImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* ------------------ SUBMIT ------------------ */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("title", eventData.title);
      formData.append("description", eventData.description);
      formData.append("startDate", eventData.startDate);
      formData.append("endDate", eventData.endDate);

      // Append each image with name 'images'
      images.forEach((img) => {
        formData.append("images", img);
      });

      await admin.uploadEvent(formData);
      setSuccessOpen(true);
    } catch (err) {
      console.error(err);
      alert("Failed to add event");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <div className="px-4 max-w-5xl">
      <h1 className="text-3xl font-semibold mb-2">Add Event</h1>
      <p className="text-gray-500 mb-8">
        Fill in the event details carefully to create an amazing experience for your visitors.
      </p>

      <form onSubmit={handleSubmit}>
        {/* IMAGES */}
        <div className="mb-8">
          <label className="block font-medium mb-2">Images</label>
          <div className="flex gap-4 items-center">
            {/* {images.map((img, i) => (
              <img
                key={i}
                src={URL.createObjectURL(img)}
                className="w-24 h-20 object-cover rounded border"
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
            <label className="w-24 h-20 border border-dashed flex items-center justify-center cursor-pointer">
              +
              <input type="file" multiple hidden onChange={handleImageUpload} />
            </label>
          </div>
        </div>

        {/* EVENT TITLE */}
        <div className="mb-6">
          <label className="block text-sm mb-1">Event Title</label>
          <input
            type="text"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter event title"
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div className="mb-6">
          <label className="block text-sm mb-1">Description</label>
          <textarea
            name="description"
            rows={3}
            value={eventData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter event description"
            required
          />
        </div>

        {/* DATES */}
        <div className="grid grid-cols-2 gap-6 mb-10">
          <div>
            <label className="block text-sm mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={eventData.startDate}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={eventData.endDate}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          {loading ? "Adding..." : "Add Event"}
        </button>
      </form>

      {/* SUCCESS MODAL */}
      <SuccessModal
        open={successOpen}
        title="Event Added Successfully 🎉"
        description="The event has been added and is now visible to users."
        onClose={() => {
          setSuccessOpen(false);
          navigate("/admin/dashboard");
        }}
      />
    </div>
  );
};

export default AddEvent;