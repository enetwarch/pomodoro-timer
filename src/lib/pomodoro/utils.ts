import type { Session, State, Timer } from "@/hooks/pomodoro/pomodoro-provider";
import type { Settings } from "@/hooks/pomodoro/settings-provider";

const MILLISECOND = 1;
const SECOND = 1000 * MILLISECOND;
const MINUTE = 60 * SECOND;

export function formatTimeUnit(time: number): string {
  return time.toString().padStart(2, "0");
}

export function calculateNewTimer(startingDate: Date, startingTimer: Timer): Timer {
  const startingTime: number = startingDate.getTime();
  const currentTime: number = Date.now();

  const elapsedTime = currentTime - startingTime;
  const elapsedMinutes = Math.floor(elapsedTime / MINUTE);
  const elapsedSeconds = Math.floor((elapsedTime % MINUTE) / SECOND);

  const totalElapsedSeconds = elapsedMinutes * 60 + elapsedSeconds;
  const totalStartingSeconds = startingTimer.minutes * 60 + startingTimer.seconds;
  const remainingSeconds = totalStartingSeconds - totalElapsedSeconds;

  return {
    minutes: Math.floor(remainingSeconds / 60),
    seconds: remainingSeconds % 60,
  };
}

export function isTimerFinished(timer: Timer): boolean {
  return timer.minutes < 0 || timer.seconds < 0;
}

export function getSettingsKey(pomodoroState: State): keyof Settings {
  switch (pomodoroState) {
    case "Work":
      return "workMinutes";
    case "Short Break":
      return "shortBreakMinutes";
    case "Long Break":
      return "longBreakMinutes";
  }
}

type StateAndSession = {
  state: State;
  session: Session;
};

export function getNextStateAndSession(state: State, session: Session, longBreakInterval: number): StateAndSession {
  const nextState: State = ((): State => {
    switch (state) {
      case "Work":
        if (session !== longBreakInterval) {
          return "Short Break";
        }
        return "Long Break";
      case "Short Break":
      case "Long Break":
        return "Work";
    }
  })();

  const nextSession: Session = ((): Session => {
    switch (state) {
      case "Work":
        return session;
      case "Short Break":
        return session + 1;
      case "Long Break":
        return 1;
    }
  })();

  return {
    state: nextState,
    session: nextSession,
  };
}
