"use client";
import React, { useEffect, useRef } from "react";
import { AppProps } from "next/app";
import {
  Settlement,
  SettlementsProvider,
  useSettlements,
} from "../context/SettlementsContext";
import { v4 as uuidv4 } from "uuid";
import InfoTooltip from "./InfoTooltip";
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
import { Bar } from "react-chartjs-2";

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

  useEffect(() => {
    const savedSettlements = localStorage.getItem("settlements");
    if (savedSettlements !== null && initialRender.current) {
      initialRender.current = false;
      setSettlements(JSON.parse(savedSettlements));
    }
  }, []);

  return (
    <main className="bg-custom-bg bg-cover bg-center">
      <Header />
      <div className="flex h-screen justify-center bg-white">
        <ResourceInputPanel />
        <CalculationResultPanel />
      </div>
    </main>
  );
}
