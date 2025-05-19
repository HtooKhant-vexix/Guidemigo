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
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '@/service/auth';
import { useHosts, usePlaces } from '@/hooks/useData';
import { SkeletonHostCard } from '@/components/SkeletonHostCard';
import { useState } from 'react';

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
  const { user } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<'traveler' | 'host'>(
    'traveler'
  );
  const { places, loading: placesLoading, error: placesError } = usePlaces();
  const { hosts, loading: hostsLoading, error: hostsError } = useHosts();

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

  const renderHostContent = () => (
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
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No tours created yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Create your first tour to get started
          </Text>
        </View>
      </View>
    </>
  );

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
});
