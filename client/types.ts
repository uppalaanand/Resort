export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  RECEPTIONIST = 'receptionist',
  MANAGER = 'manager'
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole | string;
  phone?: string;
  createdAt?: string;
  
  // Guest profile fields
  address?: string;
  idProofType?: 'Aadhar' | 'PAN' | 'Passport' | 'DrivingLicense' | 'VoterID';
  idProofNumber?: string;
  phoneVerified?: boolean;
  totalVisits?: number;
  totalSpend?: number;
  lastStay?: string;
  notes?: string;
  isActive?: boolean;
}

export interface Room {
  _id: string;
  name: string;
  description: string;
  pricePerNight: number;
  discountPrice?: number;
  maxGuests: number;
  bedType: string;
  roomSize: string;
  amenities: string[];
  images: string[];
  averageRating: number;
  reviewCount: number;
  maxBeds?: number;
  isActive: boolean;
  
  // PMS fields
  roomNumber?: string;
  status?: 'Available' | 'Reserved' | 'Occupied' | 'Maintenance' | 'Cleaning';
  floor?: number;
  currentBooking?: any;
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
  maxBeds?: number; // Added to prevent typescript errors in pages/Booking.tsx
}

export interface Booking {
  _id: string;
  user: any; // Using any to avoid TS union type errors in list pages
  type: 'room' | 'banquet';
  room?: any; // Using any to avoid TS union type errors
  banquetHall?: any; // Using any to avoid TS union type errors
  fromDate: string;
  toDate: string;
  numberOfGuests: number;
  eventType?: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed' | 'Rejected';
  specialRequests?: string;
  totalPrice: number;
  createdAt: string;
  updatedAt?: string;
  extraBeds?: number;
  checkInTime?: string;
  checkOutTime?: string;
  
  // PMS fields
  source?: 'ONLINE' | 'OFFLINE';
  rejectionReason?: string;
  approvedBy?: any;
  checkedInAt?: string;
  checkedOutAt?: string;
  checkedInBy?: any;
  checkedOutBy?: any;
  paymentStatus?: 'Pending' | 'Paid' | 'Refunded' | 'Failed' | 'Partial';
  paymentMethod?: 'Cash' | 'Card' | 'UPI' | 'BankTransfer' | 'Online';
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
  guestAddress?: string;
  idProofType?: string;
  idProofNumber?: string;
  occupancy?: number;
  notes?: string;
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
  photos?: string[]; // Added to fix missing photos error
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: UserRole | string;
  token: string;
  phone?: string;
}

export interface GalleryImage {
  id: string;
  _id?: string; // Support both format types
  images?: string[];
  category: string;
  alt: string;
  src?: string; // Add optional src for mock constants
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
  operatingHours?: string;
  ageRestriction?: string;
  skillLevel?: string;
  safetyGuidelines?: string;
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

export interface ActivityLog {
  _id: string;
  action: string;
  entityType: string;
  entityId: string;
  performedBy?: User;
  details?: any;
  ipAddress?: string;
  timestamp: string;
}

export interface DashboardStats {
  totalGuests: number;
  occupiedRooms: number;
  availableRooms: number;
  totalRevenue: number;
  pendingBookings: number;
  todayCheckins: number;
  todayCheckouts: number;
  occupancyRate: number;
  roomStatusCounts: {
    Available: number;
    Reserved: number;
    Occupied: number;
    Maintenance: number;
    Cleaning: number;
  };
  todayCheckinList: Booking[];
  todayCheckoutList: Booking[];
  recentBookings: Booking[];
}
