import type { Meta, StoryObj } from "@storybook/react";
import { ConflictResolver } from "../../components/migrations/conflict-resolver";

const meta: Meta<typeof ConflictResolver> = {
  title: "Migrations/WebUI/ConflictResolver",
  component: ConflictResolver,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ConflictResolver>;

export const Default: Story = {
  args: {},
};
