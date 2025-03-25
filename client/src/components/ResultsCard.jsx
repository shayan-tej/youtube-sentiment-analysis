import VideoInfo from "./VideoInfo";
import SentimentChart from "./SentimentChart";
import SentimentStats from "./SentimentStats";
import CommentCard from "./CommentCard";

export default function ResultsCard({ data }) {
  return (
    <>
      <VideoInfo data={data} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <SentimentChart data={data} />
        <SentimentStats data={data} />
      </div>

      <h3 className="text-2xl font-bold text-white mb-6">Comments Analysis</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.comments.map((comment, index) => (
          <CommentCard key={index} comment={comment} />
        ))}
      </div>
    </>
  );
}
