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
import { useTours } from '@/hooks/useData';
import { Post } from '@/types/api';

type BookingStatus = 'upcoming' | 'completed';

interface Booking extends Post {
  status: BookingStatus;
}

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
  const [activeFilter, setActiveFilter] = useState<BookingStatus | 'all'>(
    'all'
  );
  const { tours, loading, error } = useTours();

  const filteredBookings = tours
    .map((tour) => ({
      ...tour,
      status: (new Date(tour.startTime) > new Date()
        ? 'upcoming'
        : 'completed') as BookingStatus,
    }))
    .filter((booking) => {
      if (activeFilter === 'all') return true;
      return booking.status === activeFilter;
    });

  const renderBookingCard = (booking: Booking) => (
    <TouchableOpacity
      key={booking.id}
      style={[
        styles.bookingCard,
        booking.status === 'upcoming' && styles.upcomingCard,
        booking.status === 'completed' && styles.completedCard,
      ]}
      onPress={() => {
        if (booking.status === 'completed') return;
        router.push(`/tours/${booking.id}`);
      }}
    >
      <Image
        source={{
          uri:
            booking.images?.[0] ||
            'https://images.pexels.com/photos/5087165/pexels-photo-5087165.jpeg',
        }}
        style={[
          styles.bookingImage,
          booking.status === 'completed' && styles.completedImage,
        ]}
      />
      <View style={styles.bookingContent}>
        <Text
          style={[
            styles.tourName,
            booking.status === 'completed' && styles.completedText,
          ]}
        >
          {booking.title}
        </Text>

        <View style={styles.bookingDetails}>
          <View style={styles.detailRow}>
            <Calendar
              size={16}
              color={booking.status === 'completed' ? 'gray' : '#00BCD4'}
            />
            <Text
              style={[
                styles.detailText,
                booking.status === 'completed' && styles.completedText,
              ]}
            >
              {new Date(booking.startTime).toLocaleDateString()}
            </Text>
            <Clock
              size={16}
              color={booking.status === 'completed' ? 'gray' : '#00BCD4'}
              style={styles.detailIcon}
            />
            <Text
              style={[
                styles.detailText,
                booking.status === 'completed' && styles.completedText,
              ]}
            >
              {new Date(booking.startTime).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <MapPin
              size={16}
              color={booking.status === 'completed' ? 'gray' : '#00BCD4'}
            />
            <Text
              style={[
                styles.detailText,
                booking.status === 'completed' && styles.completedText,
              ]}
            >
              {booking.location?.name}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Users
              size={16}
              color={booking.status === 'completed' ? 'gray' : '#00BCD4'}
            />
            <Text
              style={[
                styles.detailText,
                booking.status === 'completed' && styles.completedText,
              ]}
            >
              {booking._count.booking} Participants
            </Text>
          </View>
        </View>

        <View style={styles.bookingFooter}>
          <View style={styles.guideInfo}>
            <Image
              source={{ uri: booking.host?.profile.image }}
              style={[
                styles.guideAvatar,
                booking.status === 'completed' && styles.completedImage,
              ]}
            />
            <Text
              style={[
                styles.guideName,
                booking.status === 'completed' && styles.completedText,
              ]}
            >
              {booking.host?.profile.name}
            </Text>
          </View>
          <View style={styles.priceContainer}>
            <Text
              style={[
                styles.priceLabel,
                booking.status === 'completed' && styles.completedText,
              ]}
            >
              Price
            </Text>
            <Text
              style={[
                styles.price,
                booking.status === 'completed' && styles.completedPrice,
              ]}
            >
              ${booking.price}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                booking.status === 'upcoming' ? '#E3F2FD' : '#F5F5F5',
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color: booking.status === 'upcoming' ? '#1976D2' : 'gray',
              },
            ]}
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Booking History</Text>
        </View>
        <View style={styles.filterContainer}>
          {['all', 'upcoming', 'completed'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                activeFilter === filter && styles.activeFilterButton,
              ]}
              onPress={() => setActiveFilter(filter as BookingStatus)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter && styles.activeFilterText,
                ]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {[1, 2, 3].map((_, index) => (
          <SkeletonBookingCard key={index} />
        ))}
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Booking History</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load bookings</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => window.location.reload()}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Booking History</Text>
      </View>

      <View style={styles.filterContainer}>
        <View style={styles.filterButtons}>
          {['all', 'upcoming', 'completed'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                activeFilter === filter && styles.activeFilterButton,
              ]}
              onPress={() => setActiveFilter(filter as BookingStatus)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter && styles.activeFilterText,
                ]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.bookingsContainer}>
        {filteredBookings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No bookings found</Text>
          </View>
        ) : (
          filteredBookings.map(renderBookingCard)
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 48,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'InterBold',
    color: '#000',
  },
  filterContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    minWidth: 100,
    alignItems: 'center',
  },
  activeFilterButton: {
    backgroundColor: '#00BCD4',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'InterSemiBold',
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
  },
  bookingsContainer: {
    padding: 16,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 0,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  upcomingCard: {
    borderWidth: 1,
    borderColor: '#00BCD4',
  },
  bookingImage: {
    width: '100%',
    height: 180,
  },
  completedImage: {
    opacity: 1,
  },
  bookingContent: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  tourName: {
    fontSize: 20,
    fontFamily: 'InterSemiBold',
    color: '#000',
    marginBottom: 16,
  },
  completedText: {
    color: 'gray',
  },
  bookingDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailIcon: {
    marginLeft: 16,
  },
  detailText: {
    fontSize: 15,
    fontFamily: 'Inter',
    color: '#666',
    marginLeft: 8,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginTop: 16,
  },
  guideInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guideAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  guideName: {
    fontSize: 15,
    fontFamily: 'InterSemiBold',
    color: '#000',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 13,
    fontFamily: 'Inter',
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 20,
    fontFamily: 'InterBold',
    color: '#00BCD4',
  },
  completedPrice: {
    color: 'gray',
  },
  statusBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  statusText: {
    fontSize: 13,
    fontFamily: 'InterSemiBold',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#00BCD4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'InterSemiBold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  completedCard: {
    backgroundColor: '#EEEEEE',
  },
});
