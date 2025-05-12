import { memo, forwardRef } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
} from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
}

const Input = memo(
  forwardRef<TextInput, InputProps>(
    ({ label, error, helper, style, ...props }, ref) => {
      return (
        <View style={styles.container}>
          {label && <Text style={styles.label}>{label}</Text>}
          <TextInput
            ref={ref}
            style={[styles.input, error && styles.inputError, style]}
            placeholderTextColor="#666"
            {...props}
          />
          {(error || helper) && (
            <Text style={[styles.helper, error && styles.error]}>
              {error || helper}
            </Text>
          )}
        </View>
      );
    }
  )
);

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: 'InterSemiBold',
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter',
  },
  inputError: {
    borderColor: '#FF4444',
  },
  helper: {
    fontSize: 12,
    fontFamily: 'Inter',
    color: '#666',
  },
  error: {
    color: '#FF4444',
  },
});

export default Input;
