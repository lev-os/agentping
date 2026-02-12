import type { Meta, StoryObj } from '@storybook/react';
import { GallerySofiaSection } from '../components/gallery/GallerySofiaSection';

const meta: Meta<typeof GallerySofiaSection> = {
  title: 'Sofia/Gallery',
  component: GallerySofiaSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      disable: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {};
