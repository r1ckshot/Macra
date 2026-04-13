import { Tabs } from 'expo-router';
import { BookOpen, TrendingUp, Refrigerator, User } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.bgSecondary,
          borderTopColor: Colors.bgBorder,
          borderTopWidth: 0.5,
        },
        tabBarActiveTintColor: Colors.accentPrimary,
        tabBarInactiveTintColor: Colors.textInactive,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="diary"
        options={{
          title: 'Diary',
          tabBarIcon: ({ color }) => (
            <BookOpen size={19} stroke={color} strokeWidth={1.2} />
          ),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progress',
          tabBarIcon: ({ color }) => (
            <TrendingUp size={19} stroke={color} strokeWidth={1.2} />
          ),
        }}
      />
      <Tabs.Screen
        name="fridge"
        options={{
          title: 'Fridge',
          tabBarIcon: ({ color }) => (
            <Refrigerator size={19} stroke={color} strokeWidth={1.2} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <User size={19} stroke={color} strokeWidth={1.2} />
          ),
        }}
      />
    </Tabs>
  );
}
