import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../../constants/Colors';
import { TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function DebtsLayout() {
  const router = useRouter();

  return (
    <>
      <StatusBar style="light" backgroundColor={Colors.primary} translucent={false} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'My Debts',
            headerLeft: () => (
              <TouchableOpacity onPress={() => router.push('/(tabs)')} style={{ marginLeft: 0, padding: 10 }}>
                <FontAwesome name="arrow-left" size={20} color="#fff" />
              </TouchableOpacity>
            )
          }} 
        />
        <Stack.Screen name="add" options={{ title: 'Add Record', presentation: 'modal' }} />
        <Stack.Screen name="[id]" options={{ title: 'Debt Details' }} />
      </Stack>
    </>
  );
}
