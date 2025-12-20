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
    <div className="px-4 max-w-5xl">
      <h1 className="text-3xl font-semibold mb-2">Add Banquet</h1>
      <p className="text-gray-500 mb-8">
        Add banquet details carefully to ensure accurate bookings and event
        management.
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
              name="name"
              value={banquetData.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
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

        {/* AMENITIES */}
        <div className="mb-8">
          <label className="block font-medium mb-2">Amenities</label>
          <div className="space-y-2 mb-4">
            {predefinedAmenities.map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={amenities.includes(item)}
                  onChange={() =>
                    toggleItem(item, amenities, setAmenities)
                  }
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
              value={customAmenity}
              onChange={(e) => setCustomAmenity(e.target.value)}
              placeholder="Add custom amenity"
              className="border px-3 py-2 rounded w-full"
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
              className="bg-blue-600 text-white px-4 rounded"
            >
              Add
            </button>
          </div>
        </div>

        {/* EVENTS */}
        <div className="mb-8">
          <label className="block font-medium mb-2">Supported Events</label>
          <div className="space-y-2 mb-4">
            {predefinedEvents.map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={supportedEvents.includes(item)}
                  onChange={() =>
                    toggleItem(item, supportedEvents, setSupportedEvents)
                  }
                />
                {item}
              </label>
            ))}
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
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          {loading ? "Adding..." : "Add Banquet"}
        </button>
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