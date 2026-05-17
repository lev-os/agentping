import type { Meta, StoryObj } from "@storybook/react-vite";
import { CountdownWidget } from "../../components/catalog/countdown-widget";

const meta: Meta<typeof CountdownWidget> = {
  title: "Catalog/WebUI/CountdownWidget",
  component: CountdownWidget,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof CountdownWidget>;

export const Default: Story = {
  args: {
    targetDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    title: "Launch",
  },
};
