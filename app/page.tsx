"use client";
import React, { useRef, useEffect, useState } from "react";

export default function Home() {
  const initialSettlements: Settlement[] = [
    {
      name: "開拓地1",
      id: 1,
      resources: ["", "", ""],
      numbers: [0, 0, 0],
      upgraded: false,
    },
    {
      name: "開拓地2",
      id: 2,
      resources: ["", "", ""],
      numbers: [0, 0, 0],
      upgraded: false,
    },
  ];

  const [settlements, setSettlements] =
    useState<Settlement[]>(initialSettlements);
  const [probability, setProbability] = useState<number[]>([]);
  const [expectedValue, setExpectedValue] = useState<number[]>([]);

  type Settlement = {
    name: string;
    id: number;
    resources: [string, string, string];
    numbers: [number, number, number];
    upgraded: boolean;
  };

  useEffect(() => {
    console.log("settlements = " + settlements);
  }, [settlements]);

  const handleCreateSettlement = () => {
    setSettlements([
      ...settlements,
      {
        name: `開拓地${settlements.length + 1}`,
        id: settlements.length + 1,
        resources: ["", "", ""],
        numbers: [0, 0, 0],
        upgraded: false,
      },
    ]);
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

      <div className="flex h-screen justify-center ml-4">
        {/* 左側 */}
        <div className="w-3/5 bg-red-100 p-4">
          <div>
            あとで説明文を追加Lorem ipsum dolor sit amet consectetur adipisicing
            elit. Excepturi eos quibusdam illo at alias corrupti voluptas
            numquam id rerum, eaque explicabo labore quasi doloremque nisi sint
            consequuntur nam odit veniam.
          </div>

          <div className="grid grid-cols-4 place-items-center gap-2">
            <button
              className="button mb-2"
              onClick={() => handleCreateSettlement()}
            >
              開拓地を追加
            </button>
            <div>資源１</div>
            <div>資源２</div>
            <div>資源３</div>
            {/* ここをmapで複数表示する */}
            <input type="input" value="開拓地１" />
            <div>
              <select
                id="resource-select"
                className="border border-gray-300 rounded px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              >
                <option value=""></option>
                <option value="wood">木材</option>
                <option value="bricks">レンガ</option>
                <option value="wheat">小麦</option>
                <option value="iron">鉄</option>
                <option value="wool">羊毛</option>
              </select>
              <select
                id="number-select"
                className="border border-gray-300 rounded px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              >
                <option value=""></option>
                {Array.from({ length: 11 }, (_, i) => i + 2)
                  .filter((number) => number !== 7)
                  .map((number) => (
                    <option key={number} value={number}>
                      {number}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <select
                id="resource-select"
                className="border border-gray-300 rounded px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              >
                <option value=""></option>
                <option value="wood">木材</option>
                <option value="bricks">レンガ</option>
                <option value="wheat">小麦</option>
                <option value="iron">鉄</option>
                <option value="wool">羊毛</option>
              </select>
              <select
                id="number-select"
                className="border border-gray-300 rounded px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              >
                <option value=""></option>
                {Array.from({ length: 11 }, (_, i) => i + 2)
                  .filter((number) => number !== 7)
                  .map((number) => (
                    <option key={number} value={number}>
                      {number}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <select
                id="resource-select"
                className="border border-gray-300 rounded px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              >
                <option value=""></option>
                <option value="wood">木材</option>
                <option value="bricks">レンガ</option>
                <option value="wheat">小麦</option>
                <option value="iron">鉄</option>
                <option value="wool">羊毛</option>
              </select>
              <select
                id="number-select"
                className="border border-gray-300 rounded px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              >
                <option value=""></option>
                {Array.from({ length: 11 }, (_, i) => i + 2)
                  .filter((number) => number !== 7)
                  .map((number) => (
                    <option key={number} value={number}>
                      {number}
                    </option>
                  ))}
              </select>
              <button className="bg-red-500 text-white font-bold p-2 rounded ml-4">
                消
              </button>
            </div>
          </div>
        </div>
        {/* 右側 */}
        <div className="w-1/2 bg-green-100">
          <div className="text-2xl flex justify-center">
            現在の資源取得確率と期待値を計算しA, B,
            Cなどのランクを表示(デザインいい感じにしたい)
          </div>
          <div className="text-2xl flex justify-center">
            ここにアドバイスを表示（どこに開拓地を置くべきか、どこをアップグレードするべきか）
          </div>
          <div className="text-2xl flex justify-center">
            ここに各資源のグラフを表示
          </div>
        </div>
      </div>
      {/* 各資源の数字をここで入力 */}
    </main>
  );
}
