import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { ThemedText } from '../../components/ui/ThemedText';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../hooks';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  
  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Please enter username and password');
      return;
    }
    setError('');
    setLoading(true);
    // Simulate network delay for "real" feel
    setTimeout(async () => {
      await login(username); // Password ignored for local demo
      setLoading(false);
      // Navigation is handled by RootLayout based on user state
    }, 800);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={styles.header}>
            <ThemedText variant="title" style={{ fontSize: 32, marginBottom: 8, color: Colors.primary }}>
              FinTrack
            </ThemedText>
            <ThemedText variant="subtitle" style={{ color: Colors.textSecondary }}>
              Manage your money properly
            </ThemedText>
          </View>

          <View style={styles.form}>
            <Input
              label="Username"
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              error={error}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            
            <Button 
              title="Login" 
              onPress={handleLogin} 
              isLoading={loading} 
              style={{ marginTop: 10 }}
            />

            <View style={styles.footer}>
              <ThemedText variant="caption">
                Don't have an account?{' '}
              </ThemedText>
              <Link href="/(auth)/signup" asChild>
                <ThemedText variant="link" style={{ fontSize: 14 }}>Sign Up</ThemedText>
              </Link>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  inner: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 48,
    alignItems: 'center',
  },
  form: {
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    alignItems: 'center',
  },
});
