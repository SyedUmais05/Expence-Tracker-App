import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useData } from '../../../hooks';
import { Colors } from '../../../constants/Colors';
import { ThemedText } from '../../../components/ui/ThemedText';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

export default function AddDebtScreen() {
  const router = useRouter();
  const { addDebt } = useData();
  const [type, setType] = useState<'lent' | 'borrowed'>('lent');
  const [amount, setAmount] = useState('');
  const [person, setPerson] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!amount || !person) {
        Alert.alert('Error', 'Please fill in Amount and Person Name');
        return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
        Alert.alert('Error', 'Invalid amount');
        return;
    }

    setLoading(true);
    await addDebt({
        type,
        totalAmount: numAmount,
        personName: person,
        note,
        date: new Date().toISOString(),
    });
    setLoading(false);
    router.back();
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.switchContainer}>
          <TouchableOpacity 
            style={[styles.switchOption, type === 'lent' && styles.activeLent]} 
            onPress={() => setType('lent')}
          >
              <ThemedText style={{ color: type === 'lent' ? '#FFF' : Colors.text }}>I Lent</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.switchOption, type === 'borrowed' && styles.activeBorrowed]} 
            onPress={() => setType('borrowed')}
          >
              <ThemedText style={{ color: type === 'borrowed' ? '#FFF' : Colors.text }}>I Borrowed</ThemedText>
          </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <Input
            label="Person Name"
            placeholder="e.g. John Doe"
            value={person}
            onChangeText={setPerson}
        />

        <Input
            label="Amount"
            placeholder="0.00"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            style={{ fontSize: 24, fontWeight: 'bold' }} 
        />
        
        <Input
            label="Note (Optional)"
            placeholder="e.g. Lunch money"
            value={note}
            onChangeText={setNote}
            maxLength={50}
        />

        <Button 
            title="Save Record" 
            onPress={handleSave} 
            isLoading={loading}
            style={{ marginTop: 24, backgroundColor: type === 'lent' ? Colors.lent : Colors.borrowed }}
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
  activeLent: {
      backgroundColor: Colors.lent,
  },
  activeBorrowed: {
      backgroundColor: Colors.borrowed,
  },
  form: {
      padding: 16,
  }
});
