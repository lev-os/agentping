import type { Meta, StoryObj } from "@storybook/react-vite";
import { CrudListPage } from "../../components/catalog/crud-list-page";
import { mockCrudConfig, mockCrudItems } from "../.storybook-helpers/mock-crud-decorator";

const meta: Meta<typeof CrudListPage> = {
  title: "Catalog/WebUI/Recipes/CrudListPage",
  component: CrudListPage,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof CrudListPage>;

export const Default: Story = {
  args: {
    config: mockCrudConfig,
    initialItems: mockCrudItems,
  },
};

export const Empty: Story = {
  args: {
    config: mockCrudConfig,
    initialItems: [],
  },
};
