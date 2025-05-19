import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Clock,
  Filter,
  Search,
} from 'lucide-react-native';
import { useState, useEffect, useRef } from 'react';

interface Booking {
  id: string;
  tourName: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'completed';
  image: string;
  price: number;
  participants: number;
  guide: {
    name: string;
    image: string;
  };
}

// Mock data for bookings
const MOCK_BOOKINGS: Booking[] = [
  {
    id: '1',
    tourName: 'Cultural Heritage Tour',
    date: '2024-03-15',
    time: '09:00',
    location: 'Chinatown, Singapore',
    status: 'upcoming',
    image: 'https://images.pexels.com/photos/5087165/pexels-photo-5087165.jpeg',
    price: 75,
    participants: 2,
    guide: {
      name: 'Venkatesh',
      image: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6',
    },
  },
  {
    id: '2',
    tourName: 'Modern Architecture Tour',
    date: '2024-03-20',
    time: '14:00',
    location: 'Marina Bay, Singapore',
    status: 'upcoming',
    image: 'https://images.pexels.com/photos/1538177/pexels-photo-1538177.jpeg',
    price: 89,
    participants: 1,
    guide: {
      name: 'Lokesh',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    },
  },
  {
    id: '3',
    tourName: 'Food Tour',
    date: '2024-02-28',
    time: '11:00',
    location: 'Little India, Singapore',
    status: 'completed',
    image: 'https://images.pexels.com/photos/4101555/pexels-photo-4101555.jpeg',
    price: 65,
    participants: 3,
    guide: {
      name: 'Priya',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    },
  },
];

const SkeletonBookingCard = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.bookingCard}>
      <Animated.View style={[styles.bookingImage, { opacity }]} />
      <View style={styles.bookingContent}>
        <Animated.View style={[styles.skeletonTitle, { opacity }]} />

        <View style={styles.bookingDetails}>
          <View style={styles.detailRow}>
            <Animated.View style={[styles.skeletonIcon, { opacity }]} />
            <Animated.View
              style={[styles.skeletonText, { opacity, width: 80 }]}
            />
            <Animated.View
              style={[styles.skeletonIcon, { opacity, marginLeft: 16 }]}
            />
            <Animated.View
              style={[styles.skeletonText, { opacity, width: 60 }]}
            />
          </View>

          <View style={styles.detailRow}>
            <Animated.View style={[styles.skeletonIcon, { opacity }]} />
            <Animated.View
              style={[styles.skeletonText, { opacity, width: 200 }]}
            />
          </View>

          <View style={styles.detailRow}>
            <Animated.View style={[styles.skeletonIcon, { opacity }]} />
            <Animated.View
              style={[styles.skeletonText, { opacity, width: 120 }]}
            />
          </View>
        </View>

        <View style={styles.bookingFooter}>
          <View style={styles.guideInfo}>
            <Animated.View style={[styles.skeletonAvatar, { opacity }]} />
            <Animated.View
              style={[styles.skeletonText, { opacity, width: 100 }]}
            />
          </View>
          <View style={styles.priceContainer}>
            <Animated.View
              style={[styles.skeletonText, { opacity, width: 40 }]}
            />
            <Animated.View style={[styles.skeletonPrice, { opacity }]} />
          </View>
        </View>

        <Animated.View style={[styles.skeletonStatus, { opacity }]} />
      </View>
    </View>
  );
};

export default function Bookings() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const filteredBookings = MOCK_BOOKINGS.filter((booking) => {
    if (activeFilter === 'all') return true;
    return booking.status === activeFilter;
  });

  const renderBookingCard = (booking: Booking) => (
    <TouchableOpacity
      key={booking.id}
      style={styles.bookingCard}
      onPress={() => router.push(`/tours/${booking.id}`)}
    >
      <Image source={{ uri: booking.image }} style={styles.bookingImage} />
      <View style={styles.bookingContent}>
        <Text style={styles.tourName}>{booking.tourName}</Text>

        <View style={styles.bookingDetails}>
          <View style={styles.detailRow}>
            <Calendar size={16} color="#00BCD4" />
            <Text style={styles.detailText}>{booking.date}</Text>
            <Clock size={16} color="#00BCD4" style={styles.detailIcon} />
            <Text style={styles.detailText}>{booking.time}</Text>
          </View>

          <View style={styles.detailRow}>
            <MapPin size={16} color="#00BCD4" />
            <Text style={styles.detailText}>{booking.location}</Text>
          </View>

          <View style={styles.detailRow}>
            <Users size={16} color="#00BCD4" />
            <Text style={styles.detailText}>
              {booking.participants} participants
            </Text>
          </View>
        </View>

        <View style={styles.bookingFooter}>
          <View style={styles.guideInfo}>
            <Image
              source={{ uri: booking.guide.image }}
              style={styles.guideImage}
            />
            <Text style={styles.guideName}>{booking.guide.name}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Total</Text>
            <Text style={styles.price}>
              ${booking.price * booking.participants}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.statusBadge,
            booking.status === 'upcoming'
              ? styles.upcomingBadge
              : styles.completedBadge,
          ]}
        >
          <Text style={styles.statusText}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>My Bookings</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          {['all', 'upcoming', 'completed'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                activeFilter === filter && styles.activeFilterChip,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  activeFilter === filter && styles.activeFilterChipText,
                ]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <ScrollView style={styles.bookingsList}>
          {[1, 2, 3].map((_, index) => (
            <SkeletonBookingCard key={index} />
          ))}
        </ScrollView>
      ) : (
        <ScrollView style={styles.bookingsList}>
          {filteredBookings.map(renderBookingCard)}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 48,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'InterBold',
    color: '#000',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContainer: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
  },
  activeFilterChip: {
    backgroundColor: '#00BCD4',
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: 'InterSemiBold',
    color: '#666',
  },
  activeFilterChipText: {
    color: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookingsList: {
    flex: 1,
    padding: 16,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  bookingImage: {
    width: '100%',
    height: 160,
  },
  bookingContent: {
    padding: 16,
  },
  tourName: {
    fontSize: 18,
    fontFamily: 'InterSemiBold',
    color: '#000',
    marginBottom: 12,
  },
  bookingDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    marginLeft: 16,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
    marginLeft: 8,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  guideInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guideImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  guideName: {
    fontSize: 14,
    fontFamily: 'InterSemiBold',
    color: '#000',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 12,
    fontFamily: 'Inter',
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontFamily: 'InterBold',
    color: '#00BCD4',
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  upcomingBadge: {
    backgroundColor: '#E3F2FD',
  },
  completedBadge: {
    backgroundColor: '#E8F5E9',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'InterSemiBold',
    color: '#00BCD4',
  },
  skeletonTitle: {
    height: 24,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 12,
    width: '80%',
  },
  skeletonIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
  },
  skeletonText: {
    height: 16,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginLeft: 8,
  },
  skeletonAvatar: {
    width: 32,
    height: 32,
    backgroundColor: '#E0E0E0',
    borderRadius: 16,
    marginRight: 8,
  },
  skeletonPrice: {
    height: 24,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    width: 80,
  },
  skeletonStatus: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 80,
    height: 24,
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
  },
});
