import { memo } from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  variant?: 'elevated' | 'outlined';
  children: React.ReactNode;
}

const Card = memo(
  ({ variant = 'elevated', style, children, ...props }: CardProps) => {
    return (
      <View style={[styles.card, styles[variant], style]} {...props}>
        {children}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#fff',
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  outlined: {
    borderWidth: 1,
    borderColor: '#eee',
  },
});

export default Card;
