import { useAuth } from '@/hooks/useAuth';
import { Tabs } from 'expo-router';
import {
  Chrome as Home,
  User as User2,
  Building2,
  Plane,
  Menu,
  House,
  Heart,
  MapPin,
  PlusCircle,
} from 'lucide-react-native';
import { useMemo } from 'react';

export default function TabLayout() {
  const { user } = useAuth();
  console.log(user, 'user');
  const isHost = user?.role?.name === 'guide';
  console.log(isHost, 'isHost');
  const screenOptions = useMemo(
    () => ({
      headerShown: false,
      tabBarActiveTintColor: '#00BCD4',
      tabBarStyle: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
      },
    }),
    []
  );

  const tabs = useMemo(
    () => [
      {
        name: 'index',
        title: 'Home',
        icon: House,
      },
      {
        name: 'guidemigo',
        title: 'Guides',
        icon: User2,
      },
      {
        name: 'feed',
        title: 'Feed',
        icon: Heart,
      },
      {
        name: 'places',
        title: 'Places',
        icon: MapPin,
      },
      {
        name: 'more',
        title: 'More',
        icon: Menu,
      },
    ],
    []
  );

  const host_tabs = useMemo(
    () => [
      {
        name: 'index',
        title: 'Home',
        icon: House,
      },
      {
        name: 'guidemigo',
        title: 'Guides',
        icon: User2,
      },
      {
        name: 'feed',
        title: 'Feed',
        icon: Heart,
      },
      {
        name: 'places',
        title: 'Places',
        icon: MapPin,
      },
      {
        name: 'more',
        title: 'More',
        icon: Menu,
      },
    ],
    []
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#00BCD4',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#eee',
          paddingVertical: 12,
          height: 75,
          marginTop: 1,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          marginTop: 6,
          fontWeight: '500',
          fontFamily: 'Inter',
        },
        tabBarIconStyle: {
          marginTop: 8,
        },
      }}
    >
      {isHost
        ? host_tabs.map(({ name, title, icon: Icon }) => (
            <Tabs.Screen
              key={name}
              name={name}
              options={{
                title,
                tabBarIcon: ({ size, color }) => (
                  <Icon size={size + 8} color={color} />
                ),
              }}
            />
          ))
        : tabs.map(({ name, title, icon: Icon }) => (
            <Tabs.Screen
              key={name}
              name={name}
              options={{
                title,
                tabBarIcon: ({ size, color }) => (
                  <Icon size={size + 8} color={color} />
                ),
              }}
            />
          ))}
    </Tabs>
  );
}
