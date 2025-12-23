import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Modal, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useData } from '../../../hooks';
import { Colors } from '../../../constants/Colors';
import { ThemedText } from '../../../components/ui/ThemedText';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { formatCurrency, formatDate } from '../../../utils/formatting';
import { FontAwesome } from '@expo/vector-icons';

export default function DebtDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { debts, addRepayment, deleteDebt } = useData();
    const debt = debts.find(d => d.id === id);

    const [modalVisible, setModalVisible] = useState(false);
    const [repayAmount, setRepayAmount] = useState('');

    if (!debt) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ThemedText>Debt not found</ThemedText>
            </View>
        );
    }

    const handleRepay = async () => {
        const numAmount = parseFloat(repayAmount);
        if (isNaN(numAmount) || numAmount <= 0) {
            Alert.alert('Invalid Amount');
            return;
        }
        if (numAmount > debt.remainingAmount) {
            Alert.alert('Amount exceeds remaining balance');
            return;
        }

        await addRepayment(debt.id, numAmount, 'Partial payment');
        setModalVisible(false);
        setRepayAmount('');
    };

    const handleDelete = () => {
        Alert.alert('Delete Record', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: async () => {
                await deleteDebt(debt.id);
                router.back();
            }}
        ]);
    };

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.headerCard}>
                <ThemedText variant="caption" style={{ textAlign: 'center' }}>
                    {debt.type === 'lent' ? 'OWED BY' : 'OWED TO'}
                </ThemedText>
                <ThemedText variant="title" style={{ textAlign: 'center', fontSize: 28, marginVertical: 8 }}>
                    {debt.personName}
                </ThemedText>
                <View style={styles.divider} />
                <View style={{ alignItems: 'center', marginVertical: 16 }}>
                    <ThemedText variant="caption">REMAINING</ThemedText>
                    <ThemedText style={{ 
                        fontSize: 42, 
                        fontWeight: 'bold', 
                        color: debt.type === 'lent' ? Colors.lent : Colors.borrowed,
                        paddingVertical: 8, // Fix clipping
                        lineHeight: 50,     // Fix clipping
                    }}>
                        {formatCurrency(debt.remainingAmount)}
                    </ThemedText>
                    <ThemedText variant="caption" style={{ marginTop: 4 }}>
                        of {formatCurrency(debt.totalAmount)}
                    </ThemedText>

                    {/* Debt Note */}
                     {debt.note && (
                        <View style={{ marginTop: 8, paddingHorizontal: 16, alignItems: 'center' }}>
                            <ThemedText style={{ 
                                textAlign: 'center', 
                                color: Colors.textSecondary,
                                fontSize: 16,
                                fontWeight: '500',
                                opacity: 0.8
                            }}>
                                {debt.note}
                            </ThemedText>
                        </View>
                    )}
                </View>

                {debt.status === 'active' && (
                    <Button 
                        title="Add Repayment" 
                        onPress={() => setModalVisible(true)} 
                        style={{ marginTop: 16 }}
                    />
                )}
                 <Button 
                        title="Delete Debt" 
                        onPress={handleDelete} 
                        variant="danger" // Using danger variant
                        style={{ marginTop: 8 }}
                    />
            </Card>

            <ThemedText variant="subtitle" style={{ margin: 16 }}>History</ThemedText>
            {debt.history.length === 0 ? (
                <ThemedText style={{ marginLeft: 16, color: '#999' }}>No repayments yet.</ThemedText>
            ) : (
                debt.history.map(h => (
                    <Card key={h.id} style={styles.historyItem}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View>
                                <ThemedText>Repayment</ThemedText>
                                <ThemedText variant="caption">{formatDate(h.date)}</ThemedText>
                            </View>
                            <ThemedText style={{ fontWeight: 'bold', color: Colors.success }}>
                                {formatCurrency(h.amount)}
                            </ThemedText>
                        </View>
                    </Card>
                ))
            )}

            {/* Repayment Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ThemedText variant="title" style={{ marginBottom: 16 }}>Add Repayment</ThemedText>
                        <TextInput
                            placeholder="Amount"
                            keyboardType="numeric"
                            value={repayAmount}
                            onChangeText={setRepayAmount}
                            style={styles.modalInput}
                            autoFocus
                        />
                        <View style={{ flexDirection: 'row', marginTop: 16 }}>
                            <Button 
                                title="Cancel" 
                                onPress={() => setModalVisible(false)} 
                                variant="outline"
                                style={{ flex: 1, marginRight: 8 }}
                            />
                            <Button 
                                title="Confirm" 
                                onPress={handleRepay} 
                                style={{ flex: 1, marginLeft: 8 }}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerCard: {
      margin: 16,
      padding: 24,
      alignItems: 'stretch'
  },
  divider: {
      height: 1,
      backgroundColor: '#EEE',
      width: '100%',
      marginVertical: 12,
  },
  historyItem: {
      marginHorizontal: 16,
      marginBottom: 8,
      padding: 12,
  },
  modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      padding: 24,
  },
  modalContent: {
      backgroundColor: '#FFF',
      borderRadius: 16,
      padding: 24,
  },
  modalInput: {
      borderBottomWidth: 1,
      borderBottomColor: Colors.border,
      fontSize: 24,
      padding: 8,
      textAlign: 'center',
  }
});
