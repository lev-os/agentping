import type { Meta, StoryObj } from "@storybook/react";
import { HttpInspector } from "../../components/migrations/http-inspector";

const meta = {
  title: "Migrations/WebUI/Logs/HttpInspector",
  component: HttpInspector,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof HttpInspector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
