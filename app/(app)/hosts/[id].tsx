import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Star, Globe, Users, Calendar } from 'lucide-react-native';

const HOSTS = {
  '1': {
    id: '1',
    name: 'Venkatesh',
    languages: ['Mandarin', 'English'],
    travelers: 12,
    image: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6',
    rating: 4.8,
    experience: '3 years',
    bio: "Professional tour guide with extensive knowledge of Singapore's history and culture. Specialized in cultural and historical tours, focusing on providing authentic local experiences.",
    expertise: [
      'Cultural Heritage',
      'Local Cuisine',
      'Historical Sites',
      'Photography Spots',
    ],
    reviews: [
      {
        id: '1',
        user: 'Sarah',
        rating: 5,
        comment:
          'Amazing experience! Venkatesh knows all the hidden gems of Singapore.',
      },
      {
        id: '2',
        user: 'Mike',
        rating: 4.5,
        comment: 'Very knowledgeable and friendly guide. Highly recommended!',
      },
    ],
  },
  '2': {
    id: '2',
    name: 'Lokesh',
    languages: ['Mandarin', 'English'],
    travelers: 23,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    rating: 4.9,
    experience: '5 years',
    bio: "Passionate about sharing Singapore's modern architecture and urban development. Expert in creating unique experiences that blend technology with tradition.",
    expertise: [
      'Modern Architecture',
      'Urban Planning',
      'Tech Innovations',
      'Night Tours',
    ],
    reviews: [
      {
        id: '1',
        user: 'Emma',
        rating: 5,
        comment: 'Lokesh made our Singapore trip unforgettable!',
      },
      {
        id: '2',
        user: 'John',
        rating: 5,
        comment: "Best guide we've ever had. Very informative and fun.",
      },
    ],
  },
  '3': {
    id: '2',
    name: 'Priya',
    languages: ['Tamil', 'English'],
    travelers: 18,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    rating: 4.7,
    experience: '5 years',
    bio: "Passionate about sharing Singapore's modern architecture and urban development. Expert in creating unique experiences that blend technology with tradition.",
    expertise: ['Heritage Walks', 'Photography'],
    reviews: [
      {
        id: '1',
        user: 'Emma',
        rating: 5,
        comment: 'Lokesh made our Singapore trip unforgettable!',
      },
      {
        id: '2',
        user: 'John',
        rating: 5,
        comment: "Best guide we've ever had. Very informative and fun.",
      },
    ],
  },
  '4': {
    id: '2',
    name: 'Michael',
    languages: ['Japanese', 'English'],
    travelers: 31,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    rating: 4.9,
    experience: '5 years',
    bio: "Passionate about sharing Singapore's modern architecture and urban development. Expert in creating unique experiences that blend technology with tradition.",
    expertise: ['Adventure Tours', 'Nature Walks'],
    reviews: [
      {
        id: '1',
        user: 'Emma',
        rating: 5,
        comment: 'Lokesh made our Singapore trip unforgettable!',
      },
      {
        id: '2',
        user: 'John',
        rating: 5,
        comment: "Best guide we've ever had. Very informative and fun.",
      },
    ],
  },
};

export default function HostDetail() {
  const { id } = useLocalSearchParams();
  const host = HOSTS[id as keyof typeof HOSTS];

  if (!host) {
    return (
      <View style={styles.container}>
        <Text>Host not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: host.image }} style={styles.image} />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{host.name}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Star size={16} color="#FFD700" />
            <Text style={styles.statText}>{host.rating} Rating</Text>
          </View>
          <View style={styles.stat}>
            <Globe size={16} color="#00BCD4" />
            <Text style={styles.statText}>{host.languages.join(', ')}</Text>
          </View>
          <View style={styles.stat}>
            <Users size={16} color="#00BCD4" />
            <Text style={styles.statText}>{host.travelers} Travelers</Text>
          </View>
          <View style={styles.stat}>
            <Calendar size={16} color="#00BCD4" />
            <Text style={styles.statText}>{host.experience}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bio}>{host.bio}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expertise</Text>
          <View style={styles.expertiseContainer}>
            {host.expertise.map((item, index) => (
              <View key={index} style={styles.expertiseItem}>
                <Text style={styles.expertiseText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          {host.reviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewUser}>{review.user}</Text>
                <Text style={styles.reviewRating}>★ {review.rating}</Text>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Book a Tour</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'relative',
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
    marginTop: -20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  name: {
    fontSize: 24,
    fontFamily: 'InterBold',
    color: '#000',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'InterSemiBold',
    color: '#000',
    marginBottom: 12,
  },
  bio: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#444',
    lineHeight: 24,
  },
  expertiseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  expertiseItem: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  expertiseText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
  },
  reviewCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewUser: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#000',
  },
  reviewRating: {
    fontSize: 14,
    fontFamily: 'InterSemiBold',
    color: '#FFD700',
  },
  reviewComment: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#444',
  },
  bookButton: {
    backgroundColor: '#00BCD4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  bookButtonText: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#fff',
  },
});
