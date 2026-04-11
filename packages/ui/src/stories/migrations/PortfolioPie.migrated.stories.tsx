import type { Meta, StoryObj } from "@storybook/react-vite";
import { PortfolioPie } from "../../components/migrations/portfolio-pie";

const meta = {
  title: "Migrations/WebUI/Finance/PortfolioPie",
  component: PortfolioPie,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof PortfolioPie>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
