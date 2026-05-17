import type { Meta, StoryObj } from "@storybook/react-vite";
import { FirewallRules } from "../../components/catalog/firewall-rules";

const meta = {
  title: "Catalog/WebUI/System/FirewallRules",
  component: FirewallRules,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof FirewallRules>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
