import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'error';
  size?: 'sm' | 'md';
}

const Badge = memo(
  ({ label, variant = 'primary', size = 'md' }: BadgeProps) => {
    return (
      <View style={[styles.badge, styles[variant], styles[size]]}>
        <Text
          style={[styles.text, styles[`${variant}Text`], styles[`${size}Text`]]}
        >
          {label}
        </Text>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  badge: {
    borderRadius: 99,
    alignSelf: 'flex-start',
  },
  primary: {
    backgroundColor: '#00BCD4',
  },
  secondary: {
    backgroundColor: '#f5f5f5',
  },
  success: {
    backgroundColor: '#4CAF50',
  },
  error: {
    backgroundColor: '#FF4444',
  },
  sm: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  md: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  text: {
    fontFamily: 'InterSemiBold',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#000',
  },
  successText: {
    color: '#fff',
  },
  errorText: {
    color: '#fff',
  },
  smText: {
    fontSize: 12,
  },
  mdText: {
    fontSize: 14,
  },
});

export default Badge;
