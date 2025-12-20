

import { Room, Banquet, User, UserRole, Booking, Review, GalleryImage } from './types';

export const MOCK_USER: User = {
  _id: 'u1',
  name: 'John Doe',
  email: 'john@example.com',
  role: UserRole.USER,
  phone: '+1 234 567 890'
};

export const MOCK_ADMIN: User = {
  _id: 'a1',
  name: 'Admin User',
  email: 'admin@fourleafresort.com',
  role: UserRole.ADMIN
};

export const ROOMS: Room[] = [
  {
    _id: 'r1',
    name: 'Luxury Sea View Suite',
    pricePerNight: 450,
    maxGuests: 2,
    roomSize: '550 sq ft',
    description: 'Experience the ultimate luxury with panoramic ocean views, a private jacuzzi, and king-sized comfort.',
    amenities: ['WiFi', 'AC', 'Breakfast', 'Jacuzzi', 'Ocean View', 'Mini Bar', 'Smart TV'],
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1000&q=80'
    ],
    averageRating: 4.9,
    reviewCount: 128,
    bedType: 'King',
    isActive: true
  },
  {
    _id: 'r2',
    name: 'Deluxe Garden Room',
    pricePerNight: 250,
    maxGuests: 2,
    roomSize: '350 sq ft',
    description: 'A serene escape surrounded by lush tropical gardens. Perfect for couples looking for peace.',
    amenities: ['WiFi', 'AC', 'TV', 'Garden View', 'Coffee Maker'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1598928636135-d146006ff4be?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&w=1000&q=80'
    ],
    averageRating: 4.7,
    reviewCount: 85,
    bedType: 'Queen',
    isActive: true
  },
  {
    _id: 'r3',
    name: 'Grand Family Villa',
    pricePerNight: 800,
    maxGuests: 6,
    roomSize: '1200 sq ft',
    description: 'A spacious two-story villa with a private pool, kitchen, and butler service.',
    amenities: ['WiFi', 'Kitchen', 'Private Pool', 'Butler', 'Parking', 'BBQ Grill', '3 Bedrooms'],
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1600596542815-3ad1972fa338?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80'
    ],
    averageRating: 5.0,
    reviewCount: 42,
    bedType: '2 King, 2 Twin',
    isActive: true
  },
  {
    _id: 'r4',
    name: 'Standard Comfort',
    pricePerNight: 150,
    maxGuests: 2,
    roomSize: '280 sq ft',
    description: 'Modern amenities meets classic comfort. An affordable choice for travelers.',
    amenities: ['WiFi', 'AC', 'TV', 'Shower'],
    images: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1590490360182-137d6d3dd830?auto=format&fit=crop&w=1000&q=80'
    ],
    averageRating: 4.5,
    reviewCount: 210,
    bedType: 'Queen',
    isActive: true
  }
];

