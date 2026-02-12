import type { Meta, StoryObj } from "@storybook/react";
import { EnrichmentPanel } from "../../components/migrations/enrichment-panel";

const meta: Meta<typeof EnrichmentPanel> = {
  title: "Migrations/WebUI/EnrichmentPanel",
  component: EnrichmentPanel,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof EnrichmentPanel>;

export const Default: Story = {
  args: {},
};
