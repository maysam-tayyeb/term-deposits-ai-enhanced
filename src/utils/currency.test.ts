import { describe, expect, test } from "vitest";
import { round } from "./currency.ts";

describe("currency", () => {
  test("round to two", () => {
    expect(round(9.167)).toBe(9.17);
  });
});
