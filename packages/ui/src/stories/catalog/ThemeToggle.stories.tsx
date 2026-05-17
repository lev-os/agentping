import type { Meta, StoryObj } from "@storybook/react-vite";
import { ThemeToggle } from "../../components/catalog/theme-toggle";

const meta = {
  title: "Catalog/WebUI/Root/ThemeToggle",
  component: ThemeToggle,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { theme: "dark" } };

export const Light: Story = { args: { theme: "light" } };
