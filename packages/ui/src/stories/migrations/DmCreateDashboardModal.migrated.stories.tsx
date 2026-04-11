import type { Meta, StoryObj } from "@storybook/react-vite";
import { DmCreateDashboardModal } from "../../components/migrations/dm-create-dashboard-modal";

const meta = {
  title: "Migrations/DashboardManager/CreateDashboardModal",
  component: DmCreateDashboardModal,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
} satisfies Meta<typeof DmCreateDashboardModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onClose: () => console.log("close"),
    onSubmit: async (data) => console.log("submit:", data),
  },
};
