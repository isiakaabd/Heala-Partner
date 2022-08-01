import Patients from "../Patients";
import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { store } from "store";
import "@testing-library/jest-dom/extend-expect";
import { MockedProvider } from "@apollo/client/testing";
import { Provider } from "react-redux";
import MockTheme from "../Utils/MockTheme";
import { patientsMock } from "../Utils/mockquery";
import wait from "waait";

/* Resources used to learn*/

/* video on testing graphql
 https://www.youtube.com/watch?v=gg-H6yY2xw0
 https://www.youtube.com/watch?v=_X-_X-_X-_X&list=PL-osiE80TeTt2d9bfVyTiXJA-i1sel30w&index=1

 mock provider for multiple queries
 https://spin.atomicobject.com/2022/07/11/multiple-queries-mock-provider/
 https:stackoverflow.com/questions/66455345/apollos-mockedprovider-doenst-work-when-a-component-has-multiple-usequerys
https: github.com/apollographql/apollo-client/issues/5920*/

// mocking the usealert hook
jest.mock("../../hooks/useAlert", () => () => {
  const useAlert = jest.requireActual("../../hooks/useAlert");
  return {
    ...useAlert,
    displayMessage: jest.fn(),
  };
});

beforeEach(async () => {
  render(
    <BrowserRouter>
      <MockedProvider mocks={patientsMock} addTypename={false}>
        <MockTheme>
          <Provider store={store}>
            <Patients />
          </Provider>
        </MockTheme>
      </MockedProvider>
    </BrowserRouter>
  );
});

afterAll(async () => {
  const { container } = render(
    <BrowserRouter>
      <MockedProvider mocks={patientsMock} addTypename={false}>
        <MockTheme>
          <Provider store={store}>
            <Patients />
          </Provider>
        </MockTheme>
      </MockedProvider>
    </BrowserRouter>
  );
  await wait(1);

  expect(container).toMatchSnapshot();
});

//  This test is to check if the component renders correctly
describe("<Patients Page />", () => {
  it("Should render the graphQL data correctly", async () => {
    const x = await screen.findByText("Damilare Heala");
    expect(x).toBeInTheDocument();
  });
  it("ensure the loader is displayed", () => {
    const loader = screen.getByTestId("loader");
    expect(loader).toBeInTheDocument();
  });
  it("should show pagination data", async () => {
    const x = await screen.findByText("Patients per page");
    expect(x).toBeInTheDocument();
  });
  it("Ensure data is consistent", async () => {
    const x = await screen.findByTestId("test-value");
    expect(x).toHaveTextContent("Paelon Memorial Hospital");
  });
});
