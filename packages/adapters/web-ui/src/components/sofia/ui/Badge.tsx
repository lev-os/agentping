import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center px-2 py-0.5 text-xs font-mono font-semibold uppercase tracking-wider transition-colors shadow-[inset_0_1px_0_0_rgba(222,222,222,0.075)]',
  {
    variants: {
      variant: {
        default: 'bg-primary/20 text-primary border border-white/90',
        secondary: 'bg-secondary/20 text-secondary border border-secondary/90',
        success: 'bg-green-500/20 text-green-400 border border-green-500/50',
        warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50',
        destructive: 'bg-red-500/20 text-red-400 border border-red-500/50',
        outline:
          'border border-border text-foreground shadow-[inset_0_1px_0_0_rgba(222,222,222,0.02575),0_0_4px_rgba(222,222,222,0.215)]',
        ghost: 'text-muted-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  role?: string
  'aria-label'?: string
}

function Badge({ className, variant, role = 'status', ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} role={role} {...props} />
}

export { Badge, badgeVariants }
