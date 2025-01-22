import type { Decorator, Meta, StoryObj } from "@storybook/react";

import { faker } from "@faker-js/faker";

import { FormElement } from "./FormElement";

const decorator: Decorator = (Story) => (
  <div className="w-80">
    <Story />
  </div>
);

const meta = {
  title: "UI-Kit / FormElement",
  decorators: [decorator],
  component: FormElement,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    inputType: "input",
    inputProps: {
      name: "name",
      placeholder: faker.lorem.words(),
      autoComplete: "off",
    },
    label: faker.lorem.word(),
  },
} satisfies Meta<typeof FormElement>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InputEmpty: Story = {
  args: {},
};

export const InputWithInfo: Story = {
  args: {
    info: faker.lorem.sentence(),
    errors: [],
  },
};

export const InputWithValue: Story = {
  args: {
    inputProps: {
      name: "name",
      placeholder: faker.lorem.words(),
      autoComplete: "off",
      value: faker.lorem.word(),
    },
    info: faker.lorem.sentence(),
    errors: [],
  },
};

export const InputWithError: Story = {
  args: {
    inputProps: {
      name: "name",
      placeholder: faker.lorem.words(),
      autoComplete: "off",
      value: faker.lorem.word(),
    },
    info: faker.lorem.sentence(),
    errors: [faker.lorem.sentence(), faker.lorem.sentence()],
  },
};

const options = faker.helpers
  .uniqueArray(() => faker.commerce.department(), 3)
  .map((word, i) => (
    <option key={word} value={i}>
      {word}
    </option>
  ));

export const SelectDefault: Story = {
  args: {
    inputType: "select",
    inputProps: {
      name: "name",
      autoComplete: "off",
    },
    children: options,
  },
};

export const SelectWithInfo: Story = {
  args: {
    inputType: "select",
    inputProps: {
      name: "name",
      autoComplete: "off",
    },
    children: options,
    info: faker.lorem.sentence(),
    errors: [],
  },
};

export const SelectWithValue: Story = {
  args: {
    inputType: "select",
    inputProps: {
      name: "name",
      autoComplete: "off",
      value: 2,
    },
    children: options,
    info: faker.lorem.sentence(),
    errors: [],
  },
};

export const SelectWithError: Story = {
  args: {
    inputType: "select",
    inputProps: {
      name: "name",
      autoComplete: "off",
      value: 2,
    },
    children: options,
    info: faker.lorem.sentence(),
    errors: [faker.lorem.sentence(), faker.lorem.sentence()],
  },
};
