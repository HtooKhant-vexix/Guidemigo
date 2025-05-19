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
      {isHost
        ? host_tabs.map(({ name, title, icon: Icon }) => (
            <Tabs.Screen
              key={name}
              name={name}
              options={{
                title,
                tabBarIcon: ({ size, color }) => (
                  <Icon size={size + 10} color={color} />
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
                  <Icon size={size + 10} color={color} />
                ),
              }}
            />
          ))}
    </Tabs>
  );
}
