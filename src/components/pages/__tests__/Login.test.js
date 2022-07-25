import Login from "../Login";
import React from "react";
import ReactDOM from "react-dom";
import { render, screen, cleanup } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { store } from "store";
import { ApolloProvider } from "@apollo/client";
import "@testing-library/jest-dom/extend-expect";
import { MockedProvider } from "@apollo/client/testing";
import { Provider } from "react-redux";
// import renderer from "react-test-renderer";
import MockTheme from "../Utils/MockTheme";
import { mockLogin } from "../Utils/mockquery";

afterEach(cleanup);
const mockDisplayMessage = jest.fn();
// mocking the usealert hook

jest.mock("../../hooks/useAlert", () => () => {
  const useAlert = jest.requireActual("../../hooks/useAlert");
  return {
    ...useAlert,
    displayMessage: mockDisplayMessage,
  };
});
// describe("Login", () => {
//   jest.mock("@mui/material/styles", () => () => ({
//     ...jest.requireActual("@mui/material/styles"),
//     useTheme: () => {
//       return mockUseTheme;
//     },
//   }));

//   it("Should render Example component", () => {
//     const wrapper = render(<Login />);
//     screen.debug();
//     expect(wrapper).toBeTruthy();
//   });
// });

describe("<Login />", () => {
  const div = document.createElement("div");
  render(
    <BrowserRouter>
      <MockedProvider mocks={mockLogin} addTypename={false}>
        <MockTheme>
          <ApolloProvider client={{}}>
            <Provider store={store}>
              <Login />
            </Provider>
          </ApolloProvider>
        </MockTheme>
      </MockedProvider>
    </BrowserRouter>,
    div
  );
  it("Renders the login page", () => {
    screen.debug();
    ReactDOM.unmountComponentAtNode(div);
  });

  it("Should render lOGIN component", () => {
    screen.debug();
    // expect(wrapper).toBeTruthy();
  });
});
