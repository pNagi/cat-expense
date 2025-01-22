import type { Meta, StoryObj } from "@storybook/react";

import { faker } from "@faker-js/faker";

import { Expense } from "../api/expense/schema";
import { ExpenseTable } from "./ExpenseTable";

const meta: Meta<typeof ExpenseTable> = {
  title: "Expense / ExpenseTable",
  component: ExpenseTable,
  args: { expenseDetails: [], maxCategoryAmount: {}, maxAmount: 0 },
};

export default meta;
type Story = StoryObj<typeof meta>;

const expenseDetails: Expense["expenseDetails"] = faker.helpers
  .uniqueArray(() => faker.lorem.sentence(), 12)
  .map((s, i) => ({
    id: i,
    item: s,
    categoryId: Math.floor(Math.random() * 3) as 0 | 1 | 2,
    amount: Math.random() * 1000000,
  }))
  .reverse();

const maxCategoryAmount: Expense["maxCategoryAmount"] = {};

let max = 0;

expenseDetails.forEach((d) => {
  maxCategoryAmount[d.categoryId] = Math.max(
    maxCategoryAmount[d.categoryId] ?? 0,
    d.amount,
  );
  max = Math.max(max, d.amount);
});

export const Empty: Story = {
  args: {},
};

export const EmptyLoading: Story = {
  args: { isLoading: true },
};

export const WithValue: Story = {
  args: { expenseDetails, maxCategoryAmount, maxAmount: max },
};

export const WithValueLoading: Story = {
  args: { expenseDetails, maxCategoryAmount, maxAmount: max, isLoading: true },
};
