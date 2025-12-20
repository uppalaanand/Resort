// import { useEffect, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Pagination } from "swiper/modules";

// import "swiper/css";
// import "swiper/css/pagination";
// import { getImageUrl } from "@/utils/images";

// const API_URL = "http://localhost:5000/api/events";

// const getStatus = (startDate, endDate) => {
//   const now = new Date();
//   const start = new Date(startDate);
//   const end = new Date(endDate);

//   if (start <= now && end >= now) return "ONGOING";
//   if (start > now) return "UPCOMING";
//   return "COMPLETED";
// };

// const statusColor = {
//   ONGOING: "bg-green-600",
//   UPCOMING: "bg-blue-600",
//   COMPLETED: "bg-gray-600",
// };

// export default function FullPageEvents() {
//   const [events, setEvents] = useState([]);

//   useEffect(() => {
//     fetch(API_URL)
//       .then((res) => res.json())
//       .then((data) => setEvents(data));
//   }, []);

//   return (
//     <section className="h-screen w-full">
//       <Swiper
//         modules={[Autoplay, Pagination]}
//         pagination={{ clickable: true }}
//         autoplay={{ delay: 5000 }}
//         loop
//         className="h-full"
//       >
//         {events.map((event) => {
//           const status = getStatus(event.startDate, event.endDate);

//           return (
//             <SwiperSlide key={event._id}>
//               <div
//                 className="relative h-screen w-full flex items-center justify-center"
//                 style={{
//                   backgroundImage: `url(${getImageUrl(event.images[0])})`,
//                   backgroundSize: "cover",
//                   backgroundPosition: "center",
//                 }}
//               >
//                 {/* Overlay */}
//                 <div className="absolute inset-0 bg-black/60" />

//                 {/* Content */}
//                 <div className="relative z-10 max-w-3xl text-center text-white px-6">
//                   <span
//                     className={`inline-block mb-4 px-4 py-1 text-xs tracking-widest font-bold rounded ${statusColor[status]}`}
//                   >
//                     {status}
//                   </span>

//                   <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold mb-6">
//                     {event.title}
//                   </h1>

//                   <p className="text-lg text-gray-200 mb-6 leading-relaxed">
//                     {event.description}
//                   </p>

//                   <p className="text-sm text-gray-300">
//                     {new Date(event.startDate).toDateString()} –{" "}
//                     {new Date(event.endDate).toDateString()}
//                   </p>
//                 </div>
//               </div>
//             </SwiperSlide>
//           );
//         })}
//       </Swiper>
//     </section>
//   );
// }

// import { useEffect, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Autoplay, Navigation, Pagination } from "swiper/modules";

// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import { getImageUrl } from "@/utils/images";

// const API_URL = "http://localhost:5000/api/events";

// const getStatus = (startDate, endDate) => {
//   const now = new Date();
//   const start = new Date(startDate);
//   const end = new Date(endDate);

//   if (start <= now && end >= now) return "ONGOING";
//   if (start > now) return "UPCOMING";
//   return "COMPLETED";
// };

// const statusColor = {
//   ONGOING: "bg-green-600",
//   UPCOMING: "bg-blue-600",
//   COMPLETED: "bg-gray-600",
// };

// export default function FullPageEvents() {
//   const [events, setEvents] = useState([]);

//   useEffect(() => {
//     fetch(API_URL)
//       .then((res) => res.json())
//       .then((data) => setEvents(data));
//   }, []);

//   return (
//     <section className="h-screen w-full relative">
//       <Swiper
//         modules={[Autoplay, Navigation, Pagination]}
//         navigation
//         pagination={{ clickable: true }}
//         autoplay={{ delay: 5000 }}
//         loop
//         className="h-full"
//       >
//         {events.map((event) => {
//           const status = getStatus(event.startDate, event.endDate);

//           return (
//             <SwiperSlide key={event._id}>
//               <div
//                 className="relative h-screen w-full flex items-center justify-center"
//                 style={{
//                   backgroundImage: `url(${getImageUrl(event.images[0])})`,
//                   backgroundSize: "cover",
//                   backgroundPosition: "center",
//                 }}
//               >
//                 {/* Overlay */}
//                 <div className="absolute inset-0 bg-black/60" />

//                 {/* Content */}
//                 <div className="relative z-10 max-w-3xl text-center text-white px-6">
//                   <span
//                     className={`inline-block mb-4 px-4 py-1 text-xs tracking-widest font-bold rounded ${statusColor[status]}`}
//                   >
//                     {status}
//                   </span>

//                   <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold mb-6">
//                     {event.title}
//                   </h1>

//                   <p className="text-lg text-gray-200 mb-6 leading-relaxed">
//                     {event.description}
//                   </p>

//                   <p className="text-sm text-gray-300">
//                     {new Date(event.startDate).toDateString()} –{" "}
//                     {new Date(event.endDate).toDateString()}
//                   </p>
//                 </div>
//               </div>
//             </SwiperSlide>
//           );
//         })}
//       </Swiper>
//     </section>
//   );
// }


import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import { PrevArrow, NextArrow } from "./SliderArrows";
import { api } from "@/utils/api";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { getImageUrl } from "@/utils/images";

const getStatus = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start <= now && end >= now) return "ONGOING";
  if (start > now) return "UPCOMING";
  return "COMPLETED";
};

export default function FullPageEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
  const fetchEvents = async () => {
    try {
      const data = await api.getEvents();
      setEvents(data);
    } catch (error) {
      console.error("Failed to load events", error);
    } finally {
      setLoading(false);
    }
  };

  fetchEvents();
}, []);

  const statusColors = {
  ONGOING: "bg-green-600 text-white",
  UPCOMING: "bg-blue-600 text-white",
  COMPLETED: "bg-gray-600 text-white",
};

  return (
    <section className="relative h-[70vh] w-full overflow-hidden">
      {/* Custom Arrows */}
      <PrevArrow />
      <NextArrow />

      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        navigation={{
          prevEl: ".custom-prev",
          nextEl: ".custom-next",
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop
        className="h-full"
      >
        {events.map((event) => {
          const status = getStatus(event.startDate, event.endDate);

          return (
            <SwiperSlide key={event._id}>
              <div
                className="relative h-[70vh] w-full flex items-center justify-center"
                style={{
                  backgroundImage: `url(${getImageUrl(event.images[0])})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60" />

                {/* Content */}
                <div className="relative z-10 max-w-3xl text-center text-white px-6">
                  <span className={`inline-block mb-4 px-4 py-1 text-xs font-bold tracking-widest rounded ${statusColors[status]}`}>
                    {status}
                </span>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold mb-6">
                    {event.title}
                  </h1>

                  <p className="text-lg text-gray-200 mb-6">
                    {event.description}
                  </p>

                  <p className="text-sm text-gray-300">
                    {new Date(event.startDate).toDateString()} –{" "}
                    {new Date(event.endDate).toDateString()}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}