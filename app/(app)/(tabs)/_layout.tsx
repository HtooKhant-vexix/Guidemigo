import { Tabs } from 'expo-router';
import {
  Chrome as Home,
  User as User2,
  Building2,
  Plane,
  Menu,
  House,
} from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#00BCD4',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#eee',
          paddingVertical: 20,
          height: 90,
          marginTop: 1,
        },
        tabBarLabelStyle: {
          fontSize: 14,
          marginTop: 7,
          fontWeight: 200,
        },
        tabBarIconStyle: {
          marginTop: 13,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <House size={size + 10} color={color} /> // Increase size of the icon
          ),
        }}
      />
      <Tabs.Screen
        name="guidemigo"
        options={{
          title: 'Guidemigo',
          tabBarIcon: ({ color, size }) => (
            <User2 size={size + 10} color={color} /> // Increase size of the icon
          ),
        }}
      />
      <Tabs.Screen
        name="hotelmigo"
        options={{
          title: 'Hotelmigo',
          tabBarIcon: ({ color, size }) => (
            <Building2 size={size + 10} color={color} /> // Increase size of the icon
          ),
        }}
      />
      <Tabs.Screen
        name="airmigo"
        options={{
          title: 'Airmigo',
          tabBarIcon: ({ color, size }) => (
            <Plane size={size + 10} color={color} /> // Increase size of the icon
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: ({ color, size }) => (
            <Menu size={size + 10} color={color} /> // Increase size of the icon
          ),
        }}
      />
    </Tabs>
  );
}
