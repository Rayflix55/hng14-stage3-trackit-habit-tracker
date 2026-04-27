export function calculateCurrentStreak(completions: string[], today?: string): number {
  if (completions.length === 0) return 0;

  // If today isn't provided, use local ISO date
  const referenceDate = today || new Date().toISOString().split('T')[0];
  
  // Requirement: remove duplicates and sort descending
  const uniqueSorted = Array.from(new Set(completions)).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  // Requirement: if today is not completed, current streak is 0
  if (!uniqueSorted.includes(referenceDate)) return 0;

  let streak = 0;
  let currentDate = new Date(referenceDate);

  // Iterate backwards through sorted dates
  for (const dateStr of uniqueSorted) {
    const completionDate = new Date(dateStr);
    
    // Check if completionDate matches our expected consecutive date
    if (completionDate.getTime() === currentDate.getTime()) {
      streak++;
      // Set currentDate to the previous calendar day
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (completionDate.getTime() < currentDate.getTime()) {
      // We found a gap in the calendar
      break;
    }
  }

  return streak;
}