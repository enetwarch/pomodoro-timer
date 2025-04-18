import { PomodoroContextProvider } from "@/hooks/pomodoro/pomodoro-provider";
import { SettingsProvider } from "@/hooks/pomodoro/settings-provider";
import { ToggledContextProvider } from "@/hooks/pomodoro/toggled-provider";
import { ThemeProvider } from "@/hooks/theme-provider";

import { PomodoroCard } from "@/components/pomodoro/pomodoro-card";

function Pomodoro(): React.ReactNode {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <PomodoroContextProvider>
          <ToggledContextProvider>
            <PomodoroCard />
          </ToggledContextProvider>
        </PomodoroContextProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

export { Pomodoro };
