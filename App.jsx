import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [file, setFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [speakers, setSpeakers] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
  if (!file) return;
  setLoading(true);
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post("http://localhost:8000/transcribe", formData);
    setTranscript(response.data.transcript);
    setSummary(response.data.summary);
  } catch (error) {
    console.error("Error uploading file:", error);
  } finally {
    setLoading(false);
  }
};


  const handleDownload = () => {
    const content =
      transcript + "\n\nSummary:\n" + summary +
      (speakers ? "\n\nSpeakers:\n" + JSON.stringify(speakers, null, 2) : "");
    const element = document.createElement("a");
    const fileBlob = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(fileBlob);
    element.download = "transcript.txt";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Speech-to-Text Transcriber</h1>

      <input type="file" accept="audio/*" onChange={handleFileChange} className="mb-4" />
      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Transcribing..." : "Upload & Transcribe"}
      </button>

      {transcript && (
        <div className="mt-6 bg-white rounded shadow p-4">
          <h2 className="text-xl font-semibold mb-2">📝 Transcript</h2>
          <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-4 rounded-md overflow-auto">
            {transcript}
          </pre>

          <h2 className="text-xl font-semibold mt-4 mb-2">🧠 Summary</h2>
          <p className="text-sm bg-blue-50 p-3 rounded-md">{summary}</p>

          {speakers && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2">🗣️ Speakers</h2>
              <pre className="whitespace-pre-wrap text-sm bg-yellow-50 p-4 rounded-md overflow-auto">
                {JSON.stringify(speakers, null, 2)}
              </pre>
            </div>
          )}

          <button
            onClick={handleDownload}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Download Transcript
          </button>
        </div>
      )}
    </div>
  );
}
