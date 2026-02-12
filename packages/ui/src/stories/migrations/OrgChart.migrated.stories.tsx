import type { Meta, StoryObj } from "@storybook/react";
import { OrgChart } from "../../components/migrations/org-chart";

const meta = {
  title: "Migrations/WebUI/Root/OrgChart",
  component: OrgChart,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof OrgChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: {
      id: "ceo",
      name: "Agent Prime",
      role: "Orchestrator",
      children: [
        {
          id: "eng",
          name: "Builder",
          role: "Engineer",
          children: [
            { id: "fe", name: "Pixel", role: "Frontend" },
            { id: "be", name: "Logic", role: "Backend" },
          ],
        },
        { id: "ops", name: "Runner", role: "DevOps" },
      ],
    },
  },
};
