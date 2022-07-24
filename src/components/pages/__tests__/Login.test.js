import Login from "../Login";
import React from "react";
// import { ThemeProvider } from "@mui/material/styles";
// import { ThemeProvider } from "@material-ui/core/styles";
import ReactDOM from "react-dom";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import renderer from "react-test-renderer";

afterEach(cleanup);
const mockUseTheme = jest.fn();

jest.mock("@mui/material/styles", () => () => ({
  ...jest.requireActual("@mui/material/styles"),
  useTheme: () => {
    return mockUseTheme;
  },
}));
// jest.mock("@mui/material/styles", () => {
//   const Styles = jest.requireActual("@mui/material/styles");

//   const classes = jest.requireActual("@mui/styles").useStyles();

//   //   const options = jes?St.requireActual("../../../src/themes/options").default;

//   return {
//     ...Styles,

//     makeStyles: (func) => {
//       return Styles.makeStyles(func.bind(null, classes));
//     },
//   };
// });

it("Should render Example component", () => {
  const wrapper = render(<Login />);
  screen.debug();
  expect(wrapper).toBeTruthy();
});
