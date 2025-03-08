import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Search,
  Bell,
  MapPin,
  Backpack,
  CircleUserRound,
  Bookmark,
  Languages,
} from 'lucide-react-native';

export default function Welcome() {
  const img = require('../assets/images/welcome.jpg');
  return (
    <View style={styles.container}>
      <Image source={img} style={styles.backgroundImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.gradient}
      />
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Welcome to</Text>
          <Text style={styles.title}>Guidemigo</Text>
        </View>

        <Text style={styles.subtitle}>
          Join our community of travelers and explore the world's most beautiful
          destinations
        </Text>
        <View style={styles.buttonContainer}>
          {/* <TouchableOpacity> */}
          <Link href="/login" asChild style={styles.roleButton}>
            <TouchableOpacity style={[styles.button, styles.loginButton]}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </Link>
          {/* </TouchableOpacity> */}
          {/* <Link href="/login" asChild>
            <TouchableOpacity style={[styles.button, styles.loginButton]}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/register" asChild>
            <TouchableOpacity style={[styles.button, styles.registerButton]}>
              <Text style={[styles.buttonText, styles.registerButtonText]}>
                Register
              </Text>
            </TouchableOpacity>
          </Link> */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    display: 'flex',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#00BCD4',
    borderRadius: 8,
    gap: 10,
  },
  roleText: {
    fontSize: 22,
    fontFamily: 'InterSemiBold',
    color: '#fff',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 22,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
    paddingBottom: 48,
  },
  title: {
    fontSize: 46,
    fontFamily: 'InterBold',
    color: '#fff',
    marginBottom: -16,
  },
  subtitle: {
    fontSize: 20,
    fontFamily: 'Inter',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    opacity: 0.9,
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#00BCD4',
  },
  registerButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#fff',
  },
  buttonText: {
    fontSize: 20,
    fontFamily: 'InterSemiBold',
    color: '#fff',
  },
  registerButtonText: {
    color: '#fff',
  },
});
