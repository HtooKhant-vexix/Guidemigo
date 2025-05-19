import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, HelpCircle } from 'lucide-react-native';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  relatedQuestions: string[];
}

const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How do I book a tour?',
    answer:
      'To book a tour, simply browse through our available tours, select your preferred date and time, and click the "Book Now" button. Follow the payment process to confirm your booking. You will receive a confirmation email with all the details of your booking, including the meeting point and your tour guide\'s contact information.',
    relatedQuestions: [
      'What payment methods are accepted?',
      'Can I modify my booking?',
      'What is the cancellation policy?',
    ],
  },
  {
    id: '2',
    question: 'What is the cancellation policy?',
    answer:
      'You can cancel your booking up to 24 hours before the tour start time for a full refund. Cancellations made within 24 hours may be subject to a cancellation fee. To cancel your booking, go to your bookings page, select the tour you want to cancel, and click the "Cancel Booking" button. The refund will be processed within 5-7 business days.',
    relatedQuestions: [
      'How do I get a refund?',
      'Can I reschedule my tour?',
      'What happens if the tour is cancelled?',
    ],
  },
  {
    id: '3',
    question: 'How do I contact my tour guide?',
    answer:
      'Once your booking is confirmed, you can contact your tour guide through the messaging feature in the app. Their contact information will also be provided in your booking confirmation. You can send messages, photos, and even make voice calls through the app. Tour guides typically respond within 1-2 hours during business hours.',
    relatedQuestions: [
      'What if my tour guide is late?',
      'Can I request a different tour guide?',
      'How do I rate my tour guide?',
    ],
  },
  {
    id: '4',
    question: 'What payment methods are accepted?',
    answer:
      'We accept all major credit cards, including Visa, Mastercard, and American Express. You can also use PayPal for your bookings. All payments are processed securely through our payment gateway. We do not store your credit card information on our servers.',
    relatedQuestions: [
      'Is my payment information secure?',
      'Can I pay in cash?',
      'Do you offer payment plans?',
    ],
  },
  {
    id: '5',
    question: 'How do I become a tour guide?',
    answer:
      'To become a tour guide, you need to submit an application through our website. We will review your qualifications and experience before approving your application. Requirements include: a valid tour guide license, first aid certification, and at least 2 years of experience in the tourism industry. Selected candidates will be invited for an interview and a trial tour.',
    relatedQuestions: [
      'What are the requirements?',
      'How much can I earn?',
      'What training is provided?',
    ],
  },
];

export default function FAQDetail() {
  const { id } = useLocalSearchParams();
  const faq = faqs.find((f) => f.id === id);

  if (!faq) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>FAQ Not Found</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQ</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.questionContainer}>
          <HelpCircle size={24} color="#00BCD4" style={styles.questionIcon} />
          <Text style={styles.question}>{faq.question}</Text>
        </View>

        <Text style={styles.answer}>{faq.answer}</Text>

        <View style={styles.relatedSection}>
          <Text style={styles.relatedTitle}>Related Questions</Text>
          {faq.relatedQuestions.map((question, index) => (
            <TouchableOpacity
              key={index}
              style={styles.relatedItem}
              onPress={() => {
                // Navigate to related question
              }}
            >
              <Text style={styles.relatedQuestion}>{question}</Text>
            </TouchableOpacity>
          ))}
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
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  questionIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  question: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'InterSemiBold',
    color: '#000',
    lineHeight: 28,
  },
  answer: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#666',
    lineHeight: 24,
    marginBottom: 32,
  },
  relatedSection: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 24,
  },
  relatedTitle: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#666',
    marginBottom: 16,
  },
  relatedItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  relatedQuestion: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#00BCD4',
  },
});
