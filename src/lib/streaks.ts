export function calculateCurrentStreak(completions: string[], today?: string): number {
  if (!completions || completions.length === 0) return 0;

  // 1. Setup reference dates (Today and Yesterday)
  const referenceDate = today || new Date().toISOString().split('T')[0];
  const yesterday = new Date(referenceDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  // 2. Clean and Sort Descending (Newest First)
  const uniqueSorted = Array.from(new Set(completions)).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const lastCompletion = uniqueSorted[0];

  // 3. Grace Period Check:
  // If the last completion isn't Today OR Yesterday, the streak is officially broken.
  if (lastCompletion !== referenceDate && lastCompletion !== yesterdayStr) {
    return 0;
  }

  let streak = 0;
  // Start counting from the most recent completion found
  let expectedDate = new Date(lastCompletion);

  for (const dateStr of uniqueSorted) {
    const completionDate = new Date(dateStr);
    
    // Check if completionDate matches our expected consecutive date
    if (completionDate.toDateString() === expectedDate.toDateString()) {
      streak++;
      // Move expectation back by one day
      expectedDate.setDate(expectedDate.getDate() - 1);
    } else {
      // We hit a gap in the timeline
      break;
    }
  }

  return streak;
}