import { View, StyleSheet } from 'react-native';
import { Skeleton, SkeletonText } from './Skeleton';

export function SkeletonHostCard() {
  return (
    <View style={styles.container}>
      <Skeleton height={120} />
      <View style={styles.content}>
        <SkeletonText lines={1} />
        <View style={styles.stats}>
          <Skeleton width={80} height={16} />
          <Skeleton width={60} height={16} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  content: {
    padding: 12,
    gap: 8,
  },
  stats: {
    gap: 4,
  },
});
