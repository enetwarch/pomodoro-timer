import type React from "react";
import { createContext, useContext, useState } from "react";

type Settings = {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number;
};

type SettingsProviderState = {
  pomodoroSettings: Settings;
  setPomodoroSettings: (settings: Settings) => void;
};

const defaultSettings: Settings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 30,
  longBreakInterval: 4,
};

const SettingsProviderContext = createContext<SettingsProviderState | undefined>(undefined);

type SettingsProviderProps = {
  children: React.ReactNode;
  storageKey?: string;
};

function SettingsProvider({ children, storageKey = "settings", ...props }: SettingsProviderProps): React.ReactNode {
  const [pomodoroSettings, setPomodoroSettings] = useState<Settings>((): Settings => {
    const storedSettings: string | null = localStorage.getItem(storageKey);
    if (!storedSettings) {
      return defaultSettings;
    }

    const parsedSettings: Settings = JSON.parse(storedSettings);
    return parsedSettings;
  });

  const value: SettingsProviderState = {
    pomodoroSettings,
    setPomodoroSettings: (settings: Settings): void => {
      localStorage.setItem(storageKey, JSON.stringify(settings));
      setPomodoroSettings(settings);
    },
  };

  return (
    <SettingsProviderContext.Provider value={value} {...props}>
      {children}
    </SettingsProviderContext.Provider>
  );
}

const usePomodoroSettings = (): SettingsProviderState => {
  const context: SettingsProviderState | undefined = useContext(SettingsProviderContext);
  if (!context) {
    throw Error("useSettings must be used within a SettingsProvider");
  }

  return context;
};

export { type Settings, SettingsProvider, usePomodoroSettings };
