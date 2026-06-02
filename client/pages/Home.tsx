// original
import { useEffect, useState } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Coffee, Wifi, MapPin, Camera } from 'lucide-react';
import { api } from '../utils/api';
import { getImageUrl } from '@/utils/images';
import Ameneties from './Home/Ameneties';
import Activities from './Home/Activities';


const Home = () => {
  const [featuredRooms, setFeaturedRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await api.getRooms();

        // Sort by rating (high → low)
        const topThree = data
          .sort((a, b) => b.averageRating - a.averageRating)
          .slice(0, 4);

        setFeaturedRooms(topThree);
      } catch (error) {
        console.log("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div className="animate-fadeIn overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="../home.jpg" 
            alt="Resort Background" 
            className="w-full h-full object-cover animate-scaleSlow"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-vp-dark"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto mt-10 md:mt-0">
          <div className="animate-slideUp">
             <h2 className="text-sm md:text-lg tracking-[0.4em] uppercase mb-6 text-vp-gold font-bold">Welcome to Paradise</h2>
             <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-8 leading-tight drop-shadow-lg">
                Luxury Meets <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Nature</span>
             </h1>
             <p className="text-lg md:text-2xl text-gray-200 mb-12 font-light max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                Unwind in the heart of serenity. Four Leaf Resort offers an unforgettable escape with world-class amenities and exquisite dining.
             </p>
             <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link to="/rooms" className="bg-vp-gold text-vp-dark px-10 py-4 uppercase tracking-widest font-bold text-sm hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Book Your Stay
                </Link>
                <Link to="/gallery" className="border border-white backdrop-blur-sm text-white px-10 py-4 uppercase tracking-widest font-bold text-sm hover:bg-white hover:text-vp-dark transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                View Gallery
                </Link>
             </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative z-20 -mt-10 rounded-t-[3rem] shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
             <span className="text-vp-gold font-bold tracking-widest uppercase text-sm">Why Choose Us</span>
             <h2 className="text-4xl font-serif font-bold text-vp-dark mt-2">The Four Leaf Experience</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
  {[
    { icon: Star, title: "5-Star Luxury", text: "World-class service and premium amenities for absolute comfort." },
    { icon: Coffee, title: "Fine Dining", text: "Exquisite culinary delights prepared by expert chefs." },
    { 
      icon: MapPin, 
      title: "Prime Location", 
      text: "Located just 10 minutes from Thukkuguda.",
      link: "https://www.google.com/maps/place/Thukkuguda" // Add the Google Maps link here
    }
  ].map((feature, idx) => {
    const content = (
      <div className="p-8 rounded-2xl hover:bg-vp-cream transition-colors duration-300 group cursor-pointer">
        <div className="bg-vp-blue w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
          <feature.icon className="text-vp-gold w-8 h-8" />
        </div>
        <h3 className="text-2xl font-serif font-bold mb-4 text-vp-dark">{feature.title}</h3>
        <p className="text-gray-600 leading-relaxed">{feature.text}</p>
      </div>
    );

    // If feature has a link, wrap in <a>, else just render the card
    return feature.link ? (
      <a key={idx} href={feature.link} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    ) : (
      <div key={idx}>{content}</div>
    );
  })}
</div>
        </div>
      </section>

      {/* Featured Rooms Grid */}
      <section className="py-24 bg-vp-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
                <h2 className="text-vp-gold text-sm font-bold tracking-widest uppercase mb-2">Accommodation</h2>
                <h3 className="text-4xl font-serif font-bold text-vp-dark">Featured Rooms</h3>
            </div>
            <Link to="/rooms" className="hidden md:flex items-center gap-2 text-vp-dark font-bold uppercase tracking-wider hover:text-vp-gold transition-colors">
                View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {featuredRooms.map((room) => (
              <div key={room._id} className="bg-white rounded-xl shadow-lg group overflow-hidden flex flex-col h-full">
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src={getImageUrl(room.images[0])} 
                    alt={room.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full font-bold text-xs flex items-center gap-1">
                    <Star size={10} className="text-vp-gold fill-current" /> {room.averageRating}
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <h4 className="text-2xl font-bold mb-2 font-serif text-vp-dark">{room.name}</h4>
                  <div className="flex gap-4 text-xs text-gray-400 uppercase font-bold mb-6">
                    {room.amenities.slice(0,3).map(am => (
                      <span key={am} className="flex items-center gap-1"><Wifi size={10}/> {am}</span>
                    ))}
                  </div>
                  <div className="mt-auto flex justify-between items-center">
                    <div>
                        <span className="text-2xl font-bold text-vp-gold">₹{room.pricePerNight}</span>
                        <span className="text-xs text-gray-400">/night</span>
                    </div>
                    <Link to={`/rooms/${room._id}`} className="text-vp-dark hover:text-vp-gold font-bold border-b-2 border-vp-dark hover:border-vp-gold transition-colors pb-1 uppercase text-xs tracking-widest">
                        Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12 md:hidden">
            <Link to="/rooms" className="inline-block bg-vp-dark text-white px-10 py-3 font-bold hover:bg-gray-800 transition-colors uppercase tracking-widest text-sm">
              View All Rooms
            </Link>
          </div>
        </div>
      </section>

      {/* ================= AMENITIES SECTION ================= */}
      <Ameneties />
      {/* ============== ACTIVITIES SECTION ================= */}
      <Activities />

      {/* Gallery Strip */}
      <section className="py-0">
         <div className="grid grid-cols-2 md:grid-cols-4 h-64 md:h-80">
            <div className="relative group overflow-hidden">
                <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Gallery" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/0 transition-colors"></div>
            </div>
            <div className="relative group overflow-hidden">
                <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Gallery" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/0 transition-colors"></div>
            </div>
            <div className="relative group overflow-hidden">
                <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Gallery" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/0 transition-colors"></div>
            </div>
             <div className="relative group overflow-hidden bg-vp-dark flex items-center justify-center cursor-pointer hover:bg-vp-blue transition-colors">
                <Link to="/gallery" className="text-center p-8">
                    <Camera className="w-12 h-12 text-vp-gold mx-auto mb-4" />
                    <h3 className="text-white font-serif text-2xl font-bold">View Full Gallery</h3>
                    <p className="text-gray-400 text-sm mt-2">See more photos</p>
                </Link>
            </div>
         </div>
      </section>

      {/* Banquet Highlight */}
      <section className="py-24 bg-vp-blue text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
            <img src="https://images.unsplash.com/photo-1519225421980-715cb0202128?auto=format&fit=crop&w=1500&q=80" className="w-full h-full object-cover grayscale" alt="Banquet" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2">
                <h2 className="text-vp-gold text-sm font-bold tracking-widest uppercase mb-4">Events & Weddings</h2>
                <h3 className="text-5xl font-serif font-bold mb-6 leading-tight">Create Memories that Last Forever</h3>
                <p className="text-gray-300 mb-10 leading-relaxed text-lg font-light">
                    From intimate gatherings to grand celebrations, our banquet halls provide the perfect backdrop. 
                    Experience impeccable service and state-of-the-art facilities.
                </p>
                <Link to="/banquets" className="bg-vp-gold text-vp-dark px-8 py-4 uppercase tracking-widest font-bold hover:bg-white transition-colors inline-block text-sm">
                    Explore Venues
                </Link>
            </div>
            <div className="md:w-1/2 relative">
                <div className="absolute -inset-4 border-2 border-vp-gold/30 rounded-lg transform rotate-3"></div>
                <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80" className="rounded-lg shadow-2xl relative z-10 transform -rotate-2 hover:rotate-0 transition-transform duration-500" alt="Wedding" />
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
