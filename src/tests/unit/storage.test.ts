import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storage } from '../../lib/storage';
import { STORAGE_KEYS } from '../../lib/constants';

describe('Storage Engine', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn(),
    });
  });

  it('saves and retrieves a user', () => {
    const mockUser = { id: '1', email: 'test@hng.tech', name: 'Akpe' };
    
    // 1. Mock getUsers to return empty initially
    vi.mocked(localStorage.getItem).mockReturnValueOnce(null);
    
    // 2. Save the user
    storage.saveUser(mockUser as any);
    
    // 3. Verify setItem was called with the right data
    expect(localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.USERS, 
      JSON.stringify([mockUser])
    );

    // 4. Mock the "read-back" for getUsers()
    vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify([mockUser]));
    
    const users = storage.getUsers();
    expect(users).toHaveLength(1);
    expect(users[0].email).toBe('test@hng.tech');
  });

  it('handles empty storage gracefully', () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);
    expect(storage.getHabits()).toEqual([]);
  });
});