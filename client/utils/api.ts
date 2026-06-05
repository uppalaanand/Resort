import { AuthResponse, Room, Banquet, Booking, Review, Activity, GalleryImage, Event } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = (): string | null => {
  const user = localStorage.getItem('vp_user');
  return user ? JSON.parse(user).token : null;
};

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    ...(options.body instanceof FormData
      ? {}
      : { 'Content-Type': 'application/json' }),
    ...options.headers as any,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.indexOf('application/json') !== -1) {
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'API Error');
    return data;
  } else {
    if (!response.ok) throw new Error('API Error');
    return {} as T;
  }
}

export const api = {
  // Auth
  login: (credentials: any) => fetchAPI<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData: any) => fetchAPI<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => fetchAPI<any>('/users/me'),

  // Users
  getAllUsers: () => fetchAPI<any>('/users'),
  updateProfile: (data: { name: string; email: string; phone: string; password?: string }) =>
    fetchAPI('/users/my', { method: 'PATCH', body: JSON.stringify(data) }),
  getUserById: (id: string) => fetchAPI<any>(`/users/${id}`),

  // Rooms
  getRooms: () => fetchAPI<Room[]>('/rooms'),
  getRoom: (id: string) => fetchAPI<Room>(`/rooms/${id}`),
  updateRoom: (id: string, data: FormData) => fetchAPI(`/rooms/${id}`, { method: 'PATCH', body: data }),
  createRoom: (data: any) => fetchAPI('/rooms', { method: 'POST', body: JSON.stringify(data) }),
  deleteRoom: (id: string) => fetchAPI(`/rooms/${id}`, { method: 'DELETE' }),

  // Banquets
  getBanquets: () => fetchAPI<Banquet[]>('/banquets'),
  getBanquet: (id: string) => fetchAPI<Banquet>(`/banquets/${id}`),
  updateBanquet: (id: string, data: FormData) => fetchAPI(`/banquets/${id}`, { method: 'PATCH', body: data }),
  deleteBanquete: (id: string) => fetchAPI(`/banquets/${id}`, { method: 'DELETE' }),

  // Activities
  getActivities: () => fetchAPI<Activity[]>('/activities'),

  // Bookings
  createRoomBooking: (data: any) => fetchAPI('/bookings/room', { method: 'POST', body: JSON.stringify(data) }),
  createBanquetBooking: (data: any) => fetchAPI('/bookings/banquet', { method: 'POST', body: JSON.stringify(data) }),
  getMyBookings: () => fetchAPI<Booking[]>('/bookings/my'),
  cancelBooking: (id: string) => fetchAPI(`/bookings/${id}/cancel`, { method: 'PATCH' }),
  getBookingsByUser: (id: string) => fetchAPI(`/bookings/user/${id}`),
  checkRoomAvailability: (params: { roomId: string; fromDate: string; toDate: string }) =>
    fetchAPI<{ available: boolean }>(`/bookings/check-availability?roomId=${params.roomId}&fromDate=${params.fromDate}&toDate=${params.toDate}`),
  getBookedDates: (params: { id: string; type: 'room' | 'banquet' }) =>
    fetchAPI<string[]>(`/bookings/booked-dates?type=${params.type}&id=${params.id}`),
  getAllBookings: () => fetchAPI<Booking[]>('/bookings'),
  updateBookingStatus: (id: string, status: string) =>
    fetchAPI(`/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // Reviews
  createReview: (data: any) => fetchAPI('/reviews', { method: 'POST', body: JSON.stringify(data) }),
  getReviews: (type: 'room' | 'banquet', id: string) => fetchAPI<Review[]>(`/reviews/${type}/${id}`),
  getAllReviews: () => fetchAPI<Review[]>('/reviews'),
  deleteReview: (id: string) => fetchAPI(`/reviews/${id}`, { method: 'DELETE' }),

  // Gallery
  createGallery: (data: FormData) => fetchAPI('/gallery', { method: 'POST', body: data }),
  getGallery: () => fetchAPI<GalleryImage[]>('/gallery'),
  updateGallery: (id: string, data: FormData) => fetchAPI(`/gallery/${id}`, { method: 'PATCH', body: data }),
  deleteGallery: (id: string) => fetchAPI(`/gallery/${id}`, { method: 'DELETE' }),

  // Events
  getEvents: () => fetchAPI<Event[]>('/events'),
  getEvent: (id: string) => fetchAPI<Event>(`/events/${id}`),
  deleteEvent: (id: string) => fetchAPI(`/events/${id}`, { method: 'DELETE' }),
  updateEvent: (id: string, data: FormData) => fetchAPI(`/events/${id}`, { method: 'PATCH', body: data }),

  // Room Requests
  createRoomRequest: (data: any) => fetchAPI('/room-requests', { method: 'POST', body: JSON.stringify(data) }),
  getMyRoomRequests: () => fetchAPI<any[]>('/room-requests/my'),
  getAllRoomRequests: () => fetchAPI<any[]>('/room-requests'),
  updateRoomRequestStatus: (id: string, status: string) =>
    fetchAPI(`/room-requests/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // Google Auth
  googleLogin: (idToken: string) => fetchAPI<any>('/auth/google-login', { method: 'POST', body: JSON.stringify({ idToken }) }),
  googleCompleteProfile: (data: { tempToken: string; phone: string }) =>
    fetchAPI<any>('/auth/google-complete-profile', { method: 'POST', body: JSON.stringify(data) }),
  forgotPassword: (email: string) => fetchAPI<any>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
};
