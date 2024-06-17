"use client";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import InfoTooltip from "./InfoTooltip";
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

export default function Home() {
  type Settlement = {
    name: string;
    id: string;
    resources: [string, string, string];
    numbers: [number, number, number];
    upgraded: boolean;
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

  const [settlements, setSettlements] =
    useState<Settlement[]>(initialSettlements);
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

  useEffect(() => {
    const savedSettlements = localStorage.getItem("settlements");
    if (savedSettlements !== null) {
      setSettlements(JSON.parse(savedSettlements));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("settlements", JSON.stringify(settlements));
    calculateExpectation();
    calculateProbability();
    calculateResourceExpectations();
    updateRecommendedNumbers();
    searchRecommendedSettlement();
  }, [settlements]);

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
    else if (probability >= 13) return "D";
    else return "E";
  };

  const expectationToRank = (expectation: number) => {
    if (expectation >= 50) return "S";
    else if (expectation >= 40) return "A";
    else if (expectation >= 35) return "B";
    else if (expectation >= 26) return "C";
    else if (expectation >= 18) return "D";
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

  const handleCreateSettlement = () => {
    setSettlements([
      ...settlements,
      {
        name: `開拓地${settlements.length + 1}`,
        id: uuidv4(),
        resources: ["", "", ""],
        numbers: [0, 0, 0],
        upgraded: false,
      },
    ]);
  };

  const handleResourceChange = (id: string, index: number, value: string) => {
    setSettlements(
      settlements.map((settlement) =>
        settlement.id === id
          ? {
              ...settlement,
              resources: settlement.resources.map((res, idx) =>
                idx === index ? value : res
              ) as [string, string, string],
            }
          : settlement
      )
    );
  };

  const handleNumberChange = (id: string, index: number, value: number) => {
    setSettlements(
      settlements.map((settlement) =>
        settlement.id === id
          ? {
              ...settlement,
              numbers: settlement.numbers.map((num, idx) =>
                idx === index ? value : num
              ) as [number, number, number],
            }
          : settlement
      )
    );
  };

  const handleUpgradeSettlement = (id: string) => {
    setSettlements(
      settlements.map((settlement) =>
        settlement.id === id
          ? {
              ...settlement,
              upgraded: true,
            }
          : settlement
      )
    );
  };

  const handleDowngradeSettlement = (id: string) => {
    const confirmed = window.confirm("本当に開拓地に戻しますか？");
    if (confirmed)
      setSettlements(
        settlements.map((settlement) =>
          settlement.id === id
            ? {
                ...settlement,
                upgraded: false,
              }
            : settlement
        )
      );
  };

  const handleDeleteSettlement = (id: string) => {
    const confirmed = window.confirm("本当に開拓地を削除しますか？");
    if (confirmed)
      setSettlements(settlements.filter((settlement) => settlement.id !== id));
  };

  const handleResetSettlements = () => {
    const confirmed = window.confirm("本当に初期化を行いますか？");
    if (confirmed) {
      setSettlements(initialSettlements);
      localStorage.removeItem("settlements");
    }
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
    <main className="bg-custom-bg bg-cover bg-center">
      <header className="bg-blue-200 p-4 flex justify-around">
        <div className="text-3xl font-medium">カタン確率計算アプリ</div>
        {/* <div className="flex space-x-2">
          <p>日本語</p>
          <p>/</p>
          <p>English</p>
        </div> */}
      </header>

      <div className="flex h-screen justify-center bg-white">
        {/* 左側 */}
        <div className="w-1/2 p-4">
          <div>開拓地の情報から、資源取得確率や期待値を計算できます。</div>

          <div className="grid grid-cols-5 gap-4 place-items-center mt-6">
            <button className="button mb-2" onClick={handleCreateSettlement} data-testid = "addSettlementButton">
              開拓地を追加
            </button>
            <div className="text-xl font-medium">資源１</div>
            <div className="text-xl font-medium">資源２</div>
            <div className="text-xl font-medium">資源３</div>
            <button
              className="w-3/5 mb-4 bg-gray-500 hover:bg-red-700 text-white font-bold p-2 rounded"
              onClick={() => handleResetSettlements()}
            >
              初期化
            </button>
          </div>
          <div>
            {/* ここをmapで複数表示する */}
            {settlements.map((settlement) => (
              <div key={settlement.id} className="grid grid-cols-5 gap-4 mb-4">
                <input
                  type="text"
                  value={settlement.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setSettlements(
                      settlements.map((s) =>
                        s.id === settlement.id ? { ...s, name } : s
                      )
                    );
                  }}
                  className="border border-gray-300 rounded px-4 py-2 mb-2 h-1/2 w-4/5 place-self-center"
                  placeholder="開拓地"
                  data-testid = "settlementNameInput"
                />

                {settlement.resources.map((resource, index) => (
                  <div key={index} className="">
                    <select
                      value={resource}
                      onChange={(e) =>
                        handleResourceChange(
                          settlement.id,
                          index,
                          e.target.value
                        )
                      }
                      className="w-4/5 border border-gray-300 rounded px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      data-testid="resourceSelect"
                    >
                      <option value=""></option>
                      <option value="wood">木材</option>
                      <option value="bricks">レンガ</option>
                      <option value="wheat">小麦</option>
                      <option value="iron">鉄</option>
                      <option value="wool">羊毛</option>
                    </select>
                    <select
                      value={settlement.numbers[index]}
                      onChange={(e) =>
                        handleNumberChange(
                          settlement.id,
                          index,
                          Number(e.target.value)
                        )
                      }
                      className="w-4/5 border border-gray-300 rounded px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      data-testid="numberSelect"
                    >
                      <option value=""></option>
                      {Array.from({ length: 11 }, (_, i) => i + 2)
                        .filter((number) => number !== 7)
                        .map((number) => (
                          <option
                            key={number}
                            value={number}
                            className={`${
                              number === 6 || number === 8 ? "text-red-500" : ""
                            }`}
                          >
                            {number}
                          </option>
                        ))}
                    </select>
                  </div>
                ))}
                <div className="flex flex-col w-3/4 justify-center space-y-2">
                  {settlement.upgraded ? (
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white font-bold p-2 rounded"
                      onClick={() => handleDowngradeSettlement(settlement.id)}
                    >
                      都市
                    </button>
                  ) : (
                    <button
                      className="button"
                      onClick={() => handleUpgradeSettlement(settlement.id)}
                      data-testid="upgradeButton"
                    >
                      都市化
                    </button>
                  )}
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white font-bold p-2 rounded"
                    onClick={() => handleDeleteSettlement(settlement.id)}
                    data-testid="deleteButton"
                  >
                    消
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右側 */}
        <div className="w-1/2">
          <div className="text-2xl m-4">
            <InfoTooltip
              text="期待値"
              tooltipText="2から12の36通りの数字が出たときに、何枚の資源がもらえるかを表します"
            />{" "}
            : <span data-testid="expectedValue">{expectedValue}</span> (ランク
            {expectedValueRank})
          </div>
          <div className="text-2xl m-4">
            <InfoTooltip
              text="資源取得確率"
              tooltipText="ダイスを振ったときに資源が１枚以上もらえる確率を表します"
            />
            <span>
              {" "}
              : <span data-testid="probability">{probability}</span> / 36
              (ランク
              {probabilityRank})
            </span>
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
          <div className="text-2xl flex justify-center">
            <Bar data={ChartData} options={options} />
          </div>
        </div>
      </div>
    </main>
  );
}
