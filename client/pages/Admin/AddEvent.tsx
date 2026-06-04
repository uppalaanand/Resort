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
      loadingStatusSetter();
    }
  };

  const loadingStatusSetter = () => {
    setLoading(false);
  };

  /* ------------------ UI ------------------ */
  return (
    <div className="p-6 max-w-5xl animate-admin-fadeIn">
      <h1 className="text-2xl font-bold text-admin-heading mb-1.5">Add Event</h1>
      <p className="text-admin-text text-sm mb-8">
        Fill in the event details carefully to create an amazing experience for your visitors.
      </p>

      <form onSubmit={handleSubmit} className="bg-admin-card rounded-xl border border-admin-border/50 p-6 md:p-8 space-y-6">
        {/* IMAGES */}
        <div>
          <label className="block text-sm font-medium text-admin-heading mb-1.5">Event Images</label>
          <div className="flex flex-wrap gap-4 items-center">
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

        {/* EVENT TITLE */}
        <div>
          <label className="block text-sm font-medium text-admin-heading mb-1.5">Event Title</label>
          <input
            type="text"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            className="w-full bg-admin-surface border border-admin-border text-admin-heading placeholder-admin-text/40 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-vp-gold/40 focus:border-vp-gold/60 transition-colors"
            placeholder="Enter event title"
            required
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium text-admin-heading mb-1.5">Description</label>
          <textarea
            name="description"
            rows={4}
            value={eventData.description}
            onChange={handleChange}
            className="w-full bg-admin-surface border border-admin-border text-admin-heading placeholder-admin-text/40 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-vp-gold/40 focus:border-vp-gold/60 transition-colors resize-none"
            placeholder="Enter event description"
            required
          />
        </div>

        {/* DATES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-admin-heading mb-1.5">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={eventData.startDate}
              onChange={handleChange}
              className="w-full bg-admin-surface border border-admin-border text-admin-heading placeholder-admin-text/40 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-vp-gold/40 focus:border-vp-gold/60 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-admin-heading mb-1.5">End Date</label>
            <input
              type="date"
              name="endDate"
              value={eventData.endDate}
              onChange={handleChange}
              className="w-full bg-admin-surface border border-admin-border text-admin-heading placeholder-admin-text/40 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-vp-gold/40 focus:border-vp-gold/60 transition-colors"
              required
            />
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-4 border-t border-admin-border/30">
          <button
            type="submit"
            disabled={loading}
            className="bg-vp-gold text-vp-dark font-bold hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg px-6 py-3 transition-all shadow-lg shadow-vp-gold/20 w-full md:w-auto"
          >
            {loading ? "Adding..." : "Add Event"}
          </button>
        </div>
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