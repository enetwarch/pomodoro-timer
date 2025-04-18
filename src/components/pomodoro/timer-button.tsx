import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";

import { type Timer, usePomodoro } from "@/hooks/pomodoro/pomodoro-provider";
import { useSettings } from "@/hooks/pomodoro/settings-provider";
import { useToggled } from "@/hooks/pomodoro/toggled-provider";

import { calculateNewTimer, getNextSession, getNextState, getSettingsKey, isTimerFinished } from "@/lib/utils/pomodoro";

// External dependencies
import { Pause, Play } from "lucide-react";
import { useEffect, useRef } from "react";

function TimerButton(): React.ReactNode {
  // Custom hooks
  const { timer, setTimer, state, setState, session, setSession } = usePomodoro();
  const { settings } = useSettings();
  const { toggled, setToggled } = useToggled();

  // Used to toggle button clicks and focus when pressing spacebar.
  const toggleRef = useRef<HTMLButtonElement>(null);
  const tickIntervalId = useRef<NodeJS.Timeout>(undefined);

  useEffect((): (() => void) => {
    // Needs notification permission for when the timer finishes.
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    // toggleRef use case
    const handleSpaceKeyup = (event: KeyboardEvent): void => {
      if (event.code !== "Space") return;
      event.preventDefault();

      if (!toggleRef.current) {
        throw Error("toggleRef hook is unmounted.");
      }

      toggleRef.current.focus();
      toggleRef.current.click();
    };

    document.addEventListener("keyup", handleSpaceKeyup);
    return () => document.removeEventListener("keyup", handleSpaceKeyup);
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Only needs to change based on toggled state hook.
  useEffect((): void => {
    if (toggled) {
      const startingDate: Date = new Date();
      const startingTimer: Timer = structuredClone(timer);

      tickIntervalId.current = setInterval((): void => {
        const newTimer = calculateNewTimer(startingDate, startingTimer, Date.now());
        setTimer(newTimer);
      }, 1000);
    } else {
      clearInterval(tickIntervalId.current);
    }
  }, [toggled]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Only needs the timer as dependency to check if it hit 00:00.
  useEffect((): void => {
    if (!isTimerFinished(timer)) return;

    const nextState = getNextState(state, session, settings.longBreakInterval);
    const nextSession = getNextSession(state, session);

    setState(nextState);
    setSession(nextSession);

    const settingsKey = getSettingsKey(nextState);
    const stateMinutes = settings[settingsKey];

    setTimer({
      minutes: stateMinutes,
      seconds: 0,
    });

    if (Notification.permission === "granted") {
      const title = "Pomodoro Timer";
      const body = `${nextState} for ${stateMinutes} minutes.`;

      new Notification(title, { body });
    }

    setToggled(false);
  }, [timer]);

  return (
    <Button variant="outline" size="icon" asChild>
      <Toggle ref={toggleRef} variant="outline" pressed={toggled} onPressedChange={setToggled}>
        {toggled ? <Pause /> : <Play />}
        <span className="sr-only">Toggle Timer</span>
      </Toggle>
    </Button>
  );
}

export { TimerButton };
