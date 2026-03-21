// import React from "react";
// import {
//   Bike,
//   Volleyball,
//   Flame,
//   Waves,
//   Baby,
// } from "lucide-react";
// import "../../animation.css";

// // Activities List
// const activities = [
//   {
//     id: 1,
//     icon: <Bike className="w-12 h-12 mb-4 text-blue-700" />,
//     title: "Cycling Activity",
//     desc: "Explore the surroundings with our cycling tracks and refreshing outdoor environment.",
//   },
//   {
//     id: 2,
//     icon: <Volleyball className="w-12 h-12 mb-4 text-blue-700" />,
//     title: "Outdoor Games",
//     desc: "Cricket, volleyball, badminton and more fun activities for groups & families.",
//   },
//   {
//     id: 3,
//     icon: <Waves className="w-12 h-12 mb-4 text-blue-700" />,
//     title: "Swimming Pool",
//     desc: "Relax and refresh in our clean and well-maintained pool area with safety supervision.",
//   },
//   {
//     id: 4,
//     icon: <Flame className="w-12 h-12 mb-4 text-blue-700" />,
//     title: "Campfire Nights",
//     desc: "Enjoy warm and cozy bonfire experiences with friends and family under the stars.",
//   },
//   {
//     id: 5,
//     icon: <Baby className="w-12 h-12 mb-4 text-blue-700" />,
//     title: "Kids Play Zone",
//     desc: "Safe and fun play zone designed exclusively for kids to enjoy their time.",
//   },
// ];

// const Activities = () => {
//   return (
//     <section className="py-20 bg-blue-50 block">
//       <div className="max-w-6xl mx-auto px-6 block">

//         {/* Heading */}
//         <h2 className="text-4xl font-serif font-bold text-blue-900 mb-6 text-center">
//           Activities You Can Enjoy
//         </h2>

//         <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
//           From relaxation to adventure, we offer engaging activities for guests of all ages.
//         </p>

//         {/* Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//           {activities.map((item) => (
//             <div
//               key={item.id}
//               className="border rounded-xl p-8 bg-white shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300
//               animate-card animate-delay-${index + 1}"
//             >
//               {item.icon}
//               <h3 className="text-xl font-medium mb-2 text-gray-900">{item.title}</h3>
//               <p className="text-gray-600">{item.desc}</p>
//             </div>
//           ))}
//         </div>

//       </div>
//     </section>
//   );
// };

// export default Activities;




import { Bike, Volleyball, Flame, Waves, Baby } from "lucide-react";
import { useEffect } from "react";
import "./animation.css";

// Activities List
const activities = [
  {
    id: 1,
    icon: <Bike className="w-12 h-12 mb-4 text-blue-700" />,
    title: "Cycling Activity",
    desc: "Explore the surroundings with our cycling tracks and refreshing outdoor environment.",
  },
  {
    id: 2,
    icon: <Volleyball className="w-12 h-12 mb-4 text-blue-700" />,
    title: "Outdoor Games",
    desc: "Cricket, volleyball, badminton and more fun activities for groups & families.",
  },
  {
    id: 3,
    icon: <Waves className="w-12 h-12 mb-4 text-blue-700" />,
    title: "Swimming Pool",
    desc: "Relax and refresh in our clean and well-maintained pool area with safety supervision.",
  },
  {
    id: 4,
    icon: <Flame className="w-12 h-12 mb-4 text-blue-700" />,
    title: "Campfire Nights",
    desc: "Enjoy warm and cozy bonfire experiences with friends and family under the stars.",
  },
  {
    id: 5,
    icon: <Baby className="w-12 h-12 mb-4 text-blue-700" />,
    title: "Kids Play Zone",
    desc: "Safe and fun play zone designed exclusively for kids to enjoy their time.",
  },
];

const Activities = () => {
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
    <section
      className="py-20 md:py-24 bg-vp-cream"
      role="region"
      aria-labelledby="activities-heading"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Heading */}
        <h2
          id="activities-heading"
          className="text-4xl font-serif font-bold text-vp-dark mb-6 text-center"
        >
          Activities You Can Enjoy
        </h2>

        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          From relaxation to adventure, we offer engaging activities for guests
          of all ages.
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activities.map((item) => (
            <div
              key={item.id}
              className={
                "service-card border rounded-xl p-8 bg-white shadow-sm hover:shadow-lg transition-all duration-300 " +
                "group transform-gpu will-change-transform hover:-translate-y-1 focus:-translate-y-1 " +
                "ease-in-out focus:outline-none focus:ring-2 focus:ring-vp-gold border-gray-100 rounded-2xl"
              }
              role="article"
              tabIndex={0}
              aria-labelledby={`activity-title-${item.id}`}
            >
              {/* Render the icon with brand color while preserving original sizing */}
              {(() => {
                try {
                  const Icon = item.icon.type;
                  const existing =
                    (item.icon.props && item.icon.props.className) || "";
                  return (
                    <Icon
                      className={`${existing} text-vp-gold`}
                      aria-hidden="true"
                      width={item.icon.props?.width}
                      height={item.icon.props?.height}
                    />
                  );
                } catch (e) {
                  return item.icon;
                }
              })()}

              <h3
                id={`activity-title-${item.id}`}
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

export default Activities;