export const BANQUETS: Banquet[] = [
  {
    _id: 'b1',
    name: 'Open Lawn Area',
    capacity: 800,
    pricePerPlate: 80,
    description: 'A massive lush green lawn perfect for grand receptions, parties, and musical events under the stars. Features open-air ambiance and custom decor options.',
    amenities: ['Open Air', 'Decoration', 'Catering', 'DJ Setup', 'Stage', 'Valet Parking'],
    images: [
      'https://images.unsplash.com/photo-1562012314-40a9e0a684d7?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Elegant Hall/Garden Setup (Verified)
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80', // Outdoor Night Dining (Verified)
      'https://images.unsplash.com/photo-1464366400600-7168b8af0bc3?auto=format&fit=crop&w=1000&q=80', // Crowd/Wide View (Verified)
      'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1000&q=80', // String Lights/Party (Verified)
      'https://images.unsplash.com/photo-1519225421980-715cb0202128?auto=format&fit=crop&w=1000&q=80', // Aisle/Greenery (Verified)
    ],
    supportedEvents: ['Wedding', 'Party', 'Reception', 'Concert'],
    averageRating: 4.8,
    reviewCount: 50,
    isActive: true
  },
  {
    _id: 'b2',
    name: 'Grand Conference Hall',
    capacity: 300,
    pricePerPlate: 55,
    description: 'A state-of-the-art facility designed for productivity and innovation. Equipped with latest AV tech, ergonomic seating, and acoustic paneling.',
    amenities: ['High-Speed WiFi', 'Projector', 'Video Conferencing', 'Whiteboards', 'Coffee Bar', 'Soundproof'],
    images: [
        'https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&w=1000&q=80', // Large Auditorium (Verified)
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80', // Boardroom (Verified)
        'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1000&q=80', // Conference Room (Verified)
        'https://images.unsplash.com/photo-1475721027766-f66f4cb58485?auto=format&fit=crop&w=1000&q=80'  // Speaker Stage (Verified)
    ],
    supportedEvents: ['Conference', 'Seminar', 'Workshop', 'Board Meeting'],
    averageRating: 4.9,
    reviewCount: 45,
    isActive: true
  },
  {
    _id: 'b3',
    name: '4 BHK Private Villa',
    capacity: 20,
    pricePerPlate: 1200, // Acts as rental price per day in logic or base price
    description: 'An exclusive 4-bedroom villa with a private pool, perfect for intimate gatherings, bachelor parties, or a luxury family staycation.',
    amenities: ['Private Pool', '4 Bedrooms', 'Kitchen', 'BBQ Grill', 'Music System', 'Housekeeping'],
    images: [
        'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Modern Villa Ext (Verified)
        'https://images.unsplash.com/photo-1600596542815-3ad1972fa338?auto=format&fit=crop&w=1000&q=80', // Evening Ext (Verified)
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80', // Modern Living Room (Verified)
        'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=80'  // Luxury Bedroom (Verified)
    ],
    supportedEvents: ['Private Party', 'Staycation', 'Bachelor Party', 'Get-together'],
    averageRating: 5.0,
    reviewCount: 12,
    isActive: true
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    _id: 'bk1',
    user: 'u1',
    type: 'room',
    room: 'r1',
    fromDate: '2023-11-10',
    toDate: '2023-11-15',
    status: 'Completed',
    totalPrice: 2250,
    numberOfGuests: 2,
    createdAt: '2023-10-01'
  },
  {
    _id: 'bk2',
    user: 'u1',
    type: 'banquet',
    banquetHall: 'b1',
    fromDate: '2023-12-25',
    toDate: '2023-12-25',
    status: 'Confirmed',
    totalPrice: 40000,
    numberOfGuests: 500,
    createdAt: '2023-10-05'
  }
];

