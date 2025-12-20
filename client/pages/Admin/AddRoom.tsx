//original
// import React, { useState } from "react";
// import { admin } from "@/utils/admin";
// import { useAuth } from "../../context/AuthContext";
// import { useNavigate } from "react-router-dom";

// const AddRoom = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const [roomData, setRoomData] = useState({
//     name: "",
//     description: "",
//     pricePerNight: "",
//     maxGuests: "",
//     roomSize: "",
//     amenities: "",
//     averageRating: "",
//     reviewCount: "",
//   });

//   const [images, setImages] = useState<File[]>([]);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e: any) => {
//     setRoomData({ ...roomData, [e.target.name]: e.target.value });
//   };

//   const handleImageUpload = (e: any) => {
//     setImages([...e.target.files]);
//   };

//   const validateForm = () => {
//     if (!roomData.name.trim()) return false;
//     if (!roomData.description.trim()) return false;
//     if (!roomData.pricePerNight || Number(roomData.pricePerNight) <= 0) return false;
//     if (!roomData.maxGuests || Number(roomData.maxGuests) <= 0) return false;
//     if (!roomData.roomSize.trim()) return false;
//     if (!roomData.amenities.trim()) return false;
//     if (!roomData.averageRating || Number(roomData.averageRating) < 0) return false;
//     if (!roomData.reviewCount || Number(roomData.reviewCount) < 0) return false;
//     if (images.length === 0) return false;

//     return true;
//   };

//   const handleSubmit = async (e: any) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       alert("Please fill all fields correctly!");
//       return;
//     }

//     setLoading(true);

//     try {
//       const formData = new FormData();

//       formData.append("name", roomData.name);
//       formData.append("description", roomData.description);
//       formData.append("pricePerNight", roomData.pricePerNight);
//       formData.append("maxGuests", roomData.maxGuests);
//       formData.append("roomSize", roomData.roomSize);
//       formData.append("amenities", roomData.amenities); // comma separated string
//       formData.append("averageRating", roomData.averageRating);
//       formData.append("reviewCount", roomData.reviewCount);

//       images.forEach((img) => {
//         formData.append("images", img);
//       });

//       await admin.uploadRoom(formData);

//       alert("Room Created Successfully!");
//       navigate("/admin");
//     } catch (error) {
//       console.error(error);
//       alert("Failed to create room");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="pt-24 pb-12 max-w-4xl mx-auto px-4">
//       <h1 className="text-3xl font-bold mb-8 text-vp-dark">Add New Room</h1>

//       <form
//         onSubmit={handleSubmit}
//         className="bg-white shadow-2xl p-8 rounded-2xl space-y-8 border border-gray-200"
//       >
//         {/* BASIC INFO */}
//         <div>
//           <h2 className="text-xl font-bold text-vp-dark mb-4">Basic Information</h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <label className="block text-sm font-semibold mb-1">Room Name</label>
//               <input
//                 type="text"
//                 name="name"
//                 required
//                 className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-vp-gold"
//                 value={roomData.name}
//                 onChange={handleChange}
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold mb-1">Price / Night (₹)</label>
//               <input
//                 type="number"
//                 name="pricePerNight"
//                 required
//                 className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-vp-gold"
//                 value={roomData.pricePerNight}
//                 onChange={handleChange}
//                 min="1"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold mb-1">Max Guests</label>
//               <input
//                 type="number"
//                 name="maxGuests"
//                 required
//                 className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-vp-gold"
//                 value={roomData.maxGuests}
//                 onChange={handleChange}
//                 min="1"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold mb-1">Room Size</label>
//               <input
//                 type="text"
//                 name="roomSize"
//                 placeholder="e.g., 550 sq ft"
//                 required
//                 className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-vp-gold"
//                 value={roomData.roomSize}
//                 onChange={handleChange}
//               />
//             </div>
//           </div>
//         </div>

//         {/* DESCRIPTION */}
//         <div>
//           <label className="block text-sm font-semibold mb-1">Description</label>
//           <textarea
//             name="description"
//             required
//             className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-vp-gold"
//             rows={3}
//             value={roomData.description}
//             onChange={handleChange}
//           ></textarea>
//         </div>

//         {/* AMENITIES */}
//         <div>
//           <label className="block text-sm font-semibold mb-1">Amenities</label>
//           <input
//             type="text"
//             name="amenities"
//             placeholder="WiFi, AC, Breakfast, Jacuzzi"
//             required
//             className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-vp-gold"
//             value={roomData.amenities}
//             onChange={handleChange}
//           />
//         </div>

