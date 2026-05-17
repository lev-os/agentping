import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dropdown } from "../../components/catalog/dropdown";

const meta = {
  title: "Catalog/Studio/Dropdown",
  component: Dropdown,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: 240 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    options: [
      { value: "claude-opus", label: "Claude Opus 4.6" },
      { value: "claude-sonnet", label: "Claude Sonnet 4.5" },
      { value: "claude-haiku", label: "Claude Haiku 4.5" },
    ],
    onChange: () => {},
    placeholder: "Select model...",
  },
};

export const WithSelection: Story = {
  args: {
    value: "claude-opus",
    options: [
      { value: "claude-opus", label: "Claude Opus 4.6" },
      { value: "claude-sonnet", label: "Claude Sonnet 4.5" },
      { value: "claude-haiku", label: "Claude Haiku 4.5" },
    ],
    onChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    value: "claude-opus",
    options: [{ value: "claude-opus", label: "Claude Opus 4.6" }],
    onChange: () => {},
    disabled: true,
  },
};
