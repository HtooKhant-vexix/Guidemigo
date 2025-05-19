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
  const { tours, loading, error } = useTours();
  // console.log(hosts, '......hosts');
  console.log(tours, '......tours');

  if (loading) {
    return (
      <ScrollView style={styles.container}>
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonHostCard key={index} />
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

  // const upcomingTours = hosts?.slice(0, 2).map((host) => ({
  //   id: host.id,
  //   name: `Tour with ${host.name}`,
  //   date: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000)
  //     .toISOString()
  //     .split('T')[0],
  //   time: '09:00 AM',
  //   location: 'Singapore',
  //   guide: {
  //     name: host.name,
  //     image: host.image,
  //     rating: host.rating,
  //   },
  //   participants: Math.floor(Math.random() * 8) + 2,
  // }));

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
                  {tour?.startTime?.slice(0, 10)}
                </Text>
                <Text style={styles.timeText}>
                  {tour?.startTime?.slice(11, 16)}
                </Text>
              </View>
            </View>

            <View style={styles.tourGuide}>
              <Image
                source={{
                  uri: tour.host.profile.image
                    ? tour.host.profile.image
                    : 'https://images.unsplash.com/photo-1565967511849-76a60a516170',
                }}
                style={styles.guideImage}
              />
              <View style={styles.guideInfo}>
                <Text style={styles.guideName}>{tour.host.profile.name}</Text>
                <View style={styles.guideStats}>
                  <Star size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>
                    {tour.host.profile.rating || 0}
                  </Text>
                </View>
              </View>
              <View style={styles.participantsContainer}>
                <Users size={16} color="#00BCD4" />
                <Text style={styles.participantsText}>
                  {tour._count.booking} joined
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
                  uri: tour.host.profile.image
                    ? tour.host.profile.image
                    : 'https://images.unsplash.com/photo-1565967511849-76a60a516170',
                }}
                style={styles.recommendedImage}
              />
              <View style={styles.recommendedContent}>
                <Text style={styles.recommendedName}>{tour.title}</Text>
                <Text style={styles.recommendedPrice}>${tour.price}</Text>
                <View style={styles.recommendedStats}>
                  <View style={styles.stat}>
                    <Calendar size={14} color="#666" />
                    <Text style={styles.statText}>2:00</Text>
                  </View>
                  <View style={styles.stat}>
                    <Star size={14} color="#FFD700" />
                    <Text style={styles.statText}>
                      {tour.host.profile.rating || 0}
                      {/* ({tour.reviews}) */}
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
});
