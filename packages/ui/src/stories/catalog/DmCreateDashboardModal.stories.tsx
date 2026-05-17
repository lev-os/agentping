import type { Meta, StoryObj } from "@storybook/react-vite";
import { DmCreateDashboardModal } from "../../components/catalog/dm-create-dashboard-modal";

const meta = {
  title: "Catalog/DashboardManager/CreateDashboardModal",
  component: DmCreateDashboardModal,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
} satisfies Meta<typeof DmCreateDashboardModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onClose: () => console.log("close"),
    onSubmit: async (data: unknown) => console.log("submit:", data),
  },
};
