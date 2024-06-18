// new_page.tsx

"use client";
import React, { useEffect, useRef, useState } from "react";
import { AppProps } from "next/app";
import { SettlementsProvider } from "../context/SettlementsContext";
import { v4 as uuidv4 } from "uuid";
import InfoTooltip from "./InfoTooltip";
import Header from "./header";
import ResourceInputPanel from "./resourceInputPanel";
import CalculationResultPanel from "./calculationResultPanel";
import { useSettlements, Settlement } from "../context/SettlementsContext";

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

export default function Home({ Component, pageProps }: AppProps) {
  const settlements = useSettlements().settlements;
  const setSettlements = useSettlements().setSettlements;

  const initialRender = useRef(true);

  useEffect(() => {
    const savedSettlements = localStorage.getItem("settlements");
    if (savedSettlements !== null && initialRender.current) {
      initialRender.current = false;
      setSettlements(JSON.parse(savedSettlements));
    }
  }, []);

  return (
    <SettlementsProvider>
      <main className="bg-custom-bg bg-cover bg-center">
        <Header />
        <div className="flex h-screen justify-center bg-white">
          <ResourceInputPanel />
          <CalculationResultPanel />
        </div>
      </main>
    </SettlementsProvider>
  );
}
