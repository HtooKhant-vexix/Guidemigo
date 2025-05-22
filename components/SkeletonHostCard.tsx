import { View, StyleSheet } from 'react-native';
import { Skeleton, SkeletonText } from './Skeleton';

export function SkeletonHostCard() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Skeleton height={260} borderRadius={12} />
      </View>
      <View style={styles.content}>
        <SkeletonText lines={1} spacing={8} />
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Skeleton width={24} height={24} variant="circular" />
            <Skeleton width={60} height={16} />
          </View>
          <View style={styles.stat}>
            <Skeleton width={24} height={24} variant="circular" />
            <Skeleton width={60} height={16} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    marginVertical: 10,
    marginHorizontal: 10,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 120,
  },
  content: {
    padding: 16,
    marginTop: 10,
    gap: 12,
  },
  stats: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
