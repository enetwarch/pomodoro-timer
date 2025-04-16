import PomodoroReset from "@/components/pomodoro-reset";
import PomodoroSettings from "@/components/pomodoro-settings";
import PomodoroToggle from "@/components/pomodoro-toggle";
import SupportButton from "@/components/support-button";
import ThemeProvider from "@/components/theme-provider";
import ThemeToggle from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function App() {
  return (
    <div className="min-h-screen w-full flex justify-center items-center duration-250">
      <Card>
        <CardHeader className="flex flex-row gap-2">
          <Badge variant="destructive">Work</Badge>
          <Badge variant="secondary">Session 1</Badge>
        </CardHeader>
        <CardContent className="justify-center items-center">
          <CardTitle className="font-extrabold text-7xl text-center">50:00</CardTitle>
        </CardContent>
        <CardFooter className="justify-center border-t gap-2">
          <SupportButton />
          <PomodoroReset />
          <PomodoroToggle />
          <PomodoroSettings />
          <ThemeProvider>
            <ThemeToggle />
          </ThemeProvider>
        </CardFooter>
      </Card>
    </div>
  );
}
