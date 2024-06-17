import React from "react";
import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import Home from "../app/page";
import { before } from "node:test";

// 要素が存在するかどうかなどの基本的なテスト
describe("Basic Test", () => {
  beforeEach(() => {
    render(<Home />);
  });

  afterEach(() => {
    cleanup();
  });

  // 1. タイトルがある
  test("Title exists", () => {
    const titleElement = screen.getByText(/カタン確率計算アプリ/i);
    expect(titleElement).toBeInTheDocument();
  });

  // 2. 2. ボタンが正しい数、正しい種類存在する
  test("Correct buttons exist", () => {
    const addSettlementButton = screen.getByTestId("addSettlementButton");
    const upgradeButtons = screen.getAllByTestId("upgradeButton");
    const deleteButtons = screen.getAllByTestId("deleteButton");
    expect(addSettlementButton).toBeInTheDocument();
    expect(upgradeButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });

  // 3. インプットタグが正しい数あり、値が正しい
  test("Input exists", () => {
    const inputs = screen.getAllByTestId("settlementNameInput");
    expect(inputs).toHaveLength(2);
    expect(inputs[0]).toHaveValue("開拓地1");
    expect(inputs[1]).toHaveValue("開拓地2");
  });

  // 4. セレクトタグが正しい数ある
  test("Select exists", () => {
    const selects = screen.getAllByRole("combobox");
    const resourceSelects = screen.getAllByTestId("resourceSelect");
    const numberSelects = screen.getAllByTestId("numberSelect");
    expect(selects).toHaveLength(12);
    expect(resourceSelects).toHaveLength(6);
    expect(numberSelects).toHaveLength(6);
  });

  // 5. オプションが正しい
  test("Options are correct", () => {
    const resourceSelects = screen.getAllByTestId("resourceSelect");
    const numberSelects = screen.getAllByTestId("numberSelect");

    const resourceOptions = ["木材", "レンガ", "小麦", "鉄", "羊毛"];
    const numberOptions = ["2", "3", "4", "5", "6", "8", "9", "10", "11", "12"];

    resourceSelects.forEach((select) => {
      const options = Array.from(select.querySelectorAll("option")).map(
        (option) => option.textContent
      );
      const isResourceOption = resourceOptions.every((option) =>
        options.includes(option)
      );
      expect(isResourceOption).toBeTruthy();
    });

    numberSelects.forEach((select) => {
      const options = Array.from(select.querySelectorAll("option")).map(
        (option) => option.textContent
      );
      const isNumberOption = numberOptions.every((option) =>
        options.includes(option)
      );
      expect(isNumberOption).toBeTruthy();
    });
  });

  // 6. 棒グラフがある
  test("Chart exists", () => {
    const chart = screen.getByRole("img");
    expect(chart).toBeInTheDocument();
  });

  // 7. 期待値が正しく初期化されている
  test("Expected value is initialized correctly", () => {
    expect(screen.getByTestId("expectedValue")).toHaveTextContent("0");
  });

  // 8. 資源取得確率が正しく初期化されている
  test("Resource probability is initialized correctly", () => {
    expect(screen.getByTestId("probability")).toHaveTextContent("0");
  });

  // 9. おすすめの数字が正しく初期化されている
  test("Recommended number is initialized correctly", () => {
    expect(screen.getByTestId("recommendedNumbers")).toHaveTextContent(
      "6, 8, 5"
    );
  });

  // 10. 都市化におすすめの開拓地が正しく初期化されている
  test("Recommended settlement is initialized correctly", () => {
    expect(screen.getByTestId("recommendedSettlementName")).toHaveTextContent(
      ""
    );
  });

  // 11. 資源のみを選択したとき、計算が実行されない
  test("Calculation does not execute when only resources are selected", () => {
    const resourceSelects = screen.getAllByTestId("resourceSelect");
    fireEvent.change(resourceSelects[0], { target: { value: "wood" } });
    fireEvent.change(resourceSelects[1], { target: { value: "bricks" } });
    fireEvent.change(resourceSelects[2], { target: { value: "wheat" } });

    expect(resourceSelects[0]).toHaveValue("wood");
    expect(resourceSelects[1]).toHaveValue("bricks");
    expect(resourceSelects[2]).toHaveValue("wheat");
    expect(screen.getByTestId("expectedValue")).toHaveTextContent("0");

    // 掃除
    fireEvent.change(resourceSelects[0], { target: { value: "" } });
    fireEvent.change(resourceSelects[1], { target: { value: "" } });
    fireEvent.change(resourceSelects[2], { target: { value: "" } });
    expect(resourceSelects[0]).toHaveValue("");
    expect(resourceSelects[1]).toHaveValue("");
    expect(resourceSelects[2]).toHaveValue("");
  });

  // 12. 数字のみを選択したとき、計算が実行されない
  test("Calculation does not execute when only numbers are selected", () => {
    const numberSelects = screen.getAllByTestId("numberSelect");
    fireEvent.change(numberSelects[0], { target: { value: "2" } });
    fireEvent.change(numberSelects[1], { target: { value: "6" } });
    fireEvent.change(numberSelects[2], { target: { value: "8" } });

    expect(numberSelects[0]).toHaveValue("2");
    expect(numberSelects[1]).toHaveValue("6");
    expect(numberSelects[2]).toHaveValue("8");
    expect(screen.getByTestId("expectedValue")).toHaveTextContent("0");
  });
});

// ユーザーの動きに合わせた一連の動作テスト
describe("Use case Test", () => {
  beforeEach(() => {
    render(<Home />);
    window.confirm = jest.fn().mockImplementation(() => true);
  });

  afterAll(() => {
    cleanup();
  });

  // 13. 資源と数字を入力したとき、「期待値」、「確率」、「おすすめの数字」、「アップグレードにおすすめの開拓地」が正しく計算される
  test("Calculation is correct when resources and numbers are selected", () => {
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

    expect(resourceSelects[0]).toHaveValue("wood");
    expect(resourceSelects[1]).toHaveValue("bricks");
    expect(resourceSelects[2]).toHaveValue("wheat");
    expect(numberSelects[0]).toHaveValue("2");
    expect(numberSelects[1]).toHaveValue("6");
    expect(numberSelects[2]).toHaveValue("8");
    expect(resourceSelects[3]).toHaveValue("iron");
    expect(resourceSelects[4]).toHaveValue("bricks");
    expect(resourceSelects[5]).toHaveValue("wool");
    expect(numberSelects[3]).toHaveValue("11");
    expect(numberSelects[4]).toHaveValue("3");
    expect(numberSelects[5]).toHaveValue("10");

    expect(screen.getByTestId("expectedValue")).toHaveTextContent("18");
    expect(screen.getByTestId("probability")).toHaveTextContent("18");
    expect(screen.getByTestId("recommendedNumbers")).toHaveTextContent(
      "5, 9, 4"
    );
    expect(screen.getByTestId("recommendedSettlementName")).toHaveTextContent(
      "開拓地1"
    );
  });

  // 14. 「都市化」ボタンを押したとき「期待値」、「確率」、「おすすめの数字」、「アップグレードにおすすめの開拓地」が正しく計算される
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

  // 15. 開拓地の名前を変更したとき「アップグレードにおすすめの開拓地」が変更される
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

  // 16. 「消」ボタンを押したとき、開拓地が削除される。計算が正しく行われる
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

  // 17. 「開拓地を追加」ボタンを押したとき、ボタン、Selectなどの要素が正しく増えている
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

  // 18. 「開拓地を追加」ボタンを押したとき、新しく追加された開拓地において正しい計算結果が出る
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

  // スナップショットテスト
  test("renders correctly and matches snapshot", () => {
    const { asFragment } = render(<Home />);
    expect(asFragment()).toMatchSnapshot();
  });
});
