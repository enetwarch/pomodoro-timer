import { PomodoroCard } from "@/components/pomodoro/pomodoro-card";
import { PomodoroProvider } from "@/hooks/pomodoro/pomodoro-provider";
import { SettingsProvider } from "@/hooks/pomodoro/settings-provider";
import { ThemeProvider } from "@/hooks/theme-provider";

function Pomodoro(): React.ReactNode {
  return (
    <div className="min-h-screen w-full flex justify-center items-center duration-250">
      <ThemeProvider>
        <SettingsProvider>
          <PomodoroProvider>
            <PomodoroCard />
          </PomodoroProvider>
        </SettingsProvider>
      </ThemeProvider>
    </div>
  );
}

export { Pomodoro };
