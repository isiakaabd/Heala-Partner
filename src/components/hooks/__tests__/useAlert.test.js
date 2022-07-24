import { renderHook, act } from "@testing-library/react-hooks";
import useAlert from "../useAlert";
import { Typography } from "@mui/material";

const mockEnqueue = jest.fn();

jest.mock("notistack", () => ({
  ...jest.requireActual("notistack"),
  useSnackbar: () => {
    return {
      enqueueSnackbar: mockEnqueue,
    };
  },
}));

test("calling the display message function", () => {
  const { result } = renderHook(() => useAlert());
  act(() => {
    result.current.displayMessage("error", "successful");
  });
  expect(mockEnqueue).toHaveBeenCalled();
});
test("should display alert value", () => {
  const { result } = renderHook(() => useAlert());

  act(() => {
    result.current.displayMessage("error", "Failed");
  });
  expect(mockEnqueue).toHaveBeenCalledWith(
    <Typography style={{ fontSize: "1.2rem" }} test-role="data-testing">
      Failed
    </Typography>,
    {
      anchorOrigin: { horizontal: "right", vertical: "top" },
      autoHideDuration: 5000,
      preventDuplicate: true,
      variant: "error",
    }
  );
});
test("should display alert value as success", () => {
  const { result } = renderHook(() => useAlert());

  act(() => {
    result.current.displayMessage("success", "successful");
  });
  expect(mockEnqueue).toHaveBeenCalledWith(
    <Typography style={{ fontSize: "1.2rem" }} test-role="data-testing">
      successful
    </Typography>,
    {
      anchorOrigin: { horizontal: "right", vertical: "top" },
      autoHideDuration: 5000,
      preventDuplicate: true,
      variant: "success",
    }
  );
});
