import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { FormattedNumberInput } from "./FormattedNumberInput";

describe("FormattedNumberInput Auto-repeat", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should auto-repeat when holding mouse down on increment button", async () => {
    const onChange = vi.fn();
    
    render(
      <FormattedNumberInput
        value={100}
        onChange={onChange}
        format="number"
        step={10}
        testId="test-input"
        showSteppers={true}
      />
    );
    
    const incrementButton = screen.getByTestId("test-input-increment");
    
    // Mouse down on the button
    fireEvent.mouseDown(incrementButton);
    
    // First step happens immediately
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(110);
    
    // Advance time to start auto-repeat (after 300ms delay)
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    // Should start repeating at 200ms intervals
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenLastCalledWith(110);
    
    // Continue for a few more steps
    act(() => {
      vi.advanceTimersByTime(600); // 3 more steps at 200ms each
    });
    expect(onChange).toHaveBeenCalledTimes(5);
    
    // After 5 steps, speed should increase to 100ms intervals
    act(() => {
      vi.advanceTimersByTime(200); // 2 more steps at 100ms each
    });
    expect(onChange).toHaveBeenCalledTimes(7);
    
    // Mouse up to stop
    fireEvent.mouseUp(incrementButton);
    
    // Advance time - no more calls should happen
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onChange).toHaveBeenCalledTimes(7);
  });

  it("should stop auto-repeat when mouse leaves the button", async () => {
    const onChange = vi.fn();
    
    render(
      <FormattedNumberInput
        value={100}
        onChange={onChange}
        format="number"
        step={10}
        testId="test-input"
        showSteppers={true}
      />
    );
    
    const incrementButton = screen.getByTestId("test-input-increment");
    
    // Mouse down on the button
    fireEvent.mouseDown(incrementButton);
    expect(onChange).toHaveBeenCalledTimes(1);
    
    // Start auto-repeat
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(onChange).toHaveBeenCalledTimes(2);
    
    // Mouse leaves the button
    fireEvent.mouseLeave(incrementButton);
    
    // No more steps should happen
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("should handle touch events for mobile", async () => {
    const onChange = vi.fn();
    
    render(
      <FormattedNumberInput
        value={50}
        onChange={onChange}
        format="number"
        step={5}
        testId="test-input"
        showSteppers={true}
      />
    );
    
    const decrementButton = screen.getByTestId("test-input-decrement");
    
    // Touch start
    fireEvent.touchStart(decrementButton);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(45);
    
    // Start auto-repeat
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(onChange.mock.calls.length).toBeGreaterThan(1);
    
    // Touch end
    fireEvent.touchEnd(decrementButton);
    
    // No more steps
    const callCount = onChange.mock.calls.length;
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(onChange).toHaveBeenCalledTimes(callCount);
  });
});