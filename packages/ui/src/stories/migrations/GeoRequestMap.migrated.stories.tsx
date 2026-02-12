import type { Meta, StoryObj } from "@storybook/react";
import { GeoRequestMap } from "../../components/migrations/geo-request-map";

const meta: Meta<typeof GeoRequestMap> = {
  title: "Migrations/WebUI/GeoRequestMap",
  component: GeoRequestMap,
  tags: ["autodocs"],
};
export default meta;
type Story = StoryObj<typeof GeoRequestMap>;

export const Default: Story = {
  args: {
    points: [
      { lat: 37.7749, lng: -122.4194, label: "San Francisco" },
      { lat: 40.7128, lng: -74.006, label: "New York" },
      { lat: 51.5074, lng: -0.1278, label: "London" },
    ],
  },
};
