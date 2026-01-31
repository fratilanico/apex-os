interface GroqRequest {
  message: string;
  context?: string;
  history?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  systemPrompt?: string;
  model: string;
}

interface GroqResponse {
  content: string;
}

export async function callGroq(request: GroqRequest): Promise<GroqResponse> {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error('GROQ_API_KEY not configured');
  }

  const messages = [];
  
  if (request.systemPrompt) {
    messages.push({ role: 'system', content: request.systemPrompt });
  }
  
  if (request.context) {
    messages.push({ role: 'system', content: request.context });
  }
  
  if (request.history) {
    messages.push(...request.history);
  }
  
  messages.push({ role: 'user', content: request.message });

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: request.model,
      messages,
      temperature: 0.3,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  
  return {
    content: data.choices[0]?.message?.content || '',
  };
}
