import React, { useState, useEffect } from "react";
import { admin } from "@/utils/admin";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "@/utils/api";
import { getImageUrl } from "@/utils/images";
import SuccessModal from "@/components/SuccessModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";


const UpdateRoom = () => {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const [successOpen, setSuccessOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  
  const [roomData, setRoomData] = useState({
    name: "",
    description: "",
    pricePerNight: "",
    maxGuests: "",
    roomSize: "",
    averageRating: "",
    reviewCount: "",
    maxBeds: "",
    discountPrice: ""
  });

  const predefinedAmenities = [
    "WiFi",
    "AC",
    "Breakfast",
    "Jacuzzi",
    "Ocean View",
    "Mini Bar",
    "Smart TV",
  ];

  const [amenities, setAmenities] = useState<string[]>([]);
  const [customAmenity, setCustomAmenity] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  /* ------------------ FETCH ROOM DETAILS ------------------ */
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const room = await api.getRoom(roomId); // Implement this API in your admin utils
        setRoomData({
          name: room.name,
          description: room.description,
          pricePerNight: room.pricePerNight,
          maxGuests: room.maxGuests,
          roomSize: room.roomSize,
          averageRating: room.averageRating,
          reviewCount: room.reviewCount,
          maxBeds: room.maxBeds,
          discountPrice: room.discountPrice
        });
        setAmenities(room.amenities || []);
        setExistingImages(room.images || []);
      } catch (err) {
        console.error(`Failed Error:${err}`);
        alert("Failed to fetch room details");
      }
    };
    fetchRoom();
  }, [roomId]);

  /* ------------------ HANDLERS ------------------ */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRoomData({ ...roomData, [e.target.name]: e.target.value });
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

      Object.entries(roomData).forEach(([key, value]) => {
        formData.append(key, value as string);
      });

      // formData.append("amenities", amenities.join(", "));
      /* ✅ SEND MULTIPLE AMENITIES */
      amenities.forEach((a) => {
        formData.append("amenities", a);
      });

      images.forEach((img) => formData.append("images", img));

      await api.updateRoom(roomId, formData); // Implement update API in your admin utils

      setSuccessOpen(true);
      // alert("Room updated successfully!");
      // navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to update room");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async () => {
  try {
    await api.deleteRoom(roomId); // DELETE /api/rooms/:id
    setDeleteOpen(false);
    navigate("/admin/dashboard");
  } catch (error) {
    console.error(error);
    alert("Failed to delete room");
  }
  };

  /* ------------------ UI ------------------ */
  return (
    <div className="px-4 max-w-5xl">
      <h1 className="text-3xl font-semibold mb-2">Update Room</h1>
      <p className="text-gray-500 mb-8">
        Update room details, pricing, amenities, and images carefully to maintain an accurate booking experience.
      </p>

      <form onSubmit={handleSubmit}>
        {/* IMAGES */}
        <div className="mb-8">
          <label className="block font-medium mb-2">Images</label>
          <div className="flex gap-4 items-center mb-4">
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

        {/* ROOM TYPE + PRICE */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm mb-1">Room Type</label>
            <input
              type="text"
              value={roomData.name}
              className="w-full border px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Price / night</label>
            <input
              type="number"
              name="pricePerNight"
              value={roomData.pricePerNight}
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
            value={roomData.description}
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
            <label className="block text-sm mb-1">Max Guests</label>
            <input
              type="number"
              name="maxGuests"
              value={roomData.maxGuests}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Room Size</label>
            <input
              type="text"
              name="roomSize"
              value={roomData.roomSize}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Max Beds</label>
            <input
              type="text"
              name="maxBeds"
              value={roomData.maxBeds}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Discont Price</label>
            <input
              type="text"
              name="discountPrice"
              value={roomData.discountPrice}
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
          {loading ? "Updating..." : "Update Room"}
        </button>
        <button type="button"
          onClick={() => setDeleteOpen(true)}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
        > Delete Room
        </button>
        </div>
      </form>


      <SuccessModal open={successOpen}
        title="Room Updated Successfully 🎉"
        description={`"${roomData.name}" has been updated and changes are now live.`}
        onClose={() => {
        setSuccessOpen(false);
        navigate("/admin/dashboard");
      }}/>

      <ConfirmDeleteModal open={deleteOpen} 
        title="Delete Room"
        description={`Are you sure you want to delete "${roomData.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteRoom}
        onCancel={() => setDeleteOpen(false)}
      />

    </div>
  );
};

export default UpdateRoom;
