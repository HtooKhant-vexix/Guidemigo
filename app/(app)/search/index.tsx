import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import {
  Search,
  MapPin,
  Bookmark,
  Languages,
  CircleUserRound,
  ArrowLeft,
  Filter,
} from 'lucide-react-native';
import { useState, useEffect, useRef } from 'react';
import { useHosts, usePlaces, useTours } from '@/hooks/useData';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1565967511849-76a60a516170';

export default function SearchPage() {
  const params = useLocalSearchParams();
  const { role, location } = params;
  const { places, loading: placesLoading } = usePlaces();
  const { hosts, loading: hostsLoading } = useHosts();
  const { tours, loading: toursLoading } = useTours();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'places' | 'hosts' | 'tours'>(
    'places'
  );
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [allResults, setAllResults] = useState<any[]>([]);
  const [showLoadingPopup, setShowLoadingPopup] = useState(false);
  const ITEMS_PER_PAGE = 8;
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (searchQuery || activeTab) {
      handleSearch(searchQuery);
    }
  }, [searchQuery, activeTab]);

  const handleSearch = (text: string) => {
    setIsLoading(true);
    setCurrentPage(1);
    let results: any[] = [];

    switch (activeTab) {
      case 'places':
        results =
          places?.filter(
            (place) =>
              place.name?.toLowerCase().includes(text.toLowerCase()) ||
              place.address?.toLowerCase().includes(text.toLowerCase())
          ) || [];
        break;
      case 'hosts':
        results =
          hosts?.filter(
            (host) =>
              host.profile?.name?.toLowerCase().includes(text.toLowerCase()) ||
              host.profile?.languages?.some((lang: string) =>
                lang.toLowerCase().includes(text.toLowerCase())
              )
          ) || [];
        break;
      case 'tours':
        results =
          tours?.filter(
            (tour) =>
              tour.title?.toLowerCase().includes(text.toLowerCase()) ||
              tour.location?.name?.toLowerCase().includes(text.toLowerCase())
          ) || [];
        break;
    }

    setAllResults(results);
    const paginatedResults = results.slice(0, ITEMS_PER_PAGE);
    setFilteredResults(paginatedResults);
    setHasMore(results.length > ITEMS_PER_PAGE);
    setIsLoading(false);
  };

  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      setIsLoadingMore(true);
      setShowLoadingPopup(true);
      const nextPage = currentPage + 1;
      const startIndex = 0;
      const endIndex = nextPage * ITEMS_PER_PAGE;

      setTimeout(() => {
        const paginatedResults = allResults.slice(startIndex, endIndex);
        setFilteredResults(paginatedResults);
        setHasMore(endIndex < allResults.length);
        setCurrentPage(nextPage);
        setIsLoadingMore(false);
        setShowLoadingPopup(false);
      }, 500);
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 100; // Increased padding to trigger earlier

    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;

    if (isCloseToBottom && !isLoadingMore && hasMore) {
      loadMore();
    }
  };

  console.log(tours, 'this is tour');

  const renderResultItem = (item: any) => {
    switch (activeTab) {
      case 'places':
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.resultCard}
            onPress={() => router.push(`/places/${item.id}`)}
          >
            <Image
              source={{ uri: item.image || DEFAULT_IMAGE }}
              style={styles.resultImage}
            />
            <View style={styles.resultInfo}>
              <Text style={styles.resultTitle}>{item.name}</Text>
              <View style={styles.resultLocation}>
                <MapPin size={16} color="#00BCD4" />
                <Text style={styles.resultLocationText}>{item.address}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );

      case 'hosts':
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.resultCard}
            onPress={() => router.push(`/hosts/${item.id}`)}
          >
            <Image
              source={{ uri: item.profile?.image || DEFAULT_IMAGE }}
              style={styles.resultImage}
            />
            <View style={styles.resultInfo}>
              <Text style={styles.resultTitle}>{item.profile?.name}</Text>
              <View style={styles.resultDetails}>
                <CircleUserRound size={16} color="#00BCD4" />
                <Text style={styles.resultDetailText}>
                  Hosted {item.profile?.travellers || 0} Travelers
                </Text>
              </View>
              <View style={styles.resultDetails}>
                <Languages size={16} color="#00BCD4" />
                <Text style={styles.resultDetailText}>
                  {item.profile?.languages?.join(', ')}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );

      case 'tours':
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.resultCard}
            onPress={() => router.push(`/tours/${item.id}`)}
          >
            <Image
              source={{ uri: item?.location?.image || DEFAULT_IMAGE }}
              style={styles.resultImage}
            />
            <View style={styles.resultInfo}>
              <Text style={styles.resultTitle}>{item.title}</Text>
              <View style={styles.resultLocation}>
                <MapPin size={16} color="#00BCD4" />
                <Text style={styles.resultLocationText}>
                  {item.location?.name}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setCurrentPage(1);
            }}
            autoFocus
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'places' && styles.activeTab]}
            onPress={() => {
              setActiveTab('places');
              setCurrentPage(1);
            }}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'places' && styles.activeTabText,
              ]}
            >
              Places
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'hosts' && styles.activeTab]}
            onPress={() => {
              setActiveTab('hosts');
              setCurrentPage(1);
            }}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'hosts' && styles.activeTabText,
              ]}
            >
              Hosts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'tours' && styles.activeTab]}
            onPress={() => {
              setActiveTab('tours');
              setCurrentPage(1);
            }}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'tours' && styles.activeTabText,
              ]}
            >
              Tours
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.resultsContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.scrollContent}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00BCD4" />
            <Text style={styles.loadingText}>Loading results...</Text>
          </View>
        ) : filteredResults.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No results found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.resultsList}>
              {filteredResults.map(renderResultItem)}
            </View>
            {!hasMore && filteredResults.length > 0 && (
              <View style={styles.endOfListContainer}>
                <Text style={styles.endOfListText}>
                  No more results to load
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {showLoadingPopup && (
        <View style={styles.loadingPopup}>
          <View style={styles.loadingPopupContent}>
            <ActivityIndicator size="large" color="#00BCD4" />
            <Text style={styles.loadingPopupText}>Loading more...</Text>
          </View>
        </View>
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
    padding: 16,
    paddingTop: 48,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 100,
    padding: 12,
    paddingStart: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter',
  },
  filterButton: {
    marginLeft: 12,
  },
  tabs: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#00BCD4',
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#666',
  },
  activeTabText: {
    color: '#00BCD4',
    fontFamily: 'InterSemiBold',
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  resultCard: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  resultInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  resultTitle: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#000',
    marginBottom: 4,
  },
  resultLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resultLocationText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
  },
  resultDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  resultDetailText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#666',
  },
  scrollContent: {
    flexGrow: 1,
  },
  resultsList: {
    flex: 1,
  },
  endOfListContainer: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
    position: 'relative',
    bottom: 0,
  },
  endOfListText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
  },
  loadingPopup: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  loadingPopupContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flexDirection: 'row',
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
  loadingPopupText: {
    color: '#fff',
    marginLeft: 12,
    fontSize: 14,
    fontFamily: 'Inter',
  },
});
