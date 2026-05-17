import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToggleSwitch } from "../../components/catalog/toggle-switch";

const meta = {
  title: "Catalog/WebUI/Root/ToggleSwitch",
  component: ToggleSwitch,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ToggleSwitch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { label: "Enable notifications", checked: false } };

export const On: Story = { args: { label: "Dark mode", checked: true } };

export const Disabled: Story = { args: { label: "Locked setting", checked: true, disabled: true } };
