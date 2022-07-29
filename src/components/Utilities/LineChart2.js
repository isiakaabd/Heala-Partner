import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Line } from "react-chartjs-2";

const LineChart2 = ({ type, graphState }) => {
  const theme = useTheme();
  const [state, setState] = useState("active");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const z = graphState?.data?.map((i) => i?.sum);
    setState(graphState?.state);
    setChartData(z);

    // if (activeChartData) {
    //   const z = activeChartData.map((i) => i?.sum);
    //   setActives(z);
    // }
  }, [type, graphState?.data, graphState?.state]);
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
        fill: false,
        cursor: "pointer",
        borderColor:
          state === "active"
            ? theme.palette.common.green
            : theme.palette.common.red,
        pointBackgroundColor:
          state === "active"
            ? theme.palette.common.green
            : theme.palette.common.red,
        pointBorderColor: "#fff",
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBorderWidth: 2,
        tension: 0.5,
      },
      // {
      //   label: "Inactive",
      //   data: inActives,
      //   fill: false,
      //   borderColor: theme.palette.common.red,
      //   pointBackgroundColor: theme.palette.common.red,
      //   pointBorderColor: "#fff",
      //   pointRadius: 5,
      //   pointHoverRadius: 7,
      //   pointBorderWidth: 2,
      //   tension: 0.5,
      // },
    ],
  };

  const options = {
    locale: "fr",
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#ffff",
          borderDash: [5, 8],
          display: false,
        },
      },
      x: {
        grid: {
          color: "#ffff",
          borderDash: [5, 8],
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
        titleColor: colorItem,
        onHover: hover,
        bodyColor: theme.palette.common.lightGrey,
        titleAlign: "left",
        bodyAlign: "left",
        borderColor: "rgba(0, 0, 0, 0.05)",
        borderWidth: 2,
        displayColors: true,
        boxHeight: 0,
        boxWidth: 0,
        yAlign: "bottom",
        usePointStyle: true,
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
