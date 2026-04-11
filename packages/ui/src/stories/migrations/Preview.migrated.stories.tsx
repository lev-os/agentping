import type { Meta, StoryObj } from "@storybook/react-vite";
import { Preview } from "../../components/migrations/preview";

const meta = {
  title: "Migrations/Studio/Preview",
  component: Preview,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  decorators: [(Story) => <div style={{ height: 600 }}><Story /></div>],
} satisfies Meta<typeof Preview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialUrl: "http://localhost:3000",
    onNavigate: () => {},
    onOpenExternal: () => {},
  },
};
