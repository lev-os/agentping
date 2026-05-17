import type { Meta, StoryObj } from "@storybook/react-vite";
import { AccessPad } from "../../components/catalog/access-pad";

const meta = {
  title: "Catalog/WebUI/System/AccessPad",
  component: AccessPad,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof AccessPad>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
