import React, { useState } from "react";
import { admin } from "@/utils/admin";
import { useNavigate } from "react-router-dom";
import SuccessModal from "@/components/SuccessModal";

const AddBanquete = () => {
  const navigate = useNavigate();
  const [successOpen, setSuccessOpen] = useState(false);

  /* ------------------ BANQUET DATA ------------------ */
  const [banquetData, setBanquetData] = useState({
    name: "4 BHK Private Villa",
    description:
      "An exclusive 4-bedroom villa with a private pool, perfect for intimate gatherings, bachelor parties, or a luxury family staycation.",
    capacity: "1200",
    pricePerPlate: "20",
    averageRating: "5.0",
    reviewCount: "12",
  });

  /* ------------------ AMENITIES ------------------ */
  const predefinedAmenities = [
    "Private Pool",
    "Kitchen",
    "BBQ Grill",
    "DJ Setup",
    "Stage",
  ];

  const [amenities, setAmenities] = useState<string[]>([
    "Private Pool",
    "Kitchen",
    "BBQ Grill",
  ]);

  const [customAmenity, setCustomAmenity] = useState("");

  /* ------------------ SUPPORTED EVENTS ------------------ */
  const predefinedEvents = [
    "Private Party",
    "Staycation",
    "Reception",
    "Concert",
  ];

  const [supportedEvents, setSupportedEvents] = useState<string[]>([
    "Private Party",
    "Staycation",
  ]);

  const [customEvent, setCustomEvent] = useState("");

  /* ------------------ IMAGES ------------------ */
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  /* ------------------ HANDLERS ------------------ */
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

  const removeNewImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleItem = (
    item: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const addCustomItem = (
    value: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    clear: () => void
  ) => {
    if (value.trim() && !list.includes(value.trim())) {
      setList([...list, value.trim()]);
      clear();
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

      formData.append("name", banquetData.name);
      formData.append("description", banquetData.description);
      formData.append("capacity", banquetData.capacity);
      // formData.append("pricePerPlate", banquetData.pricePerPlate);
      formData.append("averageRating", banquetData.averageRating);
      formData.append("reviewCount", banquetData.reviewCount);
      formData.append("isActive", "true");

      /* ✅ SEND MULTIPLE AMENITIES */
      amenities.forEach((a) => {
        formData.append("amenities", a);
      });

      /* ✅ SEND MULTIPLE SUPPORTED EVENTS */
      supportedEvents.forEach((e) => {
        formData.append("supportedEvents", e);
      });

      images.forEach((img) => {
        formData.append("images", img);
      });

      await admin.uploadBanquete(formData);
      setSuccessOpen(true);
    //   alert("Banquet added successfully!");
    //   navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to add banquet");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <div className="px-4 max-w-5xl animate-admin-fadeIn">
      <h1 className="text-2xl font-bold text-admin-heading mb-2">Add Banquet</h1>
      <p className="text-admin-text text-sm mb-8">
        Add banquet details carefully to ensure accurate bookings and event
        management.
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

        {/* NAME + PRICE */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-admin-heading mb-1.5">Banquet Name</label>
            <input
              name="name"
              value={banquetData.name}
              onChange={handleChange}
              className="w-full bg-admin-surface border border-admin-border text-admin-heading placeholder-admin-text/40 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-vp-gold/40 focus:border-vp-gold/60 transition-colors"
            />
          </div>
          {/* <div>
            <label className="block text-sm mb-1">Price / Plate</label>
            <input
              type="number"
              name="pricePerPlate"
              value={banquetData.pricePerPlate}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div> */}
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-medium text-admin-heading mb-1.5">Description</label>
          <textarea
            name="description"
            rows={3}
            value={banquetData.description}
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
                  onChange={() =>
                    toggleItem(item, amenities, setAmenities)
                  }
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
              value={customAmenity}
              onChange={(e) => setCustomAmenity(e.target.value)}
              placeholder="Add custom amenity"
              className="w-full bg-admin-surface border border-admin-border text-admin-heading placeholder-admin-text/40 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-vp-gold/40 focus:border-vp-gold/60 transition-colors"
            />
            <button
              type="button"
              onClick={() =>
                addCustomItem(
                  customAmenity,
                  amenities,
                  setAmenities,
                  () => setCustomAmenity("")
                )
              }
              className="bg-admin-surface text-admin-text hover:bg-admin-hover border border-admin-border rounded-lg px-4 py-2.5 transition-colors hover:text-vp-gold"
            >
              Add
            </button>
          </div>
        </div>

        <div className="border-t border-admin-border/30 my-6" />

        {/* EVENTS */}
        <div>
          <label className="block text-sm font-medium text-admin-heading mb-1.5">Supported Events</label>
          <div className="space-y-2 mb-4">
            {predefinedEvents.map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm text-admin-text cursor-pointer">
                <input
                  type="checkbox"
                  checked={supportedEvents.includes(item)}
                  onChange={() =>
                    toggleItem(item, supportedEvents, setSupportedEvents)
                  }
                  className="accent-vp-gold"
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-admin-border/30 my-6" />

        {/* META */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-admin-heading mb-1.5">Capacity</label>
            <input
              type="number"
              name="capacity"
              value={banquetData.capacity}
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
            {loading ? "Adding..." : "Add Banquet"}
          </button>
        </div>
      </form>


      <SuccessModal open={successOpen}
          title="Banqute Added Successfully 🎉"
          description="The banquete has been added and is now available for booking."
          onClose={() => {
          setSuccessOpen(false);
          navigate("/admin/dashboard");
      }}/>
    </div>
  );
};

export default AddBanquete;