import Error from "../Error";
import React from "react";
import ReactDOM from "react-dom";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import renderer from "react-test-renderer";

afterEach(cleanup);

test("Renders  Error component perfectly", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Error />, div);
});

test("<Error /> component renders the image", () => {
  const { getByAltText } = render(<Error />);
  expect(getByAltText("logo")).toBeInTheDocument();
  const image = screen.getByRole("img");
  expect(image).toHaveAttribute("alt", "logo");
});

test("Ensure it displays the correct text", () => {
  render(<Error />);
  const textError = screen.getByText("Something Went Wrong...");
  expect(textError).toBeTruthy();
});

test("if it matches snapshot", () => {
  const tree = renderer.create(<Error />).toJSON();

  expect(tree).toMatchSnapshot();
});
