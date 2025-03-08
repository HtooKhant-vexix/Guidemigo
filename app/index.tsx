import { Redirect } from 'expo-router';
import { useAuth } from '../hooks/useAuth';

export default function Index() {
  const { isAuthenticated } = useAuth();

  // Redirect based on authentication status
  if (!isAuthenticated) {
    return <Redirect href="/welcome" />;
  }

  return <Redirect href="/(app)/(tabs)" />;
}
