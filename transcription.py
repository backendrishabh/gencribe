import whisper

model = whisper.load_model("base")  # options: tiny, base, small, medium, large, i use base because i have no GPU or heavy CPU

def transcribe_audio(audio_path: str) -> str:
    result = model.transcribe(audio_path)
    return result["text"]

def transcribe_realtime_audio(audio_path: str) -> str:
    try:
        result = model.transcribe(audio_path)
        return result["text"]
    except Exception as e:
        return f"[Error in real-time transcription: {str(e)}]"
