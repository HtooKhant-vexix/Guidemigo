import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Plus, CreditCard, Trash2 } from 'lucide-react-native';
import { useState } from 'react';

interface PaymentCard {
  id: string;
  type: 'visa' | 'mastercard';
  last4: string;
  expiry: string;
  isDefault: boolean;
}

export default function PaymentMethods() {
  const [cards, setCards] = useState<PaymentCard[]>([
    {
      id: '1',
      type: 'visa',
      last4: '4242',
      expiry: '12/25',
      isDefault: true,
    },
    {
      id: '2',
      type: 'mastercard',
      last4: '8888',
      expiry: '09/24',
      isDefault: false,
    },
  ]);

  const handleAddCard = () => {
    router.push('/payment-methods/add');
  };

  const handleDeleteCard = (cardId: string) => {
    setCards(cards.filter((card) => card.id !== cardId));
  };

  const handleSetDefault = (cardId: string) => {
    setCards(
      cards.map((card) => ({
        ...card,
        isDefault: card.id === cardId,
      }))
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {cards.map((card) => (
          <View key={card.id} style={styles.cardContainer}>
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Image
                  source={
                    card.type === 'visa'
                      ? require('../../../assets/images/1.png')
                      : require('../../../assets/images/1.png')
                  }
                  style={styles.cardType}
                />
                {card.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
              </View>
              <Text style={styles.cardNumber}>•••• {card.last4}</Text>
              <Text style={styles.cardExpiry}>Expires {card.expiry}</Text>
            </View>
            <View style={styles.cardActions}>
              {!card.isDefault && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleSetDefault(card.id)}
                >
                  <Text style={styles.actionText}>Set as Default</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDeleteCard(card.id)}
              >
                <Trash2 size={20} color="#FF4444" />
                <Text style={[styles.actionText, styles.deleteText]}>
                  Remove
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.addButton} onPress={handleAddCard}>
          <Plus size={24} color="#00BCD4" />
          <Text style={styles.addButtonText}>Add New Card</Text>
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
  cardContainer: {
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardType: {
    width: 60,
    height: 40,
    resizeMode: 'contain',
  },
  defaultBadge: {
    backgroundColor: '#00BCD4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'InterSemiBold',
  },
  cardNumber: {
    fontSize: 18,
    fontFamily: 'InterSemiBold',
    color: '#000',
    marginBottom: 8,
  },
  cardExpiry: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
  },
  deleteButton: {
    gap: 4,
  },
  deleteText: {
    color: '#FF4444',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginTop: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#00BCD4',
  },
});
