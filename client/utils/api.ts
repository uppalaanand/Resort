
import { AuthResponse, Room, Banquet, Booking, Review, Activity, GalleryImage, Event } from '../types';
import { ROOMS, BANQUETS, MOCK_BOOKINGS, MOCK_REVIEWS, MOCK_USER, MOCK_ADMIN } from '../constants';

const API_URL = 'http://localhost:5000/api';

const getToken = () => {
  const user = localStorage.getItem('vp_user');
  return user ? JSON.parse(user).token : null;
};

// Removed artificial delay for faster rendering
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, 0));

// Helper to populate mock bookings with actual objects instead of ID strings
const getPopulatedBookings = () => {
    return MOCK_BOOKINGS.map(b => ({
        ...b,
        user: b.user === 'u1' ? MOCK_USER : (b.user === 'a1' ? MOCK_ADMIN : MOCK_USER),
        room: typeof b.room === 'string' ? ROOMS.find(r => r._id === b.room) : b.room,
        banquetHall: typeof b.banquetHall === 'string' ? BANQUETS.find(h => h._id === b.banquetHall) : b.banquetHall
    }));
};

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  // const headers: HeadersInit = {
  //   'Content-Type': 'application/json',
  //   ...options.headers as any,
  // };
  const headers: HeadersInit = {
      ...(options.body instanceof FormData
      ? {}
      : { 'Content-Type': 'application/json' }),
    ...options.headers as any,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'API Error');
        return data;
    } else {
         if (!response.ok) throw new Error('API Error');
         return {} as T;
    }
  } catch (error) {
    // console.warn(`Backend unavailable. Falling back to mock data for: ${endpoint}`);
    // await delay(0); // Instant response

    // const method = options.method || 'GET';

    // // --- Mock Routing Logic ---

    // // Auth Routes
    // if (endpoint === '/auth/login') {
    //     const body = JSON.parse(options.body as string);
    //     if (body.email.includes('admin')) {
    //         return { ...MOCK_ADMIN, token: 'mock-admin-token' } as unknown as T;
    //     }
    //     return { ...MOCK_USER, token: 'mock-user-token' } as unknown as T;
    // }
    // if (endpoint === '/auth/register') {
    //     return { ...MOCK_USER, token: 'mock-user-token' } as unknown as T;
    // }

    // // User Routes
    // if (endpoint === '/users/me') return MOCK_USER as unknown as T;

    // // Room Routes
    // if (endpoint === '/rooms') return ROOMS as unknown as T;
    // if (endpoint.match(/^\/rooms\/\w+/)) {
    //     if (method === 'DELETE') return { message: 'Room deleted' } as unknown as T;
    //     const id = endpoint.split('/').pop();
    //     const room = ROOMS.find(r => r._id === id);
    //     if (room) return room as unknown as T;
    //     return ROOMS[0] as unknown as T; // Fallback
    // }

    // // Banquet Routes
    // if (endpoint === '/banquets') return BANQUETS as unknown as T;
    // if (endpoint.match(/^\/banquets\/\w+/)) {
    //     if (method === 'DELETE') return { message: 'Banquet deleted' } as unknown as T;
    //     const id = endpoint.split('/').pop();
    //     const hall = BANQUETS.find(b => b._id === id);
    //     if (hall) return hall as unknown as T;
    //     return BANQUETS[0] as unknown as T; // Fallback
    // }

    // // Booking Routes
    // if (endpoint === '/bookings/my') return getPopulatedBookings() as unknown as T;
    // if (endpoint === '/bookings' && method === 'GET') return getPopulatedBookings() as unknown as T;
    
    // if (endpoint === '/bookings/room' || endpoint === '/bookings/banquet') {
    //      const body = JSON.parse(options.body as string);
    //      return {
    //          _id: 'mock_bk_' + Date.now(),
    //          status: 'Pending',
    //          totalPrice: 0, // Simplified
    //          createdAt: new Date().toISOString(),
    //          ...body,
    //          user: MOCK_USER
    //      } as unknown as T;
    // }

    // if (endpoint.includes('/cancel')) {
    //     return { message: 'Booking cancelled (Mock)' } as unknown as T;
    // }
    
    // if (endpoint.includes('/status')) {
    //     return { message: 'Status updated (Mock)' } as unknown as T;
    // }

    // // Reviews Routes
    // if (endpoint.includes('/reviews/room/')) return MOCK_REVIEWS.filter(r => r.targetType === 'room') as unknown as T;
    // if (endpoint.includes('/reviews/banquet/')) return [] as unknown as T;
    // if (endpoint === '/reviews') return { message: 'Review added (Mock)' } as unknown as T;

    // // Admin Data generic fallbacks
    // if (endpoint === '/rooms' && method === 'DELETE') return { message: 'Room deleted' } as unknown as T;

    throw new Error(error.message);
  }
}

