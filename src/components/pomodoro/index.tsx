import { ResetButton } from "@/components/pomodoro/reset-button";
import { SettingsButton } from "@/components/pomodoro/settings-button";
import { SupportButton } from "@/components/pomodoro/support-button";
import { ThemeButton } from "@/components/pomodoro/theme-button";
import { TimerButton } from "@/components/pomodoro/timer-button";
import { Badge, type badgeVariants } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { usePomodoro } from "@/hooks/pomodoro/pomodoro-provider";
import { formatTimeUnit } from "@/lib/pomodoro/utils";
import type { VariantProps } from "class-variance-authority";
import { useMemo } from "react";

function Pomodoro(): React.ReactNode {
  const { pomodoroState, pomodoroSession, pomodoroTimer } = usePomodoro();

  const stateBadgeVariant: VariantProps<typeof badgeVariants>["variant"] = useMemo(() => {
    return "destructive";
  }, []);

  const sessionBadgeVariant: VariantProps<typeof badgeVariants>["variant"] = useMemo(() => {
    return "secondary";
  }, []);

  const timerMinutes: string = useMemo((): string => {
    return formatTimeUnit(pomodoroTimer.minutes);
  }, [pomodoroTimer.minutes]);

  const timerSeconds: string = useMemo((): string => {
    return formatTimeUnit(pomodoroTimer.seconds);
  }, [pomodoroTimer.seconds]);

  return (
    <Card>
      <CardHeader className="flex flex-row gap-2">
        <Badge variant={stateBadgeVariant}>{pomodoroState}</Badge>
        <Badge variant={sessionBadgeVariant}>Session {pomodoroSession}</Badge>
      </CardHeader>
      <CardContent className="justify-center items-center">
        <CardTitle className="font-extrabold text-7xl text-center mx-4">
          {timerMinutes}:{timerSeconds}
        </CardTitle>
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
