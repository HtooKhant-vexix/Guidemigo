import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Bell,
  Moon,
  Globe,
  Shield,
  HelpCircle,
  Info,
} from 'lucide-react-native';
import { useState } from 'react';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationServices, setLocationServices] = useState(true);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          // Here you would typically handle the logout logic
          router.replace('/');
        },
      },
    ]);
  };

  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    value?: React.ReactNode,
    onPress?: () => void
  ) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingIcon}>{icon}</View>
      <Text style={styles.settingTitle}>{title}</Text>
      {value && <View style={styles.settingValue}>{value}</View>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          {renderSettingItem(
            <Bell size={24} color="#666" />,
            'Notifications',
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#ddd', true: '#00BCD4' }}
            />
          )}
          {renderSettingItem(
            <Moon size={24} color="#666" />,
            'Dark Mode',
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#ddd', true: '#00BCD4' }}
            />
          )}
          {renderSettingItem(
            <Globe size={24} color="#666" />,
            'Language',
            <Text style={styles.settingValueText}>English</Text>,
            () => {
              // Handle language selection
            }
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          {renderSettingItem(
            <Shield size={24} color="#666" />,
            'Privacy Settings',
            null,
            () => {
              // Navigate to privacy settings
            }
          )}
          {renderSettingItem(
            <Globe size={24} color="#666" />,
            'Location Services',
            <Switch
              value={locationServices}
              onValueChange={setLocationServices}
              trackColor={{ false: '#ddd', true: '#00BCD4' }}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          {renderSettingItem(
            <HelpCircle size={24} color="#666" />,
            'Help Center',
            null,
            () => {
              // Navigate to help center
            }
          )}
          {renderSettingItem(
            <Info size={24} color="#666" />,
            'About',
            null,
            () => {
              // Navigate to about page
            }
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#666',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingIcon: {
    width: 40,
    alignItems: 'center',
  },
  settingTitle: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#000',
    marginLeft: 8,
  },
  settingValue: {
    marginLeft: 8,
  },
  settingValueText: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#FF4444',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'InterSemiBold',
  },
});
