import React, { useEffect } from "react";
import { useAppSelector } from "./hooks/redux";
import { RootState } from "./store";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export { ThemeProvider, ThemeProvider as default };

function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useAppSelector((state: RootState) => state.ui.theme);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return <>{children}</>;
}
