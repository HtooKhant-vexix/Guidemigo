import { memo, useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import {
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  MoveHorizontal as MoreHorizontal,
} from 'lucide-react-native';
import { usePosts } from '@/hooks/useData';
import { SkeletonFeedPost } from '@/components/SkeletonFeedPost';
import { Skeleton } from '@/components/Skeleton';

const POSTS = [
  {
    id: '1',
    user: {
      name: 'Sarah Chen',
      avatar:
        'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      isVerified: true,
    },
    location: 'Gardens by the Bay',
    content:
      'The Supertree Grove light show was absolutely magical tonight! 🌳✨ Must-see if youre visiting Singapore.',
    images: [
      'https://images.pexels.com/photos/1057840/pexels-photo-1057840.jpeg',
    ],
    likes: 234,
    comments: 42,
    timestamp: '2h ago',
    isLiked: false,
  },
  {
    id: '2',
    user: {
      name: 'Mike Wong',
      avatar:
        'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
      isVerified: true,
    },
    location: 'Maxwell Food Centre',
    content:
      'Found the best Hainanese chicken rice in Singapore! The queue was worth it. 😋🍗',
    images: [
      'https://images.pexels.com/photos/5409015/pexels-photo-5409015.jpeg',
    ],
    likes: 156,
    comments: 28,
    timestamp: '4h ago',
    isLiked: true,
  },
  {
    id: '3',
    user: {
      name: 'Emily Tan',
      avatar:
        'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
      isVerified: false,
    },
    location: 'Chinatown',
    content:
      'Exploring the vibrant streets of Chinatown during Mid-Autumn Festival. The lanterns are so beautiful! 🏮',
    images: [
      'https://images.pexels.com/photos/2187605/pexels-photo-2187605.jpeg',
    ],
    likes: 312,
    comments: 45,
    timestamp: '6h ago',
    isLiked: false,
  },
];

interface PostProps {
  post: {
    id: string;
    content: string;
    name: string;
    avatar: string;
    isVerified?: boolean;
  };
  onLike: (postId: string) => void;
}

interface PostHeaderProps {
  user: {
    name: string;
    avatar: string;
    isVerified?: boolean;
  };
  location: string;
}

interface PostContentProps {
  content: string;
  images: string;
  onPress: () => void;
}

interface PostActionsProps {
  post: any;
  onLike: (postId: string) => void;
}

interface StoryProps {
  story: {
    id: string;
    user: {
      name: string;
      avatar: string;
      isVerified: boolean;
    };
  };
  onPress: () => void;
}

const PostHeader = memo(({ user, location }: PostHeaderProps) => (
  <View style={styles.postHeader}>
    <TouchableOpacity
      style={styles.userInfo}
      // onPress={() =>
      //   router.push({
      //     pathname: '/(app)/profile/[id]',
      //     params: { id: user.name },
      //   })
      // }
    >
      <Image
        source={{
          uri: user.author.profile.image
            ? user.author.profile.image
            : 'https://images.pexels.com/photos/2187605/pexels-photo-2187605.jpeg',
        }}
        style={styles.avatar}
      />
      <View>
        <View style={styles.nameContainer}>
          <Text style={styles.userName}>{user.author.profile.name}</Text>
          {user.isVerified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓</Text>
            </View>
          )}
        </View>
        <View style={styles.locationContainer}>
          <MapPin size={12} color="#666" />
          <Text style={styles.location}>{location}</Text>
        </View>
      </View>
    </TouchableOpacity>
    <TouchableOpacity>
      <MoreHorizontal size={24} color="#666" />
    </TouchableOpacity>
  </View>
));

const PostContent = memo(({ content, images, onPress }: PostContentProps) => (
  <TouchableOpacity onPress={onPress} style={styles.postContent}>
    <Text style={styles.postText}>{content}</Text>
    <Image source={{ uri: images }} style={styles.postImage} />
  </TouchableOpacity>
));

const PostActions = memo(({ post, onLike }: PostActionsProps) => (
  <View style={styles.postActions}>
    <View style={styles.leftActions}>
      <TouchableOpacity
        style={styles.actionButton}
        onPress={() => onLike(post.id)}
      >
        <Heart
          size={24}
          color={post.isLiked ? '#FF4444' : '#666'}
          fill={post.isLiked ? '#FF4444' : 'transparent'}
        />
        <Text style={styles.actionText}>{post.like || 0}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.actionButton}
        // onPress={() =>
        //   router.push({
        //     pathname: '/(app)/feed/post/[id]',
        //     params: { id: post.id },
        //   })
        // }
      >
        <MessageCircle size={24} color="#666" />
        <Text style={styles.actionText}>{post.comments || 0}</Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity style={styles.actionButton}>
      <Share2 size={24} color="#666" />
    </TouchableOpacity>
  </View>
));

