// header.tsx

import React, { useState } from "react";

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
      <header className="bg-blue-200 p-4 flex justify-around">
        <div className="text-3xl font-medium">カタン確率計算アプリ</div>
        {/* <div className="flex space-x-2">
          <p>日本語</p>
          <p>/</p>
          <p>English</p>
        </div> */}
        <div className="text-xl">
          {isNumericMode ? (
            <button onClick={() => setIsNumericMode(false)} className="">
              ランク表示に変更
            </button>
          ) : (
            <button onClick={() => setIsNumericMode(true)} className="">
              数字表示に変更
            </button>
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
