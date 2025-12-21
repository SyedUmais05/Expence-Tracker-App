import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
    USER: 'user_session',
    TRANSACTIONS: 'transactions_data',
    DEBTS: 'debts_data',
};

export const storage = {
    async save(key: string, value: any) {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('Failed to save data', e);
        }
    },

    async get<T>(key: string): Promise<T | null> {
        try {
            const jsonValue = await AsyncStorage.getItem(key);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.error('Failed to fetch data', e);
            return null;
        }
    },

    async clear() {
        try {
            await AsyncStorage.clear();
        } catch (e) {
            console.error('Failed to clear data', e);
        }
    },
};
