import type { Meta, StoryObj } from "@storybook/react-vite";
import { WelcomeScreen } from "../../components/catalog/welcome-screen";

const meta = {
  title: "Catalog/Studio/WelcomeScreen",
  component: WelcomeScreen,
  parameters: { layout: "fullscreen" },
  tags: ["autodocs"],
  decorators: [(Story) => <div style={{ height: "500px" }}><Story /></div>],
} satisfies Meta<typeof WelcomeScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { onStartSession: () => {} },
};

export const Loading: Story = {
  args: { isLoading: true },
};
