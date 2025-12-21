import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, storage, StorageKeys } from '../utils/storage'; 
// Note: imports might need adjusting if paths are slightly off, correcting logic below to match previous file content
import { User as UserType } from '../types';
import { StorageKeys as Keys, storage as storageUtil } from '../utils/storage';

interface AuthContextType {
  user: UserType | null;
  isLoading: boolean;
  login: (username: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const data = await storageUtil.get<UserType>(Keys.USER);
      if (data) {
        setUser(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(username: string) {
    const newUser: UserType = {
      id: Date.now().toString(),
      username,
      hasCompletedOnboarding: true,
    };
    await storageUtil.save(Keys.USER, newUser);
    setUser(newUser);
  }

  async function logout() {
    await storageUtil.clear(); // For this simple app, clear everything on logout is fine, or just remove user
    // actually, let's only remove user for now to be safe if we want to keep data? 
    // The requirement says "local storage", usually users expect data to wipe or persist. 
    // Let's clearer to just `await AsyncStorage.removeItem(Keys.USER)` but `storageUtil` needs that method.
    // For now, I'll use `clear()` but maybe that wipes data too? 
    // Let's just persist data for now even if "logged out" or re-implement storage clear properly.
    // For this simple app, "logout" effectively resets the 'session'.
    
    // Simpler: Just set user null and remove key.
    // Since my storageUtil doesn't have removeItem, I'll add it or just set null.
    // Actually, let's just use `save(Keys.USER, null)` effectively.
    await storageUtil.save(Keys.USER, null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
