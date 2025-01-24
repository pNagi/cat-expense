import { Expense, ExpenseDetail } from "./schema";

/**
 * Temporary storage for this excercise
 */

export const KEY = "expense";

export function deleteExpenseDetails(expenseDetailIds: number[]) {
  const currentExpense = getExpense();

  if (!currentExpense) return;

  const newExpense: Expense = {
    expenseDetails: [],
    sumCategoryAmount: {},
    topSumCategoryAmount: 0,
    lastId: currentExpense.lastId,
  };

  currentExpense.expenseDetails.forEach((d) => {
    if (!expenseDetailIds.includes(d.id)) {
      newExpense.expenseDetails.push(d);

      const newSum =
        (newExpense.sumCategoryAmount[d.categoryId] ?? 0) + d.amount;

      newExpense.sumCategoryAmount[d.categoryId] = newSum;
      newExpense.topSumCategoryAmount = Math.max(
        newExpense.topSumCategoryAmount,
        d.amount,
      );
    }
  });

  try {
    localStorage.setItem(KEY, JSON.stringify(newExpense));
  } catch (error) {
    // IMPROVEMENT: Change console.error to proper log
    console.error(error);

    throw new Error("Failed to delete expense details in storage");
  }
}

export function getExpense(): Expense | undefined {
  try {
    const data = localStorage.getItem(KEY);
    if (!data) return undefined;

    const parsed: unknown = JSON.parse(data);

    if (parsed) return parsed as Expense;
  } catch (error) {
    // IMPROVEMENT: Change console.error to proper log
    console.error(error);
  }

  return undefined;
}

export function saveExpenseDetail(d: Omit<ExpenseDetail, "id">) {
  const existing = getExpense();

  const newId = (existing?.lastId ?? -1) + 1;
  const newSum = (existing?.sumCategoryAmount[d.categoryId] ?? 0) + d.amount;

  const newExpense: Expense = {
    expenseDetails: [{ id: newId, ...d }, ...(existing?.expenseDetails ?? [])],
    sumCategoryAmount: {
      ...(existing?.sumCategoryAmount ?? {}),
      [d.categoryId]: newSum,
    },
    topSumCategoryAmount: Math.max(existing?.topSumCategoryAmount ?? 0, newSum),
    lastId: newId,
  };

  try {
    localStorage.setItem(KEY, JSON.stringify(newExpense));
  } catch (error) {
    // IMPROVEMENT: Change console.error to proper log
    console.error(error);

    throw new Error("Failed to save expense detail in storage");
  }
}

// IMPROVEMENT: Extract calculate infer fields to a reusable function
