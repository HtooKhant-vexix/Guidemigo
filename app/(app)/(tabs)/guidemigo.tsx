import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { MapPin, Calendar, Users, Star } from 'lucide-react-native';
import { useHosts, useTours } from '@/hooks/useData';
import { SkeletonHostCard } from '@/components/SkeletonHostCard';
import {
  Skeleton,
  SkeletonAvatar,
  SkeletonText,
  SkeletonCard,
} from '@/components/Skeleton';

const UPCOMING_TOURS = [
  {
    id: '1',
    name: 'Cultural Heritage Walk',
    date: '2024-02-15',
    time: '09:00 AM',
    location: 'Chinatown',
    guide: {
      name: 'Venkatesh',
      image: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6',
      rating: 4.8,
    },
    participants: 4,
  },
  {
    id: '2',
    name: 'Modern Architecture Tour',
    date: '2024-02-18',
    time: '02:00 PM',
    location: 'Marina Bay',
    guide: {
      name: 'Lokesh',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      rating: 4.9,
    },
    participants: 6,
  },
];

const RECOMMENDED_TOURS = [
  {
    id: '1',
    name: 'Night Photography Tour',
    price: 75,
    duration: '3 hours',
    rating: 4.9,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd',
  },
  {
    id: '2',
    name: 'Local Food Trail',
    price: 65,
    duration: '4 hours',
    rating: 4.8,
    reviews: 96,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
  },
  {
    id: '3',
    name: 'Historical Sites Walk',
    price: 55,
    duration: '2.5 hours',
    rating: 4.7,
    reviews: 84,
    image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170',
  },
];

