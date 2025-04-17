import { PomodoroCard } from "@/components/pomodoro/pomodoro-card";
import { PomodoroProvider } from "@/hooks/pomodoro/pomodoro-provider";
import { SettingsProvider } from "@/hooks/pomodoro/settings-provider";
import { ThemeProvider } from "@/hooks/theme-provider";

function Pomodoro(): React.ReactNode {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <PomodoroProvider>
          <PomodoroCard />
        </PomodoroProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export { Pomodoro };
