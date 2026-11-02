import { describe, expect, it } from "vitest";
import { isValidProfileCode, normalizeProfileCode, parseProfileCode, safeNextPath } from "@/lib/profile";

describe("profile codes", () => {
  it("normalizes case and surrounding whitespace", () => {
    expect(normalizeProfileCode("  Taro-SG ")).toBe("taro-sg");
    expect(parseProfileCode("  Taro-SG ")).toBe("taro-sg");
  });

  it("accepts readable codes and legacy cookie UUIDs", () => {
    for (const code of ["abc", "taro-sg", "a_b-c9", "c96e6513-f250-4a52-8b0a-01bd3971a83a", "x".repeat(40)]) {
      expect(isValidProfileCode(code)).toBe(true);
    }
  });

  it("rejects short, long, spaced, symbol-leading or non-ASCII codes", () => {
    for (const code of ["", "ab", "x".repeat(41), "has space", "-lead", "_lead", "日本語です", "a/b", "a.b", "<script>"]) {
      expect(isValidProfileCode(code)).toBe(false);
    }
    expect(parseProfileCode(null)).toBeNull();
    expect(parseProfileCode(undefined)).toBeNull();
    expect(parseProfileCode("no")).toBeNull();
  });
});

describe("safeNextPath", () => {
  it("keeps same-site paths and falls back to / for anything else", () => {
    expect(safeNextPath("/learn/security/cia-and-design")).toBe("/learn/security/cia-and-design");
    expect(safeNextPath("/practice?x=1")).toBe("/practice?x=1");
    for (const bad of [undefined, "", "learn", "//evil.example", "/\\evil.example", "https://evil.example", "/profile", "/api/profile"]) {
      expect(safeNextPath(bad)).toBe("/");
    }
  });
});
