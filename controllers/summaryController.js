import { summarizeConversation } from '../services/openaiService.js';

export const summarize = async (req, res) => {
  try {
    const { messages } = req.body;
    const summary = await summarizeConversation(messages);
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
