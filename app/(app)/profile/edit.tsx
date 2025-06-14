import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Camera,
  X,
  Check,
  ChevronDown,
  Calendar,
} from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../service/auth';
import * as ImagePicker from 'expo-image-picker';
import { fetchUserProfile } from '../../../service/api';

const EXPERTISE_OPTIONS = [
  'Local Culture',
  'Food & Cuisine',
  'History & Heritage',
  'Nature & Wildlife',
  'Adventure Sports',
  'Photography',
  'Nightlife',
  'Architecture',
  'Shopping',
  'Religious Sites',
  'Art & Crafts',
  'Music & Dance',
  'Traditional Festivals',
  'Hiking & Trekking',
  'Cycling Tours',
  'City Tours',
  'Boat Tours',
  'Language Translation',
  'Transportation Arrangements',
  'Event Planning',
];

const LANGUAGES = [
  'English',
  'Mandarin',
  'Malay',
  'Tamil',
  'Japanese',
  'Korean',
  'Hindi',
  'French',
  'Spanish',
  'German',
];

const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Non-binary', value: 'non-binary' },
  { label: 'Prefer not to say', value: 'not-specified' },
];

const PROFILE_TYPES = [
  { label: 'Host', value: 'host' },
  { label: 'Traveller', value: 'traveller' },
];

