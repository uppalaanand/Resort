import React from 'react'
import { Trees, FlameKindling, UtensilsCrossed, CookingPot, Wifi } from "lucide-react";
import "../../animation.css";

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
  }
];


const Ameneties = () => {
    return (
      <section className="py-20 bg-white block">
  <div className="max-w-6xl mx-auto px-6 block">

    {/* Heading */}
    <h2 className="text-4xl font-serif font-bold text-vp-dark mb-6 text-center">
      Amenities We Provide
    </h2>

    <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
      Experience premium comfort with our carefully curated amenities, designed to enhance your stay
      and make every moment memorable.
    </p>

    {/* Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {amenities.map((item) => (
        <div
          key={item.id}
          className="border rounded-xl p-8 bg-white shadow-sm hover:shadow-md transition"
        >
          {item.icon}
          <h3 className="text-xl font-medium mb-2 text-gray-900">{item.title}</h3>
          <p className="text-gray-600">{item.desc}</p>
        </div>
      ))}
    </div>

  </div>
</section>
    )
}

export default Ameneties;