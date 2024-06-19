// src/context/SettlementsContext.tsx
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { v4 as uuidv4 } from "uuid";

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

const initialSettlements: Settlement[] = [
  {
    name: "開拓地1",
    id: uuidv4(),
    resources: ["", "", ""],
    numbers: [0, 0, 0],
    upgraded: false,
  },
  {
    name: "開拓地2",
    id: uuidv4(),
    resources: ["", "", ""],
    numbers: [0, 0, 0],
    upgraded: false,
  },
];

const SettlementsContext = createContext<SettlementsContextType | undefined>(
  undefined
);

export const SettlementsProvider = ({ children }: { children: ReactNode }) => {
  const [settlements, setSettlements] =
    useState<Settlement[]>(initialSettlements);

  useEffect(() => {
    localStorage.setItem("settlements", JSON.stringify(settlements));
  }, [settlements]);

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
