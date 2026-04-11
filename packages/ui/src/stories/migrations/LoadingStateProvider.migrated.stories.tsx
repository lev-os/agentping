// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { LoadingStateProvider, useLoadingState } from "../../components/migrations/loading-state-provider";

function LoadingDemo() {
  const { isLoading } = useLoadingState();
  return (
    <div className="p-4 border border-cyan-500/20 bg-black/60 rounded-lg text-xs font-mono text-cyan-300">
      Loading state: {isLoading ? "loading..." : "idle"}
    </div>
  );
}

const meta: Meta<typeof LoadingStateProvider> = {
  title: "Migrations/WebUI/Dashboard/LoadingStateProvider",
  component: LoadingStateProvider,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof LoadingStateProvider>;

export const Default: Story = {
  render: () => (
    <LoadingStateProvider>
      <LoadingDemo />
    </LoadingStateProvider>
  ),
};
