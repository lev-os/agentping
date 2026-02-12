import type { Meta, StoryObj } from "@storybook/react";
import { StepChecklist } from "../../components/migrations/step-checklist";

const meta = {
  title: "Migrations/WebUI/Root/StepChecklist",
  component: StepChecklist,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof StepChecklist>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [
      { label: "Install dependencies", checked: true },
      { label: "Configure environment", checked: true },
      { label: "Run migrations", checked: false },
      { label: "Deploy to staging", checked: false },
    ],
  },
};
