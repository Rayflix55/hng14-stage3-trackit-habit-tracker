import { describe, it, expect, beforeEach, vi } from "vitest";
import { storage } from "../../lib/storage";
import { Habit } from "../../types/auth"; 
import { toggleHabitDate } from "../../lib/habits"; // Ensure this is imported

/**
 * MENTOR_TRACE: Requirement 5.1 - Integration Testing
 * Ensures habit logic correctly interacts with the storage engine.
 */
describe("Habit Integration Flow", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    // Setup a mock session because storage.getHabits() 
    // requires a logged-in user to filter results.
    storage.saveSession({
      userId: "user-123",
      email: "rayflix@tech.bro",
    });
  });

  it("should persist a toggled habit date into localStorage", () => {
    const initialHabit: Habit = {
      id: "int-1",
      userId: "user-123", // Link it to the session user
      name: "Water",
      category: "Health",
      frequency: "Daily",
      completedDates: [],
      createdAt: new Date().toISOString(),
    };

    // 1. Toggle the date
    const updatedHabit = toggleHabitDate(initialHabit, "2026-04-28");

    // 2. Persist using the proper storage method
    storage.saveHabit(updatedHabit);

    // 3. Retrieve using the proper storage method
    const userHabits = storage.getHabits();
    
    // 4. Verify
    expect(userHabits[0].completedDates).toContain("2026-04-28");
    expect(userHabits[0].userId).toBe("user-123");
  });
});