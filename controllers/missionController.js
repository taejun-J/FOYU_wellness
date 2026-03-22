import { generateMission } from '../services/openaiService.js';

// 메모리 저장 (실서비스는 DB 권장)
const missionHistory = [];

// 미션 문자열을 [{title, content}] 배열로 파싱
function parseMissions(missionsStr) {
  if (!missionsStr) return [];
  return missionsStr
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => {
      const [title, ...rest] = line.split(':');
      return {
        title: title ? title.trim() : '',
        content: rest.join(':').trim(),
      };
    });
}

// POST /mission : 미션 생성 및 저장
export const customMissionController = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: 'body가 비어 있습니다.' });
  }
  const { messages } = req.body;
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages 배열이 필요합니다.' });
  }
  try {
    const missions = await generateMission(messages);
    missionHistory.push({ messages, missions }); // 원본 저장
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Mission generation failed' });
  }
};

// GET /mission : [{title, content}] 배열 반환
export const getMissionHistory = (req, res) => {
  // 최신 미션만 반환하려면 missionHistory.at(-1)
  const allMissions = missionHistory.map((item) =>
    parseMissions(item.missions)
  );
  res.json(allMissions);
};
