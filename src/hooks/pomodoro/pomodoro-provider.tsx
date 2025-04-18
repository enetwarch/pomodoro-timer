import { createContext, useContext, useEffect, useState as useReactState } from "react";

type State = "Work" | "Short Break" | "Long Break";
type Timer = { minutes: number; seconds: number };
type Session = number;
type Pomodoro = { state: State; timer: Timer; session: Session };

const defaultPomodoro: Pomodoro = {
  state: "Work",
  timer: { minutes: 25, seconds: 0 },
  session: 1,
};

type PomodoroContextType = {
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
  timer: Timer;
  setTimer: React.Dispatch<React.SetStateAction<Timer>>;
  session: Session;
  setSession: React.Dispatch<React.SetStateAction<Session>>;
};

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

type PomodoroContextProviderProps = {
  children: React.ReactNode;
  storageKey?: string;
};

function PomodoroContextProvider({
  children,
  storageKey = "pomodoro",
  ...props
}: PomodoroContextProviderProps): React.ReactNode {
  const pomodoro: Pomodoro = ((): Pomodoro => {
    const storedPomodoro = localStorage.getItem(storageKey);
    if (!storedPomodoro) {
      return defaultPomodoro;
    }

    const parsedPomodoro: Pomodoro = JSON.parse(storedPomodoro);
    return parsedPomodoro;
  })();

  const [state, setState] = useReactState(pomodoro.state);
  const [timer, setTimer] = useReactState(pomodoro.timer);
  const [session, setSession] = useReactState(pomodoro.session);

  useEffect(() => {
    const savePomodoro = (): void => {
      const pomodoro: Pomodoro = { state, timer, session };

      localStorage.setItem(storageKey, JSON.stringify(pomodoro));
    };

    const saveInterval: NodeJS.Timeout = setInterval(savePomodoro, 1000 * 60);
    window.addEventListener("beforeunload", savePomodoro);

    return () => {
      clearInterval(saveInterval);
      window.removeEventListener("beforeunload", savePomodoro);
    };
  });

  const value: PomodoroContextType = {
    state,
    setState,
    timer,
    setTimer,
    session,
    setSession,
  };

  return (
    <PomodoroContext.Provider value={value} {...props}>
      {children}
    </PomodoroContext.Provider>
  );
}

const usePomodoro = (): PomodoroContextType => {
  const context: PomodoroContextType | undefined = useContext(PomodoroContext);
  if (!context) {
    throw Error("usePomodoro must be used within a PomodoroContextProvider.");
  }

  return context;
};

export { PomodoroContextProvider, usePomodoro, type Timer, type State, type Session };
