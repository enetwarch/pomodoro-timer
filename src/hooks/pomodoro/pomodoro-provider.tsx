import { createContext, useContext, useEffect, useState } from "react";

type State = "Work" | "Short Break" | "Long Break";
type Timer = { minutes: number; seconds: number };
type Session = number;
type Pomodoro = { state: State; timer: Timer; session: Session };

const defaultPomodoro: Pomodoro = {
  state: "Work",
  timer: { minutes: 25, seconds: 0 },
  session: 1,
};

type PomodoroProviderState = {
  pomodoroState: State;
  setPomodoroState: React.Dispatch<React.SetStateAction<State>>;
  pomodoroTimer: Timer;
  setPomodoroTimer: React.Dispatch<React.SetStateAction<Timer>>;
  pomodoroSession: Session;
  setPomodoroSession: React.Dispatch<React.SetStateAction<Session>>;
};

const PomodoroProviderContext = createContext<PomodoroProviderState | undefined>(undefined);

type SettingsProviderProps = {
  children: React.ReactNode;
  storageKey?: string;
};

function PomodoroProvider({ children, storageKey = "pomodoro", ...props }: SettingsProviderProps): React.ReactNode {
  const pomodoro: Pomodoro = ((): Pomodoro => {
    const storedPomodoro = localStorage.getItem(storageKey);
    if (!storedPomodoro) {
      return defaultPomodoro;
    }

    const parsedPomodoro: Pomodoro = JSON.parse(storedPomodoro);
    return parsedPomodoro;
  })();

  const [pomodoroState, setPomodoroState] = useState(pomodoro.state);
  const [pomodoroTimer, setPomodoroTimer] = useState(pomodoro.timer);
  const [pomodoroSession, setPomodoroSession] = useState(pomodoro.session);

  useEffect(() => {
    const savePomodoro = (): void => {
      const pomodoro: Pomodoro = {
        state: pomodoroState,
        timer: pomodoroTimer,
        session: pomodoroSession,
      };

      localStorage.setItem(storageKey, JSON.stringify(pomodoro));
    };

    const saveInterval: NodeJS.Timeout = setInterval(savePomodoro, 1000 * 60);
    window.addEventListener("beforeunload", savePomodoro);

    return () => {
      clearInterval(saveInterval);
      window.removeEventListener("beforeunload", savePomodoro);
    };
  });

  const value: PomodoroProviderState = {
    pomodoroState,
    setPomodoroState,
    pomodoroTimer,
    setPomodoroTimer,
    pomodoroSession,
    setPomodoroSession,
  };

  return (
    <PomodoroProviderContext.Provider value={value} {...props}>
      {children}
    </PomodoroProviderContext.Provider>
  );
}

const usePomodoro = (): PomodoroProviderState => {
  const context: PomodoroProviderState | undefined = useContext(PomodoroProviderContext);
  if (!context) {
    throw Error("usePomodoro must be used within a PomodoroProvider.");
  }

  return context;
};

export { PomodoroProvider, usePomodoro, type Timer, type State, type Session };
