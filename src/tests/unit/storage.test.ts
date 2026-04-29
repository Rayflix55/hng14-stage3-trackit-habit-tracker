import { describe, it, expect, beforeEach, vi } from "vitest";
import { storage } from "../../lib/storage";

describe("Storage Engine", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();

    vi.spyOn(Storage.prototype, "setItem");
    vi.spyOn(Storage.prototype, "getItem");
  });

  it("saves and retrieves a user", () => {
    const mockUser = { email: "rayflix@techbro.com", habits: [] };

    storage.saveSession(mockUser as any);

    expect(Storage.prototype.setItem).toHaveBeenCalled();

    const retrieved = storage.getSession();
    expect(retrieved?.email).toBe("rayflix@techbro.com");
  });

  it("handles empty storage gracefully", () => {
    localStorage.clear();
    const retrieved = storage.getSession();
    expect(retrieved).toBeNull();
  });
});
