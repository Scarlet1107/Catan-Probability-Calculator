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
  const [loading, setLoading] = useState(true);
  const [timeoutReached, setTimeoutReached] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    document.body.style.overflowY = "scroll"; // 常にスクロールバーを表示

    // Simulate loading process (e.g., data fetching)
    const loadTimer = setTimeout(() => {
      setLoadingComplete(true);
    }, 1000); // Simulating a loading process that takes 1 second

    const timeoutTimer = setTimeout(() => {
      setTimeoutReached(true);
    }, 2000); // Ensuring a minimum of 2 seconds loading time

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(timeoutTimer);
    };
  }, []);

  useEffect(() => {
    if (loadingComplete && timeoutReached) {
      setLoading(false);
    }
  }, [loadingComplete, timeoutReached]);

  if (loading) {
    return (
      <div className="bg-custom-bg bg-cover bg-center flex items-center justify-center h-screen">
        <div className="square-spin-1 mr-8"></div>
        <div className="text-5xl">Now Loading<span className="dots fixed font-bold"></span></div>
      </div>
    );
  } else {
    return (
      <SettlementsProvider>
        <CatanApp />
      </SettlementsProvider>
    );
  }
}

function CatanApp() {
  const { settlements, setSettlements } = useSettlements();
  const initialRender = useRef(true);
  const [isNumericMode, setIsNumericMode] = useState<boolean>(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const savedSettlements = localStorage.getItem("settlements");
    if (savedSettlements !== null && initialRender.current) {
      initialRender.current = false;
      setSettlements(JSON.parse(savedSettlements));
    }
  }, [setSettlements]);

  return (
    <main className="bg-custom-bg bg-cover bg-center h-screen">
      <div
        className={`opacity-0 ${
          isVisible ? "opacity-100" : ""
        } transition-opacity duration-1000`}
      >
        <Header
          isNumericMode={isNumericMode}
          setIsNumericMode={setIsNumericMode}
        />
        <div className="flex h-screen justify-center bg-white">
          <ResourceInputPanel />
          <CalculationResultPanel isNumericMode={isNumericMode} />
        </div>
      </div>
    </main>
  );
}
