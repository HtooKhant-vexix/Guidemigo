import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import {
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  MoveHorizontal as MoreHorizontal,
} from 'lucide-react-native';
import { useState } from 'react';

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

export default function Feed() {
  const [posts, setPosts] = useState(POSTS);

  const toggleLike = (postId: string) => {
    setPosts(
      posts.map((post) => {
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
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Activity Feed</Text>
        <TouchableOpacity
          style={styles.newPostButton}
          onPress={() => router.push('/feed/new-post')}
        >
          <Text style={styles.newPostButtonText}>New Post</Text>
        </TouchableOpacity>
      </View>

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
          {posts.map((post, index) => (
            <TouchableOpacity
              key={index}
              style={styles.storyButton}
              onPress={() => router.push(`/feed/story/${post.id}`)}
            >
              <Image
                source={{ uri: post.user.avatar }}
                style={styles.storyAvatar}
              />
              <Text style={styles.storyName} numberOfLines={1}>
                {post.user.name.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {posts.map((post) => (
        <View key={post.id} style={styles.post}>
          <View style={styles.postHeader}>
            <TouchableOpacity
              style={styles.userInfo}
              onPress={() => router.push(`/profile/${post.user.name}`)}
            >
              <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
              <View>
                <View style={styles.nameContainer}>
                  <Text style={styles.userName}>{post.user.name}</Text>
                  {post.user.isVerified && (
                    <View style={styles.verifiedBadge}>
                      <Text style={styles.verifiedText}>✓</Text>
                    </View>
                  )}
                </View>
                <View style={styles.locationContainer}>
                  <MapPin size={12} color="#666" />
                  <Text style={styles.location}>{post.location}</Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <MoreHorizontal size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => router.push(`/feed/post/${post.id}`)}
            style={styles.postContent}
          >
            <Text style={styles.postText}>{post.content}</Text>
            <Image source={{ uri: post.images[0] }} style={styles.postImage} />
          </TouchableOpacity>

          <View style={styles.postActions}>
            <View style={styles.leftActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => toggleLike(post.id)}
              >
                <Heart
                  size={24}
                  color={post.isLiked ? '#FF4444' : '#666'}
                  fill={post.isLiked ? '#FF4444' : 'transparent'}
                />
                <Text style={styles.actionText}>{post.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push(`/feed/post/${post.id}#comments`)}
              >
                <MessageCircle size={24} color="#666" />
                <Text style={styles.actionText}>{post.comments}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.actionButton}>
              <Share2 size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.postFooter}>
            <Text style={styles.timestamp}>{post.timestamp}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
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
});
