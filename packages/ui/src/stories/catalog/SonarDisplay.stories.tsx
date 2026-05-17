import type { Meta, StoryObj } from "@storybook/react-vite";
import { SonarDisplay } from "../../components/catalog/sonar-display";

const meta = {
  title: "Catalog/WebUI/Visuals/SonarDisplay",
  component: SonarDisplay,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof SonarDisplay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
