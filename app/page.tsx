import React from "react";
import { useState } from "react";

export default function Home() {


  type Settlement = {
    name: string;
    id: number;
    resources: [string, string, string];
    numbers: [number, number, number];
}

  return (
    <main className="">
      <header className="text-3xl bg-blue-200 p-2 flex justify-center font-medium">カタン確率計算アプリ</header>
      <div className="">
        <div>Welcome to my page. Explanation of this page is below.</div>
        <button className="button">開拓地を追加</button>
      </div>
    </main>
  );
}
