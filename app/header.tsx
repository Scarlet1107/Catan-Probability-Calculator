// header.tsx

import React from "react";

const header = () => {
  return (
    <div>
      <header className="bg-blue-200 p-4 flex justify-around">
        <div className="text-3xl font-medium">カタン確率計算アプリ</div>
        {/* <div className="flex space-x-2">
          <p>日本語</p>
          <p>/</p>
          <p>English</p>
        </div> */}
      </header>
    </div>
  );
};

export default header;
