import { useSyncExternalStore } from "react";
import {
  getResolvedTheme,
  getStoredTheme,
  setTheme,
  subscribe,
  type ResolvedTheme,
  type Theme,
} from "@/lib/theme";

type UseThemeReturn = {
  theme: Theme;
  resolvedTheme: ResolvedTheme | undefined;
  setTheme: (theme: Theme) => void;
};

/**
 * Drop-in replacement for next-themes' `useTheme`, backed by the
 * framework-agnostic store in `theme.ts`. Returns `resolvedTheme`
 * `undefined` on the server / first paint so islands can avoid hydration
 * mismatches (mirrors next-themes behavior).
 */
export function useTheme(): UseThemeReturn {
  const resolvedTheme = useSyncExternalStore(
    subscribe,
    () => getResolvedTheme(),
    () => undefined,
  );

  const theme = useSyncExternalStore(
    subscribe,
    () => getStoredTheme(),
    () => "system" as Theme,
  );

  return { theme, resolvedTheme, setTheme };
}
