import type { Meta, StoryObj } from '@storybook/react-vite'
import { Hero } from '../../components/recipes/hero'
import { Button } from '../../components/ui/button'

/**
 * Hero - Full-width hero section with SKYNET cyberpunk styling.
 *
 * A recipe component that combines base components:
 * - **ShimmerText**: Animated headline with flowing glow
 * - **GlowOrb**: Atmospheric blurry background circles
 * - **Badge**: Status/version indicators
 *
 * Background types:
 * - **grid**: Grid pattern with subtle blur orbs (default)
 * - **shimmer**: Animated shimmer overlay with orbs
 * - **gradient**: Cyber gradient from primary to secondary
 * - **color**: Solid background
 * - **transparent**: No background
 */
const meta = {
  title: 'Recipes/Hero',
  component: Hero,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A full-width hero section with configurable background types. Uses grid pattern with blur orbs by default.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Main headline text displayed with glow animation',
    },
    subtitle: {
      control: 'text',
      description: 'Secondary text below the headline',
    },
    version: {
      control: 'text',
      description: 'Optional version/status badge content',
    },
    titleSize: {
      control: 'select',
      options: ['md', 'lg', 'xl', '2xl'],
      description: 'Size variant for the headline',
    },
    bgType: {
      control: 'select',
      options: ['grid', 'shimmer', 'gradient', 'color', 'transparent'],
      description: 'Background type - grid (default) shows grid pattern with blur orbs',
    },
    glowSpeed: {
      control: { type: 'range', min: 6, max: 30, step: 1 },
      description: 'Glow animation speed (seconds) - higher = slower',
    },
  },
} satisfies Meta<typeof Hero>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default hero with grid background and blur orbs.
 */
export const Default: Story = {
  args: {
    version: 'v1.0.0 // OPERATIONAL',
    title: 'SKYNET DESIGN SYSTEM',
    subtitle: 'Cyberpunk/Military Tactical Aesthetic for High-Performance Mission Control Interfaces',
    features: [
      { label: 'ZERO RADIUS', color: 'cyan' },
      { label: 'NEON GLOW', color: 'purple' },
      { label: 'GRID PATTERN', color: 'yellow' },
      { label: 'DARK MODE', color: 'green' },
    ],
    titleSize: 'xl',
    bgType: 'grid',
    glowSpeed: 12,
  },
}

/**
 * Grid background - the default with visible grid pattern and blur orbs.
 */
export const GridBackground: Story = {
  args: {
    title: 'GRID PATTERN',
    subtitle: 'Grid lines with subtle blur orbs overlay',
    bgType: 'grid',
    titleSize: 'xl',
    glowSpeed: 12,
  },
}

/**
 * Shimmer background with animated overlay.
 */
export const ShimmerBackground: Story = {
  args: {
    title: 'SHIMMER EFFECT',
    subtitle: 'Animated shimmer overlay with atmospheric orbs',
    bgType: 'shimmer',
    titleSize: 'xl',
    glowSpeed: 12,
  },
}

/**
 * Gradient background - cyber gradient.
 */
export const GradientBackground: Story = {
  args: {
    title: 'GRADIENT STYLE',
    subtitle: 'Smooth gradient from primary to secondary colors',
    bgType: 'gradient',
    titleSize: 'xl',
    glowSpeed: 12,
  },
}

/**
 * Solid color background.
 */
export const ColorBackground: Story = {
  args: {
    title: 'SOLID COLOR',
    subtitle: 'Simple solid background color',
    bgType: 'color',
    titleSize: 'xl',
    glowSpeed: 12,
  },
}

/**
 * Transparent background - just the content.
 */
export const TransparentBackground: Story = {
  args: {
    title: 'TRANSPARENT',
    subtitle: 'No background, just shimmer text and content',
    bgType: 'transparent',
    titleSize: 'xl',
    glowSpeed: 12,
  },
}

/**
 * Product launch hero with call-to-action buttons.
 */
export const ProductLaunch: Story = {
  args: {
    version: 'LAUNCHING NOW',
    title: 'SOFIA AGENT',
    subtitle: 'Self-Organizing Flight Intelligence Agent. The future of autonomous aviation.',
    features: [
      { label: 'NEURAL CONTROL', color: 'cyan' },
      { label: 'REAL-TIME', color: 'green' },
      { label: 'MISSION READY', color: 'purple' },
    ],
    titleSize: '2xl',
    bgType: 'grid',
    glowSpeed: 14,
  },
  render: (args) => (
    <Hero {...args}>
      <div className='flex flex-wrap justify-center gap-4 mt-4'>
        <Button size='lg'>GET STARTED</Button>
        <Button variant='outline' size='lg'>
          VIEW DOCS
        </Button>
      </div>
    </Hero>
  ),
}

/**
 * Feature announcement with focused messaging.
 */
export const FeatureAnnouncement: Story = {
  args: {
    version: 'NEW FEATURE',
    title: 'TACTICAL DASHBOARD',
    subtitle: 'Real-time telemetry visualization with military-grade precision',
    features: [
      { label: 'LIVE DATA', color: 'green' },
      { label: '20HZ UPDATES', color: 'cyan' },
    ],
    titleSize: 'lg',
    bgType: 'grid',
    glowSpeed: 10,
  },
}

/**
 * Error or warning state hero.
 */
export const AlertState: Story = {
  args: {
    version: '⚠ SYSTEM ALERT',
    title: 'CRITICAL UPDATE',
    subtitle: 'Emergency maintenance required. All systems standby.',
    features: [
      { label: 'PRIORITY: HIGH', color: 'red' },
      { label: 'ETA: 2 HOURS', color: 'yellow' },
    ],
    titleSize: 'lg',
    bgType: 'grid',
  },
}

/**
 * All background types comparison.
 */
export const AllBackgroundTypes: Story = {
  args: {
    title: 'COMPARISON',
  },
  render: () => (
    <div className='space-y-0 bg-background'>
      <Hero title='GRID' subtitle='Default - grid pattern with blur orbs' bgType='grid' titleSize='lg' className='border-none' />
      <Hero title='SHIMMER' subtitle='Animated shimmer with blur orbs' bgType='shimmer' titleSize='lg' className='border-none' />
      <Hero title='GRADIENT' subtitle='Cyber gradient background' bgType='gradient' titleSize='lg' className='border-none' />
      <Hero title='COLOR' subtitle='Solid color background' bgType='color' titleSize='lg' className='border-none' />
      <Hero title='TRANSPARENT' subtitle='No background' bgType='transparent' titleSize='lg' className='border-none' />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
}

/**
 * Different title sizes comparison.
 */
export const TitleSizes: Story = {
  args: {
    title: 'SIZES',
  },
  render: () => (
    <div className='space-y-12 bg-background py-8'>
      <Hero title='MEDIUM SIZE' titleSize='md' bgType='transparent' className='border-none py-8' />
      <Hero title='LARGE SIZE' titleSize='lg' bgType='transparent' className='border-none py-8' />
      <Hero title='EXTRA LARGE' titleSize='xl' bgType='transparent' className='border-none py-8' />
      <Hero title='2X LARGE' titleSize='2xl' bgType='transparent' className='border-none py-8' />
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
  },
}
