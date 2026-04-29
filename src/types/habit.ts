export interface Habit {
  id: string;
  name: string;
  category: string;      
  frequency: string;     
  completedDates: string[]; 
  createdAt: string;
}
