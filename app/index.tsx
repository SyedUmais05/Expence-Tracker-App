import { Redirect } from 'expo-router';

export default function Index() {
  // Logic handled in RootLayoutNav, but as a fallback:
  return <Redirect href="/(auth)/login" />;
}
