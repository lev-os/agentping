import type { Meta, StoryObj } from "@storybook/react-vite";
import { StepChecklist } from "../../components/catalog/step-checklist";

const meta = {
  title: "Catalog/WebUI/Root/StepChecklist",
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
      { label: "Run schema updates", checked: false },
      { label: "Deploy to staging", checked: false },
    ],
  },
};
