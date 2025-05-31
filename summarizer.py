from transformers import pipeline

# we use BART model for summarization
summarizer = pipeline("summarization", model="facebook/bart-large-cnn")

def generate_summary(text: str) -> str:
    try:
        if len(text) > 1000:
            text = text[:1000]  # Hugging Face model input limit
        summary = summarizer(text, max_length=130, min_length=30, do_sample=False)
        return summary[0]['summary_text']
    except Exception as e:
        return f"Summary generation failed: {str(e)}"