export default function EditProfile() {
  const { user, accessToken } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showExpertiseModal, setShowExpertiseModal] = useState(false);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [showLanguagesModal, setShowLanguagesModal] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  const [showMonthModal, setShowMonthModal] = useState(false);
  const [showYearModal, setShowYearModal] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    image: '',
    type: '',
    dob: '',
    expertise: [] as string[],
    experience: '',
    location: '',
    languages: [] as string[],
    gender: '',
  });

  console.log(profile, '..');

  useEffect(() => {
    const loadProfile = async () => {
      if (!user?.id || !accessToken) return;

      try {
        setIsFetching(true);
        const response = await fetchUserProfile(user.id, accessToken);
        console.log(response);
        if (response.success) {
          const profileData = response.data;
          setProfile({
            name: profileData.name || '',
            email: user.email || '',
            phone: profileData.phonenumber || '',
            bio: profileData.bio || '',
            image: profileData.image || '',
            type: profileData.type || '',
            dob: profileData.dob || '',
            expertise: profileData.expertise?.map((e: any) => e.name) || [],
            experience: profileData.experience || '',
            location: profileData.location || '',
            languages: profileData.languages || [],
            gender: profileData.gender || '',
          });
        } else {
          throw new Error(response.message || 'Failed to load profile');
        }
      } catch (error) {
        Alert.alert(
          'Error',
          error instanceof Error ? error.message : 'Failed to load profile'
        );
      } finally {
        setIsFetching(false);
      }
    };

    loadProfile();
  }, [user?.id, accessToken]);

  const generateDays = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push(i.toString().padStart(2, '0'));
    }
    return days;
  };

  const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 100; i <= currentYear; i++) {
      years.push(i.toString());
    }
    return years.reverse();
  };

  const handleDateChange = (type: 'day' | 'month' | 'year', value: string) => {
    const currentDate = profile.dob ? new Date(profile.dob) : new Date();
    let newDate = new Date(currentDate);

    if (type === 'day') {
      newDate.setDate(parseInt(value));
    } else if (type === 'month') {
      newDate.setMonth(MONTHS.indexOf(value));
    } else if (type === 'year') {
      newDate.setFullYear(parseInt(value));
    }

    setProfile({ ...profile, dob: newDate.toISOString() });
  };

  const getCurrentDateParts = () => {
    if (!profile.dob) return { day: '', month: '', year: '' };
    const date = new Date(profile.dob);
    return {
      day: date.getDate().toString().padStart(2, '0'),
      month: MONTHS[date.getMonth()],
      year: date.getFullYear().toString(),
    };
  };

  console.log(profile.expertise, '........');
  const toggleExpertise = (expert: string) => {
    setProfile((prev) => ({
      ...prev,
      expertise: prev.expertise.includes(expert)
        ? prev.expertise.filter((e) => e !== expert)
        : [...prev.expertise, expert],
    }));
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfile({ ...profile, image: result.assets[0].uri });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const toggleLanguage = (language: string) => {
    setProfile((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('name', profile.name);
      formData.append('bio', profile.bio);
      formData.append('phonenumber', profile.phone);
      formData.append('type', profile.type);
      formData.append('dob', profile.dob);
      formData.append('experience', profile.experience);
      formData.append('location', profile.location);
      formData.append('gender', profile.gender);

      if (profile.expertise.length > 0) {
        profile.expertise.forEach((exp) => {
          formData.append('expertise[]', exp);
        });
      }

      if (profile.languages.length > 0) {
        profile.languages.forEach((lang) => {
          formData.append('languages[]', lang);
        });
      }

      if (profile.image && profile.image.startsWith('file://')) {
        const imageUri = profile.image;
        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('image', {
          uri: imageUri,
          name: filename,
          type,
        } as any);
      }

      const response = await fetch(
        `${
          process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.165:3000'
        }/user/profile/update?id=${user?.id}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', 'Profile updated successfully');
        router.back();
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to update profile'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#00BCD4" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} disabled={isLoading}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.profileImageContainer}>
        <Image
          source={
            profile.image
              ? { uri: profile.image }
              : require('../../../assets/images/default.jpg')
          }
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.cameraButton} onPress={pickImage}>
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
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={profile.email}
            editable={false}
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
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Type</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowTypeModal(!showTypeModal)}
            disabled={isLoading}
          >
            <View style={styles.languageSelector}>
              <Text
                style={[
                  styles.languageText,
                  profile.type && styles.selectedText,
                ]}
              >
                {profile.type
                  ? profile.type.charAt(0).toUpperCase() + profile.type.slice(1)
                  : 'Select type'}
              </Text>
              <ChevronDown size={20} color="#666" />
            </View>
          </TouchableOpacity>
          {showTypeModal && (
            <ScrollView
              style={styles.languageDropdown}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
            >
              {PROFILE_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  style={[
                    styles.languageOption,
                    profile.type === type.value &&
                      styles.selectedLanguageOption,
                  ]}
                  onPress={() => {
                    setProfile((prev) => ({ ...prev, type: type.value }));
                    setShowTypeModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.languageOptionText,
                      profile.type === type.value &&
                        styles.selectedLanguageOptionText,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date of Birth</Text>
          <View style={styles.datePickerContainer}>
            <TouchableOpacity
              style={[styles.datePickerInput, { flex: 1 }]}
              onPress={() => setShowDayModal(true)}
              disabled={isLoading}
            >
              <Text
                style={[styles.dateText, profile.dob && styles.selectedText]}
              >
                {getCurrentDateParts().day || 'DD'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.datePickerInput, { flex: 2 }]}
              onPress={() => setShowMonthModal(true)}
              disabled={isLoading}
            >
              <Text
                style={[styles.dateText, profile.dob && styles.selectedText]}
              >
                {getCurrentDateParts().month || 'Month'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.datePickerInput, { flex: 1 }]}
              onPress={() => setShowYearModal(true)}
              disabled={isLoading}
            >
              <Text
                style={[styles.dateText, profile.dob && styles.selectedText]}
              >
                {getCurrentDateParts().year || 'YYYY'}
              </Text>
            </TouchableOpacity>
          </View>

          {showDayModal && (
            <ScrollView
              style={styles.dateDropdown}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
            >
              {generateDays().map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dateOption,
                    getCurrentDateParts().day === day &&
                      styles.selectedDateOption,
                  ]}
                  onPress={() => {
                    handleDateChange('day', day);
                    setShowDayModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dateOptionText,
                      getCurrentDateParts().day === day &&
                        styles.selectedDateOptionText,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {showMonthModal && (
            <ScrollView
              style={styles.dateDropdown}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
            >
              {MONTHS.map((month) => (
                <TouchableOpacity
                  key={month}
                  style={[
                    styles.dateOption,
                    getCurrentDateParts().month === month &&
                      styles.selectedDateOption,
                  ]}
                  onPress={() => {
                    handleDateChange('month', month);
                    setShowMonthModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dateOptionText,
                      getCurrentDateParts().month === month &&
                        styles.selectedDateOptionText,
                    ]}
                  >
                    {month}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {showYearModal && (
            <ScrollView
              style={styles.dateDropdown}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
            >
              {generateYears().map((year) => (
                <TouchableOpacity
                  key={year}
                  style={[
                    styles.dateOption,
                    getCurrentDateParts().year === year &&
                      styles.selectedDateOption,
                  ]}
                  onPress={() => {
                    handleDateChange('year', year);
                    setShowYearModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dateOptionText,
                      getCurrentDateParts().year === year &&
                        styles.selectedDateOptionText,
                    ]}
                  >
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Expertise</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowExpertiseModal(!showExpertiseModal)}
            disabled={isLoading}
          >
            <View style={styles.languageSelector}>
              <Text
                style={[
                  styles.languageText,
                  profile.expertise.length > 0 && styles.selectedText,
                ]}
              >
                {profile.expertise.length > 0
                  ? profile.expertise.join(', ')
                  : 'Select Expertise'}
              </Text>
              <ChevronDown size={20} color="#666" />
            </View>
          </TouchableOpacity>
          {showExpertiseModal && (
            <ScrollView
              style={styles.languageDropdown}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
            >
              {EXPERTISE_OPTIONS.map((expert) => (
                <TouchableOpacity
                  key={expert}
                  style={[
                    styles.languageOption,
                    profile.expertise.includes(expert) &&
                      styles.selectedLanguageOption,
                  ]}
                  onPress={() => toggleExpertise(expert)}
                >
                  <Text
                    style={[
                      styles.languageOptionText,
                      profile.expertise.includes(expert) &&
                        styles.selectedLanguageOptionText,
                    ]}
                  >
                    {expert}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={profile.location}
            onChangeText={(text) => setProfile({ ...profile, location: text })}
            placeholder="Enter your location"
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Experience (years)</Text>
          <TextInput
            style={styles.input}
            value={profile.experience}
            onChangeText={(text) => {
              // Only allow numbers
              const numericValue = text.replace(/[^0-9]/g, '');
              setProfile({ ...profile, experience: numericValue });
            }}
            placeholder="Enter years of experience"
            keyboardType="numeric"
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gender</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowGenderModal(!showGenderModal)}
            disabled={isLoading}
          >
            <View style={styles.languageSelector}>
              <Text
                style={[
                  styles.languageText,
                  profile.gender && styles.selectedText,
                ]}
              >
                {profile.gender
                  ? GENDER_OPTIONS.find((g) => g.value === profile.gender)
                      ?.label
                  : 'Select gender'}
              </Text>
              <ChevronDown size={20} color="#666" />
            </View>
          </TouchableOpacity>
          {showGenderModal && (
            <ScrollView
              style={styles.languageDropdown}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
            >
              {GENDER_OPTIONS.map((gender) => (
                <TouchableOpacity
                  key={gender.value}
                  style={[
                    styles.languageOption,
                    profile.gender === gender.value &&
                      styles.selectedLanguageOption,
                  ]}
                  onPress={() => {
                    setProfile((prev) => ({ ...prev, gender: gender.value }));
                    setShowGenderModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.languageOptionText,
                      profile.gender === gender.value &&
                        styles.selectedLanguageOptionText,
                    ]}
                  >
                    {gender.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Languages</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowLanguagesModal(!showLanguagesModal)}
            disabled={isLoading}
          >
            <View style={styles.languageSelector}>
              <Text
                style={[
                  styles.languageText,
                  profile.languages.length > 0 && styles.selectedText,
                ]}
              >
                {profile.languages.length > 0
                  ? profile.languages.join(', ')
                  : 'Select languages'}
              </Text>
              <ChevronDown size={20} color="#666" />
            </View>
          </TouchableOpacity>
          {showLanguagesModal && (
            <ScrollView
              style={styles.languageDropdown}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
            >
              {LANGUAGES.map((language) => (
                <TouchableOpacity
                  key={language}
                  style={[
                    styles.languageOption,
                    profile.languages.includes(language) &&
                      styles.selectedLanguageOption,
                  ]}
                  onPress={() => toggleLanguage(language)}
                >
                  <Text
                    style={[
                      styles.languageOptionText,
                      profile.languages.includes(language) &&
                        styles.selectedLanguageOptionText,
                    ]}
                  >
                    {language}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
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
            editable={!isLoading}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#00BCD4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#fff',
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
  inputText: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#000',
  },
  placeholderText: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#999',
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  languageText: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#666',
  },
  selectedText: {
    color: '#000',
  },
  languageDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    maxHeight: 200,
    zIndex: 1000,
    marginTop: 4,
  },
  languageOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedLanguageOption: {
    backgroundColor: '#f0f9fa',
  },
  languageOptionText: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#666',
  },
  selectedLanguageOptionText: {
    color: '#00BCD4',
    fontFamily: 'InterSemiBold',
  },
  datePickerContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  datePickerInput: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  dateDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    maxHeight: 200,
    zIndex: 1000,
    marginTop: 4,
  },
  dateOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedDateOption: {
    backgroundColor: '#f0f9fa',
  },
  dateOptionText: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#666',
    textAlign: 'center',
  },
  selectedDateOptionText: {
    color: '#00BCD4',
    fontFamily: 'InterSemiBold',
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#666',
  },
});
