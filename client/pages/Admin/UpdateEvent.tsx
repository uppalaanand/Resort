import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/utils/api";
import SuccessModal from "@/components/SuccessModal";
import { getImageUrl } from "@/utils/images";

interface EventData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  images: string[];
}

const UpdateEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [eventData, setEventData] = useState<EventData>({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    images: [],
  });

  const [newImages, setNewImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  /* ------------------ FETCH EVENT DETAILS ------------------ */
  const fetchEvent = async () => {
    setLoading(true);
    try {
      const data = await api.getEvent(id!);
      setEventData(data);
    } catch (err) {
      console.error("Failed to fetch event details", err);
      alert("Failed to load event data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  /* ------------------ HANDLERS ------------------ */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages([...newImages, ...Array.from(e.target.files)]);
    }
  };

  const removeExistingImage = (img: string) => {
    setEventData((prev) => ({
      ...prev,
      images: prev.images.filter((i) => i !== img),
    }));
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", eventData.title);
      formData.append("description", eventData.description);
      formData.append("startDate", eventData.startDate);
      formData.append("endDate", eventData.endDate);

      // Append new images
      newImages.forEach((img) => formData.append("images", img));

      await api.updateEvent(id!, formData);

      setSuccessOpen(true);
    } catch (err) {
      console.error(err);
      alert("Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 max-w-5xl">
      <h1 className="text-3xl font-semibold mb-2">Update Event</h1>
      <p className="text-gray-500 mb-8">
        Edit the event details to update the event information visible to users.
      </p>

      <form onSubmit={handleSubmit}>
        {/* EXISTING IMAGES */}
        {eventData.images.length > 0 && (
          <div className="mb-6">
            <label className="block font-medium mb-2">Existing Images</label>
            <div className="flex gap-4 items-center flex-wrap">
              {/* {eventData.images.map((img, i) => (
                <img
                  key={i}
                  src={getImageUrl(img)}
                  alt={`Event Image ${i + 1}`}
                  className="w-24 h-20 object-cover rounded border"
                />
              ))} */}
              {eventData.images.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={getImageUrl(img)}
                    alt={`Event Image ${i + 1}`}
                    className="w-24 h-20 object-cover rounded border"
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
            </div>
          </div>
        )}

        {/* NEW IMAGE UPLOAD */}
        <div className="mb-8">
          <label className="block font-medium mb-2">Add New Images</label>
          <div className="flex gap-4 items-center">
            {/* {newImages.map((img, i) => (
              <img
                key={i}
                src={URL.createObjectURL(img)}
                className="w-24 h-20 object-cover rounded border"
              />
            ))} */}
              {newImages.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={URL.createObjectURL(img)}
                    className="w-24 h-20 object-cover rounded border"
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
          {loading ? "Updating..." : "Update Event"}
        </button>
      </form>

      {/* SUCCESS MODAL */}
      <SuccessModal
        open={successOpen}
        title="Event Updated Successfully 🎉"
        description="The event has been updated and is now visible to users."
        onClose={() => {
          setSuccessOpen(false);
          navigate("/admin/list-events");
        }}
      />
    </div>
  );
};

export default UpdateEvent;