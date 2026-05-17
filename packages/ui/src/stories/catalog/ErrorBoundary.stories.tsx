// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ErrorBoundary } from "../../components/catalog/error-boundary";

const meta: Meta<typeof ErrorBoundary> = {
  title: "Catalog/WebUI/ErrorBoundary",
  component: ErrorBoundary,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ErrorBoundary>;

export const Default: Story = {
  args: {},
};
