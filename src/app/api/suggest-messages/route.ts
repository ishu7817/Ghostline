import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
export async function POST(req: Request) {
  try {
const prompt =
  "Generate three short, punchy, very sarcastic anonymous messages for a messaging app, formatted as a single string with each message separated by '||'. These are one-way messages — the recipient can never reply or know who sent it, so each message must be a complete, standalone statement, NOT a question. Think a cheeky observation, a backhanded compliment, a playful roast or just a extreme one that just remains an inch before hurting sentiments, or an anonymous confession — something that lands and means something on its own, with no reply expected or needed. Keep each one under 15 words. Aim for dry wit over generic compliments and roasts — a little edge, a good tease, but safe for a general audience (no sensitive, political, or personal-attack topics). Pull from a wide range of everyday angles — someone's vibe, their taste, a habit, an energy they give off, a guess about their week — and vary sentence structure and phrasing each time; don't default to the same handful of go-to phrasings. Each of the three messages must focus on a distinctly different subject and angle from the others — never let two messages restate the same underlying idea in different words. Also vary which topic or tone leads first across different responses, so the opening message doesn't feel similar every time you're asked. For example: 'You give off main character energy but in a chaotic subplot kind of way.||Someone's definitely told you that you're 'a lot' and you took it as a compliment.||Your Spotify Wrapped is probably a cry for help.' Treat those only as a tone/length reference, not a template. Return only the three messages in that exact format — no extra text, no numbering, no explanation and do not say anything about someone's confidence";

    const result = streamText({
      model: google('gemini-3.1-flash-lite'),
      prompt,
      temperature: 0.9,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Error occurred while suggesting messages:', error);
    return Response.json(
      { success: false, message: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}