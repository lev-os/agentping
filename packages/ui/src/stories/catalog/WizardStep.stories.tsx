import type { Meta, StoryObj } from "@storybook/react-vite";
import { WizardStep } from "../../components/catalog/wizard-step";

const meta = {
  title: "Catalog/WebUI/Root/WizardStep",
  component: WizardStep,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof WizardStep>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Configure API Keys",
    description: "Enter your API credentials to connect to external services.",
    stepNumber: 2,
    totalSteps: 4,
    isFirst: false,
    isLast: false,
  },
};

export const FirstStep: Story = {
  args: {
    title: "Welcome",
    description: "Let's get started with your setup.",
    stepNumber: 1,
    totalSteps: 3,
    isFirst: true,
    isLast: false,
  },
};

export const LastStep: Story = {
  args: {
    title: "Review & Deploy",
    description: "Confirm your settings and deploy.",
    stepNumber: 3,
    totalSteps: 3,
    isFirst: false,
    isLast: true,
  },
};
