import { z } from "zod";

export const CategoryId = {
  Food: 0,
  Furniture: 1,
  Accessory: 2,
} as const;

export const itemSchema = z
  .string({ required_error: "Please enter item name" })
  .nonempty()
  .max(250);

export const categoryIdSchema = z.preprocess(
  (str) => (str ? Number(str) : undefined),
  z.nativeEnum(CategoryId, { required_error: "Please select a category" }),
);

export const amountSchema = z.preprocess(
  (str) => (str ? Number(str) : undefined),
  z.number({ required_error: "Please enter an amount (USD)" }).nonnegative(),
);

export const expenseDetailSchema = z.object({
  id: z.number().nonnegative(),
  item: itemSchema,
  categoryId: categoryIdSchema,
  amount: amountSchema,
});

export interface Expense {
  // Main fields
  expenseDetails: ExpenseDetail[];
  // Infer fields
  sumCategoryAmount: Record<number, number | undefined>;
  topSumCategoryAmount: number;
  lastId: number;
}

export type ExpenseDetail = z.infer<typeof expenseDetailSchema>;
