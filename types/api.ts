export interface Host {
  id: string;
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
  location: string;
  image: string;
  rating: number;
  duration: string;
  groupSize: string;
  description: string;
  highlights: string[];
}