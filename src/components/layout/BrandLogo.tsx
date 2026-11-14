import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The Smart Marketing brand mark — a glass speech bubble with a rising
 * growth arrow and an AI spark. Artwork: /public/brand/logo-icon.webp
 * (the browser-tab icon in src/app/icon.png is the same artwork).
 * It carries its own navy tile, so it drops into any header/sidebar
 * slot on both dark and light themes.
 */
export function BrandLogo({
  className,
  priority = false,
}: {
  className?: string;
  /** Set on above-the-fold placements (e.g. the landing header) so the
   *  mark preloads instead of triggering Next's LCP warning. */
  priority?: boolean;
}) {
  return (
    <Image
      src="/brand/logo-icon.webp"
      alt=""
      aria-hidden="true"
      width={512}
      height={512}
      draggable={false}
      priority={priority}
      className={cn("rounded-[24%] object-cover shrink-0 select-none", className)}
    />
  );
}
