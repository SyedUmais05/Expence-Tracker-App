import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useData } from '../../../hooks';
import { Colors } from '../../../constants/Colors';
import { ThemedText } from '../../../components/ui/ThemedText';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

export default function AddTransactionScreen() {
  const router = useRouter();
  const { addTransaction } = useData();
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!amount || !category) {
        Alert.alert('Error', 'Please fill in Amount and Category');
        return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
        Alert.alert('Error', 'Invalid amount');
        return;
    }

    setLoading(true);
    await addTransaction({
        type,
        amount: numAmount,
        category,
        note,
        date: new Date().toISOString(),
    });
    setLoading(false);
    // Go back to the previous screen (which is the list)
    // To ensure "All" is seen, the user might need to reset filter manually or we force it.
    // For now, standard back navigation is consistent with mobile patterns.
    router.back();
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.switchContainer}>
          <TouchableOpacity 
            style={[styles.switchOption, type === 'income' && styles.activeIncome]} 
            onPress={() => setType('income')}
          >
              <ThemedText style={{ color: type === 'income' ? '#FFF' : Colors.text }}>Income</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.switchOption, type === 'expense' && styles.activeExpense]} 
            onPress={() => setType('expense')}
          >
              <ThemedText style={{ color: type === 'expense' ? '#FFF' : Colors.text }}>Expense</ThemedText>
          </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Input
            label="Amount"
            placeholder="0.00"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            style={{ fontSize: 24, fontWeight: 'bold' }} // Bigger font for amount
        />
        
        <Input
            label="Category"
            placeholder="e.g. Food, Salary, Rent"
            value={category}
            onChangeText={setCategory}
        />

        <Input
            label="Note (Optional)"
            placeholder="Additional details..."
            value={note}
            onChangeText={setNote}
            maxLength={50}
        />

        <Button 
            title="Save Transaction" 
            onPress={handleSave} 
            isLoading={loading}
            style={{ marginTop: 24, backgroundColor: type === 'expense' ? Colors.expense : Colors.income }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  switchContainer: {
      flexDirection: 'row',
      margin: 16,
      backgroundColor: Colors.surface,
      borderRadius: 12,
      overflow: 'hidden',
  },
  switchOption: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
  },
  activeExpense: {
      backgroundColor: Colors.expense,
  },
  activeIncome: {
      backgroundColor: Colors.income,
  },
  form: {
      padding: 16,
  }
});
