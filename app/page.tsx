"use client";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
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
    id: number;
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
  const [expectedValue, setExpectedValue] = useState<number>(0);
  const resourseSelect = useState<string[]>([]);

  useEffect(() => {
    console.log("settlements = ", settlements);
    handleCalculateExpectation();
    handleCalculateProbability();
  }, [settlements]);

  const numberToProbability = (number: number) => {
    if (number === 2 || number === 12) return 1;
    else if (number === 3 || number === 11) return 2;
    else if (number === 4 || number === 10) return 3;
    else if (number === 5 || number === 9) return 4;
    else if (number === 6 || number === 8) return 5;
    else return 0;
  };

  const handleCalculateExpectation = () => {
    // 期待値の計算
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
    });
  };

  const handleCalculateProbability = () => {
    const set = new Set<number>();
    settlements.forEach((settlement) => {
      settlement.numbers.forEach((number) => {
        if (number !== 0) set.add(number);
      });
    });
    let sum = 0;
    set.forEach((number) => {
      sum += numberToProbability(number);
    });
    setProbability(sum);
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

  const handleResourceChange = (id: number, index: number, value: string) => {
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

  const handleNumberChange = (id: number, index: number, value: number) => {
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

  const handleUpgradeSettlement = (id: number) => {
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

  const handleDowngrageSettlement = (id: number) => {
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

  const handleDeleteSettlement = (id: number) => {
    const confirmed = window.confirm("本当に開拓地を削除しますか？");
    if (confirmed)
      setSettlements(settlements.filter((settlement) => settlement.id !== id));
  };

  const ChartData = {
    labels: ["木材", "レンガ", "小麦", "鉄", "羊毛"],
    datasets: [
      {
        label: "資源取得確率",
        data: [1, 4, 2, 4, 6],
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
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "各資源の取得確率",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "資源",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "確率",
        },
      },
    },
  };

  return (
    <main className="">
      <header className="bg-blue-200 p-4 flex justify-around mb-4">
        <div className="text-3xl font-medium">カタン確率計算アプリ</div>
        <div className="flex space-x-2">
          <p>日本語</p>
          <p>/</p>
          <p>English</p>
        </div>
      </header>

      <div className="flex h-screen justify-center">
        {/* 左側 */}
        <div className="w-1/2 bg-red-100 p-4">
          <div>
            あとで説明文を追加Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Excepturi eos quibusdam illo at alias corrupti voluptas
            numquam id rerum, eaque explicabo labore quasi doloremque nisi sint
            consequuntur nam odit veniam.
          </div>

          <div className="grid grid-cols-5 gap-4 place-items-center mt-6">
            <button className="button mb-2" onClick={handleCreateSettlement}>
              開拓地を追加
            </button>
            <div>資源１</div>
            <div>資源２</div>
            <div>資源３</div>
            <div></div>
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
                  placeholder="Settlement Name"
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
                      onClick={() => handleDowngrageSettlement(settlement.id)}
                    >
                      都市
                    </button>
                  ) : (
                    <button
                      className="button"
                      onClick={() => handleUpgradeSettlement(settlement.id)}
                    >
                      都市化
                    </button>
                  )}
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white font-bold p-2 rounded"
                    onClick={() => handleDeleteSettlement(settlement.id)}
                  >
                    消
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右側 */}
        <div className="w-1/2 bg-green-100">
          {/* S, A, Bなどのランク分けもできると良き */}
          <div className="text-2xl flex justify-center">
            期待値 : {expectedValue}
          </div>
          <div className="text-2xl flex justify-center">
            資源取得確率 : {probability} / 36
          </div>
          <div className="text-2xl flex justify-center">
            ここにアドバイスを表示（どこに開拓地を置くべきか、どこをアップグレードするべきか）
          </div>
          <div className="text-2xl flex justify-center">
            ここに各資源のグラフを表示
            <Bar data={ChartData} options={options} />
          </div>
        </div>
      </div>
      {/* 各資源の数字をここで入力 */}
    </main>
  );
}
