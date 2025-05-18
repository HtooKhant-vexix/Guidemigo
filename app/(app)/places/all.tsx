import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { MapPin, ArrowLeft } from 'lucide-react-native';
import { usePlaces } from '@/hooks/useData';

const ALL_PLACES = [
  {
    id: '1',
    name: 'Botanic',
    location: 'Singapore',
    image: require('../../../assets/images/botanic.jpg'),
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Cloud Forest',
    location: 'Marina Bay',
    image: require('../../../assets/images/cloudForest.jpg'),
    rating: 4.9,
  },
  {
    id: '3',
    name: 'Orchid Garden',
    location: 'Singapore',
    image: require('../../../assets/images/orchid.jpg'),
    rating: 4.7,
  },
  {
    id: '4',
    name: 'Gardens by the Bay',
    location: 'Marina Bay',
    image: require('../../../assets/images/bay.jpg'),
    rating: 4.9,
  },
  {
    id: '5',
    name: 'Marina Bay Sands',
    location: 'Marina Bay',
    image: require('../../../assets/images/marina.jpg'),
    rating: 4.8,
  },
  {
    id: '6',
    name: 'Sentosa Island',
    location: 'Sentosa',
    image: require('../../../assets/images/sentosa.jpg'),
    rating: 4.6,
  },
];

export default function AllPlaces() {
  const { places, loading, error } = usePlaces();
  console.log(places[0].image, '......hosts');
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color="#000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Places in Singapore</Text>
      </View>

      <FlatList
        data={places}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.placeCard}
            onPress={() => router.push(`/places/${item.id}`)}
          >
            <Image source={{ uri: item.image }} style={styles.placeImage} />
            <View style={styles.placeInfo}>
              <Text style={styles.placeName}>{item.name}</Text>
              <View style={styles.placeLocation}>
                <MapPin size={16} color="#00BCD4" />
                <Text style={styles.placeLocationText}>{item.address}</Text>
              </View>
              {/* <View style={styles.ratingContainer}>
                <Text style={styles.rating}>★ {item.rating}</Text>
              </View> */}
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        removeClippedSubviews={false}
      />
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
    padding: 16,
    paddingTop: 48,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'InterSemiBold',
    color: '#000',
  },
  listContent: {
    padding: 16,
  },
  placeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  placeImage: {
    width: '100%',
    height: 200,
  },
  placeInfo: {
    padding: 16,
  },
  placeName: {
    fontSize: 18,
    fontFamily: 'InterSemiBold',
    color: '#000',
    marginBottom: 8,
  },
  placeLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  placeLocationText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
  },
  ratingContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rating: {
    fontSize: 14,
    fontFamily: 'InterSemiBold',
    color: '#FFD700',
  },
});
