import type { Meta, StoryObj } from "@storybook/react-vite";
import { AccordionList } from "../../components/catalog/accordion-list";

const meta: Meta<typeof AccordionList> = {
  title: "Catalog/WebUI/AccordionList",
  component: AccordionList,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof AccordionList>;

export const Default: Story = {
  args: {
    items: [
      { id: "1", title: "Section One", content: "Content for section one" },
      { id: "2", title: "Section Two", content: "Content for section two" },
      { id: "3", title: "Section Three", content: "Content for section three" },
    ],
  },
};
