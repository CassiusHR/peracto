import type { ReactNode } from "react";

export function SectionCorners(): ReactNode {
  return (
    <>
      <span
        aria-hidden="true"
        data-section-corner
        className="border-border bg-background pointer-events-none absolute bottom-0 left-0 z-10 h-[7px] w-[7px] -translate-x-1/2 translate-y-1/2 border"
      />
      <span
        aria-hidden="true"
        data-section-corner
        className="border-border bg-background pointer-events-none absolute right-0 bottom-0 z-10 h-[7px] w-[7px] translate-x-1/2 translate-y-1/2 border"
      />
    </>
  );
}
