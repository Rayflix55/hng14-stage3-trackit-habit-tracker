
export function validateHabitName(name: string): {
  valid: boolean;
  value: string;
  error: string | null;
} {
  const trimmedValue = name.trim();

  if (!trimmedValue) {
    return {
      valid: false,
      value: trimmedValue,
      error: 'Habit name is required',
    };
  }

  if (trimmedValue.length > 60) {
    return {
      valid: false,
      value: trimmedValue,
      error: 'Habit name must be 60 characters or fewer',
    };
  }

  return {
    valid: true,
    value: trimmedValue,
    error: null,
  };
}

// --- New Auth Logic (Required for Login Page) ---

/**
 * Validates basic email format
 */
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validates password length based on TRD (min 6 chars)
 */
export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};