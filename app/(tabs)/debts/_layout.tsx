import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DebtsLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }} edges={['top']}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen name="index" options={{ title: 'My Debts' }} />
        <Stack.Screen name="add" options={{ title: 'Add Record', presentation: 'modal' }} />
        <Stack.Screen name="[id]" options={{ title: 'Debt Details' }} />
      </Stack>
    </SafeAreaView>
  );
}
