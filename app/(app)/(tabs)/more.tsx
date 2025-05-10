import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Image,
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
} from 'lucide-react-native';
import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';

export default function More() {
  const [darkMode, setDarkMode] = useState(false);
  const { logout } = useAuth();

  const menuItems = [
    {
      icon: User,
      title: 'Account',
      onPress: () => router.push('/profile'),
    },
    {
      icon: Bell,
      title: 'Notifications',
      onPress: () => router.push('/notifications'),
    },
    {
      icon: Lock,
      title: 'Privacy',
      onPress: () => router.push('/privacy'),
    },
    {
      icon: HelpCircle,
      title: 'Help Center',
      onPress: () => router.push('/help'),
    },
    {
      icon: Info,
      title: 'About',
      onPress: () => router.push('/about'),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      <View style={styles.section_sec}>
        <Image
          source={require('../../../assets/images/icon.png')}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
        <Text style={styles.headerTitle}>Htoo Aung Khant</Text>
        <Text style={{ fontSize: 16, fontFamily: 'Inter', color: '#666' }}>
          demo@example.com
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.darkModeContainer}>
          <View style={styles.darkModeLeft}>
            <Moon size={24} color="#666" />
            <Text style={styles.darkModeText}>Dark Mode</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: '#ddd', true: '#00BCD4' }}
            thumbColor="#fff"
          />
        </View>

        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuItemLeft}>
              <item.icon size={24} color="#666" />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <ChevronRight size={20} color="#666" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.menuItem, styles.logoutButton]}
          onPress={() => {
            logout();
            router.replace('/welcome');
          }}
        >
          <View style={styles.menuItemLeft}>
            <LogOut size={24} color="#FF4444" />
            <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  header: {
    padding: 16,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'InterBold',
    color: '#000',
  },
  section: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 26,
    height: '100%',
  },
  section_sec: {
    padding: 16,
    paddingVertical: 28,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 8,
  },
  darkModeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  darkModeText: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#000',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#000',
  },
  logoutButton: {
    marginTop: 24,
    borderBottomWidth: 0,
  },
  logoutText: {
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
});
