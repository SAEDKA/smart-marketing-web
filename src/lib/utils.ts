import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(
  isoDate: string,
  locale: string = "en",
  options?: Intl.DateTimeFormatOptions
): string {
  try {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
      ...options,
    }).format(date);
  } catch {
    return isoDate;
  }
}
