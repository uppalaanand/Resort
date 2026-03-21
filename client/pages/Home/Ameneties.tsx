// import React from 'react'
// import { Trees, FlameKindling, UtensilsCrossed, CookingPot, Wifi } from "lucide-react";
// import "../../animation.css";

// const amenities = [
//   {
//     id: 1,
//     icon: <Wifi className="w-12 h-12 mb-4 text-gray-900" />,
//     title: "High-Speed WiFi",
//     desc: "Enjoy seamless high-speed internet access throughout the property during your stay.",
//   },
//   {
//     id: 2,
//     icon: <FlameKindling className="w-12 h-12 mb-4 text-gray-900" />,
//     title: "Barbeque Spot",
//     desc: "Experience a cozy barbeque night with dedicated space and essential BBQ equipment.",
//   },
//   {
//     id: 3,
//     icon: <CookingPot className="w-12 h-12 mb-4 text-gray-900" />,
//     title: "Nation Kitchen / BBQ Grill",
//     desc: "Access our shared kitchen area with BBQ grill setup for groups & families.",
//   },
//   {
//     id: 4,
//     icon: <Trees className="w-12 h-12 mb-4 text-gray-900" />,
//     title: "Garden & Lawn Area",
//     desc: "Relax in our beautifully maintained lawn and enjoy peaceful outdoor moments.",
//   },
//   {
//     id: 5,
//     icon: <UtensilsCrossed className="w-12 h-12 mb-4 text-gray-900" />,
//     title: "Outdoor Dining",
//     desc: "Enjoy delicious meals in our peaceful open-air dining space surrounded by nature.",
//   }
// ];


// const Ameneties = () => {
//     return (
//       <section className="py-20 bg-white block">
//   <div className="max-w-6xl mx-auto px-6 block">

//     {/* Heading */}
//     <h2 className="text-4xl font-serif font-bold text-vp-dark mb-6 text-center">
//       Amenities We Provide
//     </h2>

//     <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
//       Experience premium comfort with our carefully curated amenities, designed to enhance your stay
//       and make every moment memorable.
//     </p>

//     {/* Grid */}
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//       {amenities.map((item) => (
//         <div
//           key={item.id}
//           className="border rounded-xl p-8 bg-white shadow-sm hover:shadow-md transition"
//         >
//           {item.icon}
//           <h3 className="text-xl font-medium mb-2 text-gray-900">{item.title}</h3>
//           <p className="text-gray-600">{item.desc}</p>
//         </div>
//       ))}
//     </div>

//   </div>
// </section>
//     )
// }

// export default Ameneties;


import { useEffect } from "react";
import {
  Trees,
  FlameKindling,
  UtensilsCrossed,
  CookingPot,
  Wifi,
} from "lucide-react";
import "./animation.css"; // make sure this is imported

const amenities = [
  {
    id: 1,
    icon: <Wifi className="w-12 h-12 mb-4 text-gray-900" />,
    title: "High-Speed WiFi",
    desc: "Enjoy seamless high-speed internet access throughout the property during your stay.",
  },
  {
    id: 2,
    icon: <FlameKindling className="w-12 h-12 mb-4 text-gray-900" />,
    title: "Barbeque Spot",
    desc: "Experience a cozy barbeque night with dedicated space and essential BBQ equipment.",
  },
  {
    id: 3,
    icon: <CookingPot className="w-12 h-12 mb-4 text-gray-900" />,
    title: "Nation Kitchen / BBQ Grill",
    desc: "Access our shared kitchen area with BBQ grill setup for groups & families.",
  },
  {
    id: 4,
    icon: <Trees className="w-12 h-12 mb-4 text-gray-900" />,
    title: "Garden & Lawn Area",
    desc: "Relax in our beautifully maintained lawn and enjoy peaceful outdoor moments.",
  },
  {
    id: 5,
    icon: <UtensilsCrossed className="w-12 h-12 mb-4 text-gray-900" />,
    title: "Outdoor Dining",
    desc: "Enjoy delicious meals in our peaceful open-air dining space surrounded by nature.",
  },
];

const Amenities = () => {
  // ---- Manual Animation Trigger ----
  useEffect(() => {
    const items = document.querySelectorAll(".service-card");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("play");
          }
        });
      },
      { threshold: 0.2 }
    );

    items.forEach((item) => observer.observe(item));
  }, []);

  return (
    /* semantic region + link to heading for accessibility */
    <section
      className="py-20 bg-white md:py-24 bg-vp-cream"
      role="region"
      aria-labelledby="amenities-heading"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <h2
          id="amenities-heading"
          className="text-4xl font-serif font-bold text-vp-dark mb-6 text-center"
        >
          Amenities We Provide
        </h2>

        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Experience premium comfort with our carefully curated amenities.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {amenities.map((item) => (
            <div
              key={item.id}
              className={
                /* keep original classes and append design system utilities */
                "service-card border rounded-xl p-8 bg-white shadow-sm hover:shadow-md transition " +
                "group transform-gpu will-change-transform hover:-translate-y-1 focus:-translate-y-1 " +
                "duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-vp-gold " +
                "border-gray-100 rounded-2xl"
              }
              role="article"
              tabIndex={0}
              aria-labelledby={`amenity-title-${item.id}`}
            >
              {/* clone the icon to apply brand color and preserve original sizing */}
              {/*
                We append text-vp-gold to the icon while preserving its original classes.
                This uses React.cloneElement in-place via JSX expression.
              */}
              {(() => {
                try {
                  // cloneElement requires React - using React from global scope
                  // but to keep this file simple, use item's icon and add className prop if possible
                  return (
                    // If icon is a valid React element, clone it with extra className
                    // eslint-disable-next-line react/jsx-no-useless-fragment
                    <>
                      {item.icon && item.icon.props
                        ? /* clone with new class (works in JSX) */
                          // Note: React.cloneElement is the standard approach, but to avoid importing React explicitly,
                          // we merge classes by creating a new element with same type & props
                          (() => {
                            const Icon = item.icon.type;
                            const existing = item.icon.props.className || "";
                            return (
                              <Icon
                                className={`${existing} text-vp-gold`}
                                aria-hidden="true"
                                width={item.icon.props.width || undefined}
                                height={item.icon.props.height || undefined}
                              />
                            );
                          })()
                        : item.icon}
                    </>
                  );
                } catch (e) {
                  return item.icon;
                }
              })()}

              <h3
                id={`amenity-title-${item.id}`}
                className="text-xl font-medium mb-2 text-vp-dark"
              >
                {item.title}
              </h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Amenities;
