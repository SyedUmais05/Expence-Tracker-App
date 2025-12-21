import { TouchableOpacity, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../../constants/Colors';
import { ThemedText } from './ThemedText';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
  style?: ViewStyle;
}

export function Button({ title, onPress, variant = 'primary', isLoading, style }: ButtonProps) {
  const bgColors = {
    primary: Colors.primary,
    secondary: Colors.secondary,
    outline: 'transparent',
    danger: Colors.error
  };

  const textColors = {
    primary: '#FFF',
    secondary: '#FFF',
    outline: Colors.primary,
    danger: '#FFF'
  };

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        { backgroundColor: bgColors[variant] }, 
        variant === 'outline' && styles.outline,
        style
      ]} 
      onPress={onPress}
      disabled={isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={textColors[variant]} />
      ) : (
        <ThemedText style={{ color: textColors[variant], fontWeight: '600' }}>
          {title}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  outline: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
});
