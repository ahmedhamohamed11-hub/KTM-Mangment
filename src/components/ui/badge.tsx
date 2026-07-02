import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/10 text-primary",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive/10 text-destructive",
        success: "border-transparent bg-[#16805c]/10 text-[#16805c] dark:bg-[#16805c]/20 dark:text-[#34d399]",
        warning: "border-transparent bg-[#c17a45]/10 text-[#c17a45] dark:bg-[#c17a45]/20 dark:text-[#fbbf24]",
        info: "border-transparent bg-[#5c63d1]/10 text-[#5c63d1] dark:bg-[#5c63d1]/20 dark:text-[#818cf8]",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
