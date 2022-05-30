/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const DoughnutChart = ({ chartData, totalApproved }) => {
  const { actualExpenditure, actualBalance } = chartData;

  const act = Math.round((actualExpenditure / totalApproved) * 100);
  const bal = Math.round((actualBalance / totalApproved) * 100);

  const format = {
    labels: ["Expenditure", "Balance"],

    datasets: [
      {
        label: "Budget Utilization",
        data: [act, bal],
        backgroundColor: ["rgba(39, 174, 96, 1.0)", "rgba(41, 128, 185, 1.0)"],
      },
    ],
  };

  return <Doughnut data={format} />;
};

export default DoughnutChart;
