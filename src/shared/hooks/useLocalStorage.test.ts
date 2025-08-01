import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalStorage, removeLocalStorageItem, clearLocalStorage } from "./useLocalStorage";

describe("useLocalStorage", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
    // Clear console mocks
    vi.clearAllMocks();
  });

  it("should return initial value when localStorage is empty", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));
    expect(result.current[0]).toBe("initial");
  });

  it("should return stored value from localStorage", () => {
    window.localStorage.setItem("test-key", JSON.stringify("stored-value"));
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));
    expect(result.current[0]).toBe("stored-value");
  });

  it("should update localStorage when value changes", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));
    
    act(() => {
      result.current[1]("new-value");
    });

    expect(result.current[0]).toBe("new-value");
    expect(window.localStorage.getItem("test-key")).toBe(JSON.stringify("new-value"));
  });

  it("should handle function updates like useState", () => {
    const { result } = renderHook(() => useLocalStorage("counter", 0));
    
    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(1);
    expect(window.localStorage.getItem("counter")).toBe("1");
  });

  it("should handle complex objects", () => {
    const complexObject = { name: "test", nested: { value: 123 } };
    const { result } = renderHook(() => useLocalStorage("complex", complexObject));
    
    const newObject = { name: "updated", nested: { value: 456 } };
    act(() => {
      result.current[1](newObject);
    });

    expect(result.current[0]).toEqual(newObject);
    expect(JSON.parse(window.localStorage.getItem("complex")!)).toEqual(newObject);
  });

  it("should handle localStorage errors gracefully", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    // Mock localStorage.setItem to throw
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });

    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));
    
    act(() => {
      result.current[1]("new-value");
    });

    // Value should still update in state even if localStorage fails
    expect(result.current[0]).toBe("new-value");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error saving test-key to localStorage:",
      expect.any(Error)
    );

    setItemSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  it("should handle corrupted localStorage data", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    
    // Store invalid JSON
    window.localStorage.setItem("test-key", "invalid-json{");
    
    const { result } = renderHook(() => useLocalStorage("test-key", "fallback"));
    expect(result.current[0]).toBe("fallback");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error loading test-key from localStorage:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it("should sync across tabs via storage events", () => {
    const { result } = renderHook(() => useLocalStorage("sync-key", "initial"));
    
    // Simulate storage event from another tab
    const storageEvent = new StorageEvent("storage", {
      key: "sync-key",
      newValue: JSON.stringify("from-other-tab"),
      storageArea: window.localStorage,
    });

    act(() => {
      window.dispatchEvent(storageEvent);
    });

    expect(result.current[0]).toBe("from-other-tab");
  });

  it("should handle null values in storage events", () => {
    const { result } = renderHook(() => useLocalStorage("sync-key", "initial"));
    
    // Simulate storage event with null value (item removed)
    const storageEvent = new StorageEvent("storage", {
      key: "sync-key",
      newValue: null,
      storageArea: window.localStorage,
    });

    act(() => {
      window.dispatchEvent(storageEvent);
    });

    // Should keep current value when storage event has null
    expect(result.current[0]).toBe("initial");
  });

  it("should clean up event listeners on unmount", () => {
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderHook(() => useLocalStorage("test-key", "initial"));
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith("storage", expect.any(Function));
    removeEventListenerSpy.mockRestore();
  });
});

describe("removeLocalStorageItem", () => {
  it("should remove item from localStorage", () => {
    window.localStorage.setItem("test-key", "test-value");
    expect(window.localStorage.getItem("test-key")).toBe("test-value");
    
    removeLocalStorageItem("test-key");
    
    expect(window.localStorage.getItem("test-key")).toBeNull();
  });

  it("should handle errors gracefully", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const removeItemSpy = vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
      throw new Error("Remove error");
    });

    removeLocalStorageItem("test-key");
    
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error removing test-key from localStorage:",
      expect.any(Error)
    );

    removeItemSpy.mockRestore();
    consoleSpy.mockRestore();
  });
});

describe("clearLocalStorage", () => {
  it("should clear all items from localStorage", () => {
    window.localStorage.setItem("key1", "value1");
    window.localStorage.setItem("key2", "value2");
    expect(window.localStorage.length).toBe(2);
    
    clearLocalStorage();
    
    expect(window.localStorage.length).toBe(0);
  });

  it("should handle errors gracefully", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const clearSpy = vi.spyOn(Storage.prototype, "clear").mockImplementation(() => {
      throw new Error("Clear error");
    });

    clearLocalStorage();
    
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error clearing localStorage:",
      expect.any(Error)
    );

    clearSpy.mockRestore();
    consoleSpy.mockRestore();
  });
});