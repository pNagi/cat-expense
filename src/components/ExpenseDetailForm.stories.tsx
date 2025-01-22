import type { Decorator, Meta, StoryObj } from "@storybook/react";

import { faker } from "@faker-js/faker";

import { ExpenseDetailForm } from "./ExpenseDetailForm";

const decorator: Decorator = (Story) => (
  <div className="w-80">
    <Story />
  </div>
);

const meta: Meta<typeof ExpenseDetailForm> = {
  title: "Expense / ExpenseDetailForm",
  component: ExpenseDetailForm,
  decorators: [decorator],
  parameters: {
    layout: "centered",
  },
  args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const NoError: Story = {
  args: { onSubmit: () => ({ success: true }) },
};

const errors = {
  item: [faker.lorem.sentence()],
  categoryId: [faker.lorem.sentence()],
  amount: [faker.lorem.sentence()],
};

export const Error: Story = {
  args: {
    onSubmit: () => ({
      success: false,
      errors,
    }),
  },
};
