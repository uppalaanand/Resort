import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, ArrowLeft } from "lucide-react";
import { api } from "../../utils/api";
import SuccessModal from "@/components/SuccessModal";

const AddGallery = () => {
  const navigate = useNavigate();
  const [successOpen, setSuccessOpen] = useState(false);

  const [category, setCategory] = useState("events");
  const [alt, setAlt] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const categories = ["rooms", "dining", "events", "surroundings"];

  /* ---------------- IMAGE SELECT ---------------- */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files) return;

  const files: File[] = Array.from(e.target.files);

  setImages(files);
  setPreview(files.map((file) => URL.createObjectURL(file)));
};


  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !alt || images.length === 0) {
      alert("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("category", category);
    formData.append("alt", alt);
    images.forEach((img) => formData.append("images", img));

    try {
      setLoading(true);
      await api.createGallery(formData);
      setSuccessOpen(true);
    //   navigate("/admin/gallery");
    } catch (error) {
      alert("Failed to create gallery");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          Add New Gallery Photo
        </h1>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-md p-6 space-y-6"
      >
        {/* CATEGORY */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* ALT TEXT */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Image Description (Alt Text)
          </label>
          <input
            type="text"
            placeholder="e.g. Beach Party"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* IMAGE UPLOAD */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Upload Image
          </label>

          <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer hover:border-vp-gold transition">
            <Upload className="text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">
              Click to upload image
            </span>
            <input
              type="file"
              accept="image/*"
              multiple={false}
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        {/* IMAGE PREVIEW */}
        {preview.length > 0 && (
          <div>
            <p className="text-sm font-semibold mb-2">Preview</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {preview.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt="Preview"
                  className="h-40 w-full object-cover rounded-lg shadow"
                />
              ))}
            </div>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate("/admin/gallery")}
            className="px-6 py-2 rounded-lg border hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-vp-gold text-vp-dark font-semibold hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Uploading..." : "Create Gallery"}
          </button>
        </div>
      </form>


      <SuccessModal open={successOpen}
          title="Photo Added Successfully 🎉"
          description="The photo has been added and is now it is visible to all."
          onClose={() => {
          setSuccessOpen(false);
          navigate("/admin/dashboard");
      }}/>
    </div>
  );
};

export default AddGallery;
