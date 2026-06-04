export interface Listing {
  id: string;
  user_id: string;
  display_name: string;
  bio: string;
  suburb: string;
  city: string;
  lat: number | null;
  lng: number | null;
  rate_per_hour: number;
  contact_type: 'email' | 'phone' | 'instagram' | 'website';
  contact_value: string;
  photo_key: string | null;
  is_active: 0 | 1;
  created_at: string;
  updated_at: string;
}
