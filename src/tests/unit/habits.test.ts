import { validateHabitName, toggleHabitDate } from "../../lib/habits";
import { Habit } from "../../lib/storage";

/**
 * MENTOR_TRACE: Requirement 4.3 - Habit Management Tests
 * Verifies name validation and date toggling logic.
 */

describe("Habit Logic", () => {
  describe("validateHabitName", () => {
    it("should return true for valid names (3-50 chars)", () => {
      expect(validateHabitName("Morning Run")).toBe(true);
      expect(validateHabitName("Gym")).toBe(true);
    });

    it("should return false for names shorter than 3 characters", () => {
      expect(validateHabitName("Hi")).toBe(false);
      expect(validateHabitName("  ")).toBe(false); // Testing whitespace
    });

    it("should return false for names longer than 50 characters", () => {
      const longName = "a".repeat(51);
      expect(validateHabitName(longName)).toBe(false);
    });
  });

  describe("toggleHabitDate", () => {
    const mockHabit: Habit = {
      id: "test-123",
      name: "Meditation",
      category: "Mindset",
      frequency: "Morning",
      completedDates: ["2026-04-27"],
      createdAt: new Date().toISOString(),
    };

    it("should add a date if it is not in the list", () => {
      const today = "2026-04-28";
      const result = toggleHabitDate(mockHabit, today);
      
      expect(result.completedDates).toContain(today);
      expect(result.completedDates.length).toBe(2);
    });

    it("should remove a date if it already exists (toggle off)", () => {
      const existingDate = "2026-04-27";
      const result = toggleHabitDate(mockHabit, existingDate);
      
      expect(result.completedDates).not.toContain(existingDate);
      expect(result.completedDates.length).toBe(0);
    });

    it("should not mutate the original habit object", () => {
      const today = "2026-04-28";
      toggleHabitDate(mockHabit, today);
      
      // The original habit should still only have 1 date
      expect(mockHabit.completedDates.length).toBe(1);
    });
  });
});