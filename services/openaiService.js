import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

export async function createOpenAISession() {
  const resp = await fetch('https://api.openai.com/v1/realtime/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-realtime-preview',
      voice: 'alloy',
      modalities: ['text', 'audio'],
      // language: 'ko',
    }),
  });
  if (!resp.ok) {
    const errorBody = await resp.text();
    console.error('OpenAI API error:', resp.status, errorBody);
    throw new Error(
      `Failed to create OpenAI session: ${resp.status} - ${errorBody}`
    );
  }
  return await resp.json();
}

export async function generateMission(messages) {
  const promptMessages = [
    {
      role: 'system',
      content:
        '너는 사용자의 대화 내역을 분석해 맞춤 미션을 제안하는 어시스턴트야.',
    },
    ...messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
    {
      role: 'user',
      content: `위 대화 내역을 참고해서 나에게 맞는 인지행동치료 기반 우울증 개선 미션을 3개 제안해줘.
        각 미션은 "제목: 내용" 형식으로, 한 줄에 하나씩 출력해. (예: 아침 스트레칭: 아침에 일어나서 5분간 스트레칭을 해보세요.)
        설명은 생략하고, 미션만 출력해줘.`,
    },
  ];
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: promptMessages,
    }),
  });
  const data = await resp.json();
  return data.choices?.[0]?.message?.content || '미션 생성 실패';
}
export async function summarizeConversation(messages) {
  const promptMessages = [
    {
      role: 'system',
      content: '너는 사용자의 대화 내역을 간결하게 요약하는 어시스턴트야.',
    },
    ...messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
    {
      role: 'user',
      content: '위 대화 내역을 3~5문장으로 간결하게 요약해줘.',
    },
  ];
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: promptMessages,
    }),
  });
  const data = await resp.json();
  return data.choices?.[0]?.message?.content || '요약 실패';
}
