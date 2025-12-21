import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth, useData } from '../../hooks';
import { Colors } from '../../constants/Colors';
import { ThemedText } from '../../components/ui/ThemedText';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../utils/formatting';
import { FontAwesome } from '@expo/vector-icons';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const { transactions, debts } = useData();
  const router = useRouter();

  const summary = useMemo(() => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    const owedToMe = debts
      .filter(d => d.type === 'lent' && d.status === 'active')
      .reduce((sum, d) => sum + d.remainingAmount, 0);

    const iOwe = debts
      .filter(d => d.type === 'borrowed' && d.status === 'active')
      .reduce((sum, d) => sum + d.remainingAmount, 0);

    return { totalIncome, totalExpense, balance, owedToMe, iOwe };
  }, [transactions, debts]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <ThemedText variant="caption" style={{ color: '#E0E0E0' }}>Welcome back,</ThemedText>
          <ThemedText variant="title" style={{ color: '#FFF' }}>{user?.username}</ThemedText>
        </View>
        <TouchableOpacity onPress={() => logout()} style={styles.logoutBtn}>
          <FontAwesome name="sign-out" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Main Balance Card */}
        <Card style={styles.balanceCard}>
          <ThemedText variant="caption" style={{ color: '#E0E0E0' }}>Total Balance</ThemedText>
          <ThemedText variant="title" style={{ fontSize: 36, color: '#FFF', marginVertical: 8 }}>
            {formatCurrency(summary.balance)}
          </ThemedText>
          <View style={styles.row}>
            <View>
              <ThemedText style={{ color: '#A5D6A7', fontSize: 12 }}>Income</ThemedText>
              <ThemedText style={{ color: '#FFF', fontWeight: 'bold' }}>
                 + {formatCurrency(summary.totalIncome)}
              </ThemedText>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <ThemedText style={{ color: '#EF9A9A', fontSize: 12 }}>Expense</ThemedText>
              <ThemedText style={{ color: '#FFF', fontWeight: 'bold' }}>
                 - {formatCurrency(summary.totalExpense)}
              </ThemedText>
            </View>
          </View>
        </Card>

        {/* Quick Actions */}
        <View style={styles.actionRow}>
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: Colors.primary }]} 
            onPress={() => router.push('/(tabs)/finances/add')}
            activeOpacity={0.8}
          >
            <View style={styles.iconCircle}>
                <FontAwesome name="plus" size={20} color={Colors.primary} />
            </View>
            <View>
                <ThemedText style={styles.actionText}>Add Transaction</ThemedText>
                <ThemedText style={styles.actionSubtext}>Income or Expense</ThemedText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: Colors.text }]} 
            onPress={() => router.push('/(tabs)/debts/add')}
            activeOpacity={0.8}
          >
            <View style={styles.iconCircle}>
                <FontAwesome name="handshake-o" size={18} color={Colors.text} />
            </View>
            <View>
                <ThemedText style={styles.actionText}>Record Debt</ThemedText>
                <ThemedText style={styles.actionSubtext}>Lend or Borrow</ThemedText>
            </View>
          </TouchableOpacity>
        </View>

        {/* Debt Summary */}
        <ThemedText variant="subtitle" style={styles.sectionTitle}>Debt Overview</ThemedText>
        <View style={styles.row}>
          <Card style={[styles.miniCard, { borderLeftWidth: 4, borderLeftColor: Colors.lent }]}>
            <ThemedText variant="caption">You are owed</ThemedText>
            <ThemedText variant="subtitle" style={{ color: Colors.lent }}>
              {formatCurrency(summary.owedToMe)}
            </ThemedText>
          </Card>
          <Card style={[styles.miniCard, { borderLeftWidth: 4, borderLeftColor: Colors.borrowed }]}>
            <ThemedText variant="caption">You owe</ThemedText>
            <ThemedText variant="subtitle" style={{ color: Colors.borrowed }}>
              {formatCurrency(summary.iOwe)}
            </ThemedText>
          </Card>
        </View>

        <ThemedText variant="subtitle" style={styles.sectionTitle}>Recent Activity</ThemedText>
        {transactions.length === 0 ? (
          <ThemedText style={{ fontStyle: 'italic', color: '#999', marginTop: 8 }}>
            No recent transactions
          </ThemedText>
        ) : (
          transactions.slice(0, 5).map(t => (
            <View key={t.id} style={styles.transactionRow}>
               <View style={{ flex: 1, marginRight: 8 }}>
                 <ThemedText style={{ fontWeight: '500' }}>{t.category}</ThemedText>
                 <ThemedText variant="caption">{t.note || t.type}</ThemedText>
               </View>
               <ThemedText style={{ 
                 color: t.type === 'income' ? Colors.income : Colors.expense,
                 fontWeight: 'bold' 
               }}>
                 {t.type === 'income' ? '+' : '-'} {formatCurrency(t.amount)}
               </ThemedText>
            </View>
          ))
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 80, // Extended background for card overlap
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutBtn: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  content: {
    flex: 1,
    marginTop: -50, // Overlap header
    paddingHorizontal: 20,
  },
  balanceCard: {
    backgroundColor: '#1B5E20', // Darker green
    borderRadius: 20,
    padding: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 24,
  },
  actionButton: {
    flex: 0.48,
    borderRadius: 16,
    padding: 16,
    height: 110,
    justifyContent: 'space-between',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(255,255,255,0.9)',
      justifyContent: 'center',
      alignItems: 'center',
  },
  actionText: {
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: 15,
  },
  actionSubtext: {
      color: 'rgba(255,255,255,0.7)',
      fontSize: 11,
  },
  sectionTitle: {
    marginVertical: 12,
  },
  miniCard: {
    flex: 0.48,
    padding: 12,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
});
