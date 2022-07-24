import { renderHook, act, cleanup } from "@testing-library/react-hooks";
import useCopy from "components/hooks/useCopy";

// https://stackoverflow.com/questions/62351935/how-to-mock-navigator-clipboard-writetext-in-jest

// mocking the clipboard
Object.assign(navigator, {
  clipboard: {
    writeText: () => {},
  },
});

beforeEach(cleanup);
afterEach(() => {
  jest.clearAllMocks();
});
// mocking the display function
const mockDisplayMessage = jest.fn();

// mocking the usealert hook
jest.mock("../useAlert", () => () => {
  const useAlert = jest.requireActual("../useAlert");
  return {
    ...useAlert,
    displayMessage: mockDisplayMessage,
  };
});

describe("useCopy hook", () => {
  test("Ensure Test has been copied to clipboard", async () => {
    const { result } = renderHook(() => useCopy());

    jest.spyOn(navigator.clipboard, "writeText");
    act(() => {
      result.current.copyToClipBoard("This is a copied text", "text");
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "This is a copied text"
    );
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
    expect(mockDisplayMessage).toHaveBeenCalledWith(
      "success",
      "text copied!!!"
    );
  });

  // second test
  test("ensuring the display method for alert is called", () => {
    const { result } = renderHook(() => useCopy());
    jest.spyOn(navigator.clipboard, "writeText");
    act(() => {
      result.current.copyToClipBoard("text", "Nigeria");
    });

    expect(mockDisplayMessage).toHaveBeenCalledWith(
      "success",
      "Nigeria copied!!!"
    );
  });
  test("ensuring display method is called once", () => {
    const { result } = renderHook(() => useCopy());
    jest.spyOn(navigator.clipboard, "writeText");
    act(() => {
      result.current.copyToClipBoard("This is a copied text", "text");
    });

    expect(mockDisplayMessage).toHaveBeenCalledTimes(1);
  });
});
