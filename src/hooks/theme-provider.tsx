// External dependencies
import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";
const defaultTheme = "system";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeContextProviderProps = {
  children: React.ReactNode;
  storageKey?: string;
};

function ThemeContextProvider({
  children,
  storageKey = "theme",
  ...props
}: ThemeContextProviderProps): React.ReactNode {
  const [theme, setTheme] = useState<Theme>((): Theme => {
    return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
  });

  useEffect((): void => {
    const root: HTMLElement = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme: Theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    setTheme: (theme: Theme): void => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeContext.Provider value={value} {...props}>
      {children}
    </ThemeContext.Provider>
  );
}

const useTheme = (): ThemeContextType => {
  const context: ThemeContextType | undefined = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

export { ThemeContextProvider, useTheme };
