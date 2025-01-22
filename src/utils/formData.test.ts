import { describe, expect, test } from "vitest";

import { convertEntryValueToString } from "./formData.js";

describe("convertEntryValueToString", () => {
  test("should return undefined when value is a File, null or empty string", () => {
    const file = new File(["foo"], "foo.txt", {
      type: "text/plain",
    });

    expect(convertEntryValueToString(file)).toBeUndefined();
    expect(convertEntryValueToString(null)).toBeUndefined();
    expect(convertEntryValueToString(undefined)).toBeUndefined();
    expect(convertEntryValueToString("")).toBeUndefined();
    expect(convertEntryValueToString(" ")).toBeUndefined();
    expect(convertEntryValueToString("     ")).toBeUndefined();
  });

  test("should return string when value is NOT a File, null or empty string", () => {
    expect(convertEntryValueToString("abc")).toBe("abc");
    expect(convertEntryValueToString("0001")).toBe("0001");
    expect(convertEntryValueToString("z")).toBe("z");
  });
});
