import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        rik: 'border-white bg-[#6D00C0] text-white hover:bg-primary/80',
        debet:
          'border-white border-transparent bg-[#D12027] text-white hover:bg-primary/80',
        hit: 'border-white border-transparent bg-[#FFFC00] text-black hover:bg-primary/80',
        lucky88:
          'border-white border-transparent bg-[#53A7B6] text-white hover:bg-primary/80',
        may88:
          'border-white border-transparent bg-[#FA360D] text-white hover:bg-primary/80',
        sv88: 'border-white border-transparent bg-[#F68323] text-white hover:bg-primary/80',
        xo88: 'border-white border-transparent bg-[#FDFE67] text-white hover:bg-primary/80',
        uk88: 'border-white border-transparent bg-[#3CDCA1] text-white hover:bg-primary/80',
        mu99: 'border-white border-transparent bg-[#E32C22] text-white hover:bg-primary/80',
        ta88: 'border-white border-transparent bg-[#FFA619] text-white hover:bg-primary/80',
        sunwin:
          'border-white border-transparent bg-[#FFA619] text-white hover:bg-primary/80',
        one88:
          'border-white border-transparent bg-[#244ED6] text-white hover:bg-primary/80',
        zbet: 'border-white border-transparent bg-[#5ECB33] text-white hover:bg-primary/80',
        five88:
          'border-white border-transparent bg-[#53A7B6] text-white hover:bg-primary/80',
        oxbet:
          'border-white border-transparent bg-[#FFA619] text-white hover:bg-primary/80',
        m11bet:
          'border-white border-transparent bg-[#E32C22] text-white hover:bg-primary/80',
        red88:
          'border-white border-transparent bg-[#E32C22] text-white hover:bg-primary/80',
        b52: 'border-white border-transparent bg-[#A5B72F] text-white hover:bg-primary/80',
        lode88:
          'border-white border-transparent bg-[#D01C2D] text-white hover:bg-primary/80',
        sky88:
          'border-white border-transparent bg-[#203374] text-white hover:bg-primary/80',
        default:
          'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
