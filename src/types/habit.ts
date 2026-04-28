export interface Habit {
  id: string;
  name: string;
  category: string;      // Added
  frequency: string;     // Added (e.g., "Morning", "Anytime")
  completedDates: string[]; // Added (Array of YYYY-MM-DD strings)
  createdAt: string;
}