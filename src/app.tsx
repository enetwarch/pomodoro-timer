import PomodoroReset from "@/components/pomodoro-reset";
import PomodoroSettings from "@/components/pomodoro-settings";
import PomodoroToggle from "@/components/pomodoro-toggle";
import SupportButton from "@/components/support-button";
import ThemeToggle from "@/components/theme-toggle";
import { SettingsProvider } from "@/hooks/settings-provider";
import { ThemeProvider } from "@/hooks/theme-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function App(): React.ReactNode {
  return (
    <div className="min-h-screen w-full flex justify-center items-center duration-250">
      <ThemeProvider>
        <SettingsProvider>
          <Card>
            <CardHeader className="flex flex-row gap-2">
              <Badge variant="destructive">Work</Badge>
              <Badge variant="secondary">Session 1</Badge>
            </CardHeader>
            <CardContent className="justify-center items-center">
              <CardTitle className="font-extrabold text-7xl text-center mx-4">50:00</CardTitle>
            </CardContent>
            <CardFooter className="justify-center border-t gap-2">
              <SupportButton />
              <PomodoroReset />
              <PomodoroToggle />
              <PomodoroSettings />
              <ThemeToggle />
            </CardFooter>
          </Card>
        </SettingsProvider>
      </ThemeProvider>
    </div>
  );
}
