import type { Meta, StoryObj } from "@storybook/react";
import { JsonDiff } from "../../components/migrations/json-diff";

const meta: Meta<typeof JsonDiff> = {
  title: "Migrations/WebUI/JsonDiff",
  component: JsonDiff,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof JsonDiff>;

export const Default: Story = {
  args: {
    oldJson: { name: "agent-1", status: "idle", version: "1.0.0" },
    newJson: { name: "agent-1", status: "running", version: "1.1.0", tasks: 3 },
  },
};
