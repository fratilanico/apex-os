interface GeminiRequest {
  message: string;
  context?: string;
  history?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  systemPrompt?: string;
  model: string;
}

interface GeminiResponse {
  content: string;
}

export async function callGemini(request: GeminiRequest): Promise<GeminiResponse> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const contents = [];
  
  if (request.systemPrompt) {
    contents.push({
      role: 'user',
      parts: [{ text: request.systemPrompt }],
    });
  }
  
  if (request.context) {
    contents.push({
      role: 'user',
      parts: [{ text: request.context }],
    });
  }
  
  if (request.history) {
    contents.push(
      ...request.history.map((msg) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      }))
    );
  }
  
  contents.push({
    role: 'user',
    parts: [{ text: request.message }],
  });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${request.model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 4096,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  
  return {
    content: data.candidates[0]?.content?.parts[0]?.text || '',
  };
}
