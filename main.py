from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from transcription import transcribe_audio
from diarization import diarize_speakers
from summarizer import generate_summary
import os
import shutil

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # this is only for development, not for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/transcribe/")
async def transcribe(file: UploadFile = File(...)):
    # file save on disk
    filepath = os.path.join(UPLOAD_DIR, file.filename)
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    #  transcription of audio file
    text = transcribe_audio(filepath)

    # Speaker diarization result 
    speakers = diarize_speakers(filepath)

    # Transcript summary
    summary = generate_summary(text)

    # JSON response return to frontend 
    return {
        "transcript": text,
        "speakers": speakers,
        "summary": summary
    }
