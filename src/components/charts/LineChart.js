/* eslint-disable no-unused-vars */
import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { months } from "../../services/utils/helpers";

const LineChart = ({ month, dataset }) => {
  const selections =
    month !== "all"
      ? months.long.filter((mnth) => mnth === month)
      : months.long;

  const labels = selections;

  const ditterArr = () => {
    let actual = [];
    let booked = [];

    dataset.map((dtr) => actual.push(dtr.actual));
    dataset.map((dtr) => booked.push(dtr.booked));

    return { actual, booked };
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Booked Expenditures",
        data: ditterArr().booked,
        borderColor: "rgba(39, 174, 96, 1.0)",
      },
      {
        label: "Actual Expenditures",
        data: ditterArr().actual,
        borderColor: "rgba(230, 126, 34, 1.0)",
      },
    ],
  };

  return <Line data={data} />;
};

export default LineChart;
