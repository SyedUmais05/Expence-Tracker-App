import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Modal, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../hooks';
import { Colors } from '../constants/Colors';
import { ThemedText } from '../components/ui/ThemedText';
import { Button } from '../components/ui/Button';
import { FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState<'none' | 'about'>('none');

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout }
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
           <FontAwesome name="times" size={20} color="#FFF" />
        </TouchableOpacity>
        <ThemedText variant="title" style={{ color: '#FFF' }}>Profile</ThemedText>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        {/* User Info */}
        <View style={styles.userSection}>
           <View style={styles.avatar}>
              <ThemedText style={styles.avatarText}>
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </ThemedText>
           </View>
           <ThemedText variant="title" style={{ marginTop: 12 }}>{user?.username}</ThemedText>
           <ThemedText style={{ color: Colors.textSecondary }}>Expense Tracker User</ThemedText>
        </View>

        {/* Menu Items */}
        <View style={styles.menu}>
            <TouchableOpacity style={styles.menuItem} onPress={() => Alert.alert('Coming Soon', 'Edit Profile feature is coming soon!')}>
                <View style={styles.menuIcon}>
                    <FontAwesome name="user" size={20} color={Colors.primary} />
                </View>
                <ThemedText style={styles.menuText}>Edit Profile</ThemedText>
                <FontAwesome name="chevron-right" size={16} color="#CCC" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => setActiveSection(activeSection === 'about' ? 'none' : 'about')}>
                <View style={[styles.menuIcon, { backgroundColor: '#E3F2FD' }]}>
                    <FontAwesome name="info" size={20} color="#1976D2" />
                </View>
                <ThemedText style={styles.menuText}>About App</ThemedText>
                <FontAwesome name={activeSection === 'about' ? "chevron-down" : "chevron-right"} size={16} color="#CCC" />
            </TouchableOpacity>

            {/* About Expansion */}
            {activeSection === 'about' && (
                <View style={styles.aboutSection}>
                    <ThemedText style={{ lineHeight: 22, color: Colors.textSecondary }}>
                        This Personal Finance & Expense Tracker app helps you manage your daily income, expenses, and debts efficiently. 
                    </ThemedText>
                    <ThemedText style={{ marginTop: 12, fontWeight: 'bold' }}>Developed by SyedUmais</ThemedText>
                </View>
            )}

             <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleLogout}>
                <View style={[styles.menuIcon, { backgroundColor: '#FFEBEE' }]}>
                    <FontAwesome name="sign-out" size={20} color="#D32F2F" />
                </View>
                <ThemedText style={[styles.menuText, { color: '#D32F2F' }]}>Logout</ThemedText>
            </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
          <ThemedText style={styles.footerText}>Made by SyedUmais</ThemedText>
          <ThemedText style={[styles.footerText, { fontSize: 10 }]}>v1.0.0</ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeBtn: {
      padding: 8,
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 20,
  },
  content: {
      padding: 20,
  },
  userSection: {
      alignItems: 'center',
      marginBottom: 30,
  },
  avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: '#E0E0E0',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 4,
      borderColor: '#FFF',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
  },
  avatarText: {
      fontSize: 40,
      lineHeight: 50, // Fix clipping
      paddingVertical: 4, // Ensure no cutoff
      fontWeight: 'bold',
      color: Colors.primary,
  },
  menu: {
      backgroundColor: '#FFF',
      borderRadius: 16,
      paddingHorizontal: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
  },
  menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#F0F0F0',
  },
  menuIcon: {
      width: 40,
      height: 40,
      borderRadius: 10,
      backgroundColor: '#E8F5E9',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
  },
  menuText: {
      flex: 1,
      fontSize: 16,
      fontWeight: '500',
  },
  aboutSection: {
      backgroundColor: '#F9F9F9',
      padding: 16,
      marginHorizontal: -16,
      marginBottom: 0,
      borderBottomWidth: 1,
      borderBottomColor: '#F0F0F0',
  },
  footer: {
      padding: 24,
      alignItems: 'center',
  },
  footerText: {
      color: '#CCC',
      fontWeight: '600',
  }
});
