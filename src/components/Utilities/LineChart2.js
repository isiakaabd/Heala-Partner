import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Line } from "react-chartjs-2";

const LineChart2 = ({ doctorStats, type }) => {
  const theme = useTheme();
  const [actives, setActives] = useState([]);
  const [inActives, setInActives] = useState([]);
  useEffect(() => {
    const doc = doctorStats.oneYear;
    if (doc && doc.inactiveCount) {
      const z = doc.inactiveCount.map((i) => i.count);
      setInActives(z);
    }
    if (doc && doc.activeCount) {
      const z = doc.activeCount.map((i) => i.count);
      setActives(z);
    }
  }, [doctorStats, type]);
  const data = {
    labels: ["1 DAY", "5 DAYS", "1 MONTH", "3 MONTHS", "1 YEAR"],
    datasets: [
      {
        label: "Active",
        data: actives,
        fill: false,
        cursor: "pointer",
        borderColor: theme.palette.common.green,
        pointBackgroundColor: theme.palette.common.green,
        pointBorderColor: "#fff",
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBorderWidth: 2,
        tension: 0.5,
      },
      {
        label: "Inactive",
        data: inActives,
        fill: false,
        borderColor: theme.palette.common.red,
        pointBackgroundColor: theme.palette.common.red,
        pointBorderColor: "#fff",
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBorderWidth: 2,
        tension: 0.5,
      },
    ],
  };

  const options = {
    locale: "fr",
    // maintainAspectRatio: false,
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

LineChart2.propTypes = {
  timeFrames: PropTypes.array,
  selectedTimeframe: PropTypes.number,
  setSelectedTimeframe: PropTypes.func,
  type: PropTypes.string,
  doctorStats: PropTypes.array,
};

export default LineChart2;
