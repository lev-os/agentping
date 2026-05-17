import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "../../components/catalog/skeleton";

const meta = {
  title: "Catalog/WebUI/Root/Skeleton",
  component: Skeleton,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { variant: "rect", width: 200, height: 20 } };

export const Circle: Story = { args: { variant: "circle", width: 48 } };

export const TextLines: Story = { args: { variant: "text", count: 4 } };
