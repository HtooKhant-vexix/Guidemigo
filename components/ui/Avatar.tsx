import { memo } from 'react';
import { Image, View, StyleSheet } from 'react-native';

interface AvatarProps {
  source: string;
  size?: number;
  borderColor?: string;
}

const Avatar = memo(({
  source,
  size = 40,
  borderColor,
}: AvatarProps) => {
  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor,
        },
        borderColor && styles.border,
      ]}
    >
      <Image
        source={{ uri: source }}
        style={[
          styles.image,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  border: {
    borderWidth: 2,
    padding: 2,
  },
  image: {
    resizeMode: 'cover',
  },
});

export default Avatar;