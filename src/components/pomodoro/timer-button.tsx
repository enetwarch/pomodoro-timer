import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { type Timer, usePomodoro } from "@/hooks/pomodoro/pomodoro-provider";
import { usePomodoroSettings } from "@/hooks/pomodoro/settings-provider";
import { calculateNewTimer, getNextStateAndSession, getSettingsKey, isTimerFinished } from "@/lib/pomodoro/utils";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function TimerButton(): React.ReactNode {
  const { pomodoroTimer, setPomodoroTimer, pomodoroState, setPomodoroState, pomodoroSession, setPomodoroSession } =
    usePomodoro();
  const { pomodoroSettings } = usePomodoroSettings();

  const [toggled, setToggled] = useState<boolean>(false);
  const tickIntervalId = useRef<NodeJS.Timeout>(undefined);

  useEffect((): (() => void) => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const handleSpaceKeyup = (event: KeyboardEvent): void => {
      if (event.code === "Space") {
        event.preventDefault();
        setToggled((prevToggled) => !prevToggled);
      }
    };

    document.addEventListener("keyup", handleSpaceKeyup);
    return () => document.removeEventListener("keyup", handleSpaceKeyup);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Only needs to change based on toggled state hook.
  useEffect((): void => {
    if (toggled) {
      const startingDate: Date = new Date();
      const startingTimer: Timer = structuredClone(pomodoroTimer);

      tickIntervalId.current = setInterval((): void => {
        const newTimer = calculateNewTimer(startingDate, startingTimer, Date.now());
        setPomodoroTimer(newTimer);
      }, 1000);
    } else {
      clearInterval(tickIntervalId.current);
    }
  }, [toggled]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Only needs the timer as dependency to check if it hit 00:00.
  useEffect((): void => {
    if (!isTimerFinished(pomodoroTimer)) return;

    const { state, session } = getNextStateAndSession(
      pomodoroState,
      pomodoroSession,
      pomodoroSettings.longBreakInterval,
    );

    setPomodoroState(state);
    setPomodoroSession(session);

    const settingsKey = getSettingsKey(state);
    const stateMinutes = pomodoroSettings[settingsKey];

    setPomodoroTimer({
      minutes: stateMinutes,
      seconds: 0,
    });

    if (Notification.permission === "granted") {
      const title = "Pomodoro Timer";
      const body = `${state} for ${stateMinutes} minutes.`;

      new Notification(title, { body });
    }

    setToggled(false);
  }, [pomodoroTimer]);

  const handlePress = (): void => {
    setToggled((prevToggled) => !prevToggled);
  };

  return (
    <Button variant="outline" size="icon" asChild>
      <Toggle variant="outline" pressed={toggled} onPressedChange={handlePress}>
        {toggled ? <Pause /> : <Play />}
        <span className="sr-only">Toggle Timer</span>
      </Toggle>
    </Button>
  );
}

export { TimerButton };
