
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  createdAt?: string;
}

export interface Room {
  _id: string;
  name: string;
  description: string;
  pricePerNight: number;
  discountPrice: number;
  maxGuests: number;
  bedType: string;
  roomSize: string;
  amenities: string[];
  images: string[];
  averageRating: number;
  reviewCount: number;
  maxBeds: number,
  isActive: boolean;
}

export interface Banquet {
  _id: string;
  name: string;
  description: string;
  capacity: number;
  pricePerPlate: number;
  amenities: string[];
  images: string[];
  supportedEvents: string[];
  averageRating: number;
  reviewCount: number;
  isActive: boolean;
}

export interface Booking {
  _id: string;
  user: User | string;
  type: 'room' | 'banquet';
  room?: Room | string;
  banquetHall?: Banquet | string;
  fromDate: string;
  toDate: string;
  numberOfGuests: number;
  eventType?: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
  specialRequests?: string;
  totalPrice: number;
  createdAt: string;
}

export interface Review {
  _id: string;
  user: User;
  targetType: 'room' | 'banquet';
  room?: string;
  banquetHall?: string;
  ratingStars: number;
  comment: string;
  createdAt: string;
  verifiedStay: boolean;
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
  phone?: string;
}

export interface GalleryImage {
  id: string;
  images: string[];
  category: string;
  alt: string;
}

export interface Activity {
  _id: string;
  name: string;
  description: string;
  price: number;
  priceUnit: 'per_hour' | 'per_person' | 'per_session' | 'entry_fee';
  capacityPerSlot: number;
  amenities: string[];
  image: string;
  isActive: boolean;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  images: string[];        
  location?: string;
  startDate: string;       
  endDate: string;        
  status?: "ONGOING" | "UPCOMING" | "COMPLETED"; 
}
