import type { Meta, StoryObj } from "@storybook/react-vite";
import { HolographicCard } from "../../components/catalog/holographic-card";

const meta = {
  title: "Catalog/WebUI/HolographicCard",
  component: HolographicCard,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Raw catalog component from web-ui gallery. Kept visually intact for pattern comparison before normalization.",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof HolographicCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const AlternateIdentity: Story = {
  args: {
    holder: "AGENTPING OPS",
    number: "9001  ****  ****  2048",
    expiry: "09/31",
  },
};
