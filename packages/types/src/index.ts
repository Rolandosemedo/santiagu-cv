// Tipos partilhados — Santi'Águ.cv

export type Category = {
  id: string
  slug: string
  label_pt: string
  icon: string
}

export type Place = {
  id: string
  name: string
  category_id: string
  description: string
  address: string
  phone?: string
  rating: number
  verified: boolean
  location: { lat: number; lng: number }
  opening_hours?: Record<string, string>
}

export type Review = {
  id: string
  user_id: string
  place_id: string
  rating: number
  comment: string
  created_at: string
}

export type Booking = {
  id: string
  user_id: string
  place_id: string
  event_id?: string
  checkin: string
  checkout: string
  status: 'pending' | 'confirmed' | 'cancelled'
  total_cve: number
  stripe_id?: string
}

export type Event = {
  id: string
  place_id: string
  title: string
  starts_at: string
  price_cve: number
  capacity: number
  type: 'concert' | 'festival' | 'cultural' | 'other'
}

export type User = {
  id: string
  name: string
  email: string
  phone?: string
  avatar_url?: string
  role: 'user' | 'admin' | 'business'
  created_at: string
}
