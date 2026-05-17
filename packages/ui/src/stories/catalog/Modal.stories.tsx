// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Modal } from "../../components/catalog/modal";

const meta = {
  title: "Catalog/Studio/Modal",
  component: Modal,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    title: "Confirm Action",
    children: "Are you sure you want to proceed with this operation?",
    footer: (
      <div style={{ display: "flex", gap: "8px" }}>
        <button style={{ padding: "6px 16px", borderRadius: "8px", background: "#27272a", color: "#a1a1aa", fontSize: "14px" }}>Cancel</button>
        <button style={{ padding: "6px 16px", borderRadius: "8px", background: "#0891b2", color: "white", fontSize: "14px" }}>Confirm</button>
      </div>
    ),
  },
};

export const Large: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    title: "Settings",
    size: "lg",
    children: (
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <p>This is a larger modal with more content space for complex forms or settings panels.</p>
        <p>It supports scrolling when content exceeds the viewport height.</p>
      </div>
    ),
  },
};
