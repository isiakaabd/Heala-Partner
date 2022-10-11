import React, { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Line } from "react-chartjs-2";
import { monthNames } from "components/Utilities/Time";

const HmoLineChart = ({ graphState, optionsValue, opt }) => {
  const theme = useTheme();
  const [arr, setArr] = useState([]);

  useMemo(() => {
    const currentGraphData = (graphState?.data?.[opt] || []).map(
      (data) => data?.sum || 0
    );
    setArr(currentGraphData);
  }, [graphState?.data, opt]);

  const lx = optionsValue.map((i) => {
    let x;
    const { value } = i;

    if (value === opt) {
      x = {
        label: value,
        data: arr,
        fill: true,
        color: "#f00",
        borderColor: theme.palette.common.red,

        pointBackgroundColor: theme.palette.common.red,
        pointBorderColor: "#fff",
        pointRadius: 2,
        pointHoverRadius: 2,
        pointBorderWidth: 2,
        tension: 0.5,
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;

          const gradient = ctx.createLinearGradient(0, 0, 0, 330);
          gradient.addColorStop(0, "rgba(62, 94, 209, .05)");
          gradient.addColorStop(1, "rgba(255,255,255,0.3)");
          return gradient;
        },
      };
    } else return null;
    return x;
  });
  const j = lx.filter((n) => n);

  const data = {
    labels: monthNames,
    backgroundColor: "#fff",
    datasets: [...j],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    backgroundColor: "#f3f3f3",
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
          speechSynthesis: true,
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
  function hover(event) {
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
      <Line data={data} options={options} />
    </Grid>
  );
};

HmoLineChart.propTypes = {
  timeFrames: PropTypes.array,
  optionsValue: PropTypes.array,
  selectedTimeframe: PropTypes.number,
  setSelectedTimeframe: PropTypes.func,
  doctorStats: PropTypes.array,
  graphState: PropTypes.object,
  opt: PropTypes.object,
};

export default HmoLineChart;
