import { useState, useEffect } from 'react';
import { Host, Place, Post } from '../types/api';
import {
  fetchHosts,
  fetchHost,
  fetchPlaces,
  fetchPlace,
  fetchPosts,
  likePost,
  unlikePost,
  fetchTour,
} from '../service/api';

export function useHosts() {
  const [hosts, setHosts] = useState<Host[]>([]);
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

  return { hosts, loading, error };
}

export function useHost(id: string) {
  const [host, setHost] = useState<Host | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHost() {
      try {
        const data = await fetchHost(id);
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
        setPlaces(data?.data);
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

export function usePlace(id: string) {
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlace() {
      try {
        const data = await fetchPlace(id);
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

  return { posts, loading, error, handleLike };
}
export function useTours() {
  const [tours, setTours] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      try {
        const data = await fetchTour();
        // console.error('Fetched posts:', data.data[0]);
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
  }, []);



  return { tours, loading, error };
}
