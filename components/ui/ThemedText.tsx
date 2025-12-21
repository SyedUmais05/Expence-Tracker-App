import { Text, TextProps, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';

interface ThemedTextProps extends TextProps {
  variant?: 'default' | 'title' | 'subtitle' | 'caption' | 'link';
  color?: string;
}

export function ThemedText({ style, variant = 'default', color, ...rest }: ThemedTextProps) {
  return (
    <Text 
      style={[
        styles[variant], 
        color && { color }, 
        style
      ]} 
      {...rest} 
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
    color: Colors.text,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  caption: {
    fontSize: 12,
    lineHeight: 20,
    color: Colors.textSecondary,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: Colors.primary,
  },
});
