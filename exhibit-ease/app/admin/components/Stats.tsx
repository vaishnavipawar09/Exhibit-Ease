// components/MyLineChart.tsx
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

// Register ChartJS components using ChartJS.register
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);
import { useEffect, useState } from "react";

const MyChart = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{ data: [] }],
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
    <div className="col-xs-12">
      <Line data={chartData} />
    </div>
  );
};

export default MyChart;

// const MyChart = () => {
//   return (
//     <div className="col-xs-12">
//       <Line
//         data={{
//           labels: [
//             "2023-01",
//             "2023-02",
//             "2023-03",
//             "2023-04",
//             "2023-05",
//             "2023-06",
//             "2023-07",
//           ],
//           datasets: [
//             {
//               data: [100, 120, 115, 134, 168, 132, 200],
//               backgroundColor: "purple",
//             },
//           ],
//         }}
//       />
//     </div>
//   );
// };
// export default MyChart;
