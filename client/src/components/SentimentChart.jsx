import { useEffect, useRef } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

export default function SentimentChart({ data }) {
  const chartRef = useRef(null);

  // Chart data configuration
  const chartData = {
    labels: ["Positive", "Negative", "Neutral"],
    datasets: [
      {
        data: [
          data.statistics.positive,
          data.statistics.negative,
          data.statistics.neutral,
        ],
        backgroundColor: [
          "rgba(74, 222, 128, 0.7)",
          "rgba(248, 113, 113, 0.7)",
          "rgba(251, 191, 36, 0.7)",
        ],
        borderColor: [
          "rgba(74, 222, 128, 1)",
          "rgba(248, 113, 113, 1)",
          "rgba(251, 191, 36, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    plugins: {
      legend: {
        labels: {
          color: "#fff",
        },
      },
    },
    maintainAspectRatio: false,
  };

  // Cleanup chart instance on unmount
  useEffect(() => {
    const chartInstance = chartRef.current;

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []);

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700">
      <h3 className="text-lg font-medium text-white mb-4 text-center">
        Sentiment Distribution
      </h3>
      <div className="h-64">
        <Pie ref={chartRef} data={chartData} options={options} redraw={true} />
      </div>
    </div>
  );
}
