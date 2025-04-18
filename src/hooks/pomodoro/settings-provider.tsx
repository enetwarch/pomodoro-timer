// External dependencies
import type React from "react";
import { createContext, useContext, useState } from "react";

type Settings = {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number;
};

// Standard pomodoro timer according to Todoist.
// Source: https://www.todoist.com/productivity-methods/pomodoro-technique
const defaultSettings: Settings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 30,
  longBreakInterval: 4,
};

type SettingsContextType = {
  settings: Settings;
  setSettings: (settings: Settings) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

type SettingsContextProviderProps = {
  children: React.ReactNode;
  storageKey?: string;
};

function SettingsContextProvider({
  children,
  storageKey = "settings",
  ...props
}: SettingsContextProviderProps): React.ReactNode {
  const [settings, setSettings] = useState<Settings>((): Settings => {
    const storedSettings: string | null = localStorage.getItem(storageKey);
    if (!storedSettings) {
      return defaultSettings;
    }

    const parsedSettings: Settings = JSON.parse(storedSettings);
    return parsedSettings;
  });

  const value: SettingsContextType = {
    settings,
    setSettings: (settings: Settings): void => {
      localStorage.setItem(storageKey, JSON.stringify(settings));
      setSettings(settings);
    },
  };

  return (
    <SettingsContext.Provider value={value} {...props}>
      {children}
    </SettingsContext.Provider>
  );
}

const useSettings = (): SettingsContextType => {
  const context: SettingsContextType | undefined = useContext(SettingsContext);
  if (!context) {
    throw Error("useSettings must be used within a SettingsProvider");
  }

  return context;
};

export { type Settings, SettingsContextProvider, useSettings };
