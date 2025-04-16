import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";
const defaultTheme = "system";

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

type ThemeProviderProps = {
  children: React.ReactNode;
  storageKey?: string;
};

function ThemeProvider({ children, storageKey = "theme", ...props }: ThemeProviderProps): React.ReactNode {
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

  const value: ThemeProviderState = {
    theme,
    setTheme: (theme: Theme): void => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

const useTheme = (): ThemeProviderState => {
  const context: ThemeProviderState | undefined = useContext(ThemeProviderContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

export { ThemeProvider, useTheme };
