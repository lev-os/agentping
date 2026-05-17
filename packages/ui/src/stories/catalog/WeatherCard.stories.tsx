import type { Meta, StoryObj } from "@storybook/react-vite";
import { WeatherCard } from "../../components/catalog/weather-card";

const meta = {
  title: "Catalog/WebUI/Root/WeatherCard",
  component: WeatherCard,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof WeatherCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { temperature: 22, condition: "sunny", location: "San Francisco", unit: "C" } };

export const Stormy: Story = { args: { temperature: 8, condition: "stormy", location: "London", unit: "C" } };

export const Snowy: Story = { args: { temperature: -5, condition: "snowy", location: "Oslo", unit: "C" } };
