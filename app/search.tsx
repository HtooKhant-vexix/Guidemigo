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
import { useState, useEffect } from 'react';
import { useHosts, usePlaces, useTours } from '@/hooks/useData';

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1565967511849-76a60a516170';

export default function SearchPage() {
  const params = useLocalSearchParams();
  const { role, location } = params;
  const { places, loading: placesLoading } = usePlaces();
  const { hosts, loading: hostsLoading } = useHosts();
  const { tours, loading: toursLoading } = useTours();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<
    'all' | 'places' | 'hosts' | 'tours'
  >('all');
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, activeTab]);

  const handleSearch = (text: string) => {
    setIsLoading(true);
    let results: any[] = [];

    if (activeTab === 'all' || activeTab === 'places') {
      const filteredPlaces =
        places?.filter(
          (place) =>
            place.name?.toLowerCase().includes(text.toLowerCase()) ||
            place.address?.toLowerCase().includes(text.toLowerCase())
        ) || [];
      results = [
        ...results,
        ...filteredPlaces.map((place) => ({ ...place, type: 'place' })),
      ];
    }

    if (activeTab === 'all' || activeTab === 'hosts') {
      const filteredHosts =
        hosts?.filter(
          (host) =>
            host.profile?.name?.toLowerCase().includes(text.toLowerCase()) ||
            host.profile?.languages?.some((lang: string) =>
              lang.toLowerCase().includes(text.toLowerCase())
            )
        ) || [];
      results = [
        ...results,
        ...filteredHosts.map((host) => ({ ...host, type: 'host' })),
      ];
    }

    if (activeTab === 'all' || activeTab === 'tours') {
      const filteredTours =
        tours?.filter(
          (tour) =>
            tour.title?.toLowerCase().includes(text.toLowerCase()) ||
            tour.location?.name?.toLowerCase().includes(text.toLowerCase())
        ) || [];
      results = [
        ...results,
        ...filteredTours.map((tour) => ({ ...tour, type: 'tour' })),
      ];
    }

    setFilteredResults(results);
    setIsLoading(false);
  };

  const renderResultItem = (item: any) => {
    switch (item.type) {
      case 'place':
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

      case 'host':
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

      case 'tour':
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.resultCard}
            onPress={() => router.push(`/tours/${item.id}`)}
          >
            <Image
              source={{ uri: item.image || DEFAULT_IMAGE }}
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

      default:
        return null;
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
            onChangeText={setSearchQuery}
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
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'all' && styles.activeTabText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'places' && styles.activeTab]}
            onPress={() => setActiveTab('places')}
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
            onPress={() => setActiveTab('hosts')}
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
            onPress={() => setActiveTab('tours')}
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

      <ScrollView style={styles.resultsContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00BCD4" />
          </View>
        ) : filteredResults.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No results found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        ) : (
          filteredResults.map(renderResultItem)
        )}
      </ScrollView>
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
});
