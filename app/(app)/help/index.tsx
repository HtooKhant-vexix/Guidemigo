import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Search,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  ChevronRight,
} from 'lucide-react-native';
import { useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs: FAQ[] = [
    {
      question: 'How do I book a tour?',
      answer:
        'To book a tour, simply browse through our available tours, select your preferred date and time, and click the "Book Now" button. Follow the payment process to confirm your booking.',
    },
    {
      question: 'What is the cancellation policy?',
      answer:
        'You can cancel your booking up to 24 hours before the tour start time for a full refund. Cancellations made within 24 hours may be subject to a cancellation fee.',
    },
    {
      question: 'How do I contact my tour guide?',
      answer:
        'Once your booking is confirmed, you can contact your tour guide through the messaging feature in the app. Their contact information will also be provided in your booking confirmation.',
    },
    {
      question: 'What payment methods are accepted?',
      answer:
        'We accept all major credit cards, including Visa, Mastercard, and American Express. You can also use PayPal for your bookings.',
    },
    {
      question: 'How do I become a tour guide?',
      answer:
        'To become a tour guide, you need to submit an application through our website. We will review your qualifications and experience before approving your application.',
    },
  ];

  const filteredFAQs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for help"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {filteredFAQs.map((faq, index) => (
            <TouchableOpacity
              key={index}
              style={styles.faqItem}
              onPress={() => {
                // Navigate to FAQ detail page
              }}
            >
              <View style={styles.faqContent}>
                <HelpCircle size={24} color="#00BCD4" style={styles.faqIcon} />
                <Text style={styles.faqQuestion}>{faq.question}</Text>
              </View>
              <ChevronRight size={20} color="#666" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          <TouchableOpacity style={styles.contactItem}>
            <MessageCircle
              size={24}
              color="#00BCD4"
              style={styles.contactIcon}
            />
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>Live Chat</Text>
              <Text style={styles.contactSubtitle}>Available 24/7</Text>
            </View>
            <ChevronRight size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem}>
            <Phone size={24} color="#00BCD4" style={styles.contactIcon} />
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>Phone Support</Text>
              <Text style={styles.contactSubtitle}>+1 (555) 123-4567</Text>
            </View>
            <ChevronRight size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactItem}>
            <Mail size={24} color="#00BCD4" style={styles.contactIcon} />
            <View style={styles.contactContent}>
              <Text style={styles.contactTitle}>Email Support</Text>
              <Text style={styles.contactSubtitle}>support@guidemigo.com</Text>
            </View>
            <ChevronRight size={20} color="#666" />
          </TouchableOpacity>
        </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#000',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#666',
    marginBottom: 12,
  },
  faqItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  faqContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  faqIcon: {
    marginRight: 12,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#000',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  contactIcon: {
    marginRight: 12,
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#000',
  },
  contactSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
    marginTop: 2,
  },
});
