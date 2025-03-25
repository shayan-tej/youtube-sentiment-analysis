export default function SentimentStats({ data }) {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-md border border-gray-700">
      <h3 className="text-lg font-medium text-white mb-4 text-center">
        Analysis Summary
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="text-gray-400">Total Comments:</span>
          <span className="font-medium text-white">
            {data.statistics.total}
          </span>
        </div>
        <div className="flex justify-between border-b border-gray-700 pb-2">
          <span className="text-gray-400">Average Polarity:</span>
          <span className="font-medium text-white">
            {data.statistics.avg_polarity}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Average Subjectivity:</span>
          <span className="font-medium text-white">
            {data.statistics.avg_subjectivity}
          </span>
        </div>
      </div>
    </div>
  );
}
