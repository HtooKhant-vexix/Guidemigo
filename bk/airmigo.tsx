import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {
  Search,
  Plane,
  Calendar,
  Users,
  ArrowRight,
} from 'lucide-react-native';

const FLIGHTS = [
  {
    id: '1',
    from: 'Singapore',
    to: 'Tokyo',
    date: 'Mar 15, 2024',
    airline: 'Singapore Airlines',
    price: 580,
    duration: '7h 10m',
    image: 'https://images.pexels.com/photos/379419/pexels-photo-379419.jpeg',
  },
  {
    id: '2',
    from: 'Singapore',
    to: 'Seoul',
    date: 'Mar 18, 2024',
    airline: 'Korean Air',
    price: 420,
    duration: '6h 35m',
    image: 'https://images.pexels.com/photos/2026324/pexels-photo-2026324.jpeg',
  },
  {
    id: '3',
    from: 'Singapore',
    to: 'Bangkok',
    date: 'Mar 20, 2024',
    airline: 'Thai Airways',
    price: 220,
    duration: '2h 25m',
    image: 'https://images.pexels.com/photos/1680247/pexels-photo-1680247.jpeg',
  },
];

const QUICK_FILTERS = [
  'Direct flights',
  'Morning',
  'Evening',
  'Business Class',
];

export default function Airmigo() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Your Flight</Text>
        <Text style={styles.headerSubtitle}>
          Search and book flights worldwide
        </Text>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <View style={styles.searchRow}>
            <View style={styles.searchField}>
              <Text style={styles.searchLabel}>From</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Departure city"
                placeholderTextColor="#666"
              />
            </View>
            <View style={styles.searchDivider} />
            <View style={styles.searchField}>
              <Text style={styles.searchLabel}>To</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Arrival city"
                placeholderTextColor="#666"
              />
            </View>
          </View>

          <View style={styles.searchRow}>
            <View style={styles.searchField}>
              <Text style={styles.searchLabel}>Date</Text>
              <TouchableOpacity style={styles.dateButton}>
                <Calendar size={20} color="#666" />
                <Text style={styles.dateButtonText}>Select dates</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.searchDivider} />
            <View style={styles.searchField}>
              <Text style={styles.searchLabel}>Passengers</Text>
              <TouchableOpacity style={styles.dateButton}>
                <Users size={20} color="#666" />
                <Text style={styles.dateButtonText}>1 Adult</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.searchButton}>
            <Search size={20} color="#fff" />
            <Text style={styles.searchButtonText}>Search Flights</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filters}
        >
          {QUICK_FILTERS.map((filter, index) => (
            <TouchableOpacity key={index} style={styles.filterChip}>
              <Text style={styles.filterText}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Flights</Text>
        {FLIGHTS.map((flight) => (
          <TouchableOpacity key={flight.id} style={styles.flightCard}>
            <Image source={{ uri: flight.image }} style={styles.flightImage} />
            <View style={styles.flightContent}>
              <View style={styles.flightRoute}>
                <View style={styles.routePoint}>
                  <Text style={styles.cityText}>{flight.from}</Text>
                </View>
                <View style={styles.routeLine}>
                  <Plane size={16} color="#00BCD4" />
                </View>
                <View style={styles.routePoint}>
                  <Text style={styles.cityText}>{flight.to}</Text>
                </View>
              </View>

              <View style={styles.flightDetails}>
                <View style={styles.detailColumn}>
                  <Text style={styles.detailLabel}>Date</Text>
                  <Text style={styles.detailText}>{flight.date}</Text>
                </View>
                <View style={styles.detailColumn}>
                  <Text style={styles.detailLabel}>Duration</Text>
                  <Text style={styles.detailText}>{flight.duration}</Text>
                </View>
                <View style={styles.detailColumn}>
                  <Text style={styles.detailLabel}>Airline</Text>
                  <Text style={styles.detailText}>{flight.airline}</Text>
                </View>
              </View>

              <View style={styles.flightFooter}>
                <View>
                  <Text style={styles.priceLabel}>Price per person</Text>
                  <Text style={styles.priceText}>${flight.price}</Text>
                </View>
                <TouchableOpacity style={styles.selectButton}>
                  <Text style={styles.selectButtonText}>Select</Text>
                  <ArrowRight size={16} color="#fff" />
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
  searchSection: {
    padding: 16,
    backgroundColor: '#fff',
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  searchContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    gap: 16,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 16,
  },
  searchField: {
    flex: 1,
  },
  searchLabel: {
    fontSize: 12,
    fontFamily: 'InterSemiBold',
    color: '#666',
    marginBottom: 4,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter',
  },
  searchDivider: {
    width: 1,
    backgroundColor: '#ddd',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
  },
  dateButtonText: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#666',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#00BCD4',
    padding: 16,
    borderRadius: 8,
  },
  searchButtonText: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#fff',
  },
  filtersContainer: {
    marginTop: 16,
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
  flightCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  flightImage: {
    width: '100%',
    height: 120,
  },
  flightContent: {
    padding: 16,
    gap: 16,
  },
  flightRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  routePoint: {
    flex: 1,
  },
  routeLine: {
    flex: 1,
    alignItems: 'center',
  },
  cityText: {
    fontSize: 18,
    fontFamily: 'InterSemiBold',
    color: '#000',
    textAlign: 'center',
  },
  flightDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  detailColumn: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Inter',
    color: '#666',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'InterSemiBold',
    color: '#000',
  },
  flightFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 12,
    fontFamily: 'Inter',
    color: '#666',
  },
  priceText: {
    fontSize: 24,
    fontFamily: 'InterBold',
    color: '#00BCD4',
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#00BCD4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  selectButtonText: {
    fontSize: 14,
    fontFamily: 'InterSemiBold',
    color: '#fff',
  },
});
