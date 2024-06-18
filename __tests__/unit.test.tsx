import React from "react";
import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import Home from "../app/page";

// 要素が存在するかどうかなどの基本的なテスト
describe("Basic tests for the presence of elements", () => {
  beforeEach(() => {
    render(<Home />);
  });

  afterEach(() => {
    cleanup();
    localStorage.removeItem("settlements");
  });

  // 1. タイトルがある
  test("Title exists", () => {
    const titleElement = screen.getByText(/カタン確率計算アプリ/i);
    expect(titleElement).toBeInTheDocument();
  });

  // 2. ボタンが正しい数、正しい種類存在する
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
    expect(screen.getByTestId("probability")).toHaveTextContent("0");
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
    expect(screen.getByTestId("probability")).toHaveTextContent("0");
  });

  // 13. スナップショットテスト
  test("renders correctly and matches snapshot", () => {
    const { asFragment } = render(<Home />);
    expect(asFragment()).toMatchSnapshot();
  });
});
