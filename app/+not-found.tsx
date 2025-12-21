import { Link, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../components/ui/ThemedText';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <ThemedText variant="title">This screen doesn't exist.</ThemedText>

        <Link href="/(tabs)" style={styles.link}>
          <ThemedText variant="link">Go to home screen!</ThemedText>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
