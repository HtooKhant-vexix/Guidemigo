import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Calendar,
  Camera,
  ChevronDown,
  Upload,
} from 'lucide-react-native';
import { useState } from 'react';
import { z } from 'zod';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Swal from 'sweetalert2';
import { useAuth } from '@/hooks/useAuth';
import { useLocalSearchParams } from 'expo-router';
// import * as ImagePicker from 'expo-image-picker';

export default function AccountSetup() {
  const [profileType, setProfileType] = useState<'host' | 'traveller'>(
    'traveller'
  );
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showLanguages, setShowLanguages] = useState(false);
  const [showExpertise, setShowExpertise] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);

  const profileSchema = z.object({
    name: z.string().min(1, 'Full name is required'),
    phonenumber: z
      .string()
      .regex(/^[0-9]{8}$/, 'Phone number must be 8 digits'),
    dob: z.string().min(1, 'Date of birth is required'),
    gender: z.string().min(1, 'Gender is required'),
    bio: z.string().min(1, 'Bio is required'),
    location: z.string().min(1, 'Location is required'),
    languages: z.array(z.string()).min(1, 'At least one language is required'),
    expertise: z.array(z.string()).min(1, 'At least one expertise is required'),
  });

  const [formValues, setFormValues] = useState<{
    name: string;
    phonenumber: string;
    dob: string;
    gender: string;
    type: 'host' | 'traveller';
    bio: string;
    location: string;
    languages: string[];
    experience?: string;
    travellers?: number;
    expertise?: string[];
  }>({
    name: '',
    phonenumber: '',
    dob: '',
    type: 'traveller',
    gender: '',
    bio: '',
    location: '',
    languages: selectedLanguages,
    experience: '',
    travellers: 0,
    expertise: [],
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof formValues, string[]>>
  >({});

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

  const EXPERTISE = [
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

  const COUNTRY_CODES = [
    { code: '+65', country: 'Singapore', flag: '🇸🇬' },
    { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
    { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
    { code: '+66', country: 'Thailand', flag: '🇹🇭' },
    { code: '+84', country: 'Vietnam', flag: '🇻🇳' },
    { code: '+63', country: 'Philippines', flag: '🇵🇭' },
    { code: '+81', country: 'Japan', flag: '🇯🇵' },
    { code: '+82', country: 'South Korea', flag: '🇰🇷' },
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+86', country: 'China', flag: '🇨🇳' },
  ];

  const GENDER_OPTIONS = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Non-binary', value: 'non-binary' },
    { label: 'Prefer not to say', value: 'not-specified' },
  ];

  const [showCountryCodes, setShowCountryCodes] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRY_CODES[0]);
  const token = useLocalSearchParams();
  // console.log(token, '***********************');

  const { setup, isLoading, error, clearError, user } = useAuth();

  const handleDateConfirm = (date: Date) => {
    setSelectedDate(date);
    setFormValues({ ...formValues, dob: date?.toISOString() });
    setDatePickerVisible(false);
  };

  const [photo, setPhoto] = useState<string | null>(null);

  const toggleLanguage = (language: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((l) => l !== language)
        : [...prev, language]
    );
    setFormValues({
      ...formValues,
      languages: selectedLanguages.includes(language)
        ? selectedLanguages.filter((l) => l !== language)
        : [...selectedLanguages, language],
    });
  };
  const toggleExpertise = (expert: string) => {
    setSelectedExpertise((prev) =>
      prev.includes(expert)
        ? prev.filter((l) => l !== expert)
        : [...prev, expert]
    );
    setFormValues({
      ...formValues,
      expertise: selectedExpertise.includes(expert)
        ? selectedExpertise.filter((l) => l !== expert)
        : [...selectedExpertise, expert],
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  // const formatDate = (date: Date) => {
  //   return date.toLocaleDateString('en-US', {
  //     year: 'numeric',
  //     month: 'long',
  //     day: 'numeric',
  //   });
  // };

  const handleSubmit = async () => {
    // console.log('clicked', token);
    const result = profileSchema.safeParse(formValues);

    if (!result.success) {
      // Extract error messages
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
    } else {
      const response = await setup(
        {
          ...formValues,
          id: token?.user,
        },
        token
      );
      response.success && router.replace('/(app)/(tabs)');
      // console.log('Response:', response);
      // Validation passed — continue to next screen
      // router.replace('/(app)/(tabs)');
    }
  };

  // console.log('Form Values:', formValues);

  // const handlePhotoUpload = async () => {
  //   // Request permissions first
  //   // const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

  //   if (status !== 'granted') {
  //     alert('Sorry, we need camera roll permissions to make this work!');
  //     return;
  //   }

  //   // Pick the image
  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [1, 1],
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     setPhoto(result.assets[0].uri);
  //   }
  // };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft color="#000" size={24} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>Tell us more about yourself</Text>

        {/* <View style={styles.avatarContainer}>
          <TouchableOpacity style={styles.avatar} onPress={handlePhotoUpload}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.avatarImage} />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Camera size={32} color="#666" />
                <Text style={styles.uploadText}>Tap to upload</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handlePhotoUpload}
          >
            <Upload size={16} color="#00BCD4" />
            <Text style={styles.uploadButtonText}>
              {photo ? 'Change Photo' : 'Upload Photo'}
            </Text>
          </TouchableOpacity>
        </View> */}

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name </Text>

            <TextInput
              style={errors?.name ? styles.input_err : styles.input}
              placeholder="Enter your full name"
              autoCapitalize="words"
              value={formValues.name}
              onChangeText={(text) =>
                setFormValues({ ...formValues, name: text })
              }
            />
            {errors?.name && (
              <Text style={{ color: 'red' }}>{errors?.name[0]}</Text>
            )}
          </View>

          {/* <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={errors?.username ? styles.input_err : styles.input}
              placeholder="Choose a username"
              autoCapitalize="none"
              value={formValues.username}
              onChangeText={(text) =>
                setFormValues({ ...formValues, username: text })
              }
            />
            {errors?.username && (
              <Text style={{ color: 'red' }}>{errors?.username[0]}</Text>
            )}
          </View> */}

          {/* <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.phoneInput}>
              <View style={styles.countryCode}>
                <Text style={styles.countryFlag}>🇸🇬</Text>
                <Text style={styles.countryText}>+65</Text>
              </View>
              <TextInput
                style={styles.phonenumber}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />
            </View>
          </View> */}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <View
              style={
                errors.phonenumber ? styles.phoneInput_err : styles.phoneInput
              }
            >
              <TouchableOpacity
                style={styles.countryCode}
                onPress={() => setShowCountryCodes(!showCountryCodes)}
              >
                <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
                <Text style={styles.countryText}>{selectedCountry.code}</Text>
                <ChevronDown size={16} color="#666" />
              </TouchableOpacity>
              <TextInput
                style={styles.phonenumber}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                value={formValues.phonenumber}
                onChangeText={(text) =>
                  setFormValues({ ...formValues, phonenumber: text })
                }
              />
            </View>
            {errors?.phonenumber && (
              <Text style={{ color: 'red' }}>{errors?.phonenumber[0]}</Text>
            )}
            {showCountryCodes && (
              <ScrollView
                nestedScrollEnabled={true}
                style={styles.countryCodeDropdown}
              >
                {COUNTRY_CODES.map((country) => (
                  <TouchableOpacity
                    key={country.code}
                    style={styles.countryOption}
                    onPress={() => {
                      setSelectedCountry(country);
                      setShowCountryCodes(false);
                    }}
                  >
                    <Text style={styles.countryFlag}>{country.flag}</Text>
                    <Text style={styles.countryOptionText}>
                      {country.country}
                    </Text>
                    <Text style={styles.countryOptionCode}>{country.code}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {/* <View style={styles.inputContainer}>
            <Text style={styles.label}>DOB</Text>
            <TouchableOpacity
              style={errors?.dob ? styles.input_err : styles.input}
            >
              <View style={styles.dateInput}>
                <Text style={styles.dateText}>Select date</Text>
                <Calendar size={20} color="#666" />
              </View>
            </TouchableOpacity>
            {errors?.dob && (
              <Text style={{ color: 'red' }}>{errors?.dob[0]}</Text>
            )}
          </View> */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity
              style={errors.dob ? styles.input_err : styles.input}
              onPress={() => setDatePickerVisible(true)}
            >
              <View style={styles.dateInput}>
                <Text
                  style={[styles.dateText, selectedDate && styles.selectedText]}
                >
                  {selectedDate ? formatDate(selectedDate) : 'Select date'}
                </Text>
                <Calendar size={20} color="#666" />
              </View>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleDateConfirm}
              onCancel={() => setDatePickerVisible(false)}
              maximumDate={new Date()}
            />
            {errors?.dob && (
              <Text style={{ color: 'red' }}>{errors?.dob[0]}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Gender</Text>
            <TouchableOpacity
              style={errors?.gender ? styles.input_err : styles.input}
              onPress={() => setShowGenderModal(!showGenderModal)}
            >
              <Text style={styles.selectText}>
                {selectedGender ? selectedGender : 'Select gender'}
              </Text>
            </TouchableOpacity>
            {errors?.gender && (
              <Text style={{ color: 'red' }}>{errors?.gender[0]}</Text>
            )}
            {showGenderModal && (
              <ScrollView
                nestedScrollEnabled={true}
                style={styles.countryCodeDropdown}
              >
                {GENDER_OPTIONS.map((country) => (
                  <TouchableOpacity
                    key={country.value}
                    style={styles.countryOption}
                    onPress={() => {
                      setShowGenderModal(false),
                        setFormValues({ ...formValues, gender: country.value });
                      setSelectedGender(country.label);
                    }}
                  >
                    {/* <Text style={styles.countryFlag}>{country.flag}</Text> */}
                    <Text style={styles.countryOptionText}>
                      {country.label}
                    </Text>
                    {/* <Text style={styles.countryOptionCode}>{country.code}</Text> */}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
          <View style={styles.profileTypeContainer}>
            <Text style={styles.sectionTitle}>Profile Type</Text>
            <View style={styles.profileOptions}>
              <TouchableOpacity
                style={[
                  styles.profileOption,
                  profileType === 'host' && styles.profileOptionSelected,
                ]}
                onPress={() => setProfileType('host')}
              >
                <Text
                  style={[
                    styles.profileOptionText,
                    profileType === 'host' && styles.profileOptionTextSelected,
                  ]}
                >
                  Host
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.profileOption,
                  profileType === 'traveller' && styles.profileOptionSelected,
                ]}
                onPress={() => setProfileType('traveller')}
              >
                <Text
                  style={[
                    styles.profileOptionText,
                    profileType === 'traveller' &&
                      styles.profileOptionTextSelected,
                  ]}
                >
                  Traveller
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              placeholder="Tell us about yourself"
              multiline
              numberOfLines={4}
              onChangeText={(text) =>
                setFormValues({ ...formValues, bio: text })
              }
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={errors?.location ? styles.input_err : styles.input}
              placeholder="Where are you based?"
              onChangeText={(text) =>
                setFormValues({ ...formValues, location: text })
              }
            />
            {errors?.location && (
              <Text style={{ color: 'red' }}>{errors?.location[0]}</Text>
            )}
          </View>

          {/* <View style={styles.inputContainer}>
            <Text style={styles.label}>Languages</Text>
            <TextInput
              style={styles.input}
              placeholder="What languages do you speak?"
            />
          </View> */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Languages</Text>
            <TouchableOpacity
              style={errors?.languages ? styles.input_err : styles.input}
              onPress={() => setShowLanguages(!showLanguages)}
            >
              <View style={styles.languageSelector}>
                <Text
                  style={[
                    styles.languageText,
                    selectedLanguages.length > 0 && styles.selectedText,
                  ]}
                >
                  {selectedLanguages.length > 0
                    ? selectedLanguages.join(', ')
                    : 'Select languages'}
                </Text>
                <ChevronDown size={20} color="#666" />
              </View>
            </TouchableOpacity>
            {errors?.languages && (
              <Text style={{ color: 'red' }}>{errors?.languages[0]}</Text>
            )}
            {showLanguages && (
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
                      selectedLanguages.includes(language) &&
                        styles.selectedLanguageOption,
                    ]}
                    onPress={() => toggleLanguage(language)}
                  >
                    <Text
                      style={[
                        styles.languageOptionText,
                        selectedLanguages.includes(language) &&
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
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Expertise</Text>
            <TouchableOpacity
              style={errors?.expertise ? styles.input_err : styles.input}
              onPress={() => setShowExpertise(!showExpertise)}
            >
              <View style={styles.languageSelector}>
                <Text
                  style={[
                    styles.languageText,
                    selectedExpertise.length > 0 && styles.selectedText,
                  ]}
                >
                  {selectedExpertise.length > 0
                    ? selectedExpertise.join(', ')
                    : 'Select Expertise'}
                </Text>
                <ChevronDown size={20} color="#666" />
              </View>
            </TouchableOpacity>
            {errors?.expertise && (
              <Text style={{ color: 'red' }}>{errors?.expertise[0]}</Text>
            )}
            {showExpertise && (
              <ScrollView
                style={styles.languageDropdown}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                {EXPERTISE.map((expert) => (
                  <TouchableOpacity
                    key={expert}
                    style={[
                      styles.languageOption,
                      selectedExpertise.includes(expert) &&
                        styles.selectedLanguageOption,
                    ]}
                    onPress={() => toggleExpertise(expert)}
                  >
                    <Text
                      style={[
                        styles.languageOptionText,
                        selectedExpertise.includes(expert) &&
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

          <TouchableOpacity
            style={styles.completeButton}
            // handleSubmit
            onPress={() => handleSubmit()}
          >
            <Text style={styles.completeButtonText}>Complete Setup</Text>
          </TouchableOpacity>
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
  backButton: {
    padding: 16,
    paddingTop: 48,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontFamily: 'InterBold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#666',
    marginBottom: 32,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  countryFlag: {
    fontSize: 20,
  },
  countryText: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#000',
  },
  countryCodeDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    maxHeight: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 4,
    zIndex: 1000,
  },
  countryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    gap: 12,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f5f5f5',
    overflow: 'hidden',
    marginBottom: 16,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  uploadPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  uploadButtonText: {
    fontSize: 14,
    fontFamily: 'InterSemiBold',
    color: '#00BCD4',
  },
  countryOptionText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#000',
  },
  countryOptionCode: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#666',
  },
  form: {
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: 'InterSemiBold',
    color: '#000',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter',
  },
  input_err: {
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter',
  },
  bioInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  completeButton: {
    backgroundColor: '#00BCD4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  completeButtonText: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#fff',
  },

  phoneInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
  },
  phoneInput_err: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 12,
  },
  phonenumber: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#666',
  },
  selectText: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#666',
  },
  passwordInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
  },
  passwordField: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    fontFamily: 'Inter',
  },
  eyeButton: {
    padding: 16,
  },
  profileTypeContainer: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#000',
  },
  profileOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  profileOption: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  profileOptionSelected: {
    borderColor: '#00BCD4',
    backgroundColor: '#00BCD4',
  },
  profileOptionText: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#666',
  },
  profileOptionTextSelected: {
    color: '#fff',
  },
  interestsContainer: {
    gap: 12,
  },
  interestOptions: {
    gap: 12,
  },
  interestOption: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  interestOptionSelected: {
    borderColor: '#00BCD4',
    backgroundColor: '#00BCD4',
  },
  interestOptionText: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#666',
  },
  interestOptionTextSelected: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#00BCD4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
  },
  footerLink: {
    fontSize: 14,
    fontFamily: 'InterSemiBold',
    color: '#00BCD4',
  },
  selectedText: {
    color: '#000',
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
  languageDropdown: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    maxHeight: 200,
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
});
