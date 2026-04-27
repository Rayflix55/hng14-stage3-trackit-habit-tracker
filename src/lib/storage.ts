import { User, Session } from '../types/auth';
import { Habit } from '../types/habit';
import { STORAGE_KEYS } from './constants';

// Generic helper to get data from localStorage
const getLocalData = <T>(key: string): T | null => {
  // Check if we are in a browser OR if localStorage is mocked (for tests)
  if (typeof window === 'undefined' && typeof localStorage === 'undefined') return null;
  
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
};

// Generic helper to set data in localStorage
const setLocalData = <T>(key: string, data: T): void => {
  if (typeof window !== 'undefined' || typeof localStorage !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

export const storage = {
  // Users
  getUsers: (): User[] => getLocalData<User[]>(STORAGE_KEYS.USERS) || [],
  saveUser: (user: User) => {
    const users = storage.getUsers();
    setLocalData(STORAGE_KEYS.USERS, [...users, user]);
  },

  // Session
  getSession: (): Session | null => getLocalData<Session>(STORAGE_KEYS.SESSION),
  setSession: (session: Session | null) => setLocalData(STORAGE_KEYS.SESSION, session),

  // Habits
  getHabits: (): Habit[] => getLocalData<Habit[]>(STORAGE_KEYS.HABITS) || [],
  saveHabits: (habits: Habit[]) => setLocalData(STORAGE_KEYS.HABITS, habits),
};