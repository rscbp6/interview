from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import openai
import io, os

from .ai_utils import answer_question
from .temp_store import session_store

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

# Use environment variable for OpenAI key
openai.api_key = os.getenv("OPENAI_API_KEY")

@app.post("/upload_resume/")
async def upload_resume(file: UploadFile = File(...), session_id: str = Form(...)):
    contents = await file.read()
    session_store[session_id] = session_store.get(session_id, {})
    session_store[session_id]['resume'] = contents
    return {"msg": "Resume uploaded."}

@app.post("/upload_jd/")
async def upload_jd(jd_text: str = Form(...), session_id: str = Form(...)):
    session_store[session_id] = session_store.get(session_id, {})
    session_store[session_id]['jd'] = jd_text
    return {"msg": "Job description received."}

@app.post("/upload_voice/")
async def upload_voice(file: UploadFile = File(...), session_id: str = Form(...)):
    # Save reference audio for speaker identification
    contents = await file.read()
    session_store[session_id] = session_store.get(session_id, {})
    session_store[session_id]['voiceprint'] = contents
    return {"msg": "Voice sample registered."}

@app.post("/interview_audio/")
async def interview_audio(file: UploadFile = File(...), session_id: str = Form(...)):
    contents = await file.read()
    transcript = "Simulated question from interviewer."
    is_interviewee = True  # Placeholder, should add voice matching
    if not is_interviewee:
        return JSONResponse({"msg": "Voice does not match interviewee. AI answer withheld."})
    ai_answer = answer_question(
        transcript,
        session_store[session_id].get('resume'),
        session_store[session_id].get('jd')
    )
    return {"transcript": transcript, "answer": ai_answer}

@app.post("/interview_text/")
async def interview_text(question: str = Form(...), session_id: str = Form(...)):
    ai_answer = answer_question(
        question,
        session_store[session_id].get('resume'),
        session_store[session_id].get('jd')
    )
    return {"answer": ai_answer}

@app.get("/")
def health_check():
    return {"status": "API running"}
