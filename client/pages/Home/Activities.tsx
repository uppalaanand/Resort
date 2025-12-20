import React from "react";
import {
  Bike,
  Volleyball,
  Flame,
  Waves,
  Baby,
} from "lucide-react";
import "../../animation.css";

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
  return (
    <section className="py-20 bg-blue-50 block">
      <div className="max-w-6xl mx-auto px-6 block">

        {/* Heading */}
        <h2 className="text-4xl font-serif font-bold text-blue-900 mb-6 text-center">
          Activities You Can Enjoy
        </h2>

        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          From relaxation to adventure, we offer engaging activities for guests of all ages.
        </p>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activities.map((item) => (
            <div
              key={item.id}
              className="border rounded-xl p-8 bg-white shadow-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              {item.icon}
              <h3 className="text-xl font-medium mb-2 text-gray-900">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Activities;
