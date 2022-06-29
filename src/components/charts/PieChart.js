/* eslint-disable no-unused-vars */
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const PieChart = ({ figure, title }) => {
  const data = {
    labels: ["Capex", "Recurrent", "Personnel"],
    datasets: [
      {
        label: "My First Dataset",
        data: [figure?.capex, figure?.recurrent, figure?.personnel],
        backgroundColor: [
          "rgb(255, 99, 102)",
          "rgb(54, 162, 80)",
          "rgb(76, 92, 120)",
        ],
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: title,
        position: "left",
      },
      legend: {
        display: true,
        position: "right",
      },
    },
  };

  return <Pie data={data} title={title} options={options} />;
};

export default PieChart;
