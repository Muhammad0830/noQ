const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  // Auth
  auth: {
    signin: `${API_BASE_URL}/api/auth/signin`,
    signup: `${API_BASE_URL}/api/auth/signup`,
    me: `${API_BASE_URL}/api/auth/me`,
  },
  
  // Categories
  categories: `${API_BASE_URL}/api/categories`,
  
  // Shops
  shops: `${API_BASE_URL}/api/shops`,
  shopById: (id: string) => `${API_BASE_URL}/api/shops/${id}`,
  shopServices: (id: string) => `${API_BASE_URL}/api/shops/${id}/services`,
  shopReviews: (id: string) => `${API_BASE_URL}/api/shops/${id}/reviews`,
  shopTimeline: (id: string) => `${API_BASE_URL}/api/shops/${id}/day-timeline`,
  
  // Services
  services: `${API_BASE_URL}/api/services`,
  serviceById: (id: string) => `${API_BASE_URL}/api/services/${id}`,
  
  // Bookings
  bookings: `${API_BASE_URL}/api/bookings`,
  activeBookings: `${API_BASE_URL}/api/bookings/active`,
  bookingHistory: `${API_BASE_URL}/api/bookings/history`,
  
  // Favourites
  favourites: {
    shops: `${API_BASE_URL}/api/favourites/shops`,
    services: `${API_BASE_URL}/api/favourites/services`,
    addShop: `${API_BASE_URL}/api/favourites/shop`,
    addService: `${API_BASE_URL}/api/favourites/service`,
  },
  
  // Reviews
  reviews: `${API_BASE_URL}/api/reviews`,
  reviewsByShop: (shopId: string) => `${API_BASE_URL}/api/reviews/${shopId}`,
};

export default API_ENDPOINTS;
