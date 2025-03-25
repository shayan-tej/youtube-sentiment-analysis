import Header from "./components/Header";
import InputForm from "./components/InputForm";
import ResultsCard from "./components/ResultsCard";
import { useSentimentAnalysis } from "./hooks/useSentimentAnalysis";

export default function App() {
  const { url, setUrl, loading, data, error, analyze } = useSentimentAnalysis();

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <InputForm
          url={url}
          setUrl={setUrl}
          loading={loading}
          analyze={analyze}
          error={error}
        />
        {data && <ResultsCard data={data} />}
      </div>
    </div>
  );
}
