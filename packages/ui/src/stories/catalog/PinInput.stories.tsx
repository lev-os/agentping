import type { Meta, StoryObj } from "@storybook/react-vite";
import { PinInput } from "../../components/catalog/pin-input";

const meta = {
  title: "Catalog/WebUI/Root/PinInput",
  component: PinInput,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof PinInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
