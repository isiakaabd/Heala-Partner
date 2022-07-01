import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Line } from "react-chartjs-2";
import { monthNames } from "components/Utilities/Time";

const LineChart = ({ details }) => {
  const theme = useTheme();
  const [state, setState] = useState([]);

  useEffect(() => {
    setState(
      details &&
        Object.keys(details)
          .map((key) => details[key].sum)
          .filter((element) => {
            return element !== undefined;
          })
    );
  }, [details]);

  const data = {
    labels: monthNames,

    datasets: [
      {
        label: "Orders",
        data: state,
        fill: false,
        borderColor: theme.palette.common.red,
        pointBackgroundColor: theme.palette.common.red,
        pointBorderColor: theme.palette.common.red,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBorderWidth: 0,
        tension: 0.5,
      },
    ],
  };

  const options = {
    locale: "fr",
    maintainAspectRatio: true,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#ffff",
          borderDash: [2, 3],
        },
      },
      x: {
        display: true,
        grid: {
          color: "#ffff",
          borderDash: [2, 3],
        },
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
        titleAlign: "center",
        bodyAlign: "center",
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
    event.target.style.cursor = chartElement[0] ? "pointer" : "default";
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

LineChart.propTypes = {
  timeFrames: PropTypes.array,
  selectedTimeframe: PropTypes.number,
  setSelectedTimeframe: PropTypes.func,
  tooltipTitle: PropTypes.string,
};

export default LineChart;
