// import Login from "../Login";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { render, cleanup, act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
// import { store } from "store";
// import {mount} from "enzyme"
import { ApolloProvider } from "@apollo/client";
import "@testing-library/jest-dom/extend-expect";
import { MockedProvider } from "@apollo/client/testing";
// import { Provider } from "react-redux";
import MockTheme from "../Utils/MockTheme";
import { mock } from "../Utils/mockquery";
import { LoginForm } from "../forms";

afterEach(cleanup);
const mockDisplayMessage = jest.fn();

jest.mock("../../hooks/useAlert", () => () => {
  const useAlert = jest.requireActual("../../hooks/useAlert");
  return {
    ...useAlert,
    displayMessage: mockDisplayMessage,
  };
});
const handleSubmit = jest.fn();

describe("<Login />", () => {
  it("renders LoginForm component", async () => {
    let div = document.createElement("div");

    await act(async () => {
      render(
        <BrowserRouter>
          <MockedProvider mocks={[mock]} addTypename={false}>
            <MockTheme>
              <LoginForm onSubmit={handleSubmit} />
            </MockTheme>
          </MockedProvider>
        </BrowserRouter>,
        div
      );
    });
    // await act(()=>wait(0))
    // await waitFor(
    //   () => {
    //     expect(handleSubmit).toHaveBeenCalledTimes(1);
    //   },
    //   { timeout: 1000 }
    // );
    // div.update();
    expect(div).toBeTruthy();
    screen.debug();
    expect(div).toHaveTextContent("Login");
    const email = document.querySelector("input[name='email']");
    const password = document.querySelector("input[name='password']");
    const button = document.querySelector("button");

    // const { getByRole, getByText } = render(
    //   <BrowserRouter>
    //     <MockedProvider mocks={[mock]} addTypename={false}>
    //       <MockTheme>
    //         {/* //         <Provider store={store}> */}
    //         <LoginForm onSubmit={handleSubmit} />
    //       </MockTheme>
    //     </MockedProvider>
    //   </BrowserRouter>,
    //   //
    //   div
    // );
    // const button = getByRole("button");
    // const password = getByRole("textbox", { Name: "password" });
    // const email = getByRole("textbox", { Name: "Enter your email" });
    // it("Should render input fields, image and button  component", async () => {
    //   expect(button).toBeInTheDocument();
    //   expect(getByText("Login")).toBeInTheDocument();
    //   expect(password).toBeInTheDocument();
    //   expect(email).toBeInTheDocument();
    //   expect(getByRole("checkbox")).toBeInTheDocument();
    //   expect(
    //     getByRole("link", { Name: "Forget Password" })
    //   ).not.toHaveAccessibleDescription();
    // });
    // "@testing-library/user-event": "^12.1.10",
    // it("click on the login Button", async () => {
    //   const user = userEvent.setup();
    //   await userEvent.type(email, "hospital@heala.ng");
    //   await userEvent.type(password, "60328840");
    //   await userEvent.click(button);
    //   // expect(email.textContent).toMatch("hospital@heala.ng");

    //   await waitFor(() => {
    //     expect(handleSubmit).toHaveBeenCalledWith({
    //       email: "hospital@heala.ng",
    //       password: "60328840",
    //     });
    //     expect(email).toHaveValue("hospital@heala.ng");
    //     expect(mockDisplayMessage).toHaveBeenCalledWith(
    //       "success",
    //       "Login Successful"
    //     );
    //   });
    // });
  });
});
