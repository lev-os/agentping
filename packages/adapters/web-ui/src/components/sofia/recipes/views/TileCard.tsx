'use client'

import * as React from 'react'
import { cn } from '../../../../lib/utils'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../../ui/Card'
import { Badge } from '../../ui/Badge'
import { Button } from '../../ui/Button'
import type { TileCardConfig } from '../types'

interface TileCardProps<T> {
  item: T
  config: TileCardConfig<T>
  onAction?: (action: string, item: T) => void
  className?: string
}

export function TileCard<T extends Record<string, unknown>>({ item, config, onAction, className }: TileCardProps<T>) {
  const [expanded, setExpanded] = React.useState(false)

  // Extract values
  const title = item[config.title] as string
  const subtitle = config.subtitle
    ? typeof config.subtitle === 'function'
      ? config.subtitle(item)
      : (item[config.subtitle] as string)
    : undefined

  // Avatar/initials
  const avatarContent = config.avatar ? (
    <div className='w-10 h-10 flex items-center justify-center rounded border border-border bg-muted/20 font-mono text-xs font-semibold'>
      {config.avatar.type === 'initials' ? (
        <span className='text-primary'>
          {title
            .split(' ')
            .map((w) => w[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)}
        </span>
      ) : (
        <img src={item[config.avatar.field] as string} alt={title} className='w-full h-full object-cover rounded' />
      )}
    </div>
  ) : null

  return (
    <Card className={cn('hover:border-primary/50 transition-colors', className)}>
      <CardHeader className='pb-3'>
        <div className='flex items-start gap-3'>
          {avatarContent}
          <div className='flex-1 min-w-0'>
            <CardTitle className='text-sm font-display uppercase tracking-wider'>{title}</CardTitle>
            {subtitle && <CardDescription className='text-xs mt-1'>{subtitle}</CardDescription>}
          </div>
        </div>
      </CardHeader>

      <CardContent className='space-y-3'>
        {/* Badges */}
        {config.badges && config.badges.length > 0 && (
          <div className='flex flex-wrap gap-2'>
            {config.badges.map((badge, idx) => {
              const value = item[badge.field]
              if (!value) return null
              return (
                <Badge key={idx} variant={badge.variant || 'outline'} className='text-xs'>
                  {String(value)}
                </Badge>
              )
            })}
          </div>
        )}

        {/* Stats */}
        {config.stats && config.stats.length > 0 && (
          <div className='grid grid-cols-2 gap-2 text-xs'>
            {config.stats.map((stat, idx) => {
              const value = item[stat.field]
              const Icon = stat.icon
              return (
                <div key={idx} className='flex items-center gap-2 p-2 bg-muted/20 rounded border border-border/50'>
                  {Icon && (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    React.createElement(Icon as React.ComponentType<any>, { className: 'w-3 h-3 text-muted-foreground' })
                  )}
                  <div className='flex-1 min-w-0'>
                    <div className='text-muted-foreground text-[10px] uppercase tracking-wider'>{stat.label}</div>
                    <div className='font-mono text-primary mt-0.5'>{String(value)}</div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>

      <CardFooter className='flex items-center justify-between pt-3 border-t border-border/50'>
        {config.primaryAction && (
          <Button variant='outline' size='sm' onClick={() => onAction?.(config.primaryAction!.action, item)} className='text-xs'>
            {config.primaryAction.label}
          </Button>
        )}
        {config.expandable && (
          <Button variant='ghost' size='sm' onClick={() => setExpanded(!expanded)} className='text-xs'>
            {expanded ? 'Less' : 'More'}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
