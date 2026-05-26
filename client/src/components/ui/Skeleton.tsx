import React from "react";
import { cn } from "../../lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
}

export function Skeleton({ className, variant = "rectangular", ...props }: SkeletonProps) {
  return (
    <div
      {...props}
      className={cn(
        "animate-shimmer",
        variant === "circular" && "rounded-full",
        variant === "rectangular" && "rounded-2xl",
        variant === "text" && "rounded-lg h-3.5 w-full",
        className
      )}
    />
  );
}

export function ApplicationSkeleton() {
  return (
    <div className="flex items-center gap-4 p-5 border-b border-slate-100/60 last:border-0 hover:bg-slate-50/40 transition-colors">
      <Skeleton variant="circular" className="w-11 h-11 shrink-0 shadow-sm" />
      <div className="flex-1 space-y-2.5">
        <Skeleton variant="text" className="w-1/3 h-4" />
        <Skeleton variant="text" className="w-1/2 h-3 opacity-60" />
      </div>
      <Skeleton className="w-28 h-7 rounded-full shadow-sm" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" className="w-12 h-12 shadow-sm" />
        <div className="space-y-2.5 flex-1">
          <Skeleton variant="text" className="w-1/2 h-4" />
          <Skeleton variant="text" className="w-1/4 h-3 opacity-60" />
        </div>
      </div>
      <Skeleton className="h-28 w-full rounded-2xl shadow-sm" />
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden w-full">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <Skeleton className="h-5 w-48 rounded-lg" />
        <Skeleton className="h-9 w-32 rounded-xl" />
      </div>
      <div className="p-6 space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-6 py-3 border-b border-slate-100/60 last:border-0">
            {Array.from({ length: cols }).map((_, j) => (
              <Skeleton
                key={j}
                className={cn(
                  "h-4 rounded-lg",
                  j === 0 ? "w-1/4" : j === 1 ? "w-1/3" : j === 2 ? "w-1/6" : "w-12"
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3.5">
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-1/2 rounded-md" />
            <Skeleton variant="circular" className="w-5 h-5 opacity-40" />
          </div>
          <Skeleton className="h-8 w-2/3 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
