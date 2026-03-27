const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
  // Auth
  auth: {
    signin: `${API_BASE_URL}/auth/signin`,
    signup: `${API_BASE_URL}/auth/signup`,
    me: `${API_BASE_URL}/auth/me`,
  },
  
  // Categories
  categories: `${API_BASE_URL}/categories`,
  
  // Shops
  shops: `${API_BASE_URL}/shops`,
  shops_trending: `${API_BASE_URL}/shops/trending/7days`,
  shopById: (id: string) => `${API_BASE_URL}/shops/${id}`,
  shopServices: (id: string) => `${API_BASE_URL}/shops/${id}/services`,
  shopReviews: (id: string) => `${API_BASE_URL}/shops/${id}/reviews`,
  shopTimeline: (id: string) => `${API_BASE_URL}/shops/${id}/day-timeline`,
  
  // Services
  services: `${API_BASE_URL}/services`,
  serviceById: (id: string) => `${API_BASE_URL}/services/${id}`,
  
  // Bookings
  bookings: `${API_BASE_URL}/bookings`,
  activeBookings: `${API_BASE_URL}/bookings/active`,
  bookingHistory: `${API_BASE_URL}/bookings/history`,

  // Favourites
  favourites: {
    shops: `${API_BASE_URL}/favourites/shops`,
    services: `${API_BASE_URL}/favourites/services`,
    addShop: `${API_BASE_URL}/favourites/shop`,
    addService: `${API_BASE_URL}/favourites/service`,
  },
  
  // Reviews
  reviews: `${API_BASE_URL}/reviews`,
  reviewsByShop: (shopId: string) => `${API_BASE_URL}/reviews/${shopId}`,
};

export default API_ENDPOINTS;
