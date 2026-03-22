import { createOpenAISession } from '../services/openaiService.js';

export const sessionController = async (req, res) => {
  try {
    const session = await createOpenAISession();
    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
