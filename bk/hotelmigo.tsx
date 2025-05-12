import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Search, MapPin, Star, Users, Calendar } from 'lucide-react-native';

const HOTELS = [
  {
    id: '1',
    name: 'Marina Bay Sands',
    location: 'Marina Bay',
    image: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg',
    rating: 4.9,
    reviews: 2481,
    price: 450,
    amenities: ['Pool', 'Spa', 'Gym'],
  },
  {
    id: '2',
    name: 'Raffles Hotel',
    location: 'Beach Road',
    image: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg',
    rating: 4.8,
    reviews: 1876,
    price: 380,
    amenities: ['Restaurant', 'Bar', 'Garden'],
  },
  {
    id: '3',
    name: 'Fullerton Bay',
    location: 'Marina Bay',
    image: 'https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg',
    rating: 4.7,
    reviews: 1543,
    price: 320,
    amenities: ['Waterfront', 'Rooftop', 'Spa'],
  },
];

const POPULAR_FILTERS = [
  'Pool',
  'Beach Access',
  'Spa',
  'Free Breakfast',
  'Pet Friendly',
];

export default function Hotelmigo() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Your Perfect Stay</Text>
        <Text style={styles.headerSubtitle}>
          Book unique hotels and experiences
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search hotels, locations..."
            placeholderTextColor="#666"
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filters}
        >
          {POPULAR_FILTERS.map((filter, index) => (
            <TouchableOpacity key={index} style={styles.filterChip}>
              <Text style={styles.filterText}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Hotels</Text>
        {HOTELS.map((hotel) => (
          <TouchableOpacity key={hotel.id} style={styles.hotelCard}>
            <Image source={{ uri: hotel.image }} style={styles.hotelImage} />
            <View style={styles.hotelContent}>
              <View style={styles.hotelHeader}>
                <Text style={styles.hotelName}>{hotel.name}</Text>
                <View style={styles.ratingContainer}>
                  <Star size={16} color="#FFD700" />
                  <Text style={styles.ratingText}>{hotel.rating}</Text>
                </View>
              </View>

              <View style={styles.locationContainer}>
                <MapPin size={16} color="#00BCD4" />
                <Text style={styles.locationText}>{hotel.location}</Text>
              </View>

              <View style={styles.amenitiesContainer}>
                {hotel.amenities.map((amenity, index) => (
                  <View key={index} style={styles.amenityChip}>
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.hotelFooter}>
                <Text style={styles.priceText}>
                  <Text style={styles.priceAmount}>${hotel.price}</Text> / night
                </Text>
                <TouchableOpacity style={styles.bookButton}>
                  <Text style={styles.bookButtonText}>Book Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
    padding: 24,
    paddingTop: 48,
    backgroundColor: '#00BCD4',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'InterBold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#fff',
    opacity: 0.9,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter',
  },
  filtersContainer: {
    marginLeft: -16,
  },
  filters: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'InterSemiBold',
    color: '#000',
    marginBottom: 16,
  },
  hotelCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  hotelImage: {
    width: '100%',
    height: 200,
  },
  hotelContent: {
    padding: 16,
  },
  hotelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  hotelName: {
    fontSize: 18,
    fontFamily: 'InterSemiBold',
    color: '#000',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'InterSemiBold',
    color: '#000',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  amenityChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
  },
  amenityText: {
    fontSize: 12,
    fontFamily: 'Inter',
    color: '#666',
  },
  hotelFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
  },
  priceAmount: {
    fontSize: 20,
    fontFamily: 'InterBold',
    color: '#00BCD4',
  },
  bookButton: {
    backgroundColor: '#00BCD4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bookButtonText: {
    fontSize: 14,
    fontFamily: 'InterSemiBold',
    color: '#fff',
  },
});
