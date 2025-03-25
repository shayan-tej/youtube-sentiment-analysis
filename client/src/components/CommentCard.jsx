import {
  SentimentSatisfied,
  SentimentDissatisfied,
  SentimentNeutral,
  ThumbUp,
  Person,
  CalendarToday,
} from "@mui/icons-material";

export default function CommentCard({ comment }) {
  const getSentimentIcon = () => {
    switch (comment.sentiment) {
      case "positive":
        return <SentimentSatisfied className="text-green-400" />;
      case "negative":
        return <SentimentDissatisfied className="text-red-400" />;
      default:
        return <SentimentNeutral className="text-yellow-400" />;
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-700">
      <div className="flex items-center mb-2">
        {getSentimentIcon()}
        <span className="ml-2 text-sm font-medium uppercase text-gray-300">
          {comment.sentiment}
        </span>
      </div>
      <p className="text-gray-300 mb-3 italic">"{comment.text}"</p>
      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
        <span className="flex items-center">
          <Person className="mr-1" />
          {comment.author}
        </span>
        <span className="flex items-center">
          <ThumbUp className="mr-1" />
          {comment.likes}
        </span>
        {comment.published && (
          <span className="flex items-center">
            <CalendarToday className="mr-1" />
            {new Date(comment.published).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}
