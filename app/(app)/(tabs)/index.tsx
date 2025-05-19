import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { router } from 'expo-router';
import {
  Search,
  Bell,
  MapPin,
  Backpack,
  CircleUserRound,
  Bookmark,
  Languages,
  Clock,
  Plus,
  Star,
  Users,
  Calendar,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '@/service/auth';
import { useHosts, usePlaces, useTours } from '@/hooks/useData';
import { SkeletonHostCard } from '@/components/SkeletonHostCard';
import { useState, useRef } from 'react';

const PLACES = [
  {
    id: '1',
    name: 'Botanic',
    location: 'Singapore',
    image: require('../../../assets/images/botanic.jpg'),
    cap: 'Capturing the beauty of Singapore',
    host: require('../../../assets/images/p.jpg'),
  },
  {
    id: '2',
    name: 'Cloud Forest',
    location: 'Marina Bay',
    image: require('../../../assets/images/cloudForest.jpg'),
    cap: 'Walking through the misty Cloud Forest',
    host: require('../../../assets/images/p3.jpg'),
  },
  {
    id: '3',
    name: 'Orchid Garden',
    location: 'Singapore',
    image: require('../../../assets/images/orchid.jpg'),
    cap: 'Exploring Singapores Orchid Garden',
    host: require('../../../assets/images/p2.jpg'),
  },
];

const HOSTS = [
  {
    id: '1',
    name: 'Venkatesh',
    languages: ['Manadarian', 'English'],
    travelers: 12,
    image: require('../../../assets/images/p.jpg'),
  },
  {
    id: '2',
    name: 'Lokesh',
    languages: ['Manadarian', 'English'],
    travelers: 23,
    image: require('../../../assets/images/p2.jpg'),
  },
];

const ads = [
  {
    id: '1',
    name: 'Venkatesh',
    image: require('../../../assets/images/ad2.jpg'),
    // image: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6',
  },
  {
    id: '2',
    name: 'Lokesh',
    image: require('../../../assets/images/ad1.jpg'),
  },
];

export default function Home() {
  const { tours, loading: toursLoading, error: toursError } = useTours();
  const { user } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<'traveler' | 'host'>(
    'traveler'
  );
  const { places, loading: placesLoading, error: placesError } = usePlaces();
  const { hosts, loading: hostsLoading, error: hostsError } = useHosts();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const scrollViewRef = useRef<ScrollView>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  if (placesLoading || hostsLoading) {
    return (
      <ScrollView style={styles.container}>
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonHostCard key={index} />
        ))}
      </ScrollView>
    );
  }

  if (placesError || hostsError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{placesError || hostsError}</Text>
      </View>
    );
  }

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;

    if (isCloseToBottom && !isLoadingMore && hasMore) {
      loadMoreTours();
    }
  };

  const loadMoreTours = () => {
    if (isLoadingMore) return;

    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
    const filteredTours = tours.filter(
      (tour) =>
        tour.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.location?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (startIndex >= filteredTours.length) {
      setHasMore(false);
    } else {
      setCurrentPage(nextPage);
    }
    setIsLoadingMore(false);
  };

  const renderTravelerContent = () => (
    <>
      <View style={styles.section}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.hostsList}
        >
          {ads.map((host) => (
            <TouchableOpacity key={host.id} style={styles.ads}>
              <Image source={host.image} style={styles.adsImage} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Best Hosts in Singapore</Text>
          <TouchableOpacity onPress={() => router.push('/hosts/all')}>
            <Text style={styles.viewAllButton}>View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.hostsList}
        >
          {hosts.map((host) => (
            <TouchableOpacity
              key={host.id}
              style={styles.hostCard}
              onPress={() => router.push(`/hosts/${host.id}`)}
            >
              <Image
                source={HOSTS[0].image || hosts?.profile.image}
                style={styles.hostImage}
              />
              <View style={styles.hostInfo}>
                <View style={styles.name}>
                  <Text style={styles.hostName}>{host?.profile?.name}</Text>
                  <Bookmark size={23} color="#000" />
                </View>
                <View style={styles.hostRating}>
                  <CircleUserRound size={19} color="#00BCD4" />
                  <Text style={styles.hostDetails}>
                    Hosted {host?.profile.travellers || 0} Travelers
                  </Text>
                </View>
                <View style={styles.hostRating}>
                  <Languages size={19} color="#00BCD4" />
                  <Text style={styles.hostLanguages}>
                    {host.profile?.languages?.join(', ')}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Best Places in Singapore</Text>
          <TouchableOpacity onPress={() => router.push('/places/all')}>
            <Text style={styles.viewAllButton}>View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.placesList}
        >
          {places.map((place) => (
            <TouchableOpacity
              key={place.id}
              style={styles.placeCard}
              onPress={() => router.push(`/places/${place.id}`)}
            >
              <Image source={{ uri: place.image }} style={styles.placeImage} />
              <Text style={styles.placeName}>{place?.name}</Text>
              <View style={styles.placeLocation}>
                <MapPin size={16} color="#00BCD4" />
                <Text style={styles.placeLocationText}>{place?.address}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );

  const renderHostContent = () => {
    const filteredTours = tours.filter(
      (tour) =>
        tour.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.location?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedTours = filteredTours.slice(0, currentPage * ITEMS_PER_PAGE);

    return (
      <>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My Tours</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/tours/create-tour')}
            >
              <Plus size={24} color="#00BCD4" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Search size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search tours..."
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                setCurrentPage(1);
                setHasMore(true);
              }}
            />
          </View>

          {toursLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00BCD4" />
            </View>
          ) : toursError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{toursError}</Text>
            </View>
          ) : filteredTours.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {searchQuery ? 'No tours found' : 'No tours created yet'}
              </Text>
              <Text style={styles.emptyStateSubtext}>
                {searchQuery
                  ? 'Try a different search term'
                  : 'Create your first tour to get started'}
              </Text>
            </View>
          ) : (
            <>
              <ScrollView
                ref={scrollViewRef}
                style={styles.toursList}
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={400}
              >
                {paginatedTours.map((tour) => (
                  <TouchableOpacity
                    key={tour.id}
                    style={styles.upcomingTourCard}
                    onPress={() => router.push(`/tours/${tour.id}`)}
                  >
                    <View style={styles.tourHeader}>
                      <View>
                        <Text style={styles.tourName}>{tour.title}</Text>
                        <View style={styles.tourLocationContainer}>
                          <MapPin size={16} color="#00BCD4" />
                          <Text style={styles.tourLocationText}>
                            {tour.location?.name || 'No location'}
                          </Text>
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
                          uri:
                            tour.host?.profile?.image ||
                            'https://images.unsplash.com/photo-1565967511849-76a60a516170',
                        }}
                        style={styles.guideImage}
                      />
                      <View style={styles.guideInfo}>
                        <Text style={styles.guideName}>
                          {tour.host?.profile?.name || 'Unknown Host'}
                        </Text>
                        <View style={styles.guideStats}>
                          <Star size={16} color="#FFD700" />
                          <Text style={styles.ratingText}>
                            {tour.host?.profile?.rating || 0}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.participantsContainer}>
                        <Users size={16} color="#00BCD4" />
                        <Text style={styles.participantsText}>
                          {tour._count?.booking || 0} joined
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
                {isLoadingMore && (
                  <View style={styles.loadingMoreContainer}>
                    <ActivityIndicator size="small" color="#00BCD4" />
                  </View>
                )}
                {!hasMore && paginatedTours.length > 0 && (
                  <Text style={styles.endOfListText}>
                    No more tours to load
                  </Text>
                )}
              </ScrollView>

              {currentPage > 1 && (
                <TouchableOpacity
                  style={styles.goToTopButton}
                  onPress={() =>
                    scrollViewRef.current?.scrollTo({ y: 0, animated: true })
                  }
                >
                  <Text style={styles.goToTopButtonText}>↑</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.bg}>
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <MapPin size={34} color="#fafafa" />
            <View>
              <Text style={styles.locationLabel}>Home</Text>
              <Text style={styles.locationText}>Marina Bay, Singapore</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color="#00BCD4" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Here"
            placeholderTextColor="#666"
          />
        </View>
        <Text style={styles.title}>
          Go Everywhere and Create a{'\n'}Moment Everywhere!
        </Text>
      </View>

      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[
            styles.roleButton,
            selectedRole === 'traveler' && styles.roleButtonActive,
          ]}
          onPress={() => setSelectedRole('traveler')}
        >
          <Backpack
            size={34}
            color={selectedRole === 'traveler' ? '#fafafa' : '#00BCD4'}
          />
          <Text
            style={[
              styles.roleText,
              selectedRole === 'traveler'
                ? { color: '#fafafa' }
                : { color: '#00BCD4' },
            ]}
          >
            Traveller
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.roleButton,
            styles.roleButtonLight,
            selectedRole === 'host' && styles.roleButtonActive,
          ]}
          onPress={() => setSelectedRole('host')}
        >
          <CircleUserRound
            size={34}
            color={selectedRole === 'host' ? '#fafafa' : '#00BCD4'}
          />
          <Text
            style={[
              styles.roleText,
              selectedRole === 'host'
                ? { color: '#fafafa' }
                : { color: '#00BCD4' },
            ]}
          >
            Host
          </Text>
          <View style={styles.joinBadge}>
            <Text style={styles.joinText}>JOIN</Text>
          </View>
        </TouchableOpacity>
      </View>

      {selectedRole === 'traveler'
        ? renderTravelerContent()
        : renderHostContent()}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
  },
  bg: {
    backgroundColor: '#00BCD4',
  },

  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  locationLabel: {
    fontSize: 20,
    fontWeight: 700,
    fontFamily: 'Inter',
    color: '#fafafa',
  },
  trendName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  locationText: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#fafafa',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'InterBold',
    color: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingTop: 10,
    paddingStart: 26,
    lineHeight: 36,
  },
  hostRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    padding: 12,
    paddingStart: 26,
    backgroundColor: '#f5f5f5',
    borderRadius: 100,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter',
  },
  roleContainer: {
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
  roleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  roleTrendIcon: {
    width: 38,
    height: 38,
    borderRadius: 27,
  },
  roleText: {
    fontSize: 22,
    fontFamily: 'InterSemiBold',
    color: '#fff',
  },
  joinBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#00BCD4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  joinText: {
    fontSize: 12,
    fontFamily: 'InterSemiBold',
    color: '#fff',
  },
  section: {
    padding: 16,
    flex: 1,
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
  viewAllButton: {
    fontSize: 14,
    fontFamily: 'InterSemiBold',
    color: '#00BCD4',
  },
  hostsList: {
    marginLeft: -16,
  },
  ads: {
    width: 320,
    marginLeft: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  hostCard: {
    width: 215,
    marginLeft: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  trendCard: {
    width: 330,
    marginLeft: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  hostImage: {
    width: '100%',
    height: 120,
  },
  trendImage: {
    width: '100%',
    height: 270,
  },
  adsImage: {
    width: '100%',
    height: 170,
  },
  hostInfo: {
    padding: 12,
  },
  name: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 1,
    justifyContent: 'space-between',
  },
  hostName: {
    fontSize: 18,
    fontFamily: 'InterSemiBold',
    color: '#000',
    marginBottom: 4,
  },
  hostTrendName: {
    fontSize: 19,
    width: 250,
    marginStart: 3,
    fontFamily: 'InterSemiBold',
    color: '#000',
    marginBottom: 4,
  },
  hostDetails: {
    fontSize: 15,
    marginStart: 4,
    fontFamily: 'Inter',
    color: '#666',
  },
  hostLanguages: {
    fontSize: 15,
    marginStart: 4,
    fontFamily: 'Inter',
    color: '#666',
  },
  placesList: {
    marginLeft: -16,
  },
  placeCard: {
    width: 160,
    marginLeft: 16,
  },
  placeImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 8,
  },
  placeName: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#000',
    marginBottom: 4,
  },
  placeLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  placeLocationText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
  },
  roleButtonActive: {
    backgroundColor: '#00BCD4',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: 'InterSemiBold',
    color: '#000',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
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
  tourLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tourLocationText: {
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
  toursList: {
    flex: 1,
    marginTop: 20,
  },
  loadingMoreContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  endOfListText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    fontFamily: 'Inter',
    paddingVertical: 20,
  },
  goToTopButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#00BCD4',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  goToTopButtonText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'InterBold',
  },
});
