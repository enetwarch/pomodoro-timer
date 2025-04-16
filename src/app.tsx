import { Pomodoro } from "@/components/pomodoro";
import { PomodoroProvider } from "@/hooks/pomodoro-provider";
import { SettingsProvider } from "@/hooks/settings-provider";
import { ThemeProvider } from "@/hooks/theme-provider";

export default function App(): React.ReactNode {
  return (
    <div className="min-h-screen w-full flex justify-center items-center duration-250">
      <ThemeProvider>
        <SettingsProvider>
          <PomodoroProvider>
            <Pomodoro />
          </PomodoroProvider>
        </SettingsProvider>
      </ThemeProvider>
    </div>
  );
}
