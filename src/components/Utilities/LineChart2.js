import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Line } from "react-chartjs-2";

const LineChart2 = ({ type, graphState }) => {
  const theme = useTheme();
  const [state, setState] = useState("active");
  const [chartData, setChartData] = useState([]);
  const lightGreen = "rgba(45, 211, 158, .3)";
  const lightBlue = "rgba(62, 94, 169, .3)";
  useEffect(() => {
    const z = graphState?.data?.map((i) => i?.sum);
    setState(graphState?.state);
    setChartData(z);
  }, [type, graphState]);
  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mar",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: state,
        data: chartData,
        fill: true,
        cursor: "pointer",
        borderColor:
          state === "active"
            ? theme.palette.common.green
            : theme.palette.common.red,
        pointBackgroundColor:
          state === "active"
            ? theme.palette.common.green
            : theme.palette.common.red,
        pointBorderColor:
          state === "active"
            ? theme.palette.common.green
            : theme.palette.common.red,
        pointRadius: 2,
        pointHoverRadius: 5,
        pointHoverColor: "#00f",
        pointBorderWidth: 3,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    locale: "fr",
    scales: {
      y: {
        beginAtZero: false,
        fillColor: state === "active" ? lightGreen : lightBlue,
        grid: {
          color: state === "active" ? lightGreen : lightBlue,
          borderColor: state === "active" ? lightGreen : lightBlue,
          borderDash: [2, 2],
          display: true,
        },
      },
      x: {
        grid: {
          color: state === "active" ? lightGreen : lightBlue,
          borderDash: [2, 2],
          borderColor: state === "active" ? lightGreen : lightBlue,
          display: true,
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
        titleColor: colorItem,
        onHover: hover,
        bodyColor:
          state === "active"
            ? theme.palette.common.green
            : theme.palette.common.red,
        // theme.palette.common.lightGrey,
        titleAlign: "left",
        bodyAlign: "left",
        borderColor:
          state === "active"
            ? theme.palette.common.green
            : theme.palette.common.red,
        // "rgba(0, 0, 0, 0.05)",
        borderWidth: 1,
        displayColors: true,
        boxHeight: 0,
        boxWidth: 0,
        yAlign: "bottom",
        usePointStyle: false,
        callbacks: {
          labelPointStyle: (context) => {
            return {
              pointStyle: "triangle",
              rotation: 0,
              cursor: "pointer",
            };
          },
        },
      },
    },
  };
  function hover(event, chartElement) {
    return (event.target.style.cursor = chartElement[0]
      ? "pointer"
      : "default");
  }
  function colorItem(tooltipItem) {
    const tooltipTitleColor =
      tooltipItem.tooltip.labelColors[0].backgroundColor;

    return tooltipTitleColor;
  }
  return (
    <Grid item container>
      <Line data={data} options={options} />
    </Grid>
  );
};

LineChart2.propTypes = {
  timeFrames: PropTypes.array,
  selectedTimeframe: PropTypes.number,
  setSelectedTimeframe: PropTypes.func,
  type: PropTypes.string,
  doctorStats: PropTypes.array,
};

export default LineChart2;
