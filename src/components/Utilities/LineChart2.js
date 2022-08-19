import React, { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Line } from "react-chartjs-2";
import { monthNames } from "components/Utilities/Time";
const LineChart2 = ({ graphState, optionsValue, type }) => {
  const theme = useTheme();
  const [state, setState] = useState("");
  const gold = theme.palette.common.gold;
  const [arr, setArr] = useState([]);
  useEffect(() => {
    setState(graphState?.state);
  }, [graphState?.state]);
  const active = useMemo(
    () => graphState?.data?.active?.map((i) => i?.sum),
    [graphState?.data?.active]
  );
  const inactive = useMemo(
    () => graphState?.data?.inactive?.map((i) => i?.sum),
    [graphState?.data?.inactive]
  );
  const complete = useMemo(
    () => graphState?.data?.complete?.map((i) => i?.sum),
    [graphState?.data?.complete]
  );
  const accept = useMemo(
    () => graphState?.data?.accept?.map((i) => i?.sum),
    [graphState?.data?.accept]
  );
  const cancel = useMemo(
    () => graphState?.data?.cancel?.map((i) => i?.sum),
    [graphState?.data?.cancel]
  );
  const decline = useMemo(
    () => graphState?.data?.decline?.map((i) => i?.sum),
    [graphState?.data?.decline]
  );
  const ongoing = useMemo(
    () => graphState?.data?.ongoing?.map((i) => i?.sum),
    [graphState?.data?.ongoing]
  );
  const earning = useMemo(
    () => graphState?.data?.earning?.map((i) => i?.sum),
    [graphState?.data?.earning]
  );
  const payout = useMemo(
    () => graphState?.data?.payout?.map((i) => i?.sum),
    [graphState?.data?.payout]
  );
  useEffect(() => {
    if (type === "consultation") {
      setArr([accept, complete, decline, ongoing, cancel]);
      switch (state) {
        case "all":
          return setArr([accept, complete, decline, ongoing, cancel]);
        case "Accepted":
          return setArr([accept, [], [], [], []]);
        case "Completed":
          return setArr([[], complete, [], [], []]);
        case "Declined":
          return setArr([[], [], decline, [], []]);
        case "Ongoing":
          return setArr([[], [], [], ongoing, []]);
        case "Cancelled":
          return setArr([[], [], [], [], cancel]);
        default:
          return setArr([active, inactive]);
      }
    } else if (type === "finance") {
      setArr([earning, payout]);
      switch (state) {
        case "all":
          return setArr([earning, payout]);
        case "Earnings":
          return setArr([earning, []]);
        case "Payouts":
          return setArr([[], payout]);
        default:
          return setArr([earning, payout]);
      }
    } else {
      setArr([active, inactive]);

      if (state === "active") {
        return setArr([active, []]);
      } else if (state === "inactive") {
        return setArr([[], inactive]);
      }
    }
  }, [
    graphState,
    state,
    type,
    decline,
    active,
    ongoing,
    cancel,
    accept,
    earning,
    payout,
    complete,
    inactive,
  ]);

  const lx = optionsValue.slice(1).map((i, index) => {
    const { value } = i;
    return {
      label: value,
      data: arr[index],
      fill: false,
      borderColor:
        value === "active" ||
        value === "Completed" ||
        value === "hospital" ||
        value === "Accepted" ||
        value === "Earnings"
          ? theme.palette.common.green
          : value === "inactive" ||
            value === "pharmacy" ||
            value === "Ongoing" ||
            value === "Payouts"
          ? theme.palette.common.red
          : gold,
      pointBackgroundColor:
        value === "active" ||
        value === "Completed" ||
        value === "hospital" ||
        value === "Accepted" ||
        value === "Earnings"
          ? theme.palette.common.green
          : value === "inactive" ||
            value === "pharmacy" ||
            value === "Ongoing" ||
            value === "Payouts"
          ? theme.palette.common.red
          : gold,
      pointBorderColor: "#fff",
      pointRadius: 5,
      pointHoverRadius: 7,
      pointBorderWidth: 2,
      tension: 0.5,
    };
  });

  const data = {
    labels: monthNames,
    backgroundColor: "#fff",
    datasets: [...lx],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    locale: "fr",
    scales: {
      y: {
        ticks: {
          beginAtZero: true,
          callback: function (value) {
            if (value % 1 === 0) {
              return value;
            }
          },
        },
        min: 0,
        grid: {
          color: "rgba(0,0,0,0.05)",
          borderColor: "rgba(0,0,0,0.05)",
          borderDash: [10, 10],
          display: true,
        },
      },
      x: {
        grid: {
          color: "#fff",
          borderDash: [2, 2],
          borderColor: "rgba(0,0,0,0.05)",
          display: false,
        },
        display: true,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#fff",
        cursor: "pointer",
        titleColor: colorItem,
        onHover: hover,
        bodyColor: "rgba(0, 0, 0, 1)",

        titleAlign: "left",
        bodyAlign: "left",
        borderColor: "rgba(0, 0, 0, 0.05)",

        borderWidth: 3,
        displayColors: true,
        boxHeight: 0,
        boxWidth: 0,
        yAlign: "top",
        usePointStyle: true,
        callbacks: {
          labelPointStyle: (context) => {
            return {
              pointStyle: "rectangle",
              rotation: 0,
              cursor: "pointer",
            };
          },
        },
      },
    },
  };
  function hover(event, chartElement) {
    const x = (event.target.style.cursor = "pointer");
    return x;
  }
  function colorItem(tooltipItem) {
    const tooltipTitleColor =
      tooltipItem.tooltip.labelColors[0].backgroundColor;

    return tooltipTitleColor;
  }

  return (
    <Grid item container>
      <Line
        data={data}
        options={options}
        style={{ height: "300px", width: "300px" }}
      />
    </Grid>
  );
};

LineChart2.propTypes = {
  timeFrames: PropTypes.array,
  selectedTimeframe: PropTypes.number,
  setSelectedTimeframe: PropTypes.func,
  doctorStats: PropTypes.array,
  graphState: PropTypes.object,
};

export default LineChart2;
