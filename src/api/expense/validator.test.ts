import { describe, expect, test } from "vitest";

import { validateAmount, validateCategoryId, validateItem } from "./validator";

describe("validateItem", () => {
  test("should return required error when value is empty or undefined", () => {
    const expected = ["Please enter item name"];

    expect(validateItem(undefined)).toStrictEqual(expected);
    expect(validateItem(null)).toStrictEqual(expected);
    expect(validateItem("")).toStrictEqual(expected);
    expect(validateItem(" ")).toStrictEqual(expected);
    expect(validateItem("     ")).toStrictEqual(expected);
  });

  test("should return undefined when value is valid string", () => {
    expect(validateItem("0")).toStrictEqual(undefined);
    expect(validateItem("a")).toStrictEqual(undefined);
    expect(validateItem("abc")).toStrictEqual(undefined);
  });

  test("should NOT return greater than error when value have exactly 250 characters", () => {
    expect(validateItem("abcde".repeat(25))).toStrictEqual(undefined);
    expect(validateItem("z".repeat(250))).toStrictEqual(undefined);
  });

  test("should return greater than error when value exceed maximum of 250 characters", () => {
    const expected = ["String must contain at most 250 character(s)"];

    expect(validateItem("a".repeat(251))).toStrictEqual(expected);
    expect(validateItem("z".repeat(200000))).toStrictEqual(expected);
  });
});

describe("validateCategoryId", () => {
  test("should return required error when value is empty or undefined", () => {
    const expected = ["Please select a category"];

    expect(validateCategoryId(undefined)).toStrictEqual(expected);
    expect(validateCategoryId(null)).toStrictEqual(expected);
    expect(validateCategoryId("")).toStrictEqual(expected);
    expect(validateCategoryId(" ")).toStrictEqual(expected);
    expect(validateCategoryId("     ")).toStrictEqual(expected);
  });

  test("should return undefined when value is valid string", () => {
    expect(validateItem("0")).toStrictEqual(undefined);
    expect(validateItem("a")).toStrictEqual(undefined);
    expect(validateItem("abc")).toStrictEqual(undefined);
  });

  test("should return required error when value is empty", () => {
    expect(validateCategoryId("")).toStrictEqual(["Please select a category"]);
  });
});

describe("validateAmount", () => {
  test("should return required error when value is empty or undefined", () => {
    const expected = ["Please enter an amount (USD)"];

    expect(validateAmount(undefined)).toStrictEqual(expected);
    expect(validateAmount(null)).toStrictEqual(expected);
    expect(validateAmount("")).toStrictEqual(expected);
    expect(validateAmount(" ")).toStrictEqual(expected);
    expect(validateAmount("     ")).toStrictEqual(expected);
  });

  test("should return undefined when value is valid number", () => {
    expect(validateAmount("0")).toStrictEqual(undefined);
    expect(validateAmount("123")).toStrictEqual(undefined);
    expect(validateAmount("12345678912345678912")).toStrictEqual(undefined);
    expect(
      validateAmount("12345678912345678912.12345678912345678912"),
    ).toStrictEqual(undefined);
    expect(validateAmount("1e10000")).toStrictEqual(undefined); // This translates to Infinity, which is a number
    expect(validateAmount(Infinity.toString())).toStrictEqual(undefined);
    expect(validateAmount("12.")).toStrictEqual(undefined);
    expect(validateAmount(".12")).toStrictEqual(undefined);
  });

  test("should return negative error when value is negative", () => {
    const expected = ["Number must be greater than or equal to 0"];

    expect(validateAmount("-123")).toStrictEqual(expected);
  });

  test("should return invalid type error when value is not a number", () => {
    // IMPROVEMENT: Change translation to be more user friendly
    const expected = ["Expected number, received nan"];

    expect(validateAmount("abcd")).toStrictEqual(expected);
    expect(validateAmount("123a")).toStrictEqual(expected);
    expect(validateAmount("12..")).toStrictEqual(expected);
    expect(validateAmount("..12")).toStrictEqual(expected);
    expect(validateAmount("123,000")).toStrictEqual(expected);
  });
});

// IMPROVEMENT: Write test cases for validateExpenseDetail
