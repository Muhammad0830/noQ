// auth types
export type AuthStorageSource = "local" | "session";

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  signup: (
    email: string,
    password: string,
    name: string,
    phone?: string,
  ) => Promise<void>;
  logout: () => void;
  updateProfile: (data: {
    name?: string;
    phoneNumber?: string;
    file?: File | null;
  }) => Promise<void>;
}

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  avatarUrl?: string;
  shops?: Shop[]; 
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
  backgroundImageUrl?: string;
  address: string;
  phone?: string;
  categoryId: string;
  category?: ShopCategory;
  ownerId: string;
  owner?: User;
  isOpen: boolean;
  createdAt: string;
  averageRating?: number;
  reviewCount?: number;
  services: string[];
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  price?: number;
  durationMin?: number;
  isActive?: boolean;
  shopId?: string;
  shop?: Shop;
  bufferTime?: number | null;
  assignedToAllStaff?: boolean;
  assignedStaffId?: string | null;
  assignedStaff?: {
    id: string;
    role?: "OWNER" | "MANAGER" | "STAFF";
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      avatarUrl?: string | null;
    } | null;
  } | null;
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

// backend-only types
export interface MulterFile {
  originalname: string
  buffer: Buffer
  mimetype: string
  size: number
}

// Schedule types
export type ScheduleItemType = "OPEN" | "BLOCK";

export type BackendScheduleItem = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  type: ScheduleItemType;
};

export type BackendWeeklyScheduleResponse = {
  schedule?: Record<
    string,
    { opens: BackendScheduleItem[]; blocks: BackendScheduleItem[] }
  >;
};

export type BreakRange = {
  startTime: string;
  endTime: string;
};

export type TimePickerState = {
  isOpen: boolean;
  dayId: string | null;
  mode: "add" | "edit";
  breakIndex: number | null;
  field: "startTime" | "endTime";
  hour: number;
  minute: number;
};

export type DaySchedule = {
  id: string;
  day: string;
  dayOfWeek: number;
  openStart: string;
  openEnd: string;
  breaks: BreakRange[];
  enabled: boolean;
};
