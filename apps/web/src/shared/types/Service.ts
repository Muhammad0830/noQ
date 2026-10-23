export type TrendingService = {
  id: string;
  name: string;
  shopId?: string;
  price?: number | string | null;
  durationMin?: number | string | null;
  shop?: {
    id?: string;
    name?: string;
    categoryId?: string;
    category?: {
      id?: string;
    };
  };
};