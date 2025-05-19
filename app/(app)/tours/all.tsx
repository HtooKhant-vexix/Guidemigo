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
  const { tours, loading, error } = useTours();
  console.log(tours, '.....................sdfsf');

  const filteredTours = useMemo(() => {
    if (!searchQuery) return tours;
    return tours.filter(
      (tour) =>
        tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tour.location?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tours, searchQuery]);

  const paginatedTours = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTours.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTours, currentPage]);

  const totalPages = Math.ceil(filteredTours.length / ITEMS_PER_PAGE);

  if (loading) {
    return (
      <ScrollView style={styles.container}>
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonHostCard key={index} />
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
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Tours</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={24} color="#00BCD4" />
        </TouchableOpacity>
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

      <ScrollView style={styles.toursList}>
        {paginatedTours.map((tour) => (
          <TouchableOpacity
            key={tour.id}
            style={styles.tourCard}
            onPress={() => router.push(`/tours/${tour.id}`)}
          >
            <Image
              source={{
                uri: tour.host.profile.image
                  ? tour.host.profile.image
                  : 'https://images.unsplash.com/photo-1565967511849-76a60a516170',
              }}
              style={styles.tourImage}
            />
            <View style={styles.tourContent}>
              <Text style={styles.tourName}>{tour.title}</Text>
              <View style={styles.tourInfo}>
                <View style={styles.locationContainer}>
                  <MapPin size={14} color="#666" />
                  <Text style={styles.locationText}>{tour.location?.name}</Text>
                </View>
                <View style={styles.dateContainer}>
                  <Calendar size={14} color="#666" />
                  <Text style={styles.dateText}>
                    {tour.startTime?.slice(0, 10)}
                  </Text>
                </View>
              </View>
              <View style={styles.tourFooter}>
                <View style={styles.guideInfo}>
                  <Text style={styles.guideName}>{tour.host.profile.name}</Text>
                  <View style={styles.ratingContainer}>
                    <Star size={14} color="#FFD700" />
                    <Text style={styles.ratingText}>
                      {tour.host.profile.rating || 0}
                    </Text>
                  </View>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceText}>${tour.price}</Text>
                  <View style={styles.participantsContainer}>
                    <Users size={14} color="#666" />
                    <Text style={styles.participantsText}>
                      {tour._count.booking} joined
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {totalPages > 1 && (
          <View style={styles.pagination}>
            <TouchableOpacity
              style={[
                styles.pageButton,
                currentPage === 1 && styles.pageButtonDisabled,
              ]}
              onPress={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <Text
                style={[
                  styles.pageButtonText,
                  currentPage === 1 && styles.pageButtonTextDisabled,
                ]}
              >
                Previous
              </Text>
            </TouchableOpacity>

            <Text style={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </Text>

            <TouchableOpacity
              style={[
                styles.pageButton,
                currentPage === totalPages && styles.pageButtonDisabled,
              ]}
              onPress={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
            >
              <Text
                style={[
                  styles.pageButtonText,
                  currentPage === totalPages && styles.pageButtonTextDisabled,
                ]}
              >
                Next
              </Text>
            </TouchableOpacity>
          </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
    backgroundColor: '#fff',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'InterBold',
    color: '#000',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    padding: 16,
    paddingTop: 0,
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
  toursList: {
    flex: 1,
  },
  tourCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  tourImage: {
    width: 120,
    height: 120,
  },
  tourContent: {
    flex: 1,
    padding: 12,
  },
  tourName: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#000',
    marginBottom: 4,
  },
  tourInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
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
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    fontFamily: 'Inter',
    color: '#666',
  },
  tourFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  guideInfo: {
    flex: 1,
  },
  guideName: {
    fontSize: 12,
    fontFamily: 'InterSemiBold',
    color: '#000',
    marginBottom: 2,
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
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 16,
    fontFamily: 'InterBold',
    color: '#00BCD4',
    marginBottom: 4,
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
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 0,
  },
  pageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#00BCD4',
    borderRadius: 8,
  },
  pageButtonDisabled: {
    backgroundColor: '#f5f5f5',
  },
  pageButtonText: {
    color: '#fff',
    fontFamily: 'InterSemiBold',
    fontSize: 14,
  },
  pageButtonTextDisabled: {
    color: '#666',
  },
  pageInfo: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#666',
  },
});