const Post = memo(({ post, onLike }: PostProps) => (
  <View style={styles.post}>
    <PostHeader user={post} location={'singapore'} />
    <PostContent
      content={post.content}
      // images={'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6'}
      images={post?.image.length > 0 ? post?.image[0].url : ''}
      // onPress={() => router.push('/feed/post/' + post.id)}
    />
    <PostActions post={post} onLike={onLike} />
    <View style={styles.postFooter}>
      <Text style={styles.timestamp}>2hr ago</Text>
    </View>
  </View>
));

const Story = memo(({ story, onPress }: StoryProps) => (
  <TouchableOpacity style={styles.storyButton} onPress={onPress}>
    <Image source={{ uri: story.user.avatar }} style={styles.storyAvatar} />
    <Text style={styles.storyName} numberOfLines={1}>
      {story.user.name.split(' ')[0]}
    </Text>
  </TouchableOpacity>
));

export default function Feed() {
  const { posts: data, loading, error, handleLike } = usePosts();

  const [posts, setPosts] = useState(POSTS);
  // console.log('........', data[0].author.profile.name);
  console.log(data[0]?.image[0].url, 'this is the data');

  const toggleLike = useCallback((postId: string) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
          };
        }
        return post;
      })
    );
  }, []);

  const headerContent = useMemo(
    () => (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity Feed</Text>
        <TouchableOpacity
          style={styles.newPostButton}
          onPress={() => router.push('/feed/new-post')}
        >
          <Text style={styles.newPostButtonText}>New Post</Text>
        </TouchableOpacity>
      </View>
    ),
    []
  );

  const storiesContent = useMemo(
    () => (
      <View style={styles.stories}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesContainer}
        >
          <TouchableOpacity style={styles.addStoryButton}>
            <View style={styles.addStoryIcon}>
              <Text style={styles.plusIcon}>+</Text>
            </View>
            <Text style={styles.addStoryText}>Add Story</Text>
          </TouchableOpacity>
          {posts.map((post) => (
            <Story
              key={post.id}
              story={post}
              onPress={() => router.push(`/feed/story/${post.id}`)}
            />
          ))}
        </ScrollView>
      </View>
    ),
    [posts]
  );
  const renderContent = () => {
    if (loading) {
      return (
        <ScrollView style={styles.container}>
          {/* Skeleton Header */}
          <View style={styles.header}>
            <View style={styles.skeletonHeaderTitle} />
            <View style={styles.skeletonNewPostButton} />
          </View>

          {/* Skeleton Feed Posts */}
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonFeedPost key={index} />
          ))}
        </ScrollView>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.container}>
        {headerContent}
        {/* {storiesContent} */}
        {data.reverse().map((post) => (
          <Post key={post.id} post={post} onLike={toggleLike} />
        ))}
      </ScrollView>
    );
  };
  return <>{renderContent()}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'sticky',
    top: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'InterBold',
    color: '#000',
  },
  newPostButton: {
    backgroundColor: '#00BCD4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  newPostButtonText: {
    color: '#fff',
    fontFamily: 'InterSemiBold',
    fontSize: 14,
  },
  stories: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
  },
  storiesContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  addStoryButton: {
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Inter',
  },
  addStoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  plusIcon: {
    fontSize: 24,
    color: '#00BCD4',
    fontFamily: 'InterSemiBold',
  },
  addStoryText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Inter',
  },
  storyButton: {
    alignItems: 'center',
  },
  storyAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#00BCD4',
    marginBottom: 4,
  },
  storyName: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Inter',
    maxWidth: 64,
  },
  post: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 16,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#000',
  },
  verifiedBadge: {
    backgroundColor: '#00BCD4',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: 'InterBold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 12,
    fontFamily: 'Inter',
    color: '#666',
  },
  postContent: {
    gap: 12,
  },
  postText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#000',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  postImage: {
    width: '100%',
    height: 300,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
  },
  postFooter: {
    paddingHorizontal: 16,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter',
    color: '#666',
  },

  // Skeleton Styles
  skeletonHeaderTitle: {
    width: 180,
    height: 28,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  skeletonNewPostButton: {
    width: 100,
    height: 36,
    backgroundColor: '#e0e0e0',
    borderRadius: 18,
  },
});
