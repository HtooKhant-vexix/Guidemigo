import { useState, useMemo } from 'react';
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
import {
  Search,
  MapPin,
  Calendar,
  Star,
  Users,
  Filter,
  ChevronLeft,
} from 'lucide-react-native';
import { useTours } from '@/hooks/useData';
import { SkeletonHostCard } from '@/components/SkeletonHostCard';

const ITEMS_PER_PAGE = 10;

export default function AllTours() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { tours, loading, error } = useTours('AVAILABLE');
  const currentDate = new Date();

  const availableTours = useMemo(() => {
    return (
      tours?.filter((tour) => new Date(tour.startTime) > currentDate) || []
    );
  }, [tours]);

  const filteredTours = useMemo(() => {
    if (!searchQuery) return availableTours;
    return availableTours.filter(
      (tour) =>
        tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.location?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [availableTours, searchQuery]);

  const paginatedTours = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTours.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTours, currentPage]);

  const totalPages = Math.ceil(filteredTours.length / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>All Tours</Text>
        </View>
        <View style={styles.toursList}>
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonHostCard key={index} />
          ))}
        </View>
      </ScrollView>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Tours</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tours..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.toursList}>
          {filteredTours.length > 0 ? (
            filteredTours.map((tour) => (
              <TouchableOpacity
                key={tour.id}
                style={styles.tourCard}
                onPress={() => router.push(`/tours/${tour.id}`)}
              >
                <Image
                  source={{ uri: tour.location.image }}
                  style={styles.tourImage}
                />
                <View style={styles.tourContent}>
                  <Text style={styles.tourTitle}>{tour.title}</Text>
                  <View style={styles.tourInfo}>
                    <View style={styles.infoItem}>
                      <MapPin size={16} color="#00BCD4" />
                      <Text style={styles.infoText}>{tour.location.name}</Text>
                    </View>
                    <View style={styles.infoItem}>
                      <Calendar size={16} color="#00BCD4" />
                      <Text style={styles.infoText}>
                        {new Date(tour.startTime).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.tourFooter}>
                    <View style={styles.guideInfo}>
                      <Image
                        source={{
                          uri:
                            tour.host.profile?.image ||
                            'https://images.unsplash.com/photo-1565967511849-76a60a516170',
                        }}
                        style={styles.guideImage}
                      />
                      <Text style={styles.guideName}>
                        {tour.host.profile?.name || tour.host.email}
                      </Text>
                    </View>
                    <Text style={styles.price}>${tour.price}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {searchQuery ? 'No tours found' : 'No available tours'}
              </Text>
              <Text style={styles.emptyStateSubtext}>
                {searchQuery
                  ? 'Try a different search term'
                  : 'Check back later for new tours'}
              </Text>
            </View>
          )}
        </View>
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
    padding: 16,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'InterBold',
    color: '#000',
  },
  toursList: {
    padding: 16,
  },
  tourCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  tourImage: {
    width: '100%',
    height: 200,
  },
  tourContent: {
    padding: 16,
  },
  tourTitle: {
    fontSize: 18,
    fontFamily: 'InterSemiBold',
    color: '#000',
    marginBottom: 8,
  },
  tourInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
  },
  tourFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  guideInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  guideImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  guideName: {
    fontSize: 14,
    fontFamily: 'InterSemiBold',
    color: '#000',
  },
  price: {
    fontSize: 18,
    fontFamily: 'InterBold',
    color: '#00BCD4',
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
    paddingTop: 0,
    marginTop: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
  scrollView: {
    flex: 1,
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
  },
});
