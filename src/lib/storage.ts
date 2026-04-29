import { Habit } from '../types/auth'; // Or '../types/auth' if you moved it
import { User, Session } from '../types/auth'; 
import { STORAGE_KEYS } from './constants';

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
      users[index] = user; 
      setLocalData(STORAGE_KEYS.USERS, users);
    } else {
      setLocalData(STORAGE_KEYS.USERS, [...users, user]); 
    }
  },

  getSession: (): Session | null => getLocalData<Session>(STORAGE_KEYS.SESSION),
  
  saveSession: (session: Session | null) => {
    setLocalData(STORAGE_KEYS.SESSION, session);
  },

  clearSession: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    }
  },

  getHabits: (): Habit[] => {
    const allHabits = getLocalData<Habit[]>(STORAGE_KEYS.HABITS) || [];
    const session = storage.getSession();
    
    if (!session) return [];
    
    // Filters based on the session userId
    return allHabits.filter((habit: Habit) => habit.userId === session.userId);
  },

  saveHabit: (habit: Habit) => {
    const allHabits = getLocalData<Habit[]>(STORAGE_KEYS.HABITS) || [];
    const index = allHabits.findIndex(h => h.id === habit.id);
    
    let updatedHabits;
    if (index !== -1) {
      allHabits[index] = habit;
      updatedHabits = allHabits;
    } else {
      updatedHabits = [...allHabits, habit];
    }
    
    setLocalData(STORAGE_KEYS.HABITS, updatedHabits);
  },

  deleteHabit: (habitId: string) => {
    const allHabits = getLocalData<Habit[]>(STORAGE_KEYS.HABITS) || [];
    const filtered = allHabits.filter((h: Habit) => h.id !== habitId);
    setLocalData(STORAGE_KEYS.HABITS, filtered);
  }
};