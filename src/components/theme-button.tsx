import { Button } from "@/components/ui/button";

import { useTheme } from "@/hooks/theme-provider";

// External dependencies
import { Moon, Sun } from "lucide-react";

function ThemeButton(): React.ReactNode {
  const { theme, setTheme } = useTheme();

  const handleClick = (): void => {
    if (theme === "system") {
      const newTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "light" : "dark";

      setTheme(newTheme);
    } else {
      const newTheme = theme === "dark" ? "light" : "dark";
      setTheme(newTheme);
    }
  };

  return (
    <Button variant="outline" size="icon" onClick={handleClick}>
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:inline" />
      <span className="sr-only">Toggle Theme</span>
    </Button>
  );
}

export { ThemeButton };
