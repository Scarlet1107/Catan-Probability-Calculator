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

  useEffect(() => {
    document.body.style.overflowY = "scroll"; // 常にスクロールバーを表示
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer); // クリーンアップ関数でタイマーをクリア
  }, []);

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
