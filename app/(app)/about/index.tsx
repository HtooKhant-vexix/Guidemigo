import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
} from 'react-native';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Globe,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Mail,
} from 'lucide-react-native';

interface TeamMember {
  name: string;
  role: string;
  image: any;
  bio: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'John Doe',
    role: 'CEO & Founder',
    image: require('../../../assets/images/1.png'),
    bio: 'With over 15 years of experience in the tourism industry, John founded Guidemigo to revolutionize the way people experience travel.',
  },
  {
    name: 'Jane Smith',
    role: 'Head of Operations',
    image: require('../../../assets/images/1.png'),
    bio: 'Jane brings her expertise in operations management to ensure smooth and memorable experiences for all our users.',
  },
  {
    name: 'Mike Johnson',
    role: 'Lead Developer',
    image: require('../../../assets/images/1.png'),
    bio: 'Mike leads our technical team, bringing innovative solutions to make travel planning and booking seamless.',
  },
];

export default function About() {
  const handleSocialLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Us</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.hero}>
          <Image
            source={require('../../../assets/images/1.png')}
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroTitle}>Guidemigo</Text>
            <Text style={styles.heroSubtitle}>
              Connecting travelers with local experiences
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Story</Text>
          <Text style={styles.sectionText}>
            Founded in 2020, Guidemigo was born from a simple idea: to make
            travel more personal and authentic. We believe that the best way to
            experience a new place is through the eyes of locals who know it
            best.
          </Text>
          <Text style={styles.sectionText}>
            Our platform connects travelers with experienced local guides who
            share their knowledge, passion, and unique perspectives. Together,
            we're creating meaningful connections and unforgettable experiences
            around the world.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Team</Text>
          {teamMembers.map((member, index) => (
            <View key={index} style={styles.teamMember}>
              <Image source={member.image} style={styles.memberImage} />
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberRole}>{member.role}</Text>
                <Text style={styles.memberBio}>{member.bio}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connect With Us</Text>
          <View style={styles.socialLinks}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() =>
                handleSocialLink('https://instagram.com/guidemigo')
              }
            >
              <Instagram size={24} color="#00BCD4" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLink('https://twitter.com/guidemigo')}
            >
              <Twitter size={24} color="#00BCD4" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLink('https://facebook.com/guidemigo')}
            >
              <Facebook size={24} color="#00BCD4" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() =>
                handleSocialLink('https://linkedin.com/company/guidemigo')
              }
            >
              <Linkedin size={24} color="#00BCD4" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleSocialLink('mailto:contact@guidemigo.com')}
          >
            <Mail size={24} color="#00BCD4" style={styles.contactIcon} />
            <Text style={styles.contactText}>contact@guidemigo.com</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleSocialLink('https://guidemigo.com')}
          >
            <Globe size={24} color="#00BCD4" style={styles.contactIcon} />
            <Text style={styles.contactText}>www.guidemigo.com</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 Guidemigo. All rights reserved.
          </Text>
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
  },
  hero: {
    height: 200,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  heroTitle: {
    fontSize: 32,
    fontFamily: 'InterBold',
    color: '#fff',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#fff',
    textAlign: 'center',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'InterSemiBold',
    color: '#000',
    marginBottom: 16,
  },
  sectionText: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#666',
    lineHeight: 24,
    marginBottom: 12,
  },
  teamMember: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  memberImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 18,
    fontFamily: 'InterSemiBold',
    color: '#000',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#00BCD4',
    marginBottom: 8,
  },
  memberBio: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
    lineHeight: 20,
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  socialButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  contactIcon: {
    marginRight: 12,
  },
  contactText: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#666',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
  },
});
