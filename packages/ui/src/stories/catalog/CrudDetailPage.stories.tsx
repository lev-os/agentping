import type { Meta, StoryObj } from "@storybook/react-vite";
import { CrudDetailPage } from "../../components/catalog/crud-detail-page";
import { mockCrudConfig, mockCrudItems } from "../.storybook-helpers/mock-crud-decorator";

const meta: Meta<typeof CrudDetailPage> = {
  title: "Catalog/WebUI/Recipes/CrudDetailPage",
  component: CrudDetailPage,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof CrudDetailPage>;

export const Default: Story = {
  args: {
    config: mockCrudConfig,
    itemId: "1",
    initialItem: mockCrudItems[0],
  },
};

export const NotFound: Story = {
  args: {
    config: mockCrudConfig,
    itemId: "nonexistent",
  },
};