export const api = {
  login: (credentials: any) => fetchAPI<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  register: (userData: any) => fetchAPI<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
  getMe: () => fetchAPI<any>('/users/me'),

  getAllUsers: () => fetchAPI<any>('/users'),
  updateProfile: (data: {
    name: string;
    email: string;
    phone: string;
    password?: string; 
  }) => fetchAPI('/users/my', { method: 'PATCH', body: JSON.stringify(data) }),
  getUserById: (id: string) => fetchAPI<any>(`/users/${id}`),
  
  getRooms: () => fetchAPI<Room[]>('/rooms'),
  getRoom: (id: string) => fetchAPI<Room>(`/rooms/${id}`),
  updateRoom: (id: string, data: FormData) => fetchAPI(`/rooms/${id}`, { method: 'PATCH', body: data}),
  
  getBanquets: () => fetchAPI<Banquet[]>('/banquets'),
  getBanquet: (id: string) => fetchAPI<Banquet>(`/banquets/${id}`),
  updateBanquet: (id: string, data: FormData) => fetchAPI(`/banquets/${id}`, { method: 'PATCH', body: data}),
  deleteBanquete: (id: string) => fetchAPI(`/banquets/${id}`, { method: 'DELETE' }),

  getActivities: () => fetchAPI<Activity[]>('/activities'),
  
  createRoomBooking: (data: any) => fetchAPI('/bookings/room', { method: 'POST', body: JSON.stringify(data) }),
  createBanquetBooking: (data: any) => fetchAPI('/bookings/banquet', { method: 'POST', body: JSON.stringify(data) }),
  getMyBookings: () => fetchAPI<Booking[]>('/bookings/my'),
  cancelBooking: (id: string) => fetchAPI(`/bookings/${id}/cancel`, { method: 'PATCH' }),
  getBookingsByUser: (id: string) => fetchAPI(`/bookings/user/${id}`),
  checkRoomAvailability: (params: {
            roomId: string;
            fromDate: string;
            toDate: string;
          }) => fetchAPI<{ available: boolean }>(`/bookings/check-availability?roomId=${params.roomId}&fromDate=${params.fromDate}&toDate=${params.toDate}`),
  
  createReview: (data: any) => fetchAPI('/reviews', { method: 'POST', body: JSON.stringify(data) }),
  getReviews: (type: 'room' | 'banquet', id: string) => fetchAPI<Review[]>(`/reviews/${type}/${id}`),
  getAllReviews: () => fetchAPI<Review[]>('/reviews'),
  deleteReview: (id: string) => fetchAPI(`/reviews/${id}`, { method: 'DELETE' }),

  getAllBookings: () => fetchAPI<Booking[]>('/bookings'),
  updateBookingStatus: (id: string, status: string) => fetchAPI(`/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  
  createRoom: (data: any) => fetchAPI('/rooms', { method: 'POST', body: JSON.stringify(data) }),
  deleteRoom: (id: string) => fetchAPI(`/rooms/${id}`, { method: 'DELETE' }),

  createGallery: (data: FormData) => fetchAPI("/gallery", { method: "POST", body: data }),
  getGallery: () => fetchAPI<GalleryImage[]>("/gallery"),
  updateGallery: (id: string, data: FormData) => fetchAPI(`/gallery/${id}`, { method: "PATCH", body: data, }),
  deleteGallery: (id: string) => fetchAPI(`/gallery/${id}`, { method: "DELETE", }),

  getEvents: () => fetchAPI<Event[]>('/events'),
  getEvent: (id: string) => fetchAPI<Event>(`/events/${id}`),
  deleteEvent: (id: string) => fetchAPI(`/events/${id}`, { method: "DELETE" }),
  updateEvent: (id: string, data: FormData) => fetchAPI(`/events/${id}`, { method: "PATCH", body: data, }),

  createRoomRequest: (data: any) => fetchAPI("/room-requests", { method: "POST", body: JSON.stringify(data) }),
  getMyRoomRequests: () => fetchAPI<any[]>("/room-requests/my"),
  getAllRoomRequests: () => fetchAPI<any[]>("/room-requests"),
  updateRoomRequestStatus: (id: string, status: string) => fetchAPI(`/room-requests/${id}/status`, { method: "PATCH", body: JSON.stringify({ status })}),
};
