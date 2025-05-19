import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, CreditCard } from 'lucide-react-native';
import { useState } from 'react';

export default function AddCard() {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const formatExpiry = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleSave = () => {
    if (!cardNumber || !cardHolder || !expiry || !cvv) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Here you would typically make an API call to save the card
    Alert.alert('Success', 'Card added successfully', [
      {
        text: 'OK',
        onPress: () => router.back(),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Card</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.cardPreview}>
          <CreditCard size={32} color="#00BCD4" />
          <Text style={styles.cardPreviewText}>
            {cardNumber || '•••• •••• •••• ••••'}
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Card Number</Text>
            <TextInput
              style={styles.input}
              placeholder="1234 5678 9012 3456"
              keyboardType="numeric"
              maxLength={19}
              value={cardNumber}
              onChangeText={(text) => setCardNumber(formatCardNumber(text))}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Card Holder Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              value={cardHolder}
              onChangeText={setCardHolder}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                keyboardType="numeric"
                maxLength={5}
                value={expiry}
                onChangeText={(text) => setExpiry(formatExpiry(text))}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>CVV</Text>
              <TextInput
                style={styles.input}
                placeholder="123"
                keyboardType="numeric"
                maxLength={3}
                value={cvv}
                onChangeText={setCvv}
                secureTextEntry
              />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Card</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'InterSemiBold',
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  cardPreview: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  cardPreviewText: {
    fontSize: 24,
    fontFamily: 'InterSemiBold',
    color: '#000',
    marginTop: 16,
    letterSpacing: 2,
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'InterSemiBold',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#000',
  },
  row: {
    flexDirection: 'row',
  },
  saveButton: {
    backgroundColor: '#00BCD4',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'InterSemiBold',
  },
});
