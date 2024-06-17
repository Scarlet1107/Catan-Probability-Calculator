// src/context/SettlementsContext.tsx
import React, { createContext, useState, useContext, ReactNode } from "react";

export type Settlement = {
  name: string;
  id: string;
  resources: [string, string, string];
  numbers: [number, number, number];
  upgraded: boolean;
};

type SettlementsContextType = {
  settlements: Settlement[];
  setSettlements: React.Dispatch<React.SetStateAction<Settlement[]>>;
};

const SettlementsContext = createContext<SettlementsContextType | undefined>(
  undefined
);

export const SettlementsProvider = ({ children }: { children: ReactNode }) => {
  const [settlements, setSettlements] = useState<Settlement[]>([]);

  return (
    <SettlementsContext.Provider value={{ settlements, setSettlements }}>
      {children}
    </SettlementsContext.Provider>
  );
};

export const useSettlements = (): SettlementsContextType => {
  const context = useContext(SettlementsContext);
  if (!context) {
    throw new Error("useSettlements must be used within a SettlementsProvider");
  }
  return context;
};
