// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, TabList, Tab, TabPanel } from "../../components/catalog/tabs";

const meta = {
  title: "Catalog/Studio/Tabs",
  component: Tabs,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { defaultTab: "layout" },
  render: (args) => (
    <Tabs {...args}>
      <TabList>
        <Tab id="layout">Layout</Tab>
        <Tab id="style">Style</Tab>
        <Tab id="advanced">Advanced</Tab>
      </TabList>
      <TabPanel id="layout">Layout properties content</TabPanel>
      <TabPanel id="style">Style properties content</TabPanel>
      <TabPanel id="advanced">Advanced settings content</TabPanel>
    </Tabs>
  ),
};
