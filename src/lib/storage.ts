import { Habit } from '../types/habit';
import { STORAGE_KEYS } from './constants';

export type { Habit };

export interface User {
  id: string;
  email: string;
  password: string;
  createdAt: string;
  habits: Habit[];
}

export type Session = User;

const getLocalData = <T>(key: string): T | null => {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
};

const setLocalData = <T>(key: string, data: T): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

export const storage = {
  getUsers: (): User[] => getLocalData<User[]>(STORAGE_KEYS.USERS) || [],
  
  saveUser: (user: User) => {
    const users = storage.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index !== -1) {
      users[index] = user; // Update existing
      setLocalData(STORAGE_KEYS.USERS, users);
    } else {
      setLocalData(STORAGE_KEYS.USERS, [...users, user]); // Add new
    }
  },

  getSession: (): Session | null => getLocalData<Session>(STORAGE_KEYS.SESSION),
  
  saveSession: (session: Session | null) => {
    setLocalData(STORAGE_KEYS.SESSION, session);
    if (session) storage.saveUser(session); // Keep global user list in sync
  },

  clearSession: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  },

  // Simplified Habits (Reading from the active session user)
  getHabits: (): Habit[] => {
    const session = storage.getSession();
    return session ? session.habits : [];
  }
};