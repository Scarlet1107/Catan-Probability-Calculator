// header.tsx

import React from "react";

const Header = ({
  isNumericMode,
  setIsNumericMode,
}: {
  isNumericMode: boolean;
  setIsNumericMode: (value: boolean) => void;
}) => {
  // "NUMERIC" or "RANK"

  return (
    <div>
      <header className="flex items-center space-x-12 bg-blue-200 py-4 pl-12">
        <div className="text-3xl font-medium">カタン確率計算アプリ</div>
        {/* <div className="flex space-x-2">
          <p>日本語</p>
          <p>/</p>
          <p>English</p>
        </div> */}
        <div className="text-xl">
          {isNumericMode ? (
            <button
              onClick={() => setIsNumericMode(false)}
              data-testid="changeDisplayModeToNumeric"
            >
              ランク表示に変更
            </button>
          ) : (
            <button
              onClick={() => setIsNumericMode(true)}
              data-testid="changeDisplayModeToRank"
            >
              数字表示に変更
            </button>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
