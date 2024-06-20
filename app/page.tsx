"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  SettlementsProvider,
  useSettlements,
} from "../context/SettlementsContext";
import Header from "./header";
import ResourceInputPanel from "./resourceInputPanel";
import CalculationResultPanel from "./calculationResultPanel";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function App() {
  return (
    <SettlementsProvider>
      <CatanApp />
    </SettlementsProvider>
  );
}

function CatanApp() {
  const { settlements, setSettlements } = useSettlements();
  const initialRender = useRef(true);
  const [isNumericMode, setIsNumericMode] = useState<boolean>(true);

  useEffect(() => {
    const savedSettlements = localStorage.getItem("settlements");
    if (savedSettlements !== null && initialRender.current) {
      initialRender.current = false;
      setSettlements(JSON.parse(savedSettlements));
    }
  }, []);

  return (
    <main className="bg-custom-bg bg-cover bg-center">
      <Header isNumericMode = {isNumericMode} setIsNumericMode = {setIsNumericMode}/>
      <div className="flex h-screen justify-center bg-white">
        <ResourceInputPanel />
        <CalculationResultPanel isNumericMode = {isNumericMode}/>
      </div>
    </main>
  );
}
