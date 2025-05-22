import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Users,
  Star,
  X,
  CreditCard,
  User,
  Mail,
  Phone,
} from 'lucide-react-native';
import { useTour } from '@/hooks/useData';
import { useState } from 'react';
import { SkeletonHostCard } from '@/components/SkeletonHostCard';
import { Skeleton, SkeletonText } from '@/components/Skeleton';

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
  '4': {
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
  const { tour, loading, error } = useTour(Number(id));
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    email: '',
    phone: '',
  });
  console.log(tour, 'this is the tour');

  const handlePayment = () => {
    if (!tour) return;

    setShowPaymentModal(false);
    Alert.alert(
      'Booking Confirmed!',
      'Your tour has been successfully booked. You will receive a confirmation email shortly.',
      [
        {
          text: 'View My Bookings',
          onPress: () => router.push('/bookings'),
        },
        {
          text: 'OK',
          onPress: () => router.push('/(app)/(tabs)'),
        },
      ]
    );
  };

  const renderPaymentModal = () => (
    <Modal
      visible={showPaymentModal}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowPaymentModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Payment Information</Text>
            <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
              <X size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.paymentForm}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Card Number</Text>
              <View style={styles.inputContainer}>
                <CreditCard size={20} color="#666" />
                <TextInput
                  style={styles.input}
                  placeholder="1234 5678 9012 3456"
                  keyboardType="numeric"
                  maxLength={19}
                  value={paymentInfo.cardNumber}
                  onChangeText={(text) => {
                    const formatted = text
                      .replace(/\s/g, '')
                      .replace(/(\d{4})/g, '$1 ')
                      .trim();
                    setPaymentInfo({ ...paymentInfo, cardNumber: formatted });
                  }}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.inputLabel}>Expiry Date</Text>
                <View style={styles.inputContainer}>
                  <Calendar size={20} color="#666" />
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    keyboardType="numeric"
                    maxLength={5}
                    value={paymentInfo.expiryDate}
                    onChangeText={(text) => {
                      const formatted = text
                        .replace(/\D/g, '')
                        .replace(/(\d{2})(\d{0,2})/, '$1/$2');
                      setPaymentInfo({ ...paymentInfo, expiryDate: formatted });
                    }}
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.inputLabel}>CVV</Text>
                <View style={styles.inputContainer}>
                  <CreditCard size={20} color="#666" />
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    keyboardType="numeric"
                    maxLength={3}
                    value={paymentInfo.cvv}
                    onChangeText={(text) =>
                      setPaymentInfo({ ...paymentInfo, cvv: text })
                    }
                  />
                </View>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={styles.inputContainer}>
                <User size={20} color="#666" />
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  value={paymentInfo.name}
                  onChangeText={(text) =>
                    setPaymentInfo({ ...paymentInfo, name: text })
                  }
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputContainer}>
                <Mail size={20} color="#666" />
                <TextInput
                  style={styles.input}
                  placeholder="john@example.com"
                  keyboardType="email-address"
                  value={paymentInfo.email}
                  onChangeText={(text) =>
                    setPaymentInfo({ ...paymentInfo, email: text })
                  }
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone</Text>
              <View style={styles.inputContainer}>
                <Phone size={20} color="#666" />
                <TextInput
                  style={styles.input}
                  placeholder="+1 234 567 8900"
                  keyboardType="phone-pad"
                  value={paymentInfo.phone}
                  onChangeText={(text) =>
                    setPaymentInfo({ ...paymentInfo, phone: text })
                  }
                />
              </View>
            </View>

            {tour && (
              <TouchableOpacity
                style={styles.payButton}
                onPress={handlePayment}
              >
                <Text style={styles.payButtonText}>Pay ${tour.price}</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.imageSlider}>
            <SkeletonHostCard />
          </View>
        </View>
        {/* <View style={styles.content}>
          <SkeletonHostCard />
          <SkeletonHostCard />
          <SkeletonHostCard />
        </View> */}
        <View style={styles.con}>
          <View style={styles.roleContainer_1}>
            <View style={styles.skeletonRoleButton_1} />
            {/* <View style={styles.skeletonRoleButton} /> */}
          </View>
          <View style={styles.searchContainer}>
            <View style={styles.skeletonSearchBar}>
              <View style={styles.skeletonSearchIcon} />
              <View style={styles.stat_2}>
                {/* <Skeleton width={24} height={24} variant="circular" /> */}
                <Skeleton width={200} height={16} />
                <Skeleton width={200} height={16} />
              </View>
            </View>
          </View>
          <View style={styles.roleContainer}>
            <View style={styles.skeletonRoleButton} />
            <View style={styles.skeletonRoleButton} />
          </View>
          <View style={styles.roleContainer}>
            <View style={styles.skeletonRoleButton} />
            <View style={styles.skeletonRoleButton} />
          </View>
          <View style={styles.content}>
            <SkeletonText lines={1} spacing={8} />
            <View style={styles.stats}>
              <View style={styles.stat}>
                <Skeleton width={24} height={24} variant="circular" />
                <Skeleton width={60} height={16} />
              </View>
              <View style={styles.stat}>
                <Skeleton width={24} height={24} variant="circular" />
                <Skeleton width={60} height={16} />
              </View>
            </View>
          </View>
          <View style={styles.content}>
            <SkeletonText lines={1} spacing={8} />
            <View style={styles.stats}>
              <View style={styles.stat_1}>
                {/* <Skeleton width={24} height={24} variant="circular" /> */}
                <Skeleton width={180} height={16} />
                <Skeleton width={180} height={16} />
                <Skeleton width={180} height={16} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }

  if (error || !tour) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Tour not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (tour.status !== 'AVAILABLE') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={{ uri: tour.location.image }} style={styles.image} />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft color="#fff" size={24} />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>{tour.title}</Text>
          <View style={styles.unavailableContainer}>
            <Text style={styles.unavailableText}>
              This tour is not available for booking
            </Text>
            <Text style={styles.unavailableSubtext}>
              The tour might be fully booked or has been cancelled
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => router.push('/(app)/(tabs)/guidemigo')}
            >
              <Text style={styles.exploreButtonText}>Explore Other Tours</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Check if tour is fully booked
  const isFullyBooked = tour._count.booking >= tour.maxSeats;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.imageSlider}
        >
          <Image source={{ uri: tour.location.image }} style={styles.image} />
        </ScrollView>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        {isFullyBooked && (
          <View style={styles.fullyBookedBadge}>
            <Text style={styles.fullyBookedText}>Fully Booked</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{tour.title}</Text>

        <View style={styles.guideContainer}>
          <Image
            source={{
              uri:
                tour.host.profile?.image ||
                'https://images.pexels.com/photos/5087165/pexels-photo-5087165.jpeg',
            }}
            style={styles.guideImage}
          />
          <View style={styles.guideInfo}>
            <Text style={styles.guideName}>
              Guide: {tour.host.profile?.name || tour.host.email}
            </Text>
            <View style={styles.guideStats}>
              <Star size={16} color="#FFD700" />
              <Text style={styles.guideRating}>
                {tour.host.profile?.rating || 0}
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
                {new Date(tour.startTime).toLocaleDateString()}
              </Text>
              <Text style={styles.infoValue}>
                {new Date(tour.startTime).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Clock size={20} color="#00BCD4" />
            <View>
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>
                {Math.round(
                  (new Date(tour.endTime).getTime() -
                    new Date(tour.startTime).getTime()) /
                    (1000 * 60 * 60)
                )}{' '}
                hours
              </Text>
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

        <View style={styles.footer}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Price per person</Text>
            <Text style={styles.price}>${tour.price}</Text>
          </View>
          <TouchableOpacity
            style={[
              styles.bookButton,
              isFullyBooked && styles.bookButtonDisabled,
            ]}
            onPress={() => !isFullyBooked && setShowPaymentModal(true)}
            disabled={isFullyBooked}
          >
            <Text style={styles.bookButtonText}>
              {isFullyBooked ? 'Fully Booked' : 'Book Now'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {renderPaymentModal()}
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
  stats: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stat_1: {
    paddingTop: 10,
    alignItems: 'center',
    gap: 8,
  },
  stat_2: {
    paddingStart: 20,
    paddingTop: 10,
    alignItems: 'center',
    gap: 8,
  },
  imageSlider: {
    height: '100%',
  },
  image: {
    width: 600,
    height: '100%',
  },
  roleContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  roleContainer_1: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    display: 'flex',
    justifyContent: 'center',
    paddingVertical: 26,
    // backgroundColor: '#00BCD4',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    gap: 10,
  },
  roleButtonLight: {
    backgroundColor: '#f5f5f5',
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
    marginTop: 0,
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  con: {
    marginTop: -60,
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
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'InterBold',
    color: '#000',
  },
  paymentForm: {
    marginTop: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'InterSemiBold',
    color: '#000',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter',
  },
  row: {
    flexDirection: 'row',
  },
  payButton: {
    backgroundColor: '#00BCD4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  payButtonText: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#fff',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#ff0000',
    textAlign: 'center',
    marginTop: 16,
  },
  searchContainer: {
    padding: 16,
  },
  skeletonSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 12,
  },
  skeletonSearchIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#e0e0e0',
    borderRadius: 100,
  },
  skeletonSearchInput: {
    flex: 1,
    marginLeft: 8,
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  skeletonRoleButton: {
    flex: 1,
    height: 80,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
  },
  skeletonRoleButton_1: {
    flex: 1,
    height: 30,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#00BCD4',
    textAlign: 'center',
    marginTop: 16,
  },
  unavailableContainer: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginTop: 16,
  },
  unavailableText: {
    fontSize: 18,
    fontFamily: 'InterBold',
    color: '#ff4444',
    marginBottom: 8,
  },
  unavailableSubtext: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  exploreButton: {
    backgroundColor: '#00BCD4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    fontSize: 14,
    fontFamily: 'InterSemiBold',
    color: '#fff',
  },
  fullyBookedBadge: {
    position: 'absolute',
    top: 48,
    right: 16,
    backgroundColor: 'rgba(255, 68, 68, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  fullyBookedText: {
    fontSize: 14,
    fontFamily: 'InterSemiBold',
    color: '#fff',
  },
  bookButtonDisabled: {
    backgroundColor: '#ccc',
  },
});
