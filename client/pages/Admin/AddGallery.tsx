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
    } catch (error) {
      alert("Failed to create gallery");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto animate-admin-fadeIn">
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg bg-admin-surface hover:bg-admin-hover text-admin-text border border-admin-border transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-admin-heading">
          Add New Gallery Photo
        </h1>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-admin-card rounded-xl border border-admin-border/50 p-6 md:p-8 space-y-6"
      >
        {/* CATEGORY */}
        <div>
          <label className="block text-sm font-medium text-admin-heading mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-admin-surface border border-admin-border text-admin-heading rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-vp-gold/40 focus:border-vp-gold/60 transition-colors"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-admin-surface text-admin-heading">
                {cat.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        {/* ALT TEXT */}
        <div>
          <label className="block text-sm font-medium text-admin-heading mb-1.5">
            Image Description (Alt Text)
          </label>
          <input
            type="text"
            placeholder="e.g. Beach Party"
            value={alt}
            onChange={(e) => setAlt(e.target.value)}
            className="w-full bg-admin-surface border border-admin-border text-admin-heading placeholder-admin-text/40 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-vp-gold/40 focus:border-vp-gold/60 transition-colors"
            required
          />
        </div>

        {/* IMAGE UPLOAD */}
        <div>
          <label className="block text-sm font-medium text-admin-heading mb-1.5">
            Upload Image
          </label>

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-admin-border hover:border-vp-gold/60 rounded-xl p-8 cursor-pointer bg-admin-surface/50 transition-colors text-admin-text hover:text-vp-gold group">
            <Upload className="text-admin-text/60 group-hover:text-vp-gold mb-2 transition-colors" size={24} />
            <span className="text-sm font-medium">
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
            <p className="text-sm font-medium text-admin-heading mb-2">Preview</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {preview.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt="Preview"
                  className="h-40 w-full object-cover rounded-lg border border-admin-border shadow-md"
                />
              ))}
            </div>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex justify-end gap-4 pt-4 border-t border-admin-border/30">
          <button
            type="button"
            onClick={() => navigate("/admin/gallery")}
            className="px-6 py-2 rounded-lg border border-admin-border bg-admin-surface text-admin-text hover:bg-admin-hover transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-vp-gold text-vp-dark font-semibold hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-vp-gold/20"
          >
            {loading ? "Uploading..." : "Create Gallery"}
          </button>
        </div>
      </form>

      <SuccessModal
        open={successOpen}
        title="Photo Added Successfully 🎉"
        description="The photo has been added and is now visible to all."
        onClose={() => {
          setSuccessOpen(false);
          navigate("/admin/dashboard");
        }}
      />
    </div>
  );
};

export default AddGallery;
