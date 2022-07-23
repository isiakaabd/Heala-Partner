import { renderHook, act, cleanup } from "@testing-library/react-hooks";
import useCopy from "components/hooks/useCopy";
import useAlert from "components/hooks/useAlert";

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

jest.mock("../useAlert", () => jest.fn());
// jest.mock("../useCopy", () => jest.fn());

test("calling the display message function", async () => {
  const { result } = renderHook(() => useCopy());

  jest.spyOn(navigator.clipboard, "writeText");
  jest.spyOn(useAlert().displayMessage, "displayMessage");
  act(() => {
    result.current.copyToClipBoard("This is a copied text", "text");
  });

  expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
    "This is a copied text"
  );
  expect(navigator.clipboard.writeText).toHaveBeenCalled();
});

// second test
test("ensuring the text has been copied to clipboard", () => {
  const { result } = renderHook(() => useCopy());
  jest.spyOn(navigator.clipboard, "writeText");
  act(() => {
    result.current.copyToClipBoard("This is a copied text", "text");
  });

  expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
    "This is a copied text"
  );
});