//         {/* RATING SECTION */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-sm font-semibold mb-1">Average Rating</label>
//             <input
//               type="number"
//               name="averageRating"
//               step="0.1"
//               min="0"
//               max="5"
//               required
//               className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-vp-gold"
//               value={roomData.averageRating}
//               onChange={handleChange}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-semibold mb-1">Review Count</label>
//             <input
//               type="number"
//               name="reviewCount"
//               min="0"
//               required
//               className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-vp-gold"
//               value={roomData.reviewCount}
//               onChange={handleChange}
//             />
//           </div>
//         </div>

//         {/* IMAGE UPLOAD */}
//         <div>
//           <label className="block text-sm font-semibold mb-1">Upload Images</label>
//           <input
//             type="file"
//             multiple
//             accept="image/*"
//             onChange={handleImageUpload}
//             className="w-full border border-gray-300 px-3 py-2 rounded-lg bg-gray-50"
//           />
//         </div>

//         {/* SUBMIT BUTTON */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-vp-dark text-white px-8 py-3 w-full rounded-xl font-bold uppercase tracking-wide hover:bg-black transition"
//         >
//           {loading ? "Creating..." : "Create Room"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddRoom;


import React, { useState } from "react";
import { admin } from "@/utils/admin";
import { useNavigate } from "react-router-dom";
import SuccessModal from "@/components/SuccessModal";

const AddRoom = () => {
  const navigate = useNavigate();
  const [successOpen, setSuccessOpen] = useState(false);

  /* ------------------ ROOM DATA (PRE-FILLED) ------------------ */
  const [roomData, setRoomData] = useState({
    name: "Luxury Suite",
    description:
      "Experience the ultimate luxury with panoramic ocean views, a private jacuzzi, and king-sized comfort.",
    pricePerNight: "355",
    maxGuests: "2",
    roomSize: "550 sq ft",
    averageRating: "4.8",
    reviewCount: "10",
    maxBeds: 3,
    discountPrice: 300
  });

  /* ------------------ AMENITIES ------------------ */
  const predefinedAmenities = [
    "WiFi",
    "AC",
    "Breakfast",
    "Jacuzzi",
    "Ocean View",
    "Mini Bar",
    "Smart TV",
  ];

  const [amenities, setAmenities] = useState<string[]>([
    "WiFi",
    "AC",
    "Breakfast",
    "Jacuzzi",
    "Ocean View",
    "Mini Bar",
    "Smart TV",
  ]);

  const [customAmenity, setCustomAmenity] = useState("");

  /* ------------------ IMAGES ------------------ */
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  /* ------------------ HANDLERS ------------------ */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRoomData({ ...roomData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]);
    }
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

      formData.append("name", roomData.name);
      formData.append("description", roomData.description);
      formData.append("pricePerNight", roomData.pricePerNight);
      formData.append("maxGuests", roomData.maxGuests);
      formData.append("roomSize", roomData.roomSize);
      formData.append("averageRating", roomData.averageRating);
      formData.append("reviewCount", roomData.reviewCount);
      // formData.append("amenities", amenities.join(", "));
      formData.append("maxBeds", roomData.maxBeds);
      formData.append("discountPrice", roomData.discountPrice);

      images.forEach((img) => {
        formData.append("images", img);
      });

      /* ✅ SEND MULTIPLE AMENITIES */
      amenities.forEach((a) => {
        formData.append("amenities", a);
      });

      await admin.uploadRoom(formData);
      setSuccessOpen(true);
      // alert("Room added successfully!");
      // navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to add room");
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <div className="px-4 max-w-5xl">
      <h1 className="text-3xl font-semibold mb-2">Add Room</h1>
      <p className="text-gray-500 mb-8">
        Fill in the details carefully and accurate room details, pricing, and amenities,
        to enhance the user booking experience.
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
        {/* ROOM TYPE + PRICE */}
        <div className="grid grid-cols-2 gap-6 mb-">
          <div>
            <label className="block text-sm mb-1">Room Type</label>
            <input
              type="text"
              value="Luxury Suite"
              className="w-full border px-3 py-2 rounded bg-gray-50"
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
            <label className="block text-sm mb-1">Discount Price(optional)</label>
            <input
              type="text"
              name="discountPrice"
              value={roomData.discountPrice}
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
          {loading ? "Adding..." : "Add Room"}
        </button>
      </form>

      <SuccessModal open={successOpen}
          title="Room Added Successfully 🎉"
          description="The room has been added and is now available for booking."
          onClose={() => {
          setSuccessOpen(false);
          navigate("/admin/dashboard");
      }}/>
    </div>
  );
};

export default AddRoom;