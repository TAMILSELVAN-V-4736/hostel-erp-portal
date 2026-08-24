import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
}

function Skeleton({
  className,
  width,
  height,
  borderRadius,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-800/50", className)}
      style={{ width, height, borderRadius, ...style }}
      {...props}
    />
  )
}

export { Skeleton }
