import { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from './Button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState = memo(
  ({ icon, title, description, actionLabel, onAction }: EmptyStateProps) => {
    return (
      <View style={styles.container}>
        {icon}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        {actionLabel && onAction && (
          <Button variant="primary" onPress={onAction} style={styles.button}>
            {actionLabel}
          </Button>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: 'InterSemiBold',
    color: '#000',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#666',
    textAlign: 'center',
  },
  button: {
    marginTop: 8,
  },
});

export default EmptyState;
