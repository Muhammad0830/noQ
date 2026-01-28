// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

// Shop Category
export interface ShopCategory {
  id: string;
  name: string;
  icon?: string;
}

// Shop
export interface Shop {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  address: string;
  phone?: string;
  categoryId: string;
  category?: ShopCategory;
  ownerId: string;
  owner?: User;
  isOpen: boolean;
  createdAt: string;
  rating?: number;
  reviewCount?: number;
}

// Service
export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  durationMin: number;
  isActive: boolean;
  shopId: string;
  shop?: Shop;
}

// Booking
export interface Booking {
  id: string;
  userId: string;
  user?: User;
  shopId: string;
  shop?: Shop;
  serviceId: string;
  service?: Service;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  createdAt: string;
}

export type BookingStatus = 
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

// Review
export interface Review {
  id: string;
  rating: number;
  comment?: string;
  userId: string;
  user?: User;
  shopId?: string;
  shop?: Shop;
  serviceId?: string;
  service?: Service;
  createdAt: string;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  cursor?: string;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
}

// Language types
export type Language = 'uz-latn' | 'uz-cyrl' | 'ru';

export interface Translations {
  'uz-latn': Record<string, string>;
  'uz-cyrl': Record<string, string>;
  'ru': Record<string, string>;
}
