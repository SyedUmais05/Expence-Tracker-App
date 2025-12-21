import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useData } from '../../../hooks';
import { Colors } from '../../../constants/Colors';
import { ThemedText } from '../../../components/ui/ThemedText';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { formatCurrency, formatDate } from '../../../utils/formatting';
import { FontAwesome } from '@expo/vector-icons';

export default function FinancesScreen() {
  const { transactions, deleteTransaction } = useData();
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  // Reset filter when screen comes into focus (e.g. returning from Add screen)
  useFocusEffect(
    useCallback(() => {
      setFilter('all');
    }, [])
  );

  const filteredData = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  const handleDelete = (id: string) => {
    Alert.alert('Delete Transaction', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTransaction(id) }
    ]);
  };

  const renderItem = ({ item }: { item: any }) => (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View style={styles.iconContainer}>
            <FontAwesome 
                name={item.type === 'income' ? 'arrow-down' : 'arrow-up'} 
                size={16} 
                color={item.type === 'income' ? Colors.income : Colors.expense} 
            />
        </View>
        <View style={styles.info}>
          <ThemedText style={styles.category}>{item.category}</ThemedText>
          <ThemedText variant="caption">{formatDate(item.date)} • {item.note || 'No note'}</ThemedText>
        </View>
        <View style={{ alignItems: 'flex-end', paddingBottom: 16 }}>
             <ThemedText style={{ 
                color: item.type === 'income' ? Colors.income : Colors.expense,
                fontWeight: 'bold',
                fontSize: 16
            }}>
                {item.type === 'income' ? '+' : '-'} {formatCurrency(item.amount)}
            </ThemedText>
        </View>
      </View>
      <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id)}>
          <FontAwesome name="trash" size={16} color="#999" />
      </TouchableOpacity>
    </Card>
  );

  return (
    <View style={styles.container}>
        <View style={styles.filterContainer}>
            {['all', 'income', 'expense'].map((f) => (
                <TouchableOpacity 
                    key={f} 
                    style={[styles.filterChip, filter === f && styles.activeChip]}
                    onPress={() => setFilter(f as any)}
                >
                    <ThemedText style={{ color: filter === f ? '#FFF' : Colors.text, textTransform: 'capitalize' }}>
                        {f}
                    </ThemedText>
                </TouchableOpacity>
            ))}
        </View>

        <FlatList
            data={filteredData}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16 }}
            ListEmptyComponent={
                <View style={{ alignItems: 'center', marginTop: 50 }}>
                    <ThemedText style={{ color: '#999' }}>No transactions found.</ThemedText>
                    <Button 
                        title="Add First Transaction" 
                        onPress={() => router.push('/(tabs)/finances/add')} 
                        variant="outline"
                        style={{ marginTop: 20 }}
                    />
                </View>
            }
        />

        <TouchableOpacity 
            style={styles.fab} 
            onPress={() => router.push('/(tabs)/finances/add')}
        >
            <FontAwesome name="plus" size={24} color="#FFF" />
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  filterContainer: {
      flexDirection: 'row',
      padding: 16,
      backgroundColor: Colors.surface,
  },
  filterChip: {
      paddingHorizontal: 20,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: '#F0F0F0',
      marginRight: 8,
  },
  activeChip: {
      backgroundColor: Colors.primary,
  },
  card: {
      marginBottom: 10,
      padding: 12,
  },
  row: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#F5F7FA',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
  },
  info: {
      flex: 1,
  },
  category: {
      fontWeight: '600',
      fontSize: 16,
  },
  deleteBtn: {
      position: 'absolute',
      bottom: 5,
      right: 5,
      padding: 5,
  },
  fab: {
      position: 'absolute',
      bottom: 24,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: Colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
  }
});
