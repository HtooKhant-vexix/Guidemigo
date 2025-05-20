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
} from 'react-native';
import { useState, useEffect } from 'react';
import {
  Camera,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Calendar,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { NewTour, fetchPlaces } from '@/service/api';
import { usePlaces } from '@/hooks/useData';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

interface Place {
  id: number;
  name: string;
  description: string;
  address: string;
}

export default function CreateTour() {
  const router = useRouter();
  const { places, loading: placesLoading } = usePlaces();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(
    null
  );
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [maxParticipants, setMaxParticipants] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [datePickerMode, setDatePickerMode] = useState<'date' | 'time'>('date');
  const [createdPlaces, setCreatedPlaces] = useState<Place[]>([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(true);

  useEffect(() => {
    loadCreatedPlaces();
  }, []);

  const loadCreatedPlaces = async () => {
    try {
      setIsLoadingPlaces(true);
      const response = await fetchPlaces();
      if (response && response.data) {
        setCreatedPlaces(response.data);
      }
    } catch (error) {
      console.error('Error loading places:', error);
      Alert.alert('Error', 'Failed to load places. Please try again.');
    } finally {
      setIsLoadingPlaces(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled && result.assets[0].uri) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCreateTour = async () => {
    try {
      setIsLoading(true);

      // Validate required fields
      if (
        !title ||
        !description ||
        !selectedLocationId ||
        !maxParticipants ||
        !price
      ) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      // Validate dates
      if (endDate <= startDate) {
        Alert.alert('Error', 'End date must be after start date');
        return;
      }

      // Format dates to ISO string
      const formattedStartTime = startDate.toISOString();
      const formattedEndTime = endDate.toISOString();

      // Create tour data object
      const tourData = {
        title,
        description,
        locationId: selectedLocationId,
        price: parseFloat(price),
        maxSeats: parseInt(maxParticipants),
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        status: 'AVAILABLE',
      };

      // If there's an image, create FormData
      if (image) {
        const formData = new FormData();

        // Append all tour data as strings
        Object.entries(tourData).forEach(([key, value]) => {
          formData.append(key, value.toString());
        });

        // Append image
        formData.append('image', {
          uri: image,
          type: 'image/jpeg',
          name: 'tour-image.jpg',
        } as any);

        await NewTour(formData);
      } else {
        // If no image, send regular JSON data
        await NewTour(tourData);
      }

      Alert.alert('Success', 'Tour created successfully!');
      router.back(); // Navigate back to previous screen
    } catch (error) {
      console.error('Error creating tour:', error);
      Alert.alert('Error', 'Failed to create tour. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleStartDateTimeChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      if (datePickerMode === 'date') {
        const newDate = new Date(startDate);
        newDate.setFullYear(selectedDate.getFullYear());
        newDate.setMonth(selectedDate.getMonth());
        newDate.setDate(selectedDate.getDate());
        setStartDate(newDate);
        setShowStartDatePicker(false);
        setShowStartTimePicker(true);
        setDatePickerMode('time');
      } else {
        const newDate = new Date(startDate);
        newDate.setHours(selectedDate.getHours());
        newDate.setMinutes(selectedDate.getMinutes());
        setStartDate(newDate);
        setShowStartTimePicker(false);
        setDatePickerMode('date');
      }
    } else {
      setShowStartDatePicker(false);
      setShowStartTimePicker(false);
    }
  };

  const handleEndDateTimeChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      if (datePickerMode === 'date') {
        const newDate = new Date(endDate);
        newDate.setFullYear(selectedDate.getFullYear());
        newDate.setMonth(selectedDate.getMonth());
        newDate.setDate(selectedDate.getDate());
        setEndDate(newDate);
        setShowEndDatePicker(false);
        setShowEndTimePicker(true);
        setDatePickerMode('time');
      } else {
        const newDate = new Date(endDate);
        newDate.setHours(selectedDate.getHours());
        newDate.setMinutes(selectedDate.getMinutes());
        setEndDate(newDate);
        setShowEndTimePicker(false);
        setDatePickerMode('date');
      }
    } else {
      setShowEndDatePicker(false);
      setShowEndTimePicker(false);
    }
  };

  const renderLocationPicker = () => {
    if (isLoadingPlaces) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#00BCD4" />
          <Text style={styles.loadingText}>Loading locations...</Text>
        </View>
      );
    }

    if (createdPlaces.length === 0) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            No locations available. Please create a location first.
          </Text>
          <TouchableOpacity
            style={styles.createLocationButton}
            onPress={() => router.push('/create-location')}
          >
            <Text style={styles.createLocationButtonText}>Create Location</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedLocationId}
          onValueChange={(itemValue: number | null) =>
            setSelectedLocationId(itemValue)
          }
          style={styles.picker}
        >
          <Picker.Item label="Select a location" value={null} />
          {createdPlaces.map((place) => (
            <Picker.Item
              key={place.id}
              label={`${place.name} - ${place.address}`}
              value={place.id}
            />
          ))}
        </Picker>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create a New Tour</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.uploadedImage} />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Camera size={32} color="#666" />
              <Text style={styles.uploadText}>Upload Tour Image</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Tour Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter tour title"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your tour"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Location</Text>
            {renderLocationPicker()}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Start Date & Time</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => {
                setDatePickerMode('date');
                setShowStartDatePicker(true);
              }}
            >
              <Calendar size={20} color="#666" />
              <Text style={styles.dateText}>{formatDateTime(startDate)}</Text>
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={handleStartDateTimeChange}
                minimumDate={new Date()}
              />
            )}
            {showStartTimePicker && (
              <DateTimePicker
                value={startDate}
                mode="time"
                display="default"
                onChange={handleStartDateTimeChange}
              />
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>End Date & Time</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => {
                setDatePickerMode('date');
                setShowEndDatePicker(true);
              }}
            >
              <Calendar size={20} color="#666" />
              <Text style={styles.dateText}>{formatDateTime(endDate)}</Text>
            </TouchableOpacity>
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={handleEndDateTimeChange}
                minimumDate={startDate}
              />
            )}
            {showEndTimePicker && (
              <DateTimePicker
                value={endDate}
                mode="time"
                display="default"
                onChange={handleEndDateTimeChange}
              />
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Maximum Participants</Text>
            <View style={styles.iconInput}>
              <Users size={20} color="#666" />
              <TextInput
                style={styles.iconInputText}
                placeholder="e.g., 10"
                value={maxParticipants}
                onChangeText={setMaxParticipants}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Price per Person</Text>
            <View style={styles.iconInput}>
              <DollarSign size={20} color="#666" />
              <TextInput
                style={styles.iconInputText}
                placeholder="Enter price"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.createButton,
              isLoading && styles.createButtonDisabled,
            ]}
            onPress={handleCreateTour}
            disabled={isLoading}
          >
            <Text style={styles.createButtonText}>
              {isLoading ? 'Creating...' : 'Create Tour'}
            </Text>
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
  header: {
    padding: 16,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'InterBold',
    color: '#000',
  },
  content: {
    padding: 16,
  },
  imageUpload: {
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  uploadedImage: {
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
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  iconInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
  },
  iconInputText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
  },
  dateText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#000',
  },
  createButton: {
    backgroundColor: '#00BCD4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#fff',
  },
  createButtonDisabled: {
    opacity: 0.7,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#666',
  },
  errorContainer: {
    padding: 16,
    alignItems: 'center',
    gap: 12,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter',
    color: '#ff4444',
    textAlign: 'center',
  },
  createLocationButton: {
    backgroundColor: '#00BCD4',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  createLocationButtonText: {
    fontSize: 14,
    fontFamily: 'InterSemiBold',
    color: '#fff',
  },
});
