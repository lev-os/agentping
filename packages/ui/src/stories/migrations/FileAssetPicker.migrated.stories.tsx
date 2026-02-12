import type { Meta, StoryObj } from "@storybook/react";
import { FileAssetPicker } from "../../components/migrations/file-asset-picker";

const meta: Meta<typeof FileAssetPicker> = {
  title: "Migrations/WebUI/FileAssetPicker",
  component: FileAssetPicker,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof FileAssetPicker>;

export const Default: Story = {
  args: {
    assets: [
      { id: "1", name: "photo.png", type: "image/png", size: "2.4 MB" },
      { id: "2", name: "report.pdf", type: "application/pdf", size: "1.1 MB" },
      { id: "3", name: "data.csv", type: "text/csv", size: "340 KB" },
    ],
    selected: "1",
  },
};
