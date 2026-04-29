// src/types/auth.ts

export type User = {
  id: string;
  email: string;
  password: string;
  createdAt: string;
};

export type Session = {
  userId: string;
  email: string;
};

export type Habit = {
  id: string;
  userId: string; // The missing property causing your error
  name: string;
  category: string;
  frequency: string;
  completedDates: string[]; 
  createdAt: string;
};