export interface Place {
  id: string;
  name: string;
  category_slug: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  review_count: number;
  cover_url: string;
  phone?: string;
  verified: boolean;
  price_level?: number;
  tags?: string[];
}
