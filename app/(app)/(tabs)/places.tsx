import { memo, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { Search, MapPin, Star, Clock, Users } from 'lucide-react-native';

const CATEGORIES = [
  { id: '1', name: 'Popular', icon: '🔥' },
  { id: '2', name: 'Nature', icon: '🌿' },
  { id: '3', name: 'Culture', icon: '🏮' },
  { id: '4', name: 'Food', icon: '🍜' },
  { id: '5', name: 'Shopping', icon: '🛍️' },
  { id: '6', name: 'Nightlife', icon: '🌙' },
];

const FEATURED_PLACES = [
  {
    id: '1',
    name: 'Gardens by the Bay',
    location: 'Marina Bay',
    image: 'https://images.pexels.com/photos/1057840/pexels-photo-1057840.jpeg',
    rating: 4.8,
    reviews: 3245,
    category: 'Nature',
  },
  {
    id: '2',
    name: 'Chinatown',
    location: 'Outram',
    image: 'https://images.pexels.com/photos/2187605/pexels-photo-2187605.jpeg',
    rating: 4.6,
    reviews: 2891,
    category: 'Culture',
  },
  {
    id: '3',
    name: 'Maxwell Food Centre',
    location: 'Chinatown',
    image: 'https://images.pexels.com/photos/5409015/pexels-photo-5409015.jpeg',
    rating: 4.7,
    reviews: 4521,
    category: 'Food',
  },
];

const TRENDING_PLACES = [
  {
    id: '1',
    name: 'ArtScience Museum',
    location: 'Marina Bay',
    image: 'https://images.pexels.com/photos/4388167/pexels-photo-4388167.jpeg',
    rating: 4.5,
    price: '$$',
    category: 'Culture',
  },
  {
    id: '2',
    name: 'Singapore Zoo',
    location: 'Mandai',
    image: 'https://images.pexels.com/photos/145939/pexels-photo-145939.jpeg',
    rating: 4.7,
    price: '$$$',
    category: 'Nature',
  },
  {
    id: '3',
    name: 'Clarke Quay',
    location: 'Singapore River',
    image: 'https://images.pexels.com/photos/1538177/pexels-photo-1538177.jpeg',
    rating: 4.4,
    price: '$$$',
    category: 'Nightlife',
  },
];

const SearchBar = memo(({ onSearch }) => (
  <View style={styles.searchBar}>
    <Search size={20} color="#666" />
    <TextInput
      style={styles.searchInput}
      placeholder="Search places..."
      placeholderTextColor="#666"
      onChangeText={onSearch}
    />
  </View>
));

const CategoryButton = memo(({ category, onPress }) => (
  <TouchableOpacity
    style={styles.categoryButton}
    onPress={() => onPress(category.id)}
  >
    <Text style={styles.categoryIcon}>{category.icon}</Text>
    <Text style={styles.categoryName}>{category.name}</Text>
  </TouchableOpacity>
));

const FeaturedCard = memo(({ place }) => (
  <TouchableOpacity
    style={styles.featuredCard}
    onPress={() => router.push(`/places/${place.id}`)}
  >
    <Image source={{ uri: place.image }} style={styles.featuredImage} />
    <View style={styles.featuredContent}>
      <Text style={styles.placeName}>{place.name}</Text>
      <View style={styles.placeInfo}>
        <View style={styles.locationContainer}>
          <MapPin size={14} color="#666" />
          <Text style={styles.locationText}>{place.location}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Star size={14} color="#FFD700" />
          <Text style={styles.ratingText}>
            {place.rating} ({place.reviews})
          </Text>
        </View>
      </View>
      <View style={styles.categoryTag}>
        <Text style={styles.categoryTagText}>{place.category}</Text>
      </View>
    </View>
  </TouchableOpacity>
));

const TrendingCard = memo(({ place }) => (
  <TouchableOpacity
    style={styles.trendingCard}
    onPress={() => router.push(`/places/${place.id}`)}
  >
    <Image source={{ uri: place.image }} style={styles.trendingImage} />
    <View style={styles.trendingContent}>
      <View>
        <Text style={styles.placeName}>{place.name}</Text>
        <View style={styles.placeInfo}>
          <View style={styles.locationContainer}>
            <MapPin size={14} color="#666" />
            <Text style={styles.locationText}>{place.location}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Star size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{place.rating}</Text>
          </View>
        </View>
      </View>
      <View style={styles.priceTag}>
        <Text style={styles.priceText}>{place.price}</Text>
      </View>
    </View>
  </TouchableOpacity>
));

export default function Places() {
  const [searchQuery, setSearchQuery] = useState('');

  const headerContent = useMemo(
    () => (
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover Places</Text>
        <Text style={styles.headerSubtitle}>
          Find amazing spots in Singapore
        </Text>
      </View>
    ),
    []
  );

  const searchContent = useMemo(
    () => (
      <View style={styles.searchContainer}>
        <SearchBar onSearch={setSearchQuery} />
      </View>
    ),
    []
  );

  const categoriesContent = useMemo(
    () => (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categories}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORIES.map((category) => (
          <CategoryButton
            key={category.id}
            category={category}
            onPress={(id) => router.push(`/places/category/${id}`)}
          />
        ))}
      </ScrollView>
    ),
    []
  );

  const featuredContent = useMemo(
    () => (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Places</Text>
          <TouchableOpacity onPress={() => router.push('/places/featured')}>
            <Text style={styles.seeAllButton}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredContainer}
        >
          {FEATURED_PLACES.map((place) => (
            <FeaturedCard key={place.id} place={place} />
          ))}
        </ScrollView>
      </View>
    ),
    []
  );

  const trendingContent = useMemo(
    () => (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Now</Text>
          <TouchableOpacity onPress={() => router.push('/places/trending')}>
            <Text style={styles.seeAllButton}>See All</Text>
          </TouchableOpacity>
        </View>
        {TRENDING_PLACES.map((place) => (
          <TrendingCard key={place.id} place={place} />
        ))}
      </View>
    ),
    []
  );

  return (
    <ScrollView style={styles.container}>
      {headerContent}
      {searchContent}
      {categoriesContent}
      {featuredContent}
      {trendingContent}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    paddingTop: 48,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'InterBold',
    color: '#000',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#666',
  },
  searchContainer: {
    padding: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter',
  },
  categories: {
    marginBottom: 24,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryButton: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    fontFamily: 'InterSemiBold',
    color: '#000',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'InterSemiBold',
    color: '#000',
  },
  seeAllButton: {
    fontSize: 14,
    fontFamily: 'InterSemiBold',
    color: '#00BCD4',
  },
  featuredContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  featuredCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  featuredImage: {
    width: '100%',
    height: 180,
  },
  featuredContent: {
    padding: 12,
  },
  placeName: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#000',
    marginBottom: 4,
  },
  placeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'Inter',
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Inter',
    color: '#666',
  },
  categoryTag: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryTagText: {
    fontSize: 12,
    fontFamily: 'InterSemiBold',
    color: '#fff',
  },
  trendingCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  trendingImage: {
    width: 100,
    height: 100,
  },
  trendingContent: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceTag: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priceText: {
    fontSize: 12,
    fontFamily: 'InterSemiBold',
    color: '#000',
  },
});
