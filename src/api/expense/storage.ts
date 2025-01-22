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
    maxCategoryAmount: {},
    maxAmount: 0,
    lastId: currentExpense.lastId,
  };

  currentExpense.expenseDetails.forEach((expenseDetail) => {
    if (!expenseDetailIds.includes(expenseDetail.id)) {
      const currentMaxAmount =
        newExpense.maxCategoryAmount[expenseDetail.categoryId];

      newExpense.expenseDetails.push(expenseDetail);
      newExpense.maxCategoryAmount[expenseDetail.categoryId] = currentMaxAmount
        ? Math.max(currentMaxAmount, expenseDetail.amount)
        : expenseDetail.amount;
      newExpense.maxAmount = Math.max(
        newExpense.maxAmount,
        expenseDetail.amount,
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

export function saveExpenseDetail(newExpenseDetail: Omit<ExpenseDetail, "id">) {
  const currentExpense = getExpense();
  const currentMaxAmount =
    currentExpense?.maxCategoryAmount[newExpenseDetail.categoryId];

  const newId = (currentExpense?.lastId ?? -1) + 1;
  const newExpense: Expense = {
    expenseDetails: [
      { id: newId, ...newExpenseDetail },
      ...(currentExpense?.expenseDetails ?? []),
    ],
    maxCategoryAmount: {
      ...(currentExpense?.maxCategoryAmount ?? {}),
      [newExpenseDetail.categoryId]: Math.max(
        currentMaxAmount ?? 0,
        newExpenseDetail.amount,
      ),
    },
    maxAmount: Math.max(
      currentExpense?.maxAmount ?? 0,
      newExpenseDetail.amount,
    ),
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
