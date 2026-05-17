import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { FadeInOut } from "../../components/catalog/animations";

const meta: Meta<typeof FadeInOut> = {
  title: "Catalog/WebUI/Sofia/FadeInOut",
  component: FadeInOut,
  tags: ["autodocs"],
  argTypes: {
    show: { control: "boolean" },
    duration: { control: { type: "number", min: 50, max: 2000, step: 50 } },
  },
};
export default meta;
type Story = StoryObj<typeof FadeInOut>;

export const Default: Story = {
  args: {
    show: true,
    children: "Hello, I fade in and out!",
  },
};

export const Hidden: Story = {
  args: {
    show: false,
    children: "You can't see me",
  },
};

export const WithContent: Story = {
  args: {
    show: true,
    duration: 400,
    children: React.createElement(
      "div",
      {
        style: {
          padding: "1rem",
          borderRadius: "0.5rem",
          background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          color: "#e2e8f0",
          fontFamily: "monospace",
        },
      },
      React.createElement("h3", { style: { margin: "0 0 0.5rem" } }, "Notification"),
      React.createElement("p", { style: { margin: 0, opacity: 0.8 } }, "Agent task completed successfully.")
    ),
  },
};

export const SlowFade: Story = {
  args: {
    show: true,
    duration: 1000,
    children: "I fade in slowly over 1 second",
  },
};
