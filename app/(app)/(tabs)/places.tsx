import { memo, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Search, MapPin, Star, Clock, Users } from 'lucide-react-native';
import { usePlaces } from '@/hooks/useData';
import { SkeletonPlaceCard } from '@/components/SkeletonPlaceCard';
import { Place } from '@/types/api';

const CATEGORIES = [
  { id: '1', name: 'Popular', icon: '🔥' },
  { id: '2', name: 'Nature', icon: '🌿' },
  { id: '3', name: 'Culture', icon: '🏮' },
  { id: '4', name: 'Food', icon: '🍜' },
  { id: '5', name: 'Shopping', icon: '🛍️' },
  { id: '6', name: 'Nightlife', icon: '🌙' },
];

interface SearchBarProps {
  onSearch: (text: string) => void;
}

interface CategoryButtonProps {
  category: {
    id: string;
    name: string;
    icon: string;
  };
  onPress: (id: string) => void;
}

interface PlaceCardProps {
  place: Place;
}

const SearchBar = memo(({ onSearch }: SearchBarProps) => (
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

const CategoryButton = memo(({ category, onPress }: CategoryButtonProps) => (
  <TouchableOpacity
    style={styles.categoryButton}
    onPress={() => onPress(category.id)}
  >
    <Text style={styles.categoryIcon}>{category.icon}</Text>
    <Text style={styles.categoryName}>{category.name}</Text>
  </TouchableOpacity>
));

const FeaturedCard = memo(({ place }: PlaceCardProps) => (
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
          <Text style={styles.locationText}>{place.address}</Text>
        </View>
        {/* <View style={styles.ratingContainer}>
          <Star size={14} color="#FFD700" />
          <Text style={styles.ratingText}>{place.rating}</Text>
        </View> */}
      </View>
      {/* <View style={styles.categoryTag}>
        <Text style={styles.categoryTagText}>{place.group_size}</Text>
      </View> */}
    </View>
  </TouchableOpacity>
));

const TrendingCard = memo(({ place }: PlaceCardProps) => (
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
            <Text style={styles.locationText}>{place.address}</Text>
          </View>
          {/* <View style={styles.ratingContainer}>
            <Star size={14} color="#FFD700" />
            <Text style={styles.ratingText}>{place.rating}</Text>
          </View> */}
        </View>
      </View>
      {/* <View style={styles.priceTag}>
        <Text style={styles.priceText}>{place.duration}</Text>
      </View> */}
    </View>
  </TouchableOpacity>
));

export default function Places() {
  const [searchQuery, setSearchQuery] = useState('');
  const { places, loading, error } = usePlaces();
  console.log(places);

  const filteredPlaces = useMemo(() => {
    if (!searchQuery) return places;
    return places.filter(
      (place) =>
        place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [places, searchQuery]);

  const featuredPlaces = useMemo(() => {
    return filteredPlaces.slice(0, 3);
  }, [filteredPlaces]);

  const trendingPlaces = useMemo(() => {
    return filteredPlaces.slice(3, 6);
  }, [filteredPlaces]);

  const renderContent = () => {
    if (loading) {
      return (
        <ScrollView style={styles.container}>
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonPlaceCard key={index} />
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

    return (
      <ScrollView style={styles.container}>
        {headerContent}
        {searchContent}
        {categoriesContent}
        {featuredContent}
        {trendingContent}
      </ScrollView>
    );
  };

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
          <TouchableOpacity onPress={() => router.push('/places/all')}>
            <Text style={styles.seeAllButton}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredContainer}
        >
          {featuredPlaces.map((place) => (
            <FeaturedCard key={place.id} place={place} />
          ))}
        </ScrollView>
      </View>
    ),
    [featuredPlaces]
  );

  const trendingContent = useMemo(
    () => (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trending Now</Text>
          <TouchableOpacity onPress={() => router.push('/places/all')}>
            <Text style={styles.seeAllButton}>See All</Text>
          </TouchableOpacity>
        </View>
        {trendingPlaces.map((place) => (
          <TrendingCard key={place.id} place={place} />
        ))}
      </View>
    ),
    [trendingPlaces]
  );

  return <>{renderContent()}</>;
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    color: '#FF4444',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Inter',
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
