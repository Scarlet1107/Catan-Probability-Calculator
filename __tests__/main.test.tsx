import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "../app/page";

test("Title exists", () => {
  render(<Home />);
  const titleElement = screen.getByText(/カタン確率計算アプリ/i);
  expect(titleElement).toBeInTheDocument();
});

test("Button exists", () => {
  render(<Home />);
  const buttons = screen.getAllByRole("button");
  expect(buttons).toHaveLength(6);
});

test("Input exists", () => {
  render(<Home />);
  const inputs = screen.getAllByRole("textbox");
  expect(inputs).toHaveLength(2);
});

test("Select exists", () => {
  render(<Home />);
  const selects = screen.getAllByRole("combobox");
  expect(selects).toHaveLength(12);
});

test("Options are correct", () => {
  render(<Home />);
  const selects = screen.getAllByRole("combobox");
  selects.forEach((select) => {
    const options = Array.from(select.querySelectorAll("option")).map(
      (option) => option.textContent
    );
    const resourceOptions = ["木材", "レンガ", "小麦", "鉄", "羊毛"];
    const numberOptions = ["2", "3", "4", "5", "6", "8", "9", "10", "11", "12"];
    const isResourceOption = resourceOptions.every(option => options.includes(option));
    const isNumberOption = numberOptions.every(option => options.includes(option));
    expect(isResourceOption || isNumberOption).toBeTruthy();
  });
});

// test("Chart exists", () => {
//   render(<Home />);
//   const chart = screen.getByRole("img");
//   expect(chart).toBeInTheDocument();
// });