export const GALLERY_IMAGES: GalleryImage[] = [
  { id: 'g1', src: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80', category: 'surroundings', alt: 'Aerial View' },
  { id: 'g2', src: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80', category: 'rooms', alt: 'Suite Interior' },
  { id: 'g3', src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80', category: 'dining', alt: 'Restaurant' },
  { id: 'g4', src: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80', category: 'events', alt: 'Wedding Hall' },
  { id: 'g5', src: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80', category: 'surroundings', alt: 'Poolside' },
  { id: 'g6', src: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80', category: 'rooms', alt: 'Garden Room' },
  { id: 'g7', src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1000&q=80', category: 'dining', alt: 'Gourmet Dish' },
  { id: 'g8', src: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1000&q=80', category: 'events', alt: 'Beach Party' },
];

export const MOCK_REVIEWS: Review[] = [
  { _id: 'rv1', user: MOCK_USER, targetType: 'room', room: 'r1', ratingStars: 5, comment: 'Absolutely stunning views! The service was impeccable.', createdAt: '2023-10-15', verifiedStay: true },
  { _id: 'rv2', user: MOCK_USER, targetType: 'room', room: 'r1', ratingStars: 4, comment: 'Great room, but the wifi was a bit spotty on the balcony.', createdAt: '2023-09-20', verifiedStay: true },
  { _id: 'rv3', user: MOCK_USER, targetType: 'room', room: 'r2', ratingStars: 5, comment: 'So peaceful. I loved the garden access.', createdAt: '2023-11-01', verifiedStay: true },
  { _id: 'rv4', user: MOCK_USER, targetType: 'room', room: 'r3', ratingStars: 5, comment: 'The best family vacation we have ever had. The pool is amazing.', createdAt: '2023-08-10', verifiedStay: true },
];

export const ACTIVITIES: Activity[] = [
  {
    _id: 'act1',
    name: 'Cycling',
    description: 'Explore our scenic trails with premium mountain bikes. Route maps provided.',
    price: 0,
    priceUnit: 'per_hour',
    capacityPerSlot: 20,
    amenities: ['Bike Rental', 'Safety Gear', 'Map'],
    image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?auto=format&fit=crop&w=1000&q=80',
    isActive: true,
    operatingHours: '6:00 AM - 6:00 PM',
    ageRestriction: '10+ Years',
    skillLevel: 'All Levels',
    safetyGuidelines: 'Helmets are mandatory at all times.'
  },
  {
    _id: 'act2',
    name: 'Swimming Pool',
    description: 'Olympic sized pool with dedicated kids area. Lifeguard on duty.',
    price: 0,
    priceUnit: 'entry_fee',
    capacityPerSlot: 50,
    amenities: ['Towels', 'Lifeguard', 'Showers'],
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1000&q=80',
    isActive: true,
    operatingHours: '7:00 AM - 8:00 PM',
    ageRestriction: 'All Ages',
    safetyGuidelines: 'No diving in shallow end. Children must be supervised.'
  },
  {
    _id: 'act3',
    name: 'Jungle Walk',
    description: 'Guided nature walk through the adjacent forest reserve.',
    price: 0,
    priceUnit: 'per_person',
    capacityPerSlot: 15,
    amenities: ['Guide', 'Water Bottle', 'Binoculars'],
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=80',
    isActive: true,
    operatingHours: '6:00 AM - 10:00 AM',
    ageRestriction: '5+ Years',
    skillLevel: 'Beginner',
    safetyGuidelines: 'Stay on designated paths. Closed shoes recommended.'
  },
  {
    _id: 'act4',
    name: 'Cricket & Pickleball',
    description: 'Professional grade turf and courts. Equipment rental available.',
    price: 0,
    priceUnit: 'per_hour',
    capacityPerSlot: 22,
    amenities: ['Equipment', 'Floodlights', 'Umpire (On Request)'],
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1000&q=80',
    isActive: true,
    operatingHours: '8:00 AM - 10:00 PM',
    ageRestriction: 'All Ages',
    skillLevel: 'All Levels',
    safetyGuidelines: 'Proper sports attire required.'
  },
  {
    _id: 'act5',
    name: 'Luxury Spa',
    description: 'Rejuvenate with our signature massages and therapies.',
    price: 0,
    priceUnit: 'per_session',
    capacityPerSlot: 5,
    amenities: ['Massage', 'Sauna', 'Tea'],
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1000&q=80',
    isActive: true,
    operatingHours: '10:00 AM - 9:00 PM',
    ageRestriction: '18+ Years',
    safetyGuidelines: 'Consult for medical conditions before booking.'
  },
  {
    _id: 'act6',
    name: 'Zakuza Dining',
    description: 'Fine dining and entertainment zone featuring Asian fusion cuisine.',
    price: 0,
    priceUnit: 'entry_fee',
    capacityPerSlot: 100,
    amenities: ['Live Music', 'Bar', 'Outdoor Seating'],
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1000&q=80',
    isActive: true,
    operatingHours: '6:00 PM - 1:00 AM',
    ageRestriction: '21+ for Bar',
    safetyGuidelines: 'Smart casual dress code applies.'
  },
  {
    _id: 'act7',
    name: 'Farms & Fruity Nursery',
    description: 'Educational tour of our organic orchards and nursery.',
    price: 0,
    priceUnit: 'per_person',
    capacityPerSlot: 30,
    amenities: ['Tasting Session', 'Guide'],
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1000&q=80',
    isActive: true,
    operatingHours: '9:00 AM - 5:00 PM',
    ageRestriction: 'All Ages',
    safetyGuidelines: 'Do not pluck fruits without guide permission.'
  }
];