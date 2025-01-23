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
      sumCategoryAmount: {
        [CategoryId.Accessory]: 55.5555,
      },
      topCategoryId: CategoryId.Accessory,
      lastId: 0,
    };

    expect(getExpense()).toStrictEqual(expected);
  });

  test("should add new expense, update sum and update top category ID", () => {
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
      sumCategoryAmount: {
        [CategoryId.Food]: 0.5,
        [CategoryId.Accessory]: 999,
      },
      topCategoryId: CategoryId.Accessory,
      lastId: 1,
    });

    // Add one affect top category
    saveExpenseDetail({
      item: "Item 2",
      categoryId: CategoryId.Food,
      amount: 12500002.3612,
    });
    expect(getExpense()).toStrictEqual({
      expenseDetails: [
        {
          id: 2,
          item: "Item 2",
          categoryId: CategoryId.Food,
          amount: 12500002.3612,
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
      sumCategoryAmount: {
        [CategoryId.Food]: 12500002.3612 + 0.5,
        [CategoryId.Accessory]: 999,
      },
      topCategoryId: CategoryId.Food,
      lastId: 2,
    });

    // Add one NOT affect top category
    saveExpenseDetail({
      item: "Item 3",
      categoryId: CategoryId.Accessory,
      amount: 0.160003,
    });
    expect(getExpense()).toStrictEqual({
      expenseDetails: [
        {
          id: 3,
          item: "Item 3",
          categoryId: CategoryId.Accessory,
          amount: 0.160003,
        },
        {
          id: 2,
          item: "Item 2",
          categoryId: CategoryId.Food,
          amount: 12500002.3612,
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
      sumCategoryAmount: {
        [CategoryId.Food]: 12500002.3612 + 0.5,
        [CategoryId.Accessory]: 999 + 0.160003,
      },
      topCategoryId: CategoryId.Food,
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
          amount: 0.160003,
        },
        {
          id: 2,
          item: "Item 2",
          categoryId: CategoryId.Food,
          amount: 12500002.3612,
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
      sumCategoryAmount: {
        [CategoryId.Food]: 12500002.3612 + 0.5,
        [CategoryId.Accessory]: 999 + 0.160003,
        [CategoryId.Furniture]: 0,
      },
      topCategoryId: CategoryId.Food,
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
          categoryId: CategoryId.Furniture,
          amount: 55.5555,
        },
      ],
      sumCategoryAmount: {
        [CategoryId.Furniture]: 55.5555,
      },
      topCategoryId: CategoryId.Furniture,
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
          categoryId: CategoryId.Furniture,
          amount: 55.5555,
        },
      ],
      sumCategoryAmount: {
        [CategoryId.Furniture]: 55.5555,
      },
      topCategoryId: CategoryId.Furniture,
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
      sumCategoryAmount: {
        [CategoryId.Food]: 1,
        [CategoryId.Furniture]: 4560000.05 + 270,
        [CategoryId.Accessory]: 19.999 + 0.15,
      },
      topCategoryId: CategoryId.Furniture,
      lastId: 9,
    };

    localStorage.setItem(KEY, JSON.stringify(given));

    deleteExpenseDetails([8, 1, 3, 4]);

    const actual = getExpense();

    expect(actual).toStrictEqual({
      expenseDetails: [
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
      ],
      sumCategoryAmount: {
        [CategoryId.Food]: 1,
        [CategoryId.Accessory]: 0.15,
      },
      topCategoryId: CategoryId.Food,
      lastId: 9,
    });
  });
});
