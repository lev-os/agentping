import type { Meta, StoryObj } from "@storybook/react-vite";
import { ConflictResolver } from "../../components/catalog/conflict-resolver";

const meta: Meta<typeof ConflictResolver> = {
  title: "Catalog/WebUI/ConflictResolver",
  component: ConflictResolver,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ConflictResolver>;

export const Default: Story = {
  args: {},
};
