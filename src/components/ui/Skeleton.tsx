import React from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

function SkeletonImpl({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[12px] bg-white/5 border border-white/5",
        className
      )}
      {...props}
    />
  );
}

export const Skeleton = React.memo(SkeletonImpl);
