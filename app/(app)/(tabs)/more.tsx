import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import {
  User,
  Bell,
  Lock,
  CircleHelp as HelpCircle,
  Info,
  ChevronRight,
  LogOut,
  Moon,
  CreditCard,
  Shield,
  Languages,
  Settings,
  Bookmark,
  History,
} from 'lucide-react-native';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { useAuthStore } from '../../../service/auth';
import { fetchUserProfile } from '../../../service/api';
import { Ionicons } from '@expo/vector-icons';

const ProfileSkeleton = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.profileSection}>
      <Animated.View
        style={[styles.profileImage, { backgroundColor: '#E0E0E0', opacity }]}
      />
      <Animated.View
        style={[styles.skeletonText, { width: 150, height: 24, opacity }]}
      />
      <Animated.View
        style={[styles.skeletonText, { width: 200, height: 20, opacity }]}
      />
      <Animated.View style={[styles.skeletonButton, { opacity }]} />
    </View>
  );
};

export default function More() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const { logout } = useAuth();
  const { user, accessToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id || !accessToken) return;

      try {
        setIsLoading(true);
        const response = await fetchUserProfile(user.id, accessToken);
        if (response.success) {
          setProfileData(response.data);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user?.id, accessToken]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/welcome');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const menuSections = [
    {
      title: 'Account',
      items: [
        {
          icon: User,
          title: 'Profile',
          onPress: () => router.push('/profile'),
        },
        {
          icon: CreditCard,
          title: 'Payment Methods',
          onPress: () => router.push('/payment-methods'),
        },
        {
          icon: Bookmark,
          title: 'Saved Items',
          onPress: () => router.push('/saved'),
        },
        {
          icon: History,
          title: 'Booking History',
          onPress: () => router.push('/bookings'),
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: Bell,
          title: 'Notifications',
          onPress: () => router.push('/notifications'),
          rightElement: (
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#ddd', true: '#00BCD4' }}
              thumbColor="#fff"
            />
          ),
        },
        {
          icon: Moon,
          title: 'Dark Mode',
          onPress: () => setDarkMode(!darkMode),
          rightElement: (
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#ddd', true: '#00BCD4' }}
              thumbColor="#fff"
            />
          ),
        },
        {
          icon: Languages,
          title: 'Language',
          onPress: () => router.push('/language'),
          rightElement: <ChevronRight size={20} color="#666" />,
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          title: 'Help Center',
          onPress: () => router.push('/help'),
        },
        {
          icon: Shield,
          title: 'Privacy Policy',
          onPress: () => router.push('/privacy'),
        },
        {
          icon: Info,
          title: 'About',
          onPress: () => router.push('/about'),
        },
      ],
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {isLoading ? (
        <ProfileSkeleton />
      ) : (
        <View style={styles.profileSection}>
          <Image
            source={
              profileData?.image
                ? { uri: profileData.image }
                : require('../../../assets/images/default.jpg')
            }
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>
            {profileData?.name || user?.name}
          </Text>
          <Text style={styles.profileEmail}>{user?.email}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => router.push('../profile/edit')}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      )}

      {menuSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map((item, itemIndex) => (
            <TouchableOpacity
              key={itemIndex}
              style={[
                styles.menuItem,
                itemIndex === section.items.length - 1 && styles.lastMenuItem,
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <item.icon size={24} color="#666" />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              {item.rightElement || <ChevronRight size={20} color="#666" />}
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={24} color="#FF4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    paddingTop: 48,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'InterBold',
    color: '#000',
  },
  profileSection: {
    padding: 24,
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 20,
    fontFamily: 'InterBold',
    color: '#000',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#666',
    marginBottom: 16,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#00BCD4',
    borderRadius: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'InterSemiBold',
  },
  section: {
    marginTop: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#666',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#000',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#FF4444',
  },
  version: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
    marginTop: 32,
    marginBottom: 16,
  },
  skeletonText: {
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonButton: {
    width: 120,
    height: 36,
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    marginTop: 8,
  },
});
