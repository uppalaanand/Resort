

// import React from 'react';
// import { Link } from 'react-router-dom';

// const Events = () => {
//   return (
//     <div className="pt-20">
//        <div className="relative h-[50vh]">
//          <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80" className="w-full h-full object-cover" alt="Events" />
//          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
//             <h1 className="text-6xl font-serif font-bold text-white text-center">Unforgettable Moments</h1>
//          </div>
//        </div>
//        <div className="max-w-5xl mx-auto px-8 py-20 text-center">
//           <h2 className="text-3xl font-serif font-bold text-vp-dark mb-6">Weddings & Corporate Galas</h2>
//           <p className="text-gray-600 text-lg leading-relaxed mb-10">
//             Whether you are planning an intimate ceremony or a grand celebration, Four Leaf Resort offers the perfect setting. Our dedicated events team will ensure every detail is executed to perfection.
//           </p>
//           <div className="grid md:grid-cols-2 gap-8">
//              <div className="bg-vp-cream p-8 rounded-lg">
//                 <h3 className="font-serif font-bold text-2xl mb-4">Weddings</h3>
//                 <p className="text-gray-500 mb-6">Say "I do" against the backdrop of a golden sunset or within our crystal ballroom.</p>
//                 <Link to="/banquets" className="text-vp-gold font-bold uppercase tracking-widest text-sm hover:text-vp-dark">View Venues</Link>
//              </div>
//              <div className="bg-vp-cream p-8 rounded-lg">
//                 <h3 className="font-serif font-bold text-2xl mb-4">Corporate</h3>
//                 <p className="text-gray-500 mb-6">Inspire your team with a retreat that blends productivity with relaxation.</p>
//                 <Link to="/banquets" className="text-vp-gold font-bold uppercase tracking-widest text-sm hover:text-vp-dark">View Venues</Link>
//              </div>
//           </div>
//        </div>
//     </div>
//   );
// };
// export default Events;



// import React, { useEffect } from "react";
// import "./Home/animation.css";

// const events = [
//   {
//     title: "Destination Weddings",
//     tag: "Nature’s backdrop for your love",
//     description:
//       "Host your dream wedding at Aura Retreat. Exchange vows amidst breathtaking natural beauty with curated luxury experiences.",
//     image:
//       "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200",
//   },
//   {
//     title: "Receptions",
//     tag: "Celebrate love amidst scenic beauty",
//     description:
//       "Our elegant spaces are perfect for joyful receptions filled with laughter, warmth, and unforgettable memories.",
//     image:
//       "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=1200",
//   },
//   {
//     title: "Corporate Events",
//     tag: "Where productivity meets serenity",
//     description:
//       "Elevate your meetings, conferences, and team retreats with state-of-the-art facilities surrounded by calm nature.",
//     image:
//       "https://images.unsplash.com/photo-1503428593586-e225b39bddfe?q=80&w=1200",
//   },
//   {
//     title: "Birthday Celebrations",
//     tag: "Celebrate milestones in style",
//     description:
//       "From intimate gatherings to grand celebrations, Aura Retreat is the perfect destination for birthdays worth remembering.",
//     image:
//       "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1200",
//   },
// ];


// const Events = () => {
//   useEffect(() => {
//     const sections = document.querySelectorAll(".event-section");

//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             entry.target.classList.add("play");
//           }
//         });
//       },
//       { threshold: 0.25 }
//     );

//     sections.forEach((s) => observer.observe(s));
//   }, []);

//   return (
//     <div className="pt-24 bg-vp-cream">
//       {/* Header */}
//       <header className="max-w-5xl mx-auto px-4 text-center mb-24">
//         <p className="text-sm uppercase tracking-widest font-bold text-vp-gold">
//           Events & Experiences
//         </p>
//         <h1 className="mt-3 text-4xl md:text-5xl font-playfair font-bold text-vp-dark">
//           Events that come alive in nature
//         </h1>
//         <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
//           Thoughtfully curated spaces designed for weddings, celebrations,
//           retreats, and unforgettable experiences.
//         </p>
//       </header>

