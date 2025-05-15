import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Link, router } from 'expo-router';
import { ArrowLeft, Calendar, Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { z } from 'zod';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [profileType, setProfileType] = useState<'personal' | 'business'>(
    'personal'
  );

  const [interests, setInterests] = useState({
    findingHosts: true,
    offeringHosting: false,
  });

  const { register, isLoading, error, clearError, user } = useAuth();

  const handleRegister = async () => {
    const result = profileSchema.safeParse(formValues);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
    } else {
      const tokens = await register({
        email: formValues.email,
        password: formValues.password,
        name: 'test',
        type: 'traveller',
      });

      if (tokens !== undefined && tokens !== null) {
        console.log(tokens, 'tokens*******************************');
        router.replace({
          pathname: '/account-setup',
          params: tokens,
        });
      } else {
        console.error('Registration failed: No tokens returned');
      }
    }
  };

  const profileSchema = z
    .object({
      email: z.string().email(),
      password: z.string().min(4),
      confirmPassword: z.string().min(4),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ['confirmPassword'],
      message: 'Passwords do not match',
    });

  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof formValues, string[]>>
  >({});

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <ArrowLeft color="#000" size={24} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Guidemigo</Text>

        <View style={styles.form}>
          {/* <View style={styles.inputContainer}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              autoCapitalize="words"
            />
          </View> */}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email </Text>
            <TextInput
              style={errors.email ? styles.input_err : styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formValues.email}
              onChangeText={(text) =>
                setFormValues({ ...formValues, email: text })
              }
            />
            {errors?.email && (
              <Text style={{ color: 'red' }}>{errors?.email[0]}</Text>
            )}
          </View>

          {/* <View style={styles.inputContainer}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.phoneInput}>
              <View style={styles.countryCode}>
                <Text style={styles.countryFlag}>🇸🇬</Text>
                <Text style={styles.countryText}>+65</Text>
              </View>
              <TextInput
                style={styles.phoneNumber}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
              />
            </View>
          </View> */}

          {/* <View style={styles.inputContainer}>
            <Text style={styles.label}>DOB</Text>
            <TouchableOpacity style={styles.input}>
              <View style={styles.dateInput}>
                <Text style={styles.dateText}>Select date</Text>
                <Calendar size={20} color="#666" />
              </View>
            </TouchableOpacity>
          </View> */}

          {/* <View style={styles.inputContainer}>
            <Text style={styles.label}>Gender</Text>
            <TouchableOpacity style={styles.input}>
              <Text style={styles.selectText}>Select gender</Text>
            </TouchableOpacity>
          </View> */}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Create Password</Text>
            <View
              style={
                errors?.password
                  ? styles.passwordInput_err
                  : styles.passwordInput
              }
            >
              <TextInput
                style={styles.passwordField}
                placeholder="Create a password"
                secureTextEntry={!showPassword}
                value={formValues.password}
                onChangeText={(text) =>
                  setFormValues({ ...formValues, password: text })
                }
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#666" />
                ) : (
                  <Eye size={20} color="#666" />
                )}
              </TouchableOpacity>
            </View>
            {errors?.password && (
              <Text style={{ color: 'red' }}>{errors?.password[0]}</Text>
            )}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View
              style={
                errors?.confirmPassword
                  ? styles.passwordInput_err
                  : styles.passwordInput
              }
            >
              <TextInput
                style={styles.passwordField}
                placeholder="Create a password"
                secureTextEntry={!showPassword}
                value={formValues.confirmPassword}
                onChangeText={(text) =>
                  setFormValues({ ...formValues, confirmPassword: text })
                }
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#666" />
                ) : (
                  <Eye size={20} color="#666" />
                )}
              </TouchableOpacity>
            </View>
            {errors?.confirmPassword && (
              <Text style={{ color: 'red' }}>{errors?.confirmPassword[0]}</Text>
            )}
          </View>

          {/* <View style={styles.profileTypeContainer}>
            <Text style={styles.sectionTitle}>Profile Type</Text>
            <View style={styles.profileOptions}>
              <TouchableOpacity
                style={[
                  styles.profileOption,
                  profileType === 'personal' && styles.profileOptionSelected,
                ]}
                onPress={() => setProfileType('personal')}
              >
                <Text
                  style={[
                    styles.profileOptionText,
                    profileType === 'personal' &&
                      styles.profileOptionTextSelected,
                  ]}
                >
                  Host
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.profileOption,
                  profileType === 'business' && styles.profileOptionSelected,
                ]}
                onPress={() => setProfileType('business')}
              >
                <Text
                  style={[
                    styles.profileOptionText,
                    profileType === 'business' &&
                      styles.profileOptionTextSelected,
                  ]}
                >
                  Traveller
                </Text>
              </TouchableOpacity>
            </View>
          </View> */}

          {/* <View style={styles.interestsContainer}>
            <Text style={styles.sectionTitle}>Interested In</Text>
            <View style={styles.interestOptions}>
              <TouchableOpacity
                style={[
                  styles.interestOption,
                  interests.findingHosts && styles.interestOptionSelected,
                ]}
                onPress={() =>
                  setInterests((prev) => ({
                    ...prev,
                    findingHosts: !prev.findingHosts,
                  }))
                }
              >
                <Text
                  style={[
                    styles.interestOptionText,
                    interests.findingHosts && styles.interestOptionTextSelected,
                  ]}
                >
                  Finding Hosts/Locations
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.interestOption,
                  interests.offeringHosting && styles.interestOptionSelected,
                ]}
                onPress={() =>
                  setInterests((prev) => ({
                    ...prev,
                    offeringHosting: !prev.offeringHosting,
                  }))
                }
              >
                <Text
                  style={[
                    styles.interestOptionText,
                    interests.offeringHosting &&
                      styles.interestOptionTextSelected,
                  ]}
                >
                  Offering Hostings
                </Text>
              </TouchableOpacity>
            </View>
          </View> */}

          <TouchableOpacity
            onPress={handleRegister}
            style={styles.submitButton}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already a Member </Text>
            <Link href="/login" style={styles.footerLink}>
              Please Login!
            </Link>
          </View>
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
    fontSize: 28,
    fontFamily: 'InterBold',
    color: '#00BCD4',
    marginBottom: 32,
  },
  form: {
    gap: 20,
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
  phoneInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
  },
  countryCode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
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
  phoneNumber: {
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
  passwordInput_err: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'red',
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
});
