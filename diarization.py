import os
from pyannote.audio import Pipeline

os.environ["HUGGINGFACE_TOKEN"] = ""

pipeline = Pipeline.from_pretrained(
    "pyannote/speaker-diarization@2.1",
    use_auth_token=os.getenv("HUGGINGFACE_TOKEN")
)

def diarize_speakers(audio_path: str):
    diarization = pipeline(audio_path)
    segments = []
    for turn, _, speaker in diarization.itertracks(yield_label=True):
        segments.append({
            "start": turn.start,
            "end": turn.end,
            "speaker": speaker
        })
    return segments
