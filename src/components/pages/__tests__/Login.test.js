import Login from "../Login";
import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { store } from "store";
import "@testing-library/jest-dom/extend-expect";
import { MockedProvider } from "@apollo/client/testing";
import { Provider } from "react-redux";
import MockTheme from "../Utils/MockTheme";
import { mockLogin } from "../Utils/mockquery";
import wait from "waait";
import { act } from "react-test-renderer";
import userEvent from "@testing-library/user-event";
const mockDisplayMessage = jest.fn();
// mocking the usealert hook

jest.mock("../../hooks/useAlert", () => () => {
  const useAlert = jest.requireActual("../../hooks/useAlert");
  return {
    ...useAlert,
    displayMessage: mockDisplayMessage,
  };
});

beforeEach(async () => {
  await act(async () => {
    render(
      <BrowserRouter>
        <MockedProvider mocks={mockLogin} addTypename={false}>
          <MockTheme>
            <Provider store={store}>
              <Login />
            </Provider>
          </MockTheme>
        </MockedProvider>
      </BrowserRouter>
    );
  });
});
afterAll(async () => {
  const { container } = render(
    <BrowserRouter>
      <MockedProvider mocks={mockLogin} addTypename={false}>
        <MockTheme>
          <Provider store={store}>
            <Login />
          </Provider>
        </MockTheme>
      </MockedProvider>
    </BrowserRouter>
  );
  await wait(1);

  expect(container).toMatchSnapshot();
});

describe("<Login />", () => {
  // it("Should render input fields, image and button  component", async () => {
  //   const login = screen.getByText("LOGIN TO PARTNER ACCOUNT");
  //   const passwordField = screen.getByPlaceholderText(/enter your password/i);
  //   const emailField = screen.getByRole("textbox", {
  //     name: /enter your email/i,
  //   });
  //   const checkbox = screen.getByRole("checkbox");
  //   const button = screen.getByRole("button", { name: /login/i });

  //   // Assertions
  //   expect(login).toBeInTheDocument();
  //   expect(button).toBeInTheDocument();
  //   expect(passwordField).toBeInTheDocument();
  //   expect(passwordField).toBeInTheDocument();
  //   expect(emailField).toBeInTheDocument();
  //   expect(checkbox).toBeInTheDocument();
  // });
  it("Should display alert after login", async () => {
    const button = await screen.findByRole("button", { name: /login/i });

    await act(async () => {
      userEvent.click(button);
    });
    const alert = await screen.findByTestId("alert-test-value");
    expect(alert).toBeInTheDocument();
  });
});
