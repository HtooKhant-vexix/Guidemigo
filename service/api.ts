import axios from 'axios';

// Types
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthResponse extends AuthTokens {
  user: User;
}

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  name: string;
}

interface TourData {
  title: string;
  description: string;
  locationId: number;
  price: number;
  maxSeats: number;
  startTime: string;
  endTime: string;
  status: string;
}

interface ProfileResponse {
  success: boolean;
  message: string;
  data: {
    location: string;
    id: number;
    name: string;
    email: string;
    phonenumber?: string;
    bio?: string;
    image?: string;
    type?: string;
    dob?: string;
    expertise?: string[];
    experience?: string;
    address?: string;
    languages?: string[];
    gender?: string;
  };
}

// Create axios instance
const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.165:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Places API
export const fetchPlaces = async () => {
  const { data } = await api.get('/location');
  return data;
};

export const fetchPlace = async (id: string) => {
  const { data } = await api.get(`/location/${id}`);
  return data;
};

// Posts API
export const fetchPosts = async () => {
  const { data } = await api.get('/activity/recent/desc');
  return data;
};

export const NewPost = async (
  postData:
    | FormData
    | {
        content: string;
        location?: string;
        images?: string[];
      }
) => {
  const response = await api.post('/activity', postData, {
    headers: {
      'Content-Type':
        postData instanceof FormData
          ? 'multipart/form-data'
          : 'application/json',
    },
  });
  return response.data;
};

export const NewTour = async (tourData: TourData) => {
  try {
    const { data } = await api.post('/tour', tourData, {
      headers: { 'Content-Type': 'application/json' },
    });
    return data;
  } catch (error: any) {
    console.error(
      'Tour creation error:',
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updatePost = async (
  postId: string,
  postData: {
    content: string;
    location?: string;
    images?: string[];
  }
) => {
  const { data } = await api.put(`/posts/${postId}`, postData);
  return data;
};

export const deletePost = async (postId: string) => {
  const { data } = await api.delete(`/posts/${postId}`);
  return data;
};

export const addComment = async (postId: string, comment: string) => {
  const { data } = await api.post(`/posts/${postId}/comments`, { comment });
  return data;
};

export const deleteComment = async (postId: string, commentId: string) => {
  const { data } = await api.delete(`/posts/${postId}/comments/${commentId}`);
  return data;
};

export const updateComment = async (
  postId: string,
  commentId: string,
  comment: string
) => {
  const { data } = await api.put(`/posts/${postId}/comments/${commentId}`, {
    comment,
  });
  return data;
};

export const fetchTours = async (status?: string) => {
  const endpoint = status ? `/tour/status/${status}` : '/tour/all/tours';
  const { data } = await api.get(endpoint);
  return data;
};

export const fetchTour = async (id: number) => {
  const { data } = await api.get(`/tour/${id}`);
  return data;
};

export const fetchReview = async (id: number) => {
  const { data } = await api.get(`/review/host/${id}`);
  return data;
};

export const likePost = async (postId: string) => {
  const { data } = await api.post(`/posts/${postId}/like`);
  return data;
};

export const unlikePost = async (postId: string) => {
  const { data } = await api.delete(`/posts/${postId}/like`);
  return data;
};

// Hosts API
export const fetchHosts = async () => {
  const { data } = await api.get('/user/all');
  return data;
};

export const fetchHost = async (id: string) => {
  const { data } = await api.get(`/user/profile/${id}`);
  return data;
};

export const fetchUserBookings = async () => {
  const { data } = await api.get('/booking');
  return data;
};
