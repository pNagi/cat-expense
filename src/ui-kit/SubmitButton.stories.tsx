import type { Decorator, Meta, StoryObj } from "@storybook/react";

import { SubmitButton } from "./SubmitButton";

const decorator: Decorator = (Story) => (
  <div className="w-80">
    <Story />
  </div>
);

const meta: Meta<typeof SubmitButton> = {
  title: "UI-Kit / SubmitButton",
  component: SubmitButton,
  decorators: [decorator],
  parameters: {
    layout: "centered",
  },
  args: {
    className: "w-full",
    text: "text",
    pendingText: "pending text",
    isPending: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {},
};

export const IsPending: Story = {
  args: { isPending: true },
};
