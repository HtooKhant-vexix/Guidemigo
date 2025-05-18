import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Users,
  Star,
} from 'lucide-react-native';
import { useTour } from '@/hooks/useData';

const TOURS = {
  '1': {
    id: '1',
    name: 'Cultural Heritage Tour',
    guide: {
      name: 'Venkatesh',
      image: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6',
      rating: 4.8,
      reviews: 24,
    },
    date: '2025-03-15',
    time: '09:00 AM',
    duration: '3 hours',
    location: 'Chinatown, Singapore',
    maxParticipants: 8,
    currentParticipants: 3,
    price: 75,
    description:
      "Explore the rich cultural heritage of Singapore's Chinatown. Visit historical temples, taste traditional cuisine, and learn about the area's fascinating history.",
    highlights: [
      'Visit the Buddha Tooth Relic Temple',
      'Explore traditional shophouses',
      'Sample local delicacies',
      'Learn about Chinese traditions',
    ],
    includes: [
      'Professional guide',
      'Food tastings',
      'Temple entrance fees',
      'Bottled water',
    ],
    meetingPoint: {
      name: 'Chinatown MRT Station',
      details: 'Exit A, Ground Level',
      coordinates: {
        lat: 1.2847,
        lng: 103.8445,
      },
    },
    images: [
      'https://images.pexels.com/photos/5087165/pexels-photo-5087165.jpeg',
      'https://images.pexels.com/photos/5087185/pexels-photo-5087185.jpeg',
      'https://images.pexels.com/photos/5087189/pexels-photo-5087189.jpeg',
    ],
  },
  '2': {
    id: '2',
    name: 'Modern Architecture Tour',
    guide: {
      name: 'Lokesh',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      rating: 4.9,
      reviews: 31,
    },
    date: '2025-03-16',
    time: '14:00 PM',
    duration: '4 hours',
    location: 'Marina Bay, Singapore',
    maxParticipants: 10,
    currentParticipants: 5,
    price: 89,
    description:
      "Discover Singapore's stunning modern architecture around Marina Bay. Learn about the design and engineering behind these architectural marvels.",
    highlights: [
      'Marina Bay Sands',
      'ArtScience Museum',
      'Gardens by the Bay',
      'Singapore Flyer',
    ],
    includes: [
      'Professional guide',
      'Entry tickets',
      'Photography tips',
      'Refreshments',
    ],
    meetingPoint: {
      name: 'Marina Bay Sands',
      details: 'Hotel Lobby, Tower 1',
      coordinates: {
        lat: 1.2847,
        lng: 103.861,
      },
    },
    images: [
      'https://images.pexels.com/photos/1538177/pexels-photo-1538177.jpeg',
      'https://images.pexels.com/photos/4101555/pexels-photo-4101555.jpeg',
      'https://images.pexels.com/photos/4101560/pexels-photo-4101560.jpeg',
    ],
  },
};

export default function TourDetail() {
  const { id } = useLocalSearchParams();
  console.log(id);
  const mockTour = TOURS[id as keyof typeof TOURS];
  const { tour, loading, error } = useTour(Number(id));
  console.log(tour, loading, error);

  if (tour.length < 1) {
    return (
      <View style={styles.container}>
        <Text>Tour not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.imageSlider}
        >
          {mockTour.images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.image} />
          ))}
        </ScrollView>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{tour.host.profile.name}</Text>

        <View style={styles.guideContainer}>
          <Image
            source={{
              uri: tour.host.profile.image
                ? tour.host.profile.image
                : 'https://images.pexels.com/photos/5087165/pexels-photo-5087165.jpeg',
            }}
            style={styles.guideImage}
          />
          <View style={styles.guideInfo}>
            <Text style={styles.guideName}>
              Guide: {tour.host.profile.name}
            </Text>
            <View style={styles.guideStats}>
              <Star size={16} color="#FFD700" />
              <Text style={styles.guideRating}>
                {tour.host.profile.rating || 0}
              </Text>
              <Text style={styles.guideReviews}>
                {/* ({tour.guide.reviews} reviews) */}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Calendar size={20} color="#00BCD4" />
            <View>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>
                {tour.startTime.slice(0, 10)}
              </Text>
              <Text style={styles.infoValue}>
                {tour.startTime.slice(11, 16)}
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Clock size={20} color="#00BCD4" />
            <View>
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>2:00</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <MapPin size={20} color="#00BCD4" />
            <View>
              <Text style={styles.infoLabel}>Location</Text>
              <Text style={styles.infoValue}>{tour.location.name}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Users size={20} color="#00BCD4" />
            <View>
              <Text style={styles.infoLabel}>Group Size</Text>
              <Text style={styles.infoValue}>
                {tour._count.booking}/{tour.maxSeats} joined
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Tour</Text>
          <Text style={styles.description}>{tour.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Highlights</Text>
          {tour.location.highlights.map((highlight, index) => (
            <View key={index} style={styles.highlightItem}>
              <View style={styles.bullet} />
              <Text style={styles.highlightText}>{highlight}</Text>
            </View>
          ))}
        </View>

        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>What's Included</Text>
          {tour.includes.map((item, index) => (
            <View key={index} style={styles.includeItem}>
              <View style={styles.bullet} />
              <Text style={styles.includeText}>{item}</Text>
            </View>
          ))}
        </View> */}

        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meeting Point</Text>
          <Text style={styles.meetingPointName}>{tour.meetingPoint.name}</Text>
          <Text style={styles.meetingPointDetails}>
            {tour.meetingPoint.details}
          </Text>
        </View> */}

        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Price per person</Text>
            <Text style={styles.price}>${tour.price}</Text>
          </View>
          <TouchableOpacity style={styles.bookButton}>
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
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
  imageSlider: {
    height: '100%',
  },
  image: {
    width: 600,
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
  title: {
    fontSize: 24,
    fontFamily: 'InterBold',
    color: '#000',
    marginBottom: 16,
  },
  guideContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  guideImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  guideInfo: {
    flex: 1,
  },
  guideName: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#000',
    marginBottom: 4,
  },
  guideStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  guideRating: {
    fontSize: 14,
    fontFamily: 'InterSemiBold',
    color: '#000',
  },
  guideReviews: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  infoItem: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Inter',
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'InterSemiBold',
    color: '#000',
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
  description: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#444',
    lineHeight: 24,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00BCD4',
  },
  highlightText: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#444',
  },
  includeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  includeText: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#444',
  },
  meetingPointName: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#000',
    marginBottom: 4,
  },
  meetingPointDetails: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    fontFamily: 'Inter',
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 24,
    fontFamily: 'InterBold',
    color: '#00BCD4',
  },
  bookButton: {
    backgroundColor: '#00BCD4',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  bookButtonText: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#fff',
  },
});
