import type { Meta, StoryObj } from "@storybook/react-vite";
import { SharedComponents } from "../../components/migrations/shared-components";

const meta = {
  title: "Migrations/WebUI/Root/SharedComponents",
  component: SharedComponents,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof SharedComponents>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
