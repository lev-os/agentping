import type { Meta, StoryObj } from "@storybook/react-vite";
import { TeamRoster } from "../../components/migrations/team-roster";

const meta = {
  title: "Migrations/WebUI/Root/TeamRoster",
  component: TeamRoster,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof TeamRoster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    members: [
      { name: "Alice Chen", role: "Tech Lead", status: "online" },
      { name: "Bob Martinez", role: "Backend Dev", status: "online" },
      { name: "Carol Kim", role: "Frontend Dev", status: "away" },
      { name: "Dan Okafor", role: "DevOps", status: "online" },
      { name: "Eva Johansson", role: "Designer", status: "offline" },
      { name: "Frank Li", role: "QA Engineer", status: "online" },
    ],
  },
};

export const SmallTeam: Story = {
  args: {
    members: [
      { name: "Zara Ahmed", role: "Founder", status: "online" },
      { name: "Kai Tanaka", role: "CTO", status: "away" },
    ],
  },
};
