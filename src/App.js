// src/App.js
import React, { useRef, useState } from "react";
import { uploadResume, uploadJD, uploadVoice, sendInterviewText } from "./api";
import "./App.css";

function getSessionId() {
  // Simple random session key (could use UUID)
  return localStorage.getItem("session_id") ||
    (() => {
      const id = Math.random().toString(36).substr(2, 9);
      localStorage.setItem("session_id", id);
      return id;
    })();
}

export default function App() {
  const [resumeStatus, setResumeStatus] = useState("");
  const [jdStatus, setJDStatus] = useState("");
  const [voiceStatus, setVoiceStatus] = useState("");
  const [interviewInput, setInterviewInput] = useState("");
  const [aiAnswer, setAIAnswer] = useState("");
  const [transcript, setTranscript] = useState("");
  const [loading, setLoading] = useState(false);

  const jdRef = useRef(null);

  const sessionId = getSessionId();

  // Upload Resume
  async function handleResume(e) {
    setResumeStatus("Uploading...");
    const file = e.target.files[0];
    if (!file) return;
    const resp = await uploadResume(file, sessionId);
    setResumeStatus(resp.msg);
  }

  // Upload JD
  async function handleJD() {
    setJDStatus("Uploading...");
    const jdText = jdRef.current.value;
    const resp = await uploadJD(jdText, sessionId);
    setJDStatus(resp.msg);
  }

  // Upload Voice Reference
  async function handleVoice(e) {
    setVoiceStatus("Uploading...");
    const file = e.target.files[0];
    if (!file) return;
    const resp = await uploadVoice(file, sessionId);
    setVoiceStatus(resp.msg);
  }

  // Send Interview/Transcript
  async function handleInterview(e) {
    e.preventDefault();
    setLoading(true);
    setTranscript(interviewInput);
    setAIAnswer("");
    const resp = await sendInterviewText(interviewInput, sessionId);
    setAIAnswer(resp.answer);
    setLoading(false);
  }

  return (
    <div className="container">
      <h1>AI Interview Candidate</h1>

      <div className="block">
        <label>Upload Resume (PDF/Doc):</label>
        <input type="file" accept=".pdf,.doc,.docx" onChange={handleResume} />
        <span>{resumeStatus}</span>
      </div>

      <div className="block">
        <label>Paste Job Description:</label>
        <textarea ref={jdRef} rows={5}></textarea>
        <button onClick={handleJD}>Upload JD</button>
        <span>{jdStatus}</span>
      </div>

      <div className="block">
        <label>Upload Reference Voice (WAV/MP3):</label>
        <input type="file" accept="audio/*" onChange={handleVoice} />
        <span>{voiceStatus}</span>
      </div>

      <hr />

      <div className="block">
        <label>Live Interview Text Input</label>
        <form onSubmit={handleInterview}>
          <input
            type="text"
            value={interviewInput}
            onChange={e => setInterviewInput(e.target.value)}
            placeholder="Type interviewer question..."
            style={{ width: "100%" }}
          />
          <button type="submit" disabled={loading}>Send</button>
        </form>
      </div>
      {loading && <div className="block">Waiting for AI answer...</div>}

      <div className="block">
        <label>Transcript:</label>
        <div className="transcript">{transcript}</div>
      </div>

      <div className="block">
        <label>AI Answer:</label>
        <div className="ai-answer">{aiAnswer}</div>
      </div>
    </div>
  );
}
