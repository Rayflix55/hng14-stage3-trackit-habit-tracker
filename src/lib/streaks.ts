export function calculateCurrentStreak(completions: string[], today?: string): number {
  if (!completions || completions.length === 0) return 0;

  // 1. Setup reference dates as simple strings (avoiding Timezone shifts)
  const referenceDate = today || new Date().toISOString().split('T')[0];
  
  const yesterdayDate = new Date(referenceDate);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = yesterdayDate.toISOString().split('T')[0];
  
  // 2. Clean, Sort Descending (Newest First), and filter out any future dates
  const uniqueSorted = Array.from(new Set(completions))
    .filter(d => d <= referenceDate)
    .sort((a, b) => b.localeCompare(a));

  if (uniqueSorted.length === 0) return 0;

  const lastCompletion = uniqueSorted[0];

  // 3. Grace Period Check:
  // If the last completion isn't Today OR Yesterday, the streak is broken.
  if (lastCompletion !== referenceDate && lastCompletion !== yesterdayStr) {
    return 0;
  }

  let streak = 0;
  let currentRef = new Date(lastCompletion);

  for (let i = 0; i < uniqueSorted.length; i++) {
    const dateStr = uniqueSorted[i];
    const expectedStr = currentRef.toISOString().split('T')[0];

    if (dateStr === expectedStr) {
      streak++;
      // Move currentRef back exactly one day
      currentRef.setDate(currentRef.getDate() - 1);
    } else {
      // Gap found
      break;
    }
  }

  return streak;
}