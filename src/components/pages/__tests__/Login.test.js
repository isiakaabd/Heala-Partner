import Login from "../Login";
import React from "react";
import { render, cleanup, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { store } from "store";
import { ApolloProvider } from "@apollo/client";
import "@testing-library/jest-dom/extend-expect";
import { MockedProvider } from "@apollo/client/testing";
import { Provider } from "react-redux";
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
const onSubmit = jest.fn();

describe("<Login />", () => {
  const div = document.createElement("div");
  const { getByRole, getByText } = render(
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
  const button = getByRole("button");
  const password = getByRole("textbox", { Name: "password" });
  const email = getByRole("textbox", { Name: "Enter your email" });
  it("Should render input fields, image and button  component", async () => {
    expect(button).toBeInTheDocument();
    expect(getByText("Login")).toBeInTheDocument();
    expect(password).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(getByRole("checkbox")).toBeInTheDocument();
    expect(
      getByRole("link", { Name: "Forget Password" })
    ).not.toHaveAccessibleDescription();
  });
  // "@testing-library/user-event": "^12.1.10",
  it("click on the login Button", async () => {
    const user = userEvent.setup();
    await user.type(email, "hospital@heala.ng");
    await user.type(password, "60328840");
    await user.click(button);
    // expect(email.textContent).toMatch("hospital@heala.ng");

    await waitFor(() => {
      // expect(onSubmit).toHaveBeenCalledWith({
      //   email: "hospital@heala.ng",
      //   password: "60328840",
      // });
      expect(email).toHaveValue("hospital@heala.ng");
      expect(mockDisplayMessage).toHaveBeenCalledWith(
        "success",
        "Login Successful"
      );
    });
  });
});
