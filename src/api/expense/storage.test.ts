import { afterEach, describe, expect, test, vi } from "vitest";

import { CategoryId, Expense } from "./schema";
import {
  deleteExpenseDetails,
  getExpense,
  KEY,
  saveExpenseDetail,
} from "./storage";

const getItemSpy = vi.spyOn(Storage.prototype, "getItem");
const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

afterEach(() => {
  localStorage.clear();
  getItemSpy.mockClear();
  setItemSpy.mockClear();
});

describe("getExpense", () => {
  test("should return undefined when expense is not present", () => {
    expect(getExpense()).toBeUndefined();
    expect(getItemSpy).toHaveBeenCalledWith(KEY);
  });

  test("should return undefined when expense is broken JSON", () => {
    localStorage.setItem(KEY, "<broken>");

    expect(getExpense()).toBeUndefined();
    expect(getItemSpy).toHaveBeenCalledWith(KEY);
  });

  test("should return undefined when expense is null string", () => {
    localStorage.setItem(KEY, "null");

    expect(getExpense()).toBeUndefined();
    expect(getItemSpy).toHaveBeenCalledWith(KEY);
  });
});

describe("saveExpenseDetail", () => {
  test("should be able to add new expense for the first time with id = 0", () => {
    saveExpenseDetail({
      item: "Item",
      categoryId: CategoryId.Accessory,
      amount: 55.5555,
    });

    const expected: Expense = {
      expenseDetails: [
        {
          id: 0,
          item: "Item",
          categoryId: CategoryId.Accessory,
          amount: 55.5555,
        },
      ],
      maxCategoryAmount: {
        [CategoryId.Accessory]: 55.5555,
      },
      maxAmount: 55.5555,
      lastId: 0,
    };

    expect(getExpense()).toStrictEqual(expected);
  });

  test("should add new expense and update max", () => {
    saveExpenseDetail({
      item: "Item 0",
      categoryId: CategoryId.Food,
      amount: 0.5,
    });
    saveExpenseDetail({
      item: "Item 1",
      categoryId: CategoryId.Accessory,
      amount: 999,
    });

    expect(getExpense()).toStrictEqual({
      expenseDetails: [
        {
          id: 1,
          item: "Item 1",
          categoryId: CategoryId.Accessory,
          amount: 999,
        },
        {
          id: 0,
          item: "Item 0",
          categoryId: CategoryId.Food,
          amount: 0.5,
        },
      ],
      maxCategoryAmount: {
        [CategoryId.Food]: 0.5,
        [CategoryId.Accessory]: 999,
      },
      maxAmount: 999,
      lastId: 1,
    });

    // Add one not affect max
    saveExpenseDetail({
      item: "Item 2",
      categoryId: CategoryId.Food,
      amount: 0.160003,
    });
    expect(getExpense()).toStrictEqual({
      expenseDetails: [
        {
          id: 2,
          item: "Item 2",
          categoryId: CategoryId.Food,
          amount: 0.160003,
        },
        {
          id: 1,
          item: "Item 1",
          categoryId: CategoryId.Accessory,
          amount: 999,
        },
        {
          id: 0,
          item: "Item 0",
          categoryId: CategoryId.Food,
          amount: 0.5,
        },
      ],
      maxCategoryAmount: {
        [CategoryId.Food]: 0.5,
        [CategoryId.Accessory]: 999,
      },
      maxAmount: 999,
      lastId: 2,
    });

    // Add one affect max
    saveExpenseDetail({
      item: "Item 3",
      categoryId: CategoryId.Accessory,
      amount: 12500002.3612,
    });
    expect(getExpense()).toStrictEqual({
      expenseDetails: [
        {
          id: 3,
          item: "Item 3",
          categoryId: CategoryId.Accessory,
          amount: 12500002.3612,
        },
        {
          id: 2,
          item: "Item 2",
          categoryId: CategoryId.Food,
          amount: 0.160003,
        },
        {
          id: 1,
          item: "Item 1",
          categoryId: CategoryId.Accessory,
          amount: 999,
        },
        {
          id: 0,
          item: "Item 0",
          categoryId: CategoryId.Food,
          amount: 0.5,
        },
      ],
      maxCategoryAmount: {
        [CategoryId.Food]: 0.5,
        [CategoryId.Accessory]: 12500002.3612,
      },
      maxAmount: 12500002.3612,
      lastId: 3,
    });

    // Add one new category
    saveExpenseDetail({
      item: "Item 4",
      categoryId: CategoryId.Furniture,
      amount: 0,
    });
    expect(getExpense()).toStrictEqual({
      expenseDetails: [
        {
          id: 4,
          item: "Item 4",
          categoryId: CategoryId.Furniture,
          amount: 0,
        },
        {
          id: 3,
          item: "Item 3",
          categoryId: CategoryId.Accessory,
          amount: 12500002.3612,
        },
        {
          id: 2,
          item: "Item 2",
          categoryId: CategoryId.Food,
          amount: 0.160003,
        },
        {
          id: 1,
          item: "Item 1",
          categoryId: CategoryId.Accessory,
          amount: 999,
        },
        {
          id: 0,
          item: "Item 0",
          categoryId: CategoryId.Food,
          amount: 0.5,
        },
      ],
      maxCategoryAmount: {
        [CategoryId.Food]: 0.5,
        [CategoryId.Accessory]: 12500002.3612,
        [CategoryId.Furniture]: 0,
      },
      maxAmount: 12500002.3612,
      lastId: 4,
    });
  });
});

