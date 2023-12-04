"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Tooltip,
  PointElement,
  LineElement,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";

// Register ChartJS components using ChartJS.register
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

const MyChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [], backgroundColor: "purple", }],
  });

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/stats");
      const data = await response.json();
      setChartData({
        labels: data.labels,
        datasets: [
          {
            data: data.data,
            backgroundColor: "purple",
          },
        ],
      });
    };

    fetchData();
  }, []);

  return (
    <div>
      My stats
      <Line data={chartData} width={800} height={800} />
    </div>
  );
};

export default MyChart;
