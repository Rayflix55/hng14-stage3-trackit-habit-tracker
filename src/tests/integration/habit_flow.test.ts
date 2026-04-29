import { describe, it, expect, beforeEach, vi } from "vitest";
import { storage } from "../../lib/storage";
import { toggleHabitDate } from "../../lib/habits";
import { Habit } from "../../lib/storage";

/**
 * MENTOR_TRACE: Requirement 5.1 - Integration Testing
 * Ensures habit logic correctly interacts with the storage engine.
 */
describe("Habit Integration Flow", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("should persist a toggled habit date into localStorage", () => {
    const initialHabit: Habit = {
      id: "int-1",
      name: "Water",
      category: "Health",
      frequency: "Daily",
      completedDates: [],
      createdAt: new Date().toISOString(),
    };

    const updatedHabit = toggleHabitDate(initialHabit, "2026-04-28");

    storage.saveSession({
      email: "rayflix@tech.bro",
      habits: [updatedHabit],
    } as any);

    const session = storage.getSession();
    expect(session?.habits[0].completedDates).toContain("2026-04-28");
  });
});