export default function Guidemigo() {
  const { hosts, loading: userLoading, error: userErr } = useHosts();
  const { tours, loading, error } = useTours('AVAILABLE');
  console.log(tours, '......tours');

  if (loading) {
    return (
      <ScrollView style={styles.container}>
        {/* Skeleton Header */}
        <View style={styles.header}>
          <View style={styles.skeletonHeaderTitle} />
        </View>

        {/* Skeleton Upcoming Tours */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.skeletonSectionTitle} />
            <View style={styles.skeletonSeeAllButton} />
          </View>
          {Array.from({ length: 2 }).map((_, index) => (
            <View key={index} style={styles.upcomingTourCard}>
              <View style={styles.tourHeader}>
                <View>
                  <Skeleton
                    height={16}
                    width={150}
                    style={{ marginBottom: 4 }}
                  />
                  <View style={styles.locationContainer}>
                    <View style={styles.skeletonIcon} />
                    <Skeleton height={14} width={100} />
                  </View>
                </View>
                <View style={styles.dateContainer}>
                  <View style={styles.skeletonIcon} />
                  <Skeleton height={14} width={80} />
                  <Skeleton height={12} width={50} />
                </View>
              </View>
              <View style={styles.tourGuide}>
                <SkeletonAvatar size={40} />
                <View style={styles.guideInfo}>
                  <Skeleton
                    height={14}
                    width={120}
                    style={{ marginBottom: 2 }}
                  />
                  <View style={styles.guideStats}>
                    <View style={styles.skeletonIcon} />
                    <Skeleton height={12} width={30} />
                  </View>
                </View>
                <View style={styles.participantsContainer}>
                  <View style={styles.skeletonIcon} />
                  <Skeleton height={12} width={60} />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Skeleton Recommended Tours */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.skeletonSectionTitle} />
            <View style={styles.skeletonSeeAllButton} />
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendedContainer}
          >
            {Array.from({ length: 3 }).map((_, index) => (
              <View key={index} style={styles.recommendedCard}>
                <Skeleton height={160} style={styles.recommendedImage} />
                <View style={styles.recommendedContent}>
                  <Skeleton
                    height={16}
                    width={100}
                    style={styles.recommendedName}
                  />
                  <Skeleton
                    height={18}
                    width={60}
                    style={styles.recommendedPrice}
                  />
                  <View style={styles.recommendedStats}>
                    <View style={styles.stat}>
                      <View style={styles.skeletonIcon} />
                      <Skeleton height={12} width={40} />
                    </View>
                    <View style={styles.stat}>
                      <View style={styles.skeletonIcon} />
                      <Skeleton height={12} width={30} />
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Tours</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Tours</Text>
          <TouchableOpacity onPress={() => router.push('/tours/all')}>
            <Text style={styles.seeAllButton}>See All</Text>
          </TouchableOpacity>
        </View>
        {tours?.slice(0, 2).map((tour) => (
          <TouchableOpacity
            key={tour.id}
            style={styles.upcomingTourCard}
            onPress={() => router.push(`/tours/${tour.id}`)}
          >
            <View style={styles.tourHeader}>
              <View>
                <Text style={styles.tourName}>{tour.title}</Text>
                <View style={styles.locationContainer}>
                  <MapPin size={16} color="#00BCD4" />
                  <Text style={styles.locationText}>{tour.location.name}</Text>
                </View>
              </View>
              <View style={styles.dateContainer}>
                <Calendar size={16} color="#00BCD4" />
                <Text style={styles.dateText}>
                  {new Date(tour.startTime).toLocaleDateString()}
                </Text>
                <Text style={styles.timeText}>
                  {new Date(tour.startTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </View>

            <View style={styles.tourGuide}>
              <Image
                source={{
                  uri:
                    tour.host.profile?.image ||
                    'https://images.unsplash.com/photo-1565967511849-76a60a516170',
                }}
                style={styles.guideImage}
              />
              <View style={styles.guideInfo}>
                <Text style={styles.guideName}>
                  {tour.host.profile?.name || tour.host.email}
                </Text>
                <View style={styles.guideStats}>
                  <Star size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>
                    {tour.host.profile?.rating || 0}
                  </Text>
                </View>
              </View>
              <View style={styles.participantsContainer}>
                <Users size={16} color="#00BCD4" />
                <Text style={styles.participantsText}>
                  {tour._count.booking}/{tour.maxSeats} joined
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recommended Tours</Text>
          <TouchableOpacity onPress={() => router.push('/tours/all')}>
            <Text style={styles.seeAllButton}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recommendedContainer}
        >
          {tours.slice(0, 3).map((tour) => (
            <TouchableOpacity
              key={tour.id}
              style={styles.recommendedCard}
              onPress={() => router.push(`/tours/${tour.id}`)}
            >
              <Image
                source={{
                  uri:
                    tour.location.image ||
                    'https://images.unsplash.com/photo-1565967511849-76a60a516170',
                }}
                style={styles.recommendedImage}
              />
              <View style={styles.recommendedContent}>
                <Text style={styles.recommendedName}>{tour.title}</Text>
                <Text style={styles.recommendedPrice}>${tour.price}</Text>
                <View style={styles.recommendedStats}>
                  <View style={styles.stat}>
                    <Calendar size={14} color="#666" />
                    <Text style={styles.statText}>
                      {new Date(tour.startTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  <View style={styles.stat}>
                    <Star size={14} color="#FFD700" />
                    <Text style={styles.statText}>
                      {tour.host.profile?.rating || 0}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  header: {
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
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'InterSemiBold',
    color: '#000',
  },
  seeAllButton: {
    fontSize: 14,
    fontFamily: 'InterSemiBold',
    color: '#00BCD4',
  },
  upcomingTourCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  tourHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tourName: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#000',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
  },
  dateContainer: {
    alignItems: 'flex-end',
    gap: 4,
  },
  dateText: {
    fontSize: 14,
    fontFamily: 'InterSemiBold',
    color: '#000',
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Inter',
    color: '#666',
  },
  tourGuide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guideImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  guideInfo: {
    flex: 1,
  },
  guideName: {
    fontSize: 14,
    fontFamily: 'InterSemiBold',
    color: '#000',
    marginBottom: 2,
  },
  guideStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Inter',
    color: '#666',
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  participantsText: {
    fontSize: 12,
    fontFamily: 'Inter',
    color: '#666',
  },
  recommendedContainer: {
    paddingRight: 16,
  },
  recommendedCard: {
    width: 240,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  recommendedImage: {
    width: '100%',
    height: 160,
  },
  recommendedContent: {
    padding: 12,
  },
  recommendedName: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#000',
    marginBottom: 4,
  },
  recommendedPrice: {
    fontSize: 18,
    fontFamily: 'InterBold',
    color: '#00BCD4',
    marginBottom: 8,
  },
  recommendedStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    fontFamily: 'Inter',
    color: '#666',
  },
  skeletonHeaderTitle: {
    width: 150,
    height: 24,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginTop: 4,
  },
  skeletonSectionTitle: {
    width: 120,
    height: 18,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  skeletonSeeAllButton: {
    width: 60,
    height: 14,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  skeletonIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
});
