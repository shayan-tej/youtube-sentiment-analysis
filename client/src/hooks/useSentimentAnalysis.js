import { useState } from "react";
import axios from "axios";

export const useSentimentAnalysis = () => {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!url) {
      setError("Please enter a YouTube URL");
      return;
    }

    setLoading(true);
    setError("");
    setData(null);

    try {
      const response = await axios.post("http://localhost:5000/analyze", {
        url,
        max_comments: 100,
      });
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to analyze comments");
    } finally {
      setLoading(false);
    }
  };

  return { url, setUrl, loading, data, error, analyze };
};
