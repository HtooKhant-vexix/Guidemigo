import { useState, useEffect } from 'react';
import { Host, Place, Post } from '../types/api';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import {
  fetchHosts,
  fetchHost,
  fetchPlaces,
  fetchPlace,
  fetchPosts,
  likePost,
  unlikePost,
  fetchTour,
  NewPost,
  fetchReview,
  fetchTours,
} from '../service/api';

export function useHosts() {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [host, setHost] = useState<Host | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHosts() {
      try {
        const data = await fetchHosts();
        setHosts(data.data);
        setError(null);
      } catch (err) {
        setError('Failed to load hosts');
        console.error('Error loading hosts:', err);
      } finally {
        setLoading(false);
      }
    }

    loadHosts();
  }, []);

  return { hosts, host, loading, error };
}

export function useHost(id: number) {
  const [host, setHost] = useState<Host | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHost() {
      try {
        const { data } = await fetchHost(id);
        setHost(data);
        setError(null);
      } catch (err) {
        setError('Failed to load host details');
        console.error('Error loading host:', err);
      } finally {
        setLoading(false);
      }
    }

    loadHost();
  }, [id]);

  return { host, loading, error };
}

export function usePlaces() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlaces() {
      try {
        const data = await fetchPlaces();
        setPlaces((data as { data: Place[] }).data);
        setError(null);
      } catch (err) {
        setError('Failed to load places');
        console.error('Error loading places:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPlaces();
  }, []);

  return { places, loading, error };
}

export function usePlace(id: number) {
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlace() {
      try {
        const { data } = await fetchPlace(id);
        setPlace(data);
        setError(null);
      } catch (err) {
        setError('Failed to load place details');
        console.error('Error loading place:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPlace();
  }, [id]);

  return { place, loading, error };
}

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await fetchPosts();
        // console.error('Fetched posts:', data.data[0]);
        setPosts(data.data);
        setError(null);
      } catch (err) {
        setError('Failed to load posts');
        console.error('Error loading posts:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  const handleLike = async (postId: string, isLiked: boolean) => {
    try {
      if (isLiked) {
        await unlikePost(postId);
      } else {
        await likePost(postId);
      }

      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              isLiked: !isLiked,
              likes: isLiked ? post.likes - 1 : post.likes + 1,
            };
          }
          return post;
        })
      );
    } catch (err) {
      console.error('Error updating like:', err);
    }
  };
  const deletePost = async (postId: string) => {
    try {
      await deletePost(postId);
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };
  const updatePost = async (
    postId: string,
    postData: {
      content: string;
      location?: string;
      images?: string[];
    }
  ) => {
    try {
      const updatedPost = await updatePost(postId, postData);
      setPosts(posts.map((post) => (post.id === postId ? updatedPost : post)));
    } catch (err) {
      console.error('Error updating post:', err);
    }
  };
  const addComment = async (postId: string, comment: string) => {
    try {
      const updatedPost = await addComment(postId, comment);
      setPosts(posts.map((post) => (post.id === postId ? updatedPost : post)));
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };
  const deleteComment = async (postId: string, commentId: string) => {
    try {
      const updatedPost = await deleteComment(postId, commentId);
      setPosts(posts.map((post) => (post.id === postId ? updatedPost : post)));
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };
  const updateComment = async (
    postId: string,
    commentId: string,
    comment: string
  ) => {
    try {
      const updatedPost = await updateComment(postId, commentId, comment);
      setPosts(posts.map((post) => (post.id === postId ? updatedPost : post)));
    } catch (err) {
      console.error('Error updating comment:', err);
    }
  };
  const createPost = async (postData: {
    content: string;
    location?: string;
    images?: Array<{
      uri: string;
      type: string;
      name: string;
    }>;
  }) => {
    try {
      const formData = new FormData();
      formData.append('content', postData.content);
      if (postData.location) {
        formData.append('location', postData.location);
      }

      if (postData.images && postData.images.length > 0) {
        postData.images.forEach((image, index) => {
          if (image.uri.startsWith('file://')) {
            formData.append('images', {
              uri: image.uri,
              type: image.type,
              name: image.name,
            } as any);
          }
        });
      }

      const { data } = await NewPost(formData);
      console.log(data, 'new post');
      if (data) {
        setPosts([data as Post, ...posts]);
        Alert.alert('Success', 'Post created successfully');
        router.back();
      }
    } catch (err) {
      console.error('Error creating post:', err);
      throw err;
    }
  };

  return { posts, loading, createPost, error, handleLike };
}

export function useTours(status?: string) {
  const [tours, setTours] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await fetchTours(status);
        setTours(data.data);
        setError(null);
      } catch (err) {
        setError('Failed to load posts');
        console.error('Error loading posts:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, [status]);

  return { tours, loading, error };
}

export function useTour(id: number) {
  const [tour, setTour] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        console.log('load');
        const data = await fetchTour(id);
        console.log(data.data, 'thiioshofhaoihfo');
        // console.error('Fetched posts:', data.data[0]);
        setTour(data.data);
        setError(null);
      } catch (err) {
        setError('Failed to load posts');
        console.error('Error loading posts:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, []);

  return { tour, loading, error };
}

export function useReview(id: number) {
  const [review, setReview] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts(id: number) {
      try {
        const data = await fetchReview(id);
        // console.error('Fetched posts:', data.data[0]);
        setReview(data.data);
        setError(null);
      } catch (err) {
        setError('Failed to load posts');
        console.error('Error loading posts:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPosts(id);
  }, []);

  return { review, loading, error };
}
