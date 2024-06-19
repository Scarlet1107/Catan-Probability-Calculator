import React from "react";
import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import CatanApp from "../app/page";

// 各テストは前の結果を引き継いで次のテストを行っています。並列処理で実行しないでください。

// ユーザーの動きに合わせた一連の動作テスト
describe("A series of user behavior tests", () => {
  beforeEach(() => {
    render(<CatanApp />);
    window.confirm = jest.fn().mockImplementation(() => true);
  });

  afterAll(() => {
    cleanup();
    localStorage.removeItem("settlements");
  });

  // 1-1. 資源と数字を入力したとき、「期待値」、「確率」、「おすすめの数字」、「アップグレードにおすすめの開拓地」が正しく計算される
  test("Calculation is correct when resources and numbers are selected in case 1", () => {
    const resourceSelects = screen.getAllByTestId("resourceSelect");
    const numberSelects = screen.getAllByTestId("numberSelect");

    fireEvent.change(resourceSelects[0], { target: { value: "wood" } });
    fireEvent.change(resourceSelects[1], { target: { value: "wood" } });
    fireEvent.change(resourceSelects[2], { target: { value: "wood" } });
    fireEvent.change(numberSelects[0], { target: { value: "2" } });
    fireEvent.change(numberSelects[1], { target: { value: "2" } });
    fireEvent.change(numberSelects[2], { target: { value: "2" } });
    fireEvent.change(resourceSelects[3], { target: { value: "wood" } });
    fireEvent.change(resourceSelects[4], { target: { value: "wood" } });
    fireEvent.change(resourceSelects[5], { target: { value: "wood" } });
    fireEvent.change(numberSelects[3], { target: { value: "2" } });
    fireEvent.change(numberSelects[4], { target: { value: "2" } });
    fireEvent.change(numberSelects[5], { target: { value: "2" } });

    expect(screen.getByTestId("expectedValue")).toHaveTextContent("6");
    expect(screen.getByTestId("probability")).toHaveTextContent("1");
    expect(screen.getByTestId("recommendedNumbers")).toHaveTextContent(
      "6, 8, 5"
    );
    expect(screen.getByTestId("recommendedSettlementName")).toHaveTextContent(
      "開拓地1"
    );
  });

  // 1-2. 資源と数字を入力したとき、「期待値」、「確率」、「おすすめの数字」、「アップグレードにおすすめの開拓地」が正しく計算される
  test("Calculation is correct when resources and numbers are selected in case 1", () => {
    const resourceSelects = screen.getAllByTestId("resourceSelect");
    const numberSelects = screen.getAllByTestId("numberSelect");

    fireEvent.change(resourceSelects[0], { target: { value: "iron" } });
    fireEvent.change(resourceSelects[1], { target: { value: "wood" } });
    fireEvent.change(resourceSelects[2], { target: { value: "bricks" } });
    fireEvent.change(numberSelects[0], { target: { value: "4" } });
    fireEvent.change(numberSelects[1], { target: { value: "6" } });
    fireEvent.change(numberSelects[2], { target: { value: "8" } });
    fireEvent.change(resourceSelects[3], { target: { value: "wool" } });
    fireEvent.change(resourceSelects[4], { target: { value: "bricks" } });
    fireEvent.change(resourceSelects[5], { target: { value: "iron" } });
    fireEvent.change(numberSelects[3], { target: { value: "5" } });
    fireEvent.change(numberSelects[4], { target: { value: "9" } });
    fireEvent.change(numberSelects[5], { target: { value: "12" } });

    expect(screen.getByTestId("expectedValue")).toHaveTextContent("22");
    expect(screen.getByTestId("probability")).toHaveTextContent("22");
    expect(screen.getByTestId("recommendedNumbers")).toHaveTextContent(
      "10, 3, 11"
    );
    expect(screen.getByTestId("recommendedSettlementName")).toHaveTextContent(
      "開拓地1"
    );
  });

  // 1-3. 資源と数字を入力したとき、「期待値」、「確率」、「おすすめの数字」、「アップグレードにおすすめの開拓地」が正しく計算される
  test("Calculation is correct when resources and numbers are selected in case 2", () => {
    const resourceSelects = screen.getAllByTestId("resourceSelect");
    const numberSelects = screen.getAllByTestId("numberSelect");

    fireEvent.change(resourceSelects[0], { target: { value: "wood" } });
    fireEvent.change(resourceSelects[1], { target: { value: "bricks" } });
    fireEvent.change(resourceSelects[2], { target: { value: "wheat" } });
    fireEvent.change(numberSelects[0], { target: { value: "2" } });
    fireEvent.change(numberSelects[1], { target: { value: "6" } });
    fireEvent.change(numberSelects[2], { target: { value: "8" } });
    fireEvent.change(resourceSelects[3], { target: { value: "iron" } });
    fireEvent.change(resourceSelects[4], { target: { value: "bricks" } });
    fireEvent.change(resourceSelects[5], { target: { value: "wool" } });
    fireEvent.change(numberSelects[3], { target: { value: "11" } });
    fireEvent.change(numberSelects[4], { target: { value: "3" } });
    fireEvent.change(numberSelects[5], { target: { value: "10" } });

    expect(screen.getByTestId("expectedValue")).toHaveTextContent("18");
    expect(screen.getByTestId("probability")).toHaveTextContent("18");
    expect(screen.getByTestId("recommendedNumbers")).toHaveTextContent(
      "5, 9, 4"
    );
    expect(screen.getByTestId("recommendedSettlementName")).toHaveTextContent(
      "開拓地1"
    );
  });

  // 2. 「都市化」ボタンを押したとき「期待値」、「確率」、「おすすめの数字」、「アップグレードにおすすめの開拓地」が正しく計算される
  test("Calculation is correct when the city button is pressed", () => {
    const upgradeButtons = screen.getAllByTestId("upgradeButton");
    expect(upgradeButtons.length).toBeGreaterThan(0);
    fireEvent.click(upgradeButtons[0]);
    expect(screen.getByTestId("expectedValue")).toHaveTextContent("29");
    expect(screen.getByTestId("probability")).toHaveTextContent("18");
    expect(screen.getByTestId("recommendedNumbers")).toHaveTextContent(
      "5, 9, 4"
    );
    expect(screen.getByTestId("recommendedSettlementName")).toHaveTextContent(
      "開拓地2"
    );
  });

  // 3. 開拓地の名前を変更したとき「アップグレードにおすすめの開拓地」が変更される
  test("The recommended settlement changes when the name of the settlement is changed", () => {
    const settlementNameInputs = screen.getAllByTestId("settlementNameInput");
    fireEvent.change(settlementNameInputs[1], {
      target: { value: "テスト開拓地" },
    });
    expect(settlementNameInputs[1]).toHaveValue("テスト開拓地");
    expect(screen.getByTestId("recommendedSettlementName")).toHaveTextContent(
      "テスト開拓地"
    );
  });

  // 4. 「消」ボタンを押したとき、開拓地が削除される。計算が正しく行われる
  test("The settlement is deleted when the delete button is pressed", () => {
    const deleteButtons = screen.getAllByTestId("deleteButton");
    fireEvent.click(deleteButtons[0]);

    const resourceSelects = screen.getAllByTestId("resourceSelect");
    const numberSelects = screen.getAllByTestId("numberSelect");
    expect(resourceSelects.length).toBe(3);
    expect(numberSelects.length).toBe(3);
    expect(screen.getByTestId("expectedValue")).toHaveTextContent("7");
    expect(screen.getByTestId("probability")).toHaveTextContent("7");
    expect(screen.getByTestId("recommendedNumbers")).toHaveTextContent(
      "6, 8, 5"
    );
    expect(screen.getByTestId("recommendedSettlementName")).toHaveTextContent(
      "テスト開拓地"
    );
  });

  // 5. 「開拓地を追加」ボタンを押したとき、ボタン、Selectなどの要素が正しく増えている
  test("Adding settlement button works correctly", () => {
    const addSettlementButton = screen.getByTestId("addSettlementButton");
    fireEvent.click(addSettlementButton);

    const resourceSelects = screen.getAllByTestId("resourceSelect");
    expect(resourceSelects.length).toBe(6);
    const numberSelects = screen.getAllByTestId("numberSelect");
    expect(numberSelects.length).toBe(6);
    const upgradeButtons = screen.getAllByTestId("upgradeButton");
    expect(upgradeButtons.length).toBe(2);
    const deleteButtons = screen.getAllByTestId("deleteButton");
    expect(deleteButtons.length).toBe(2);
    const settlementNameInputs = screen.getAllByTestId("settlementNameInput");
    expect(settlementNameInputs.length).toBe(2);
  });

  // 6. 新しく追加された開拓地において、正しく計算される
  test("The correct calculation result is obtained for the newly added settlement", () => {
    const resourceSelects = screen.getAllByTestId("resourceSelect");
    const numberSelects = screen.getAllByTestId("numberSelect");

    fireEvent.change(resourceSelects[3], { target: { value: "wool" } });
    fireEvent.change(resourceSelects[4], { target: { value: "bricks" } });
    fireEvent.change(resourceSelects[5], { target: { value: "wheat" } });
    fireEvent.change(numberSelects[3], { target: { value: "6" } });
    fireEvent.change(numberSelects[4], { target: { value: "4" } });
    fireEvent.change(numberSelects[5], { target: { value: "10" } });
    expect(resourceSelects[3]).toHaveValue("wool");
    expect(resourceSelects[4]).toHaveValue("bricks");
    expect(resourceSelects[5]).toHaveValue("wheat");
    expect(numberSelects[3]).toHaveValue("6");
    expect(numberSelects[4]).toHaveValue("4");
    expect(numberSelects[5]).toHaveValue("10");

    expect(screen.getByTestId("expectedValue")).toHaveTextContent("18");
    expect(screen.getByTestId("probability")).toHaveTextContent("15");
    expect(screen.getByTestId("recommendedNumbers")).toHaveTextContent(
      "8, 5, 9"
    );
    expect(screen.getByTestId("recommendedSettlementName")).toHaveTextContent(
      "開拓地2"
    );
  });

  // 7. 「初期化」ボタンを押したとき、正しくリセットされる
  test("Reset button works correctly", () => {
    const resetButton = screen.getByTestId("resetButton");
    fireEvent.click(resetButton);

    const selects = screen.getAllByRole("combobox");
    const buttons = screen.getAllByRole("button");
    const resourceSelects = screen.getAllByTestId("resourceSelect");
    const numberSelects = screen.getAllByTestId("numberSelect");

    expect(selects.length).toBe(12);
    expect(buttons.length).toBe(6);
    expect(resourceSelects.length).toBe(6);
    expect(numberSelects.length).toBe(6);
    expect(resourceSelects[0]).toHaveValue("");
    expect(resourceSelects[1]).toHaveValue("");
    expect(resourceSelects[2]).toHaveValue("");
    expect(numberSelects[0]).toHaveValue("");
    expect(numberSelects[1]).toHaveValue("");
    expect(numberSelects[2]).toHaveValue("");
    expect(screen.getByTestId("expectedValue")).toHaveTextContent("0");
    expect(screen.getByTestId("probability")).toHaveTextContent("0");
    expect(screen.getByTestId("recommendedNumbers")).toHaveTextContent(
      "6, 8, 5"
    );
    expect(screen.getByTestId("recommendedSettlementName")).toHaveTextContent(
      ""
    );
  });
});
