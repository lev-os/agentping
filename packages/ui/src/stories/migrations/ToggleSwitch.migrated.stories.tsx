import type { Meta, StoryObj } from "@storybook/react";
import { ToggleSwitch } from "../../components/migrations/toggle-switch";

const meta = {
  title: "Migrations/WebUI/Root/ToggleSwitch",
  component: ToggleSwitch,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ToggleSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { label: "Enable notifications", checked: false } };

export const On: Story = { args: { label: "Dark mode", checked: true } };

export const Disabled: Story = { args: { label: "Locked setting", checked: true, disabled: true } };
