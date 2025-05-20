export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
}

export interface Host {
  id: string;
  profile: {
    name: string;
    image: string;
    rating: number;
    travellers: number;
    languages: string[];
  };
  name: string;
  languages: string[];
  travelers: number;
  image: string;
  rating: number;
  experience: string;
  bio: string;
  expertise: string[];
  reviews: Review[];
}

export interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  image: string;
  rating?: number;
  duration?: string;
  group_size?: string;
  description?: string;
  highlights?: string[];
  created_at?: string;
  user_id?: string;
}

export interface Post {
  id: number;
  title: string;
  description: string;
  price: string;
  startTime: string;
  endTime: string;
  maxSeats: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  hostId: number;
  locationId: number;
  host: {
    id: number;
    email: string;
    profile?: {
      name: string;
      image: string;
      rating: number;
    };
  };
  location: {
    id: number;
    name: string;
    image: string;
    description: string;
    address: string;
    latitude: number;
    longitude: number;
    highlights: string[];
  };
  _count: {
    booking: number;
  };
}

export interface Review {
  id: string;
  user: User;
  rating: number;
  comment: string;
}

export interface Comment {
  id: string;
  content: string;
  user: User;
  created_at: string;
}
