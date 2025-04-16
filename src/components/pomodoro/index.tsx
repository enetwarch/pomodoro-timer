import { ResetButton } from "@/components/pomodoro/reset-button";
import { SettingsButton } from "@/components/pomodoro/settings-button";
import { SupportButton } from "@/components/pomodoro/support-button";
import { ThemeButton } from "@/components/pomodoro/theme-button";
import { TimerButton } from "@/components/pomodoro/timer-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

function Pomodoro(): React.ReactNode {
  return (
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
        <ResetButton />
        <TimerButton />
        <SettingsButton />
        <ThemeButton />
      </CardFooter>
    </Card>
  );
}

export { Pomodoro };
