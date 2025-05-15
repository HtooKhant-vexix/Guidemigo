import { View, StyleSheet } from 'react-native';
import { Skeleton, SkeletonAvatar, SkeletonText } from './Skeleton';

export function SkeletonFeedPost() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SkeletonAvatar size={40} />
        <View style={styles.headerInfo}>
          <SkeletonText lines={2} spacing={4} />
        </View>
      </View>
      <View style={styles.content}>
        <SkeletonText lines={3} />
        <Skeleton height={300} style={styles.image} />
      </View>
      <View style={styles.actions}>
        <Skeleton width={80} height={24} />
        <Skeleton width={80} height={24} />
        <Skeleton width={80} height={24} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  content: {
    gap: 12,
    paddingHorizontal: 16,
  },
  image: {
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 12,
  },
});
