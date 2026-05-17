import type { Meta, StoryObj } from "@storybook/react-vite";
import { LandingPage } from "../../components/catalog/landing-page";

const meta: Meta<typeof LandingPage> = {
  title: "Catalog/WebUI/LandingPage",
  component: LandingPage,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof LandingPage>;

export const Default: Story = {
  args: {},
};
