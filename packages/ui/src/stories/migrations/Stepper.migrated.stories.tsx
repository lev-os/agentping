import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stepper } from "../../components/migrations/stepper";

const meta = {
  title: "Migrations/WebUI/Root/Stepper",
  component: Stepper,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { steps: ["Account", "Profile", "Review", "Done"], currentStep: 1 },
};

export const AllComplete: Story = {
  args: { steps: ["Upload", "Process", "Verify"], currentStep: 3 },
};
