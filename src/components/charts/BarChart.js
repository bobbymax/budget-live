/* eslint-disable no-unused-vars */
import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { months } from "../../services/utils/helpers";

const BarChart = ({ chartData }) => {
  const labels = months.short;
  // console.log(chartData);
  const data = {
    labels,
    datasets: [
      {
        label: "Actual Expenses",
        data: labels.map((label) => chartData[label] && chartData[label][0]),
        backgroundColor: ["rgba(41, 128, 185, 1.0)"],
      },
      {
        label: "Expected Expenses",
        data: labels.map((label) => chartData[label] && chartData[label][1]),
        backgroundColor: ["rgba(39, 174, 96, 1.0)"],
      },
    ],
  };

  return <Bar data={data} />;
};

export default BarChart;
