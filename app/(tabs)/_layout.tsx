import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { useAuth } from '../../hooks';
import { Redirect } from 'expo-router';
import { TabBarIcon } from '../../components/ui/TabBarIcon';

export default function TabLayout() {
  const { user } = useAuth();
  
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          borderTopColor: Colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="finances"
        options={{
          title: 'Finances',
          tabBarIcon: ({ color }) => <TabBarIcon name="dollar" color={color} />, // Changed to 'dollar'
        }}
      />
      <Tabs.Screen
        name="debts"
        options={{
          title: 'Debts',
          tabBarIcon: ({ color }) => <TabBarIcon name="handshake-o" color={color} />,
        }}
      />
    </Tabs>
  );
}
