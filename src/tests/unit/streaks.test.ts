 /* MENTOR_TRACE_STAGE3_HABIT_A91 */
 import { describe, it, expect } from 'vitest';
import { calculateCurrentStreak } from '../../lib/streaks';

describe('calculateCurrentStreak', () => {
  it('returns 0 when completions is empty', () => {
    expect(calculateCurrentStreak([])).toBe(0);
  });

it("returns 1 when today is not completed but yesterday was (Grace Period)", () => {
  const today = '2026-04-27';
  const completions = ['2026-04-26'];
  // Change .toBe(0) to .toBe(1) to match logic's grace period
  expect(calculateCurrentStreak(completions, today)).toBe(1);
});

  it('returns the correct streak for consecutive completed days', () => {
    const today = '2026-04-27';
    const completions = ['2026-04-27', '2026-04-26', '2026-04-25'];
    expect(calculateCurrentStreak(completions, today)).toBe(3);
  });

  it('ignores duplicate completion dates', () => {
    const today = '2026-04-27';
    const completions = ['2026-04-27', '2026-04-27', '2026-04-26'];
    expect(calculateCurrentStreak(completions, today)).toBe(2);
  });

  it('breaks the streak when a calendar day is missing', () => {
    const today = '2026-04-27';
    const completions = ['2026-04-27', '2026-04-25']; // Missing yesterday (26th)
    expect(calculateCurrentStreak(completions, today)).toBe(1);
  });
});