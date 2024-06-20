// resourceInputPanel.tsx

import React from "react";
import { Settlement, useSettlements } from "../context/SettlementsContext";
import { v4 as uuidv4 } from "uuid";

const ResourceInputPanel = () => {
  const { settlements, setSettlements } = useSettlements();
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

  return (
    <>
      {/* 左側 */}
      <div className="w-1/2 p-4">
        <div>開拓地の情報から、資源取得確率や期待値を計算できます。</div>
        <div className="grid grid-cols-5 gap-4 place-items-center mt-6">
          <button
            className="button bg-blue-500 hover:bg-blue-600 mb-2"
            onClick={handleCreateSettlement}
            tabIndex={1}
            data-testid="addSettlementButton"
          >
            開拓地を追加
          </button>
          <div className="text-xl font-medium">資源１</div>
          <div className="text-xl font-medium">資源２</div>
          <div className="text-xl font-medium">資源３</div>
          <button
            className="button w-3/5 mb-4 bg-gray-500 hover:bg-red-700"
            onClick={() => handleResetSettlements()}
            tabIndex={1}
            data-testid="resetButton"
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
                tabIndex={2}
                data-testid="settlementNameInput"
              />
              {settlement.resources.map((resource, index) => (
                <div key={index} className="">
                  <select
                    value={resource}
                    onChange={(e) =>
                      handleResourceChange(settlement.id, index, e.target.value)
                    }
                    className="w-4/5 border border-gray-300 rounded px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                    tabIndex={1}
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
                    tabIndex={1}
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
                    className="button bg-green-500 hover:bg-green-600"
                    onClick={() => handleDowngradeSettlement(settlement.id)}
                    tabIndex={2}
                  >
                    都市
                  </button>
                ) : (
                  <button
                    className="button bg-blue-500 hover:bg-blue-600"
                    onClick={() => handleUpgradeSettlement(settlement.id)}
                    tabIndex={2}
                    data-testid="upgradeButton"
                  >
                    都市化
                  </button>
                )}
                <button
                  className="button bg-red-500 hover:bg-red-600"
                  onClick={() => handleDeleteSettlement(settlement.id)}
                  tabIndex={2}
                  data-testid="deleteButton"
                >
                  消
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ResourceInputPanel;