describe("deleteExpenseDetails", () => {
  test("should do nothing when expense is not present", () => {
    deleteExpenseDetails([0, 1, 2, 3]);

    expect(setItemSpy).not.toHaveBeenCalledWith();
  });

  test("should do nothing when given ids is not in the list", () => {
    const expected: Expense = {
      expenseDetails: [
        {
          id: 0,
          item: "Item",
          categoryId: CategoryId.Accessory,
          amount: 55.5555,
        },
      ],
      maxCategoryAmount: {
        [CategoryId.Accessory]: 55.5555,
      },
      maxAmount: 55.5555,
      lastId: 0,
    };

    localStorage.setItem(KEY, JSON.stringify(expected));

    deleteExpenseDetails([1, 2, 3]);
    expect(getExpense()).toStrictEqual(expected);
  });

  test("should do nothing when given ids is not valid", () => {
    const expected: Expense = {
      expenseDetails: [
        {
          id: 0,
          item: "Item",
          categoryId: CategoryId.Accessory,
          amount: 55.5555,
        },
      ],
      maxCategoryAmount: {
        [CategoryId.Accessory]: 55.5555,
      },
      maxAmount: 55.5555,
      lastId: 0,
    };

    localStorage.setItem(KEY, JSON.stringify(expected));

    deleteExpenseDetails([NaN, Infinity]);
    expect(getExpense()).toStrictEqual(expected);
  });

  test("should delete given ids and update max amount", () => {
    const given: Expense = {
      expenseDetails: [
        {
          id: 9,
          item: "Item 9",
          categoryId: CategoryId.Accessory,
          amount: 0.15,
        },
        {
          id: 8,
          item: "Item 8",
          categoryId: CategoryId.Food,
          amount: 0,
        },
        {
          id: 4,
          item: "Item 4",
          categoryId: CategoryId.Furniture,
          amount: 270,
        },
        {
          id: 3,
          item: "Item 3",
          categoryId: CategoryId.Furniture,
          amount: 4560000.05,
        },
        {
          id: 1,
          item: "Item 1",
          categoryId: CategoryId.Accessory,
          amount: 19.999,
        },
        {
          id: 0,
          item: "Item 0",
          categoryId: CategoryId.Food,
          amount: 1,
        },
      ],
      maxCategoryAmount: {
        [CategoryId.Accessory]: 55.5555,
      },
      maxAmount: 55.5555,
      lastId: 9,
    };

    localStorage.setItem(KEY, JSON.stringify(given));

    // Remove non-max Food (8) - should have same max
    // Remove max Accessory (1) - should have new max
    // Remove all Furniture (3, 4) - should have NO max left

    deleteExpenseDetails([8, 1, 3, 4]);

    const actual = getExpense();

    expect(actual?.expenseDetails).toStrictEqual([
      {
        id: 9,
        item: "Item 9",
        categoryId: CategoryId.Accessory,
        amount: 0.15,
      },
      {
        id: 0,
        item: "Item 0",
        categoryId: CategoryId.Food,
        amount: 1,
      },
    ]);
    expect(actual?.maxCategoryAmount[CategoryId.Food]).toBe(1);
    expect(actual?.maxCategoryAmount[CategoryId.Accessory]).toBe(0.15);
    expect(actual?.maxCategoryAmount[CategoryId.Furniture]).toBe(undefined);
    expect(actual?.maxAmount).toBe(1);
    expect(actual?.lastId).toBe(9);
  });
});
