export const chartConfig = (data) => ({
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
});
