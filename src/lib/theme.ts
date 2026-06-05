/**
 * Framework-agnostic theme manager.
 *
 * `next-themes` is React-context based, which does not work across Astro
 * islands (each island is an isolated React root). This vanilla store drives
 * the `.dark` class on `<html>`, persists the user's choice, and notifies
 * subscribers — so independent islands (DitherShader, Pricing, ThemeSwitch)
 * all stay in sync. A React adapter lives in `use-theme.ts`.
 */
export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";
const THEME_EVENT = "themechange";

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "dark") return "dark";
  return "dark";
}

export function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === "system" ? getSystemTheme() : theme;
}

export function getResolvedTheme(): ResolvedTheme {
  if (typeof document !== "undefined") {
    return document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
  }
  return resolveTheme(getStoredTheme());
}

function applyResolvedTheme(resolved: ResolvedTheme): void {
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
}

export function setTheme(_theme: Theme): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
  applyResolvedTheme("dark");
  window.dispatchEvent(new CustomEvent(THEME_EVENT));
}

export function subscribe(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  const media = window.matchMedia("(prefers-color-scheme: dark)");

  const onSystemChange = (): void => {
    // Only react to the OS when the user is following the system theme.
    if (getStoredTheme() === "system") {
      applyResolvedTheme(getSystemTheme());
    }
    callback();
  };

  window.addEventListener(THEME_EVENT, callback);
  media.addEventListener("change", onSystemChange);

  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    media.removeEventListener("change", onSystemChange);
  };
}
