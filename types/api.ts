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
  id: string;
  title: string;
  content: string;
  startTime: string;
  location: {
    name: string;
  };
  host: {
    profile: {
      name: string;
      image: string;
      rating: number;
    };
  };
  _count: {
    booking: number;
  };
  price: number;
  images: string[];
  likes: number;
  comments: number;
  created_at: string;
  isLiked: boolean;
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
