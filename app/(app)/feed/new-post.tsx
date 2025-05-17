import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Camera, MapPin, X } from 'lucide-react-native';
import { useState } from 'react';

import * as ImagePicker from 'expo-image-picker';
import { usePosts } from '@/hooks/useData';
import axios from 'axios';

export default function NewPost() {
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState<string[]>([]);
  console.log(images, content, location, 'images');

  const { createPost } = usePosts();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled && result.assets[0].uri) {
      setImages([...images, result.assets[0].uri]);
      console.log(result.assets[0], 'result');
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handlePost = async () => {
    try {
      // Create FormData object
      const formData = new FormData();
      formData.append('content', content);
      formData.append('location', location);

      // Append images to FormData
      images.forEach((imageUri, index) => {
        const fileName = imageUri.split('/').pop();
        const fileType = fileName?.split('.').pop();
        formData.append(`images`, {
          uri: imageUri,
          name: fileName || `image_${index}.${fileType || 'jpg'}`,
          type: `image/${fileType || 'jpeg'}`, // Default to 'jpeg' if fileType is undefined
        });
      });

      console.log('FormData:', formData);

      // Make API call to create a new post
      const response = await createPost(formData);

      console.log('Post created:', response);

      // Navigate back after successful post creation
      router.back();
    } catch (error) {
      console.error(
        'Error creating post:',
        error.response?.data || error.message
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Post</Text>
        <TouchableOpacity
          style={[styles.postButton, !content && styles.postButtonDisabled]}
          onPress={handlePost}
          disabled={!content}
        >
          <Text
            style={[
              styles.postButtonText,
              !content && styles.postButtonTextDisabled,
            ]}
          >
            Post
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="What's on your mind?"
            multiline
            value={content}
            onChangeText={setContent}
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.locationContainer}>
          <MapPin size={20} color="#00BCD4" />
          <TextInput
            style={styles.locationInput}
            placeholder="Add location"
            value={location}
            onChangeText={setLocation}
            placeholderTextColor="#666"
          />
        </View>

        {images.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.imagePreviewContainer}
            contentContainerStyle={styles.imagePreviewContent}
          >
            {images.map((image, index) => (
              <View key={index} style={styles.imagePreview}>
                <Image source={{ uri: image }} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <X size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}

        <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
          <Camera size={24} color="#00BCD4" />
          <Text style={styles.addImageText}>Add Photos</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'InterSemiBold',
    color: '#000',
  },
  postButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#00BCD4',
  },
  postButtonDisabled: {
    backgroundColor: '#ccc',
  },
  postButtonText: {
    color: '#fff',
    fontFamily: 'InterSemiBold',
    fontSize: 16,
  },
  postButtonTextDisabled: {
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#000',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginBottom: 16,
  },
  locationInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter',
    color: '#000',
  },
  imagePreviewContainer: {
    marginBottom: 16,
  },
  imagePreviewContent: {
    gap: 12,
  },
  imagePreview: {
    position: 'relative',
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  addImageText: {
    fontSize: 16,
    fontFamily: 'InterSemiBold',
    color: '#00BCD4',
  },
});
