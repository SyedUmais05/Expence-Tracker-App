import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../../constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function FinancesLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }} edges={['top']}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Transactions' }} />
        <Stack.Screen name="add" options={{ title: 'New Transaction', presentation: 'modal' }} />
      </Stack>
    </SafeAreaView>
  );
}
