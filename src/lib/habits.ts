import { Habit } from "./storage";

/**
 * MENTOR_TRACE: Requirement 4.3 - Habit Management
 * Validates habit name and handles toggling logic.
 */

export const validateHabitName = (name: string): boolean => {
  return name.trim().length >= 3 && name.trim().length <= 50;
};

export const toggleHabitDate = (habit: Habit, date: string): Habit => {
  const isCompleted = habit.completedDates.includes(date);
  const newDates = isCompleted
    ? habit.completedDates.filter((d) => d !== date)
    : [...habit.completedDates, date];
  
  return { ...habit, completedDates: newDates };
};