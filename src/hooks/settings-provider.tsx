import React, { createContext, useContext, useState } from "react";

type Settings = {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number;
};

type SettingsProviderState = {
  settings: Settings;
  setSettings: (settings: Settings) => void;
};

const defaultSettings: Settings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 30,
  longBreakInterval: 4,
};

const defaultSettingsProviderState: SettingsProviderState = {
  settings: defaultSettings,
  setSettings: () => null,
};

const SettingsProviderContext = createContext<SettingsProviderState>(defaultSettingsProviderState);

type SettingsProviderProps = {
  children: React.ReactNode;
  defaultSettings?: Settings;
  storageKey?: string;
};

export function SettingsProvider({
  children,
  defaultSettings = defaultSettingsProviderState.settings,
  storageKey = "settings",
  ...props
}: SettingsProviderProps): React.ReactNode {
  const [settings, setSettings] = useState<Settings>((): Settings => {
    const storedSettings: string | null = localStorage.getItem(storageKey);
    if (!storedSettings) {
      return defaultSettings;
    }

    const parsedSettings: Settings = JSON.parse(storedSettings);
    return parsedSettings;
  });

  const value: SettingsProviderState = {
    settings,
    setSettings: (settings: Settings): void => {
      localStorage.setItem(storageKey, JSON.stringify(settings));
      setSettings(settings);
    },
  };

  return (
    <SettingsProviderContext.Provider value={value} {...props}>
      {children}
    </SettingsProviderContext.Provider>
  );
}

export const useSettings = (): SettingsProviderState => {
  const context: SettingsProviderState = useContext(SettingsProviderContext);
  if (!context) {
    throw Error("useSettings must be used within a SettingsProvider");
  }

  return context;
};
