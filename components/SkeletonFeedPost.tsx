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
        <SkeletonText lines={3} spacing={6} />
        <Skeleton height={300} style={styles.image} />
      </View>
      <View style={styles.actions}>
        <View style={styles.actionButton}>
          <Skeleton width={24} height={24} variant="circular" />
          <Skeleton width={40} height={16} />
        </View>
        <View style={styles.actionButton}>
          <Skeleton width={24} height={24} variant="circular" />
          <Skeleton width={40} height={16} />
        </View>
        <View style={styles.actionButton}>
          <Skeleton width={24} height={24} variant="circular" />
          <Skeleton width={40} height={16} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  content: {
    gap: 12,
  },
  image: {
    borderRadius: 8,
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
