import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useData } from '../../../hooks';
import { Colors } from '../../../constants/Colors';
import { ThemedText } from '../../../components/ui/ThemedText';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { formatCurrency, formatDate } from '../../../utils/formatting';
import { FontAwesome } from '@expo/vector-icons';

export default function DebtsScreen() {
  const { debts } = useData();
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'lent' | 'borrowed'>('all');

  const filteredData = debts.filter(d => {
    if (filter === 'all') return d.status === 'active'; // default show active
    return d.type === filter && d.status === 'active';
  });
  
  // Maybe add a toggle for "Show Paid" later, for now focus on active

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => router.push(`/(tabs)/debts/${item.id}`)} activeOpacity={0.9}>
      <Card style={[styles.card, { 
          borderLeftWidth: 4, 
          borderLeftColor: item.type === 'lent' ? Colors.lent : Colors.borrowed 
      }]}>
        <View style={styles.row}>
          <View style={styles.info}>
            <ThemedText style={styles.person}>{item.personName}</ThemedText>
            <ThemedText variant="caption">
                {item.type === 'lent' ? 'Owes you' : 'You owe'} • {formatDate(item.date)}
            </ThemedText>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
               <ThemedText style={{ 
                  color: item.type === 'lent' ? Colors.lent : Colors.borrowed,
                  fontWeight: 'bold',
                  fontSize: 18
              }}>
                  {formatCurrency(item.remainingAmount)}
              </ThemedText>
              {item.remainingAmount < item.totalAmount && (
                  <ThemedText variant="caption" style={{ fontSize: 10 }}>
                      of {formatCurrency(item.totalAmount)}
                  </ThemedText>
              )}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
         <View style={styles.filterContainer}>
            {['all', 'lent', 'borrowed'].map((f) => (
                <TouchableOpacity 
                    key={f} 
                    style={[styles.filterChip, filter === f && styles.activeChip]}
                    onPress={() => setFilter(f as any)}
                >
                    <ThemedText style={{ color: filter === f ? '#FFF' : Colors.text, textTransform: 'capitalize' }}>
                        {f === 'lent' ? 'Owed to Me' : f === 'borrowed' ? 'I Owe' : 'Active Debts'}
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
                    <ThemedText style={{ color: '#999' }}>No active debts found.</ThemedText>
                    <Button 
                        title="Record a Debt" 
                        onPress={() => router.push('/(tabs)/debts/add')} 
                        variant="outline"
                        style={{ marginTop: 20 }}
                    />
                </View>
            }
        />

         <TouchableOpacity 
            style={styles.fab} 
            onPress={() => router.push('/(tabs)/debts/add')}
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
      paddingHorizontal: 16,
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
      padding: 16,
  },
  row: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
  },
  info: {
      flex: 1,
  },
  person: {
      fontWeight: '600',
      fontSize: 18,
      marginBottom: 4,
  },
  fab: {
      position: 'absolute',
      bottom: 24,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: Colors.warning, // distinct for debt
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
  }
});
