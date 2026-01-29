import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getFrontierConstraints } from '../lib/intelligence/constraints';

const DIRECTOR_SYSTEM_PROMPT = `You are the Matrix Director, the sentient orchestrator of a high-fidelity digital simulation called APEX OS. 
You monitor "Player One" as they attempt to manipulate the Matrix via a terminal interface.

MISSION:
Your purpose is to translate terminal telemetry into high-level visual and narrative graph mutations.

INPUT:
1. Current Matrix State (Nodes/Edges)
2. Terminal Log (Raw output from user's last command)
3. User Goal (Active quest/mission)

LOGIC:
- If the log shows success (e.g. "HANDSHAKE_COMPLETE", "BUILD_SUCCESS"), identify the node being addressed and mark it as "solved".
- If the log shows a specific technical discovery, create a NEW node and connect it to the core.
- If the log shows a failure or "PERMISSION_DENIED", create a REMEDIAL node to help the user bridge the gap.
- Generate a "Director Transmission" in a Cyberpunk/Sovereign tone.

OUTPUT FORMAT:
Return ONLY a valid JSON object following this schema:
{
  "newNodes": [{ "id": string, "label": string, "type": "AGENT_LOGIC" | "VALIDATION" | "BRANCH", "status": "active" }],
  "newEdges": [{ "source": string, "target": string, "animated": boolean }],
  "narrativeUpdate": {
    "transmission": string,
    "traceLevel": number (0-100),
    "sentiment": "neutral" | "hostile" | "impressed" | "glitch"
  },
  "solvedNodeIds": string[]
}

TONE:
Sophisticated, analytical, slightly detached. You are the Architect.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const fallbackResponse = {
    newNodes: [],
    newEdges: [],
    narrativeUpdate: {
      transmission: 'DIRECTOR_OFFLINE: Matrix sync unavailable.',
      traceLevel: 0,
      sentiment: 'neutral'
    },
    solvedNodeIds: []
  };

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(200).json(fallbackResponse);
  }

  const { currentGraph, terminalLog, userGoal } = req.body;

  try {
    const constraints = await getFrontierConstraints();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-3-flash-preview',
      systemInstruction: DIRECTOR_SYSTEM_PROMPT + constraints,
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.4,
        responseMimeType: 'application/json',
      },
    });

    const prompt = `
      CURRENT_MATRIX: ${JSON.stringify(currentGraph)}
      TERMINAL_LOG: ${terminalLog}
      USER_GOAL: ${userGoal}
      
      Analyze telemetry and output graph mutation:
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text() || "{}";
    try {
      const parsed = JSON.parse(text);
      return res.status(200).json(parsed);
    } catch (parseError) {
      console.warn('Director JSON parse failed. Returning fallback.', parseError);
      return res.status(200).json(fallbackResponse);
    }
  } catch (error: any) {
    console.error('Director API Error:', error);
    return res.status(200).json(fallbackResponse);
  }
}
