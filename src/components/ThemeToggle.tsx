import { type Theme, useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleClick = () => {
    if (theme === "system") {
      const newTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "light" : "dark";

      setTheme(newTheme);
    } else {
      const newTheme: Theme = theme === "dark" ? "light" : "dark";
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
