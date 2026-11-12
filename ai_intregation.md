## AI Integration — Groq API

**Provider:** Groq  
**API:** Official Groq API  
**Documentation:** https://console.groq.com/docs

### Environment configuration

GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=your_selected_model

### Requirements

- Use the user's own Groq API key.
- Make the model configurable.
- Use the official Groq API.
- Support streaming responses where available.
- Handle API errors and rate limits.
- Maintain conversation context.
- Provide beginner-friendly Python explanations.
- Focus on the nine curriculum chapters.
- Never expose the API key in frontend JavaScript.
- Never use NEXT_PUBLIC for the API key.

### Architecture

Next.js Frontend
    |
    v
Minimal Serverless API Route
    |
    v
Groq API
    |
    v
AI Python Assistant

The serverless route exists only to protect the API credentials. No database or traditional backend is required.

The AI integration must be modular so the model can be changed without modifying the chat interface.