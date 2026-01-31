interface CohereRequest {
  message: string;
  context?: string;
  history?: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
  systemPrompt?: string;
  model: string;
}

interface CohereResponse {
  content: string;
}

export async function callCohere(request: CohereRequest): Promise<CohereResponse> {
  const apiKey = process.env.COHERE_API_KEY;
  
  if (!apiKey) {
    throw new Error('COHERE_API_KEY not configured');
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

  const response = await fetch('https://api.cohere.ai/v1/chat', {
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
    throw new Error(`Cohere API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  
  return {
    content: data.message?.content?.[0]?.text || '',
  };
}
