import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center px-2 py-0.5 text-xs font-mono font-semibold uppercase tracking-wider transition-colors shadow-[inset_0_1px_0_0_rgba(222,222,222,0.075)]',
  {
    variants: {
      variant: {
        default: 'bg-primary/20 text-primary border border-white/90',
        secondary: 'bg-secondary/20 text-secondary border border-secondary/90',
        success: 'bg-success/20 text-success border border-success/50',
        warning: 'bg-warning/20 text-warning border border-warning/50',
        destructive: 'bg-destructive/20 text-destructive border border-destructive/50',
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
