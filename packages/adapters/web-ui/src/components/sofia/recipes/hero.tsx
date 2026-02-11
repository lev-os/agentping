import * as React from 'react'
import { cn } from '../../lib/utils'
import { Badge } from '../ui/Badge'
import { ShimmerText } from '../ui/ShimmerText'
import { GlowOrb } from '../ui/GlowOrb'

export type HeroBgType = 'grid' | 'shimmer' | 'gradient' | 'color' | 'transparent'

export interface HeroProps extends React.HTMLAttributes<HTMLElement> {
  /** Version badge text (e.g., "v1.0.0 // OPERATIONAL") */
  version?: string
  /** Main headline text */
  title: string
  /** Subtitle or tagline */
  subtitle?: string
  /** Array of feature tags to display */
  features?: Array<{
    label: string
    color?: 'cyan' | 'purple' | 'yellow' | 'green' | 'red'
  }>
  /** Title text size variant */
  titleSize?: 'md' | 'lg' | 'xl' | '2xl'
  /** Background type */
  bgType?: HeroBgType
  /** Glow animation speed (seconds) */
  glowSpeed?: number
  /** Custom content below features */
  children?: React.ReactNode
}

/**
 * Hero - Full-width hero section with SKYNET styling
 *
 * A recipe component that composes:
 * - ShimmerText for animated headline
 * - GlowOrb for atmospheric background effects
 * - Badge for version/status indicators
 *
 * Background types:
 * - grid: Grid pattern with subtle blur orbs (default)
 * - shimmer: Animated shimmer overlay
 * - gradient: Cyber gradient from primary to secondary
 * - color: Solid background color
 * - transparent: No background
 *
 * @example
 * ```tsx
 * <Hero
 *   version="v1.0.0 // OPERATIONAL"
 *   title="SKYNET DESIGN SYSTEM"
 *   subtitle="Cyberpunk/Military Tactical Aesthetic"
 *   bgType="grid"
 *   features={[
 *     { label: "ZERO RADIUS", color: "cyan" },
 *     { label: "NEON GLOW", color: "purple" },
 *   ]}
 * />
 * ```
 */
const Hero = React.forwardRef<HTMLElement, HeroProps>(
  (
    { className, version, title, subtitle, features = [], titleSize = 'xl', bgType = 'grid', glowSpeed = 12, children, ...props },
    ref
  ) => {
    // Feature tag colors mapping
    const featureColors = {
      cyan: 'bg-primary/20 text-primary border-primary/50',
      purple: 'bg-secondary/20 text-secondary border-secondary/50',
      yellow: 'bg-accent/20 text-accent border-accent/50',
      green: 'bg-success/20 text-success border-success/50',
      red: 'bg-destructive/20 text-destructive border-destructive/50',
    }

    // Show orbs for grid and shimmer bg types
    const showOrbs = bgType === 'grid' || bgType === 'shimmer'

    return (
      <header
        ref={ref}
        className={cn('relative py-16 md:py-24 px-6 md:px-8 text-center overflow-hidden', 'border-b border-border', className)}
        {...props}
      >
        {/* Background layer based on bgType */}
        {bgType === 'grid' && (
          <div
            className='absolute inset-0 bg-grid-pattern pointer-events-none'
            aria-hidden='true'
            style={{
              opacity: 0.6,
            }}
          />
        )}

        {bgType === 'shimmer' && (
          <div
            className='absolute inset-0 pointer-events-none'
            aria-hidden='true'
            style={{
              background:
                'linear-gradient(135deg, hsla(195, 100%, 50%, 0.03) 0%, transparent 50%, hsla(280, 100%, 60%, 0.03) 100%)',
              animation: 'shimmer-bg 8s ease-in-out infinite',
            }}
          />
        )}

        {bgType === 'gradient' && (
          <div
            className='absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-secondary/10 pointer-events-none'
            aria-hidden='true'
          />
        )}

        {bgType === 'color' && <div className='absolute inset-0 bg-background/80 pointer-events-none' aria-hidden='true' />}

        {/* Subtle blur orbs - over grid/shimmer, behind text (z-index 1) */}
        {showOrbs && (
          <div className='absolute inset-0 z-1 pointer-events-none' aria-hidden='true'>
            <GlowOrb
              color='cyan'
              size='2xl'
              intensity='subtle'
              blur='2xl'
              x='15%'
              y='25%'
              blendMode='screen'
              pulse
              pulseDuration={16}
            />
            <GlowOrb
              color='purple'
              size='xl'
              intensity='subtle'
              blur='2xl'
              x='85%'
              y='65%'
              blendMode='screen'
              pulse
              pulseDuration={20}
            />
            <GlowOrb
              color='cyan'
              size='lg'
              intensity='subtle'
              blur='xl'
              x='75%'
              y='20%'
              blendMode='screen'
              pulse
              pulseDuration={14}
            />
            <GlowOrb
              color='purple'
              size='md'
              intensity='subtle'
              blur='xl'
              x='25%'
              y='75%'
              blendMode='screen'
              pulse
              pulseDuration={18}
            />
          </div>
        )}

        {/* Content container - above everything (z-index 10) */}
        <div className='relative z-10 max-w-5xl mx-auto'>
          {/* Version badge */}
          {version && (
            <Badge variant='outline' className='mb-6 font-mono text-xs border-primary/30'>
              {version}
            </Badge>
          )}

          {/* Main headline with shimmer */}
          <h1 className='mb-6'>
            <ShimmerText size={titleSize} color='cyan' glowSpeed={glowSpeed} glow>
              {title}
            </ShimmerText>
          </h1>

          {/* Subtitle */}
          {subtitle && (
            <p className='font-body text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed'>
              {subtitle}
            </p>
          )}

          {/* Feature tags */}
          {features.length > 0 && (
            <div className='flex flex-wrap justify-center gap-3 md:gap-4'>
              {features.map((feature, index) => (
                <Badge
                  key={index}
                  className={cn('text-xs md:text-sm font-display tracking-wider', featureColors[feature.color || 'cyan'])}
                >
                  {feature.label}
                </Badge>
              ))}
            </div>
          )}

          {/* Custom content slot */}
          {children && <div className='mt-8'>{children}</div>}
        </div>
      </header>
    )
  }
)

Hero.displayName = 'Hero'

export { Hero }
