import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import {
  ArrowLeft,
  Star,
  Globe,
  Users,
  Calendar,
  X,
  MapPin,
} from 'lucide-react-native';
import { useHost, useHosts, useReview, useTours } from '@/hooks/useData';
import { useEffect, useState } from 'react';

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
  const { loading, error, review } = useReview(Number(id));
  const {
    host: single_host,
    loading: single_loading,
    error: single_err,
  } = useHost(Number(id));
  const { tours } = useTours();
  const [showToursModal, setShowToursModal] = useState(false);

  const hostTours = tours
    .filter(
      (tour) => tour.host?.id === Number(id) && tour.status === 'AVAILABLE'
    )
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

  if (!host) {
    return (
      <View style={styles.container}>
        <Text>Host not found</Text>
      </View>
    );
  }

  console.log(review, 'this is the review');

  const renderToursModal = () => (
    <Modal
      visible={showToursModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowToursModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Available Tours</Text>
            <TouchableOpacity onPress={() => setShowToursModal(false)}>
              <X size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.toursList}>
            {hostTours && hostTours.length > 0 ? (
              hostTours.map((tour) => (
                <TouchableOpacity
                  key={tour.id}
                  style={styles.tourCard}
                  onPress={() => {
                    setShowToursModal(false);
                    router.push(`/tours/${tour.id}`);
                  }}
                >
                  <Image
                    source={{
                      uri:
                        tour.location?.image ||
                        'https://images.unsplash.com/photo-1565967511849-76a60a516170',
                    }}
                    style={styles.tourImage}
                  />
                  <View style={styles.tourInfo}>
                    <Text style={styles.tourName}>{tour.title}</Text>
                    <View style={styles.tourDetails}>
                      <Calendar size={16} color="#00BCD4" />
                      <Text style={styles.tourDate}>
                        {tour.startTime?.slice(0, 10)}
                      </Text>
                    </View>
                    <View style={styles.tourDetails}>
                      <MapPin size={16} color="#00BCD4" />
                      <Text style={styles.tourLocation}>
                        {tour.location?.name || 'No location'}
                      </Text>
                    </View>
                    <Text style={styles.tourPrice}>${tour.price}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noDataText}>
                No tours available at the moment
              </Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={
            single_host?.image
              ? {
                  uri: single_host?.image,
                }
              : require('../../../assets/images/default.jpg')
          }
          style={styles.image}
        />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.name}>{single_host?.name}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Star size={16} color="#FFD700" />
            <Text style={styles.statText}>
              {single_host?.rating || 0} Rating
            </Text>
          </View>
          <View style={styles.stat}>
            <Globe size={16} color="#00BCD4" />
            <Text style={styles.statText}>
              {single_host?.languages.join(', ')}
            </Text>
          </View>
          <View style={styles.stat}>
            <Users size={16} color="#00BCD4" />
            <Text style={styles.statText}>
              {single_host?.travelers || 0} Travelers
            </Text>
          </View>
          <View style={styles.stat}>
            <Calendar size={16} color="#00BCD4" />
            <Text style={styles.statText}>{single_host?.experience || 0}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bio}>{single_host?.bio}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expertise</Text>
          <View style={styles.expertiseContainer}>
            {single_host?.expertise && single_host.expertise.length > 0 ? (
              single_host.expertise.map((item, index) => (
                <View key={index} style={styles.expertiseItem}>
                  <Text style={styles.expertiseText}>
                    {typeof item === 'string' ? item : item.name}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>
                No expertise areas specified yet
              </Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reviews</Text>
          {review && review.length > 0 ? (
            review.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewUser}>
                    {review.user?.profile?.name ||
                      review.user?.email ||
                      'Anonymous User'}
                  </Text>
                  <Text style={styles.reviewRating}>
                    ★ {review.rating || 0}
                  </Text>
                </View>
                <Text style={styles.reviewComment}>
                  {review.comment || 'No comment provided'}
                </Text>
                <Text style={styles.reviewDate}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No reviews yet</Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => setShowToursModal(true)}
        >
          <Text style={styles.bookButtonText}>Book a Tour</Text>
        </TouchableOpacity>
      </View>

      {renderToursModal()}
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
  reviewDate: {
    fontSize: 12,
    fontFamily: 'Inter',
    color: '#999',
    marginTop: 8,
  },
  bookButton: {
    backgroundColor: '#00BCD4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 'auto',
  },
  bookButtonText: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#fff',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'InterBold',
    color: '#000',
  },
  toursList: {
    marginTop: 16,
  },
  tourCard: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  tourImage: {
    width: 120,
    height: 120,
  },
  tourInfo: {
    flex: 1,
    padding: 12,
  },
  tourName: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#000',
    marginBottom: 8,
  },
  tourDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  tourDate: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
  },
  tourLocation: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
  },
  tourPrice: {
    fontSize: 18,
    fontFamily: 'InterBold',
    color: '#00BCD4',
    marginTop: 8,
  },
  noDataText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },
});