//       {/* Gallery Sections */}
//       {events.map((event, index) => (
//         <section
//           key={index}
//           className={`event-section flex flex-col md:flex-row ${
//             index % 2 !== 0 ? "md:flex-row-reverse" : ""
//           } items-center gap-8 max-w-4xl mx-auto px-6 mb-32`}
//         >
//           {/* Text */}
//           <div className="md:w-1/2 slide-left">
//             <p className="text-xs uppercase tracking-widest font-bold text-vp-gold mb-3">
//               {event.tag}
//             </p>
//             <h2 className="text-3xl md:text-4xl font-playfair font-bold text-vp-dark mb-5">
//               {event.title}
//             </h2>
//             <p className="text-gray-600 leading-relaxed mb-6">
//               {event.description}
//             </p>
//             <button className="border border-vp-dark px-6 py-2 rounded-full text-sm font-bold tracking-wider text-vp-dark hover:bg-vp-dark hover:text-white transition-all">
//               Enquire Now
//             </button>
//           </div>

//           {/* Image */}
//           <div className="md:w-1/2 slide-right">
//             <img
//               src={event.image}
//               alt={event.title}
//               className="w-full h-[260px] md:h-[320px] object-cover rounded-3xl"
//             />
//           </div>
//         </section>
//       ))}
//     </div>
//   );
// };

// export default Events;


import React from "react";
import FullPageEvents from "./Events/FullPageEvents";

const events = [
  {
    tag: "CELEBRATE LOVE AMIDST SCENIC BEAUTY",
    title: "Receptions",
    description:
      "Celebrate love and joy with friends and family at AURA RETREAT. Our versatile spaces provide the ideal backdrop for your reception, ensuring a seamless and memorable event filled with laughter and happiness.",
    image:
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=1200",
  },
  {
    tag: "PRODUCTIVITY MEETS SERENITY IN LUXURY",
    title: "Corporate Events",
    description:
      "Elevate your corporate gatherings at AURA RETREAT. With state-of-the-art facilities and personalized services, our resort offers the perfect setting for productive meetings and memorable events.",
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200",
  },
  {
    tag: "BONDING IN NATURE’S TRANQUIL EMBRACE",
    title: "Private Parties",
    description:
      "From birthday celebrations to intimate gatherings, Aura Retreat offers nature-filled venues that turn moments into unforgettable memories.",
    image:
      "https://images.unsplash.com/photo-1503428593586-e225b39bddfe?q=80&w=1200",
  },
];

const Events = () => {
  return (
    <div className="bg-vp-cream py-20">
      <FullPageEvents />
      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 text-center mb-20 mt-5">
        <p className="text-sm uppercase tracking-widest font-bold text-vp-gold">
          Events & Experiences
        </p>
        <h1 className="mt-3 text-3xl md:text-4xl font-playfair font-bold text-vp-dark">
          Events that come alive in nature
        </h1>
        <p className="mt-4 text-gray-600">
          Thoughtfully curated spaces for celebrations, meetings, and memorable
          experiences at Aura Retreat.
        </p>
      </div>

      {/* Events */}
      <div className="space-y-24">
        {events.map((event, index) => {
          const reverse = index % 2 !== 0;

          return (
            <div
              key={index}
              className={`max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center`}
            >
              {/* TEXT */}
              <div className={`${reverse ? "md:order-2" : ""}`}>
                <p className="text-xs uppercase tracking-widest font-bold text-vp-gold mb-2">
                  {event.tag}
                </p>

                <h2 className="text-2xl md:text-3xl font-playfair font-bold text-vp-dark mb-4">
                  {event.title}
                </h2>

                <p className="text-gray-600 leading-relaxed mb-6">
                  {event.description}
                </p>

                <button className="px-6 py-2 bg-vp-gold text-vp-dark text-sm font-bold tracking-wider rounded hover:bg-vp-dark hover:text-white transition-all">
                  LEARN MORE
                </button>
              </div>

              {/* IMAGE */}
              <div className={`${reverse ? "md:order-1" : ""}`}>
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-[300px] object-cover rounded-md shadow-lg"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Events;