// src/api.js

const API_BASE = "https://interview-23uz.onrender.com"; // Replace with live backend

export async function uploadResume(file, sessionId) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('session_id', sessionId);
  const resp = await fetch(`${API_BASE}/upload_resume/`, { method: "POST", body: formData });
  return await resp.json();
}

export async function uploadJD(jdText, sessionId) {
  const formData = new FormData();
  formData.append('jd_text', jdText);
  formData.append('session_id', sessionId);
  const resp = await fetch(`${API_BASE}/upload_jd/`, { method: "POST", body: formData });
  return await resp.json();
}

export async function uploadVoice(file, sessionId) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('session_id', sessionId);
  const resp = await fetch(`${API_BASE}/upload_voice/`, { method: "POST", body: formData });
  return await resp.json();
}

export async function sendInterviewText(question, sessionId) {
  const formData = new FormData();
  formData.append('question', question);
  formData.append('session_id', sessionId);
  const resp = await fetch(`${API_BASE}/interview_text/`, { method: "POST", body: formData });
  return await resp.json();
}
