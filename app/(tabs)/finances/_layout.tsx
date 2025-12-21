import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../../constants/Colors';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function FinancesLayout() {
  const router = useRouter();
  
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Transactions',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.push('/(tabs)')} style={{ marginLeft: 0, padding: 10 }}>
                <FontAwesome name="arrow-left" size={20} color="#fff" />
              </TouchableOpacity>
            )
          }} 
        />
        <Stack.Screen name="add" options={{ title: 'New Transaction', presentation: 'modal' }} />
      </Stack>
    </>
  );
}
