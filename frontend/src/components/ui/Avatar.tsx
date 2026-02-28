"use client";

import * as RadixAvatar from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  xs: "h-6 w-6 text-xs",
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-14 w-14 text-lg",
  xl: "h-20 w-20 text-2xl",
};

export function Avatar({ src, alt, fallback, size = "md", className }: AvatarProps) {
  const initials = fallback
    ? fallback.slice(0, 2).toUpperCase()
    : "??";

  return (
    <RadixAvatar.Root
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full",
        sizes[size],
        className
      )}
    >
      <RadixAvatar.Image
        src={src ?? undefined}
        alt={alt ?? "Avatar"}
        className="h-full w-full object-cover"
      />
      <RadixAvatar.Fallback
        className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 font-semibold text-white"
        delayMs={300}
      >
        {initials}
      </RadixAvatar.Fallback>
    </RadixAvatar.Root>
  );
}
