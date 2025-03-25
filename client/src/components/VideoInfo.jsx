import {
  SentimentSatisfied,
  SentimentDissatisfied,
  SentimentNeutral,
} from "@mui/icons-material";

export default function VideoInfo({ data }) {
  return (
    <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden mb-10 border border-gray-700">
      <div className="md:flex">
        <div className="md:flex-shrink-0 md:w-1/3">
          <img
            className="h-48 w-full object-cover md:h-full"
            src={data.video.thumbnail}
            alt={data.video.title}
          />
        </div>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            {data.video.title}
          </h2>
          <p className="text-gray-400 mb-4">Channel: {data.video.author}</p>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-900/50 text-green-400">
              <SentimentSatisfied className="mr-1" />
              {data.statistics.positive} Positive
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-900/50 text-yellow-400">
              <SentimentNeutral className="mr-1" />
              {data.statistics.neutral} Neutral
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-900/50 text-red-400">
              <SentimentDissatisfied className="mr-1" />
              {data.statistics.negative} Negative
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
