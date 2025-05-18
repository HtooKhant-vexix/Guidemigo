import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Users } from 'lucide-react-native';
import { useHosts, useReview } from '@/hooks/useData';
import { SkeletonHostCard } from '@/components/SkeletonHostCard';
import { SkeletonFeedPost } from '@/components/SkeletonFeedPost';

const ALL_HOSTS = [
  {
    id: '1',
    name: 'Venkatesh',
    languages: ['Mandarin', 'English'],
    travelers: 12,
    image: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6',
    rating: 4.8,
    specialties: ['Cultural Tours', 'Food Tours'],
  },
  {
    id: '2',
    name: 'Lokesh',
    languages: ['Mandarin', 'English'],
    travelers: 23,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    rating: 4.9,
    specialties: ['Architecture', 'Night Tours'],
  },
  {
    id: '3',
    name: 'Priya',
    languages: ['English', 'Tamil'],
    travelers: 18,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    rating: 4.7,
    specialties: ['Heritage Walks', 'Photography'],
  },
  {
    id: '4',
    name: 'Michael',
    languages: ['English', 'Japanese'],
    travelers: 31,
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    rating: 4.9,
    specialties: ['Adventure Tours', 'Nature Walks'],
  },
];

export default function AllHosts() {
  const { hosts, loading, error } = useHosts();
  if (loading) {
    return (
      <ScrollView style={styles.container}>
        {Array.from({ length: 3 }).map((_, index) => (
          <SkeletonFeedPost key={index} />
        ))}
      </ScrollView>
    );
  }

  // if (error) {
  //   return (
  //     <View style={styles.errorContainer}>
  //       <Text style={styles.errorText}>{error}</Text>
  //     </View>
  //   );
  // }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft color="#000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Hosts in Singapore</Text>
      </View>

      <FlatList
        data={hosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.hostCard}
            onPress={() => router.push(`/hosts/${item.profile.id}`)}
          >
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
              }}
              style={styles.hostImage}
            />
            <View style={styles.hostInfo}>
              <Text style={styles.hostName}>{item.profile.name}</Text>
              <View style={styles.hostStats}>
                <Users size={16} color="#00BCD4" />
                <Text style={styles.hostStatsText}>
                  {item.profile.travelers} Travelers
                </Text>
              </View>
              <Text style={styles.languages}>
                {item.profile.languages.join(' • ')}
              </Text>
              <View style={styles.specialtiesContainer}>
                {item.profile.languages.map((specialty, index) => (
                  <View key={index} style={styles.specialtyTag}>
                    <Text style={styles.specialtyText}>{specialty}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>
                  ★ {item.profile.rating ? item.profile.rating : 3}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        removeClippedSubviews={false}
        contentContainerStyle={styles.listContent}
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
  hostCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  hostImage: {
    width: '100%',
    height: 200,
  },
  hostInfo: {
    padding: 16,
  },
  hostName: {
    fontSize: 18,
    fontFamily: 'InterSemiBold',
    color: '#000',
    marginBottom: 8,
  },
  hostStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  hostStatsText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
  },
  languages: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
    marginBottom: 12,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  specialtyTag: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  specialtyText: {
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
