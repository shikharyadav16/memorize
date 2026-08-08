import express from 'express';
import Groq from 'groq-sdk';
import Submission from '../models/Submission.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', optionalAuth, async (req, res) => {
  try {
    const { original, userText } = req.body;

    if (!original || userText === undefined) {
      return res.status(400).json({ error: 'Both original and userText are required.' });
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const prompt = `You are an evaluator for a passage memorization game.

The player was shown an original passage and then asked to recall it from memory.

Evaluate how well the player's response demonstrates their memory of the original passage.

The player DOES NOT need to reproduce the passage word-for-word. Different wording, sentence structure, synonyms, grammar changes, and shorter phrasing should NOT be heavily penalized as long as the important information and meaning are correctly remembered.

Evaluate these four aspects:

1. Key information remembered
2. Meaning and concepts remembered
3. Completeness
4. Accuracy

Scoring:

10 - Almost all important information is remembered correctly.
9 - Nearly all important information is remembered, with only minor omissions.
8 - Most important information is remembered, with some smaller details missing.
7 - The main idea and most important details are remembered, but several secondary details are missing.
6 - The main idea is remembered, but a noticeable amount of information is missing.
5 - Some important information is remembered, but several major details are missing.
4 - A limited portion of the important information is remembered.
3 - Only a small amount of relevant information is remembered.
2 - Only isolated or vague details are remembered.
1 - Almost no relevant information is remembered.
0 - No meaningful information from the passage is remembered.

IMPORTANT RULES:

- Do NOT require word-for-word matching.
- Do NOT penalize synonyms.
- Do NOT penalize different sentence structures.
- Do NOT penalize minor grammar or spelling mistakes when the meaning is clear.
- Do NOT penalize shorter wording when the same information is preserved.
- DO penalize missing important facts.
- DO penalize incorrect facts or contradictions.
- DO penalize invented information when it changes the meaning.
- A concise response can still receive 8-10 if it preserves the important information.
- Judge semantic recall and key information, not textual similarity.

FEEDBACK RULES:

The feedback will be shown directly to the player.

Therefore:
- ALWAYS address the player directly using "you" or "your".
- NEVER refer to the player as "the user", "the user's response", "the player", or "their response".
- NEVER talk about the evaluation process in the feedback.
- Do not say things such as "The user's response..." or "The player remembered...".
- Briefly mention what the player remembered correctly and what important information they missed.
- Keep feedback to 2-3 sentences.
- Make the feedback encouraging and constructive, especially for lower scores.

Examples:

Good:
"You remembered that honeybees use a special movement to communicate the location of food. You missed that the dance indicates both direction and approximate distance."

Bad:
"The user's response correctly mentions the communication method but misses the details about direction and distance."

Original passage:
"""
${original}
"""

User's recalled text:
"""
${userText}
"""

Respond ONLY in valid JSON format:
{"score": <number>, "feedback": "<string>"}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an AI assistant that evaluates text memorization accuracy and returns JSON output.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    const responseText = chatCompletion.choices[0]?.message?.content || '{}';

    // Parse the JSON response
    let parsed;
    try {
      const cleaned = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { score: 5, feedback: 'Could not parse AI response. Assigned a default score.' };
    }

    const finalScore = Math.min(10, Math.max(0, parseInt(parsed.score) || 0));
    const finalFeedback = parsed.feedback || 'No feedback available.';

    let submissionId = null;

    // Automatically save submission if user is logged in
    if (req.user) {
      try {
        const submission = new Submission({
          userId: req.user._id,
          originalText: original,
          userText: userText || '',
          score: finalScore,
          feedback: finalFeedback,
        });
        await submission.save();
        submissionId = submission._id;
      } catch (saveErr) {
        console.error('Error auto-saving submission:', saveErr);
      }
    }

    res.json({
      score: finalScore,
      feedback: finalFeedback,
      submissionId,
    });
  } catch (err) {
    console.error('Evaluation error:', err);
    res.status(500).json({ error: 'Failed to evaluate passage with Groq.' });
  }
});

export default router;
