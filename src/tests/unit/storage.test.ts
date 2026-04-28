import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storage } from '../../lib/storage';

describe("Storage Engine", () => {
  beforeEach(() => {
    // Completely reset the environment
    localStorage.clear();
    vi.clearAllMocks();
    
    // Explicitly spy on the methods
    vi.spyOn(Storage.prototype, 'setItem');
    vi.spyOn(Storage.prototype, 'getItem');
  });

  it("saves and retrieves a user", () => {
    const mockUser = { email: "rayflix@techbro.com", habits: [] };
    
    // 1. Save the session
    storage.saveSession(mockUser as any);
    
    // 2. Verify setItem was called on the prototype
    expect(Storage.prototype.setItem).toHaveBeenCalled();
    
    // 3. Verify retrieval matches
    const retrieved = storage.getSession();
    expect(retrieved?.email).toBe("rayflix@techbro.com");
  });

  it("handles empty storage gracefully", () => {
    // Ensure it's empty
    localStorage.clear();
    const retrieved = storage.getSession();
    expect(retrieved).toBeNull();
  });
});