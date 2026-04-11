import type { Meta, StoryObj } from "@storybook/react-vite";
import { LandingPage } from "../../components/migrations/landing-page";

const meta: Meta<typeof LandingPage> = {
  title: "Migrations/WebUI/LandingPage",
  component: LandingPage,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof LandingPage>;

export const Default: Story = {
  args: {},
};
