import { Habit } from '../types/habit';
import { STORAGE_KEYS } from './constants';

// Re-exporting so other files can import it from here easily
export type { Habit };

// Define the interfaces directly since we aren't using a separate types/auth file
export interface User {
  id: string;
  email: string;
  password: string;
  createdAt: string;
  habits: Habit[];
}

// Session is just a User object or null
export type Session = User;

const getLocalData = <T>(key: string): T | null => {
  if (typeof window === 'undefined' && typeof localStorage === 'undefined') return null;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
};

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
  
  // Alias for the UI
  saveSession: (session: Session | null) => storage.setSession(session),
clearSession: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  },
  // Habits
  getHabits: (): Habit[] => getLocalData<Habit[]>(STORAGE_KEYS.HABITS) || [],
  saveHabits: (habits: Habit[]) => setLocalData(STORAGE_KEYS.HABITS, habits),
};