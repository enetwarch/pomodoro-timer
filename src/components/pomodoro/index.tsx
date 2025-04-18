import { PomodoroContextProvider } from "@/hooks/pomodoro/pomodoro-provider";
import { SettingsContextProvider } from "@/hooks/pomodoro/settings-provider";
import { ToggledContextProvider } from "@/hooks/pomodoro/toggled-provider";
import { ThemeContextProvider } from "@/hooks/theme-provider";

import { PomodoroCard } from "@/components/pomodoro/pomodoro-card";

function Pomodoro(): React.ReactNode {
  return (
    <ThemeContextProvider>
      <SettingsContextProvider>
        <PomodoroContextProvider>
          <ToggledContextProvider>
            <PomodoroCard />
          </ToggledContextProvider>
        </PomodoroContextProvider>
      </SettingsContextProvider>
    </ThemeContextProvider>
  );
}

export { Pomodoro };
