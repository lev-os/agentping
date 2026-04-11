// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/migrations/card";

const meta: Meta<typeof Card> = {
  title: "Migrations/WebUI/Sofia/Card",
  component: Card,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Agent Status</CardTitle>
        <CardDescription>Current operational metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">All systems nominal.</p>
      </CardContent>
    </Card>
  ),
};
