import { View, StyleSheet } from 'react-native';
import { Skeleton, SkeletonText } from './Skeleton';

export function SkeletonPlaceCard() {
  return (
    <View style={styles.container}>
      <Skeleton height={200} borderRadius={12} />
      <View style={styles.content}>
        <SkeletonText lines={1} />
        <View style={styles.info}>
          <Skeleton width={100} height={16} />
          <Skeleton width={60} height={16} />
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
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 16,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
