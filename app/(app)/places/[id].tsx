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
  MapPin,
  Star,
  Clock,
  Users,
  X,
  Calendar,
} from 'lucide-react-native';
import { usePlace, usePlaces, useTours } from '@/hooks/useData';
import { useState } from 'react';

const PLACES = {
  '1': {
    id: '1',
    name: 'Botanic',
    location: 'Singapore',
    image: require('../../../assets/images/botanic.jpg'),
    rating: 4.8,
    duration: '2-3 hours',
    groupSize: '1-10 people',
    description:
      "Singapore Botanic Gardens is a 162-year-old tropical garden located at the fringe of Singapore's Orchard Road shopping district. It is one of three gardens, and the only tropical garden, to be honored as a UNESCO World Heritage Site.",
    highlights: [
      'National Orchid Garden',
      'Swan Lake',
      'Rainforest Walking Trail',
      'Evolution Garden',
    ],
  },
  '2': {
    id: '2',
    name: 'Cloud Forest',
    location: 'Marina Bay',
    image: require('../../../assets/images/cloudForest.jpg'),
    rating: 4.9,
    duration: '1-2 hours',
    groupSize: '1-15 people',
    description:
      'Cloud Forest is a mysterious world veiled in mist. Take in breathtaking mountain views surrounded by diverse vegetation and hidden floral gems. And learn about rare plants and their fast-disappearing environment.',
    highlights: [
      'The Lost World',
      'Crystal Mountain',
      'Tree Top Walk',
      'Secret Garden',
    ],
  },
  '3': {
    id: '3',
    name: 'Orchid Garden',
    location: 'Singapore',
    image: require('../../../assets/images/orchid.jpg'),
    rating: 4.7,
    duration: '1-2 hours',
    groupSize: '1-8 people',
    description:
      'The National Orchid Garden is located on the highest hill in the Singapore Botanic Gardens. Three hectares of carefully landscaped slopes provide a setting for over 1,000 species and 2,000 hybrids.',
    highlights: [
      'VIP Orchid Garden',
      'Burkill Hall',
      'Misthouse',
      'Cool House',
    ],
  },
  '4': {
    id: '4',
    name: 'Gardens by the Bay',
    location: 'Singapore',
    image: require('../../../assets/images/bay.jpg'),
    rating: 4.8,
    duration: '2-3 hours',
    groupSize: '1-10 people',
    description:
      "Singapore Botanic Gardens is a 162-year-old tropical garden located at the fringe of Singapore's Orchard Road shopping district. It is one of three gardens, and the only tropical garden, to be honored as a UNESCO World Heritage Site.",
    highlights: [
      'National Orchid Garden',
      'Swan Lake',
      'Rainforest Walking Trail',
      'Evolution Garden',
    ],
  },
  '5': {
    id: '5',
    name: 'Marina Bay Sands',
    location: 'Marina Bay',
    image: require('../../../assets/images/marina.jpg'),
    rating: 4.9,
    duration: '1-2 hours',
    groupSize: '1-15 people',
    description:
      'Cloud Forest is a mysterious world veiled in mist. Take in breathtaking mountain views surrounded by diverse vegetation and hidden floral gems. And learn about rare plants and their fast-disappearing environment.',
    highlights: [
      'The Lost World',
      'Crystal Mountain',
      'Tree Top Walk',
      'Secret Garden',
    ],
  },
  '6': {
    id: '6',
    name: 'Sentosa Island',
    location: 'Singapore',
    image: require('../../../assets/images/sentosa.jpg'),
    rating: 4.7,
    duration: '1-2 hours',
    groupSize: '1-8 people',
    description:
      'The National Orchid Garden is located on the highest hill in the Singapore Botanic Gardens. Three hectares of carefully landscaped slopes provide a setting for over 1,000 species and 2,000 hybrids.',
    highlights: [
      'VIP Orchid Garden',
      'Burkill Hall',
      'Misthouse',
      'Cool House',
    ],
  },
};

export default function PlaceDetail() {
  const { id } = useLocalSearchParams();
  const place = PLACES[id as keyof typeof PLACES];
  const {
    place: place_data,
    loading: placesLoading,
    error: placesError,
  } = usePlace(Number(id));
  const { tours } = useTours();
  const [showToursModal, setShowToursModal] = useState(false);

  const placeTours = tours.filter(
    (tour) => place_data && tour.location?.name === place_data.name
  );

  if (!place_data) {
    return (
      <View style={styles.container}>
        <Text>Place not found</Text>
      </View>
    );
  }

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
            {placeTours.map((tour) => (
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
                    uri: 'https://images.unsplash.com/photo-1565967511849-76a60a516170',
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
                    <Users size={16} color="#00BCD4" />
                    <Text style={styles.tourLocation}>
                      Host: {tour.host?.profile.name || 'No host'}
                    </Text>
                  </View>
                  <Text style={styles.tourPrice}>${tour.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri:
              place_data.image ||
              'https://images.unsplash.com/photo-1565967511849-76a60a516170',
          }}
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
        <Text style={styles.title}>{place_data?.name}</Text>

        <View style={styles.locationContainer}>
          <MapPin size={16} color="#00BCD4" />
          <Text style={styles.location}>{place_data.address}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Star size={16} color="#FFD700" />
            <Text style={styles.statText}>{place_data.rating || 0} Rating</Text>
          </View>
          <View style={styles.stat}>
            <Clock size={16} color="#00BCD4" />
            <Text style={styles.statText}>
              {place_data.duration || '2-3 hours'}
            </Text>
          </View>
          <View style={styles.stat}>
            <Users size={16} color="#00BCD4" />
            <Text style={styles.statText}>
              {place_data.group_size || '1-10 people'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{place_data?.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Highlights</Text>
          {place_data.highlights?.map((highlight, index) => (
            <View key={index} style={styles.highlightItem}>
              <View style={styles.bullet} />
              <Text style={styles.highlightText}>{highlight}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => setShowToursModal(true)}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
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
  title: {
    fontSize: 24,
    fontFamily: 'InterBold',
    color: '#000',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 4,
  },
  location: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 24,
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
});
