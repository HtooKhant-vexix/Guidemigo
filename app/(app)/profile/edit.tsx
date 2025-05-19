import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Camera } from 'lucide-react-native';
import { useState } from 'react';

export default function EditProfile() {
  const [profile, setProfile] = useState({
    name: 'Htoo Aung Khant',
    email: 'demo@example.com',
    phone: '+65 1234 5678',
    bio: 'Travel enthusiast and adventure seeker',
  });

  const handleSave = () => {
    // TODO: Implement save functionality
    Alert.alert('Success', 'Profile updated successfully');
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.profileImageContainer}>
        <Image
          source={require('../../../assets/images/icon.png')}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.cameraButton}>
          <Camera size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={profile.name}
            onChangeText={(text) => setProfile({ ...profile, name: text })}
            placeholder="Enter your full name"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={profile.email}
            onChangeText={(text) => setProfile({ ...profile, email: text })}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            value={profile.phone}
            onChangeText={(text) => setProfile({ ...profile, phone: text })}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, styles.bioInput]}
            value={profile.bio}
            onChangeText={(text) => setProfile({ ...profile, bio: text })}
            placeholder="Tell us about yourself"
            multiline
            numberOfLines={4}
          />
        </View>
      </View>
    </ScrollView>
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
  saveButton: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#00BCD4',
  },
  profileImageContainer: {
    alignItems: 'center',
    padding: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 24,
    right: '50%',
    marginRight: -60,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#00BCD4',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontFamily: 'InterSemiBold',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#000',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
});
