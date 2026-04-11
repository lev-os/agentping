import type { Meta, StoryObj } from "@storybook/react-vite";
import { DocCard } from "../../components/migrations/doc-card";

const meta: Meta<typeof DocCard> = {
  title: "Migrations/WebUI/Dashboard/DocCard",
  component: DocCard,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof DocCard>;

export const Default: Story = {
  args: {},
};
