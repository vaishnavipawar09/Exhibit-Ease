"use client";

import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const MyChart = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/stats");
      const data = await response.json();
      setChartData(data.data.map((value, index) => ({ x: data.labels[index], y: value })));
    };

    fetchData();
  }, []);

  return (
    <div className="col-xs-1">
      My stats:
      <LineChart width={600} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="y" stroke="purple" />
      </LineChart>
    </div>
  );
};

export default MyChart;