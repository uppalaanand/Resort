import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import Room from '../models/Room';
import BanquetHall from '../models/BanquetHall';
import connectDB from '../config/db';

dotenv.config();

const seedData = async () => {
  await connectDB();

  try {
    // Clear existing
    await User.deleteMany({});
    await Room.deleteMany({});
    await BanquetHall.deleteMany({});

    // Create Admin
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@vpresort.com',
      passwordHash: '123456', // Will be hashed by pre-save hook
      role: 'admin'
    });

    // Create User
    await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      passwordHash: '123456',
      role: 'user'
    });

    console.log('Users Created');

    // Create Rooms
    const rooms = await Room.insertMany([
      {
        name: 'Luxury Sea View Suite',
        description: 'Experience the ultimate luxury with panoramic ocean views, a private jacuzzi, and king-sized comfort.',
        pricePerNight: 450,
        maxGuests: 2,
        roomSize: '550 sq ft',
        amenities: ['WiFi', 'AC', 'Breakfast', 'Jacuzzi', 'Ocean View', 'Mini Bar', 'Smart TV'],
        images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80'],
        averageRating: 4.9,
        reviewCount: 120
      },
      {
        name: 'Deluxe Garden Room',
        description: 'A serene escape surrounded by lush tropical gardens. Perfect for couples looking for peace.',
        pricePerNight: 250,
        maxGuests: 2,
        roomSize: '350 sq ft',
        amenities: ['WiFi', 'AC', 'TV', 'Garden View', 'Coffee Maker'],
        images: ['https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80'],
        averageRating: 4.7,
        reviewCount: 85
      },
      {
        name: 'Grand Family Villa',
        description: 'A spacious two-story villa with a private pool, kitchen, and butler service.',
        pricePerNight: 800,
        maxGuests: 6,
        roomSize: '1200 sq ft',
        amenities: ['WiFi', 'Kitchen', 'Private Pool', 'Butler', 'Parking', 'BBQ Grill', '3 Bedrooms'],
        images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80'],
        averageRating: 5.0,
        reviewCount: 42
      }
    ]);
    console.log('Rooms Created');

    // Create Banquets
    await BanquetHall.insertMany([
      {
        name: 'Royal Grand Ballroom',
        description: 'Our largest venue, perfect for grand weddings and corporate galas. Features crystal chandeliers.',
        capacity: 500,
        pricePerPlate: 80,
        amenities: ['Stage', 'AV System', 'Catering', 'Decoration', 'Valet'],
        images: ['https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80'],
        supportedEvents: ['Wedding', 'Corporate', 'Gala']
      },
      {
        name: 'Sunset Terrace',
        description: 'An open-air venue overlooking the horizon. Ideal for cocktail parties and intimate receptions.',
        capacity: 150,
        pricePerPlate: 60,
        amenities: ['Bar', 'Music System', 'Outdoor', 'Heaters'],
        images: ['https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80'],
        supportedEvents: ['Cocktail', 'Reception', 'Birthday']
      }
    ]);
    console.log('Banquets Created');

    console.log('Data Seeded Successfully');
    (process as any).exit();
  } catch (error) {
    console.error(error);
    (process as any).exit(1);
  }
};

seedData();