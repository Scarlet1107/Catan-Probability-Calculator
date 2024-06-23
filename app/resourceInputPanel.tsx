// resourceInputPanel.tsx
import React, { useRef } from "react";
import { Settlement, useSettlements } from "../context/SettlementsContext";
import { v4 as uuidv4 } from "uuid";
import confetti from "canvas-confetti";

const ResourceInputPanel = () => {
  const { settlements, setSettlements } = useSettlements();
  const upGradebuttonRef = useRef<HTMLButtonElement>(null);
  const createSettlementbuttonRef = useRef<HTMLButtonElement>(null);
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
    if (settlements.length >= 9) return; // 開拓地は最大9個まで
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
    handleCreateSettlementConfetti();
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
    handleUpgradeCelebrate(upGradebuttonRef);
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

  const showConfetti = (element: HTMLButtonElement) => {
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    confetti({
      particleCount: 300,
      startVelocity: 40,
      spread: 360,
      origin: {
        x: x / window.innerWidth,
        y: y / window.innerHeight,
      },
    });
  };

  const handleUpgradeCelebrate = (
    buttonRef: React.RefObject<HTMLButtonElement>
  ) => {
    if (buttonRef.current) {
      showConfetti(buttonRef.current);
    }
  };

  const handleCreateSettlementConfetti = () => {
    const count = 300;
    const defaults = {
      origin: { y: 0.7 },
    };

    function fire(
      particleRatio: number,
      opts: {
        spread: number;
        startVelocity?: number;
        decay?: number;
        scalar?: number;
      }
    ) {
      confetti(
        Object.assign({}, defaults, opts, {
          particleCount: Math.floor(count * particleRatio),
        })
      );
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  return (
    <>
      {/* 左側 */}
      <div className="w-1/2 pl-8 pt-4 mr-4">
        <div>開拓地の情報から、資源取得確率や期待値を計算できます。</div>
        <div className="grid grid-cols-5 gap-4 place-items-center mt-6 ">
          <button
            className="button bg-blue-500 hover:bg-blue-600 place-self-start w-4/5 h-5/6"
            onClick={handleCreateSettlement}
            ref={createSettlementbuttonRef}
            tabIndex={1}
            data-testid="addSettlementButton"
          >
            開拓地を追加
          </button>
          <div className="text-xl font-medium">資源１</div>
          <div className="text-xl font-medium">資源２</div>
          <div className="text-xl font-medium">資源３</div>
          <button
            className="button mb-4 bg-gray-500 hover:bg-red-700 place-self-end w-4/5 mr-2"
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
            <div
              key={settlement.id}
              className="grid grid-cols-5 gap-4 mb-4 place-items-end"
            >
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
                className="border border-gray-300 rounded px-4 py-2 mb-2 h-1/2 w-4/5 place-self-start self-center"
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
                    className="justify-self-center w-4/5 border border-gray-300 rounded px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
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
                    className="w-4/5 mt-2 border border-gray-300 rounded px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
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
              <div className="flex flex-col w-full mr-2">
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
                    ref={upGradebuttonRef}
                    tabIndex={2}
                    data-testid="upgradeButton"
                  >
                    都市化
                  </button>
                )}
                <button
                  className="button bg-red-500 hover:bg-red-600 mt-2"
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
