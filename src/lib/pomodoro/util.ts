import type { Session, State, Timer } from "@/hooks/pomodoro/pomodoro-provider";
import type { Settings } from "@/hooks/pomodoro/settings-provider";

function formatTimeUnit(time: number): string {
  return time.toString().padStart(2, "0");
}

function calculateNewTimer(startingDate: Date, startingTimer: Timer, currentTime: number): Timer {
  const startingTime: number = startingDate.getTime();
  const elapsedTime = currentTime - startingTime;

  const totalElapsedSeconds = Math.floor(elapsedTime / 1000);
  const totalStartingSeconds = startingTimer.minutes * 60 + startingTimer.seconds;
  const remainingSeconds = totalStartingSeconds - totalElapsedSeconds;

  return {
    minutes: Math.floor(remainingSeconds / 60),
    seconds: remainingSeconds % 60,
  };
}

function isTimerFinished(timer: Timer): boolean {
  return timer.seconds < 0;
}

function getSettingsKey(pomodoroState: State): keyof Settings {
  switch (pomodoroState) {
    case "Work":
      return "workMinutes";
    case "Short Break":
      return "shortBreakMinutes";
    case "Long Break":
      return "longBreakMinutes";
  }
}

function getNextState(state: State, session: Session, interval: number): State {
  switch (state) {
    case "Work":
      if (session !== interval) return "Short Break";
      return "Long Break";
    case "Short Break":
    case "Long Break":
      return "Work";
  }
}

function getNextSession(state: State, session: Session): Session {
  switch (state) {
    case "Work":
      return session;
    case "Short Break":
      return session + 1;
    case "Long Break":
      return 1;
  }
}

export { formatTimeUnit, calculateNewTimer, isTimerFinished, getSettingsKey, getNextState, getNextSession };
