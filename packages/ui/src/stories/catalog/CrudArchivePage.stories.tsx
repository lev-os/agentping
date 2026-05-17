import type { Meta, StoryObj } from "@storybook/react-vite";
import { CrudArchivePage } from "../../components/catalog/crud-archive-page";
import { mockCrudConfig, mockCrudItems } from "../.storybook-helpers/mock-crud-decorator";

const meta: Meta<typeof CrudArchivePage> = {
  title: "Catalog/WebUI/Recipes/CrudArchivePage",
  component: CrudArchivePage,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof CrudArchivePage>;

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
