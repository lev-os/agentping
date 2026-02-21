// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react";
import { ErrorBoundary } from "../../components/migrations/error-boundary";

const meta: Meta<typeof ErrorBoundary> = {
  title: "Migrations/WebUI/ErrorBoundary",
  component: ErrorBoundary,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof ErrorBoundary>;

export const Default: Story = {
  args: {},
};
