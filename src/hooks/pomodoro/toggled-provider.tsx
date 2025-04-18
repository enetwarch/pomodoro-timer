// External dependencies
import type React from "react";
import { createContext, useContext, useState } from "react";

type ToggledContextType = {
  toggled: boolean;
  setToggled: React.Dispatch<React.SetStateAction<boolean>>;
};

const ToggledContext = createContext<ToggledContextType | undefined>(undefined);

type ToggledContextProviderProps = {
  children: React.ReactNode;
};

function ToggledContextProvider({ children }: ToggledContextProviderProps): React.ReactNode {
  const [toggled, setToggled] = useState<boolean>(false);
  const value: ToggledContextType = { toggled, setToggled };

  return <ToggledContext.Provider value={value}>{children}</ToggledContext.Provider>;
}

// Used for toggling the timer on and off.
const useToggled = (): ToggledContextType => {
  const context: ToggledContextType | undefined = useContext(ToggledContext);
  if (!context) {
    throw Error("useToggled must be used within ToggledContextProvider");
  }

  return context;
};

export { ToggledContextProvider, useToggled };
