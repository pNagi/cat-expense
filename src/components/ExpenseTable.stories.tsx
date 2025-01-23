import type { Meta, StoryObj } from "@storybook/react";

import { faker } from "@faker-js/faker";

import { Expense } from "../api/expense/schema";
import { ExpenseTable } from "./ExpenseTable";

const meta: Meta<typeof ExpenseTable> = {
  title: "Expense / ExpenseTable",
  component: ExpenseTable,
  args: { expenseDetails: [], topCategoryId: undefined },
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

const sumCategoryAmount: Expense["sumCategoryAmount"] = {};

let topCategoryId: number | undefined = undefined;

expenseDetails.forEach((d) => {
  const newSum = (sumCategoryAmount[d.categoryId] ?? 0) + d.amount;

  sumCategoryAmount[d.categoryId] = newSum;

  if (newSum > (sumCategoryAmount[topCategoryId ?? -1] ?? -1)) {
    topCategoryId = d.categoryId;
  }
});

export const Empty: Story = {
  args: {},
};

export const EmptyLoading: Story = {
  args: { isLoading: true },
};

export const WithValue: Story = {
  args: { expenseDetails, topCategoryId },
};

export const WithValueLoading: Story = {
  args: { expenseDetails, topCategoryId, isLoading: true },
};
