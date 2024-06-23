import React, { useEffect, useState, useRef } from "react";
import { useSettlements } from "../context/SettlementsContext";
import InfoTooltip from "./InfoTooltip";
import { Bar } from "react-chartjs-2";
import Chart, { BubbleDataPoint, Point } from "chart.js/auto";

const CalculationResultPanel = ({
  isNumericMode,
}: {
  isNumericMode: boolean;
}) => {
  const { settlements, setSettlements } = useSettlements();
  const [probability, setProbability] = useState<number>(0);
  const [probabilityRank, setProbabilityRank] = useState<string>("");
  const [expectedValue, setExpectedValue] = useState<number>(0);
  const [expectedValueRank, setExpectedValueRank] = useState<string>("");
  const [expectedValueForEachResource, setExpectedValueForEachResource] =
    useState<number[]>([]);
  const set = new Set<number>();
  const [recommendedNumbers, setRecommendedNumbers] = useState<number[]>([]);
  const [recommendedSettlementName, setRecommendedSettlementName] =
    useState<string>("");

  const chartRef = useRef<Chart<
    "bar",
    (number | Point | [number, number] | BubbleDataPoint | null)[],
    unknown
  > | null>(null);

  // 開拓地の情報が変更されるたびに再計算する
  useEffect(() => {
    calculateExpectation();
    calculateProbability();
    calculateResourceExpectations();
    updateRecommendedNumbers();
    searchRecommendedSettlement();
  }, [settlements]);

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.resize();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const numberToProbability = (number: number) => {
    if (number === 2 || number === 12) return 1;
    else if (number === 3 || number === 11) return 2;
    else if (number === 4 || number === 10) return 3;
    else if (number === 5 || number === 9) return 4;
    else if (number === 6 || number === 8) return 5;
    else return 0;
  };

  const probabilityToRank = (probability: number) => {
    if (probability >= 27) return "S";
    else if (probability >= 23) return "A";
    else if (probability >= 19) return "B";
    else if (probability >= 16) return "C";
    else return "D";
  };

  const expectationToRank = (expectation: number) => {
    if (expectation >= 60) return "S";
    else if (expectation >= 52) return "A";
    else if (expectation >= 44) return "B";
    else if (expectation >= 33) return "C";
    else if (expectation >= 24) return "D";
    else return "E";
  };

  const updateSet = () => {
    set.clear();
    settlements.forEach((settlement) => {
      for (let i = 0; i < settlement.numbers.length; i++) {
        if (settlement.numbers[i] !== 0 && settlement.resources[i] !== "")
          set.add(settlement.numbers[i]);
      }
    });
  };

  const calculateExpectation = () => {
    let sum = 0;
    settlements.forEach((settlement) => {
      settlement.numbers.forEach((number, index) => {
        if (
          settlement.resources[index] !== "" &&
          settlement.upgraded === false
        ) {
          sum += numberToProbability(number);
        } else if (
          settlement.resources[index] !== "" &&
          settlement.upgraded === true
        ) {
          sum += numberToProbability(number) * 2;
        }
      });
      setExpectedValue(sum);
      setExpectedValueRank(expectationToRank(sum));
    });
  };

  const calculateProbability = () => {
    updateSet();
    let sum = 0;
    set.forEach((number) => {
      sum += numberToProbability(number);
    });
    setProbability(sum);
    setProbabilityRank(probabilityToRank(sum));
  };

  const calculateResourceExpectations = () => {
    updateSet();
    let sum = 0;
    const expectedValueForEachResource: number[] = [0, 0, 0, 0, 0];
    set.forEach((number) => {
      sum += numberToProbability(number);
      settlements.forEach((settlement) => {
        settlement.numbers.forEach((num, index) => {
          if (num === number) {
            if (settlement.resources[index] === "wood") {
              expectedValueForEachResource[0] += numberToProbability(number);
              if (settlement.upgraded) {
                expectedValueForEachResource[0] += numberToProbability(number);
              }
            } else if (settlement.resources[index] === "bricks") {
              expectedValueForEachResource[1] += numberToProbability(number);
              if (settlement.upgraded) {
                expectedValueForEachResource[1] += numberToProbability(number);
              }
            } else if (settlement.resources[index] === "wheat") {
              expectedValueForEachResource[2] += numberToProbability(number);
              if (settlement.upgraded) {
                expectedValueForEachResource[2] += numberToProbability(number);
              }
            } else if (settlement.resources[index] === "iron") {
              expectedValueForEachResource[3] += numberToProbability(number);
              if (settlement.upgraded) {
                expectedValueForEachResource[3] += numberToProbability(number);
              }
            } else if (settlement.resources[index] === "wool") {
              expectedValueForEachResource[4] += numberToProbability(number);
              if (settlement.upgraded) {
                expectedValueForEachResource[4] += numberToProbability(number);
              }
            }
          }
        });
      });
    });
    setExpectedValueForEachResource(expectedValueForEachResource);
  };

  const updateRecommendedNumbers = () => {
    // ここでどの数字がおすすめか計算する
    let numbers = [2, 3, 4, 5, 6, 8, 9, 10, 11, 12];
    numbers = numbers.filter((number) => !set.has(number));
    numbers.sort((a, b) => numberToProbability(b) - numberToProbability(a));
    numbers = numbers.slice(0, 3);
    setRecommendedNumbers(numbers);
  };

  // アップグレードにおすすめの開拓地を探す
  const searchRecommendedSettlement = () => {
    let max = 0;
    let maxSettlementName = "";
    settlements.forEach((settlement) => {
      if (settlement.upgraded) return;
      else {
        let sum = 0;
        settlement.numbers.forEach((number, index) => {
          if (settlement.resources[index] !== "") {
            sum += numberToProbability(number);
          }
          if (sum > max) {
            max = sum;
            maxSettlementName = settlement.name;
          }
        });
      }
    });
    setRecommendedSettlementName(maxSettlementName);
  };

  const ChartData = {
    labels: ["木材", "レンガ", "小麦", "鉄", "羊毛"],
    datasets: [
      {
        label: "資源取得量",
        data: expectedValueForEachResource,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        title: {
          display: true,
        },
        ticks: {
          max: 20,
          stepSize: 5,
          beginAtZero: true,
        },
      },
    },
  };

  return (
    <>
      <div className="w-1/2 ml-4 mr-8">
        <div className="text-2xl m-4">
          <InfoTooltip
            text="期待値"
            tooltipText="2から12の36通りの数字が出たときに、何枚の資源がもらえるかを表します"
          />{" "}
          :{" "}
          {isNumericMode ? (
            <span data-testid="expectedValue">{expectedValue}</span>
          ) : (
            <span>ランク{expectedValueRank}</span>
          )}
        </div>
        <div className="text-2xl m-4">
          <InfoTooltip
            text="資源取得確率"
            tooltipText="ダイスを振ったときに資源が１枚以上もらえる確率を表します"
          />{" "}
          :{" "}
          {isNumericMode ? (
            <span data-testid="probability">{probability} / 36</span>
          ) : (
            <span>ランク{probabilityRank}</span>
          )}
        </div>
        <div className="text-2xl m-4">
          <InfoTooltip
            text="おすすめの数字"
            tooltipText="おすすめの開拓地の数字の場所を表します"
          />{" "}
          :{" "}
          <span data-testid="recommendedNumbers">
            {recommendedNumbers.join(", ")}
          </span>
        </div>
        <div className="text-2xl m-4">
          <InfoTooltip
            text="アップグレードにおすすめの開拓地"
            tooltipText="資源取得量からアップグレードにおすすめの開拓地を計算します。資源取得量のみを考慮しているのでお気をつけください"
          />{" "}
          : 「
          <span data-testid="recommendedSettlementName">
            {recommendedSettlementName}
          </span>
          」
        </div>
        <div
          className="text-2xl flex justify-center"
          style={{ height: "400px" }}
        >
          <Bar ref={chartRef} data={ChartData} options={options} />
        </div>
      </div>
    </>
  );
};

export default CalculationResultPanel;
