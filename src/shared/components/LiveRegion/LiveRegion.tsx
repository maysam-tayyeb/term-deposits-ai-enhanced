import React from "react";

export interface LiveRegionProps {
  message: string;
  politeness?: "polite" | "assertive";
  atomic?: boolean;
  relevant?: "additions" | "removals" | "text" | "all";
  className?: string;
}

export function LiveRegion({
  message,
  politeness = "polite",
  atomic = true,
  relevant = "additions",
  className = "sr-only",
}: LiveRegionProps): React.JSX.Element {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant}
      className={className}
    >
      {message}
    </div>
  );
}
