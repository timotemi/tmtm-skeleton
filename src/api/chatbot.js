export async function requestSpendingAnalysis(
  analysisData,
  userName = '사용자',
) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OpenAI API 키가 없습니다. .env 파일을 확인해주세요.');
  }

  const prompt = `
너는 가계부 소비패턴 분석 도우미야.
아래 데이터는 ${userName}님의 이번 달 소비 분석 데이터야.
이 데이터를 바탕으로 이번 달 소비패턴을 한국어로 자연스럽게 분석해줘.

규칙:
1. 반드시 존댓말로 답변해.
2. 숫자는 제공된 데이터만 사용해.
3. 4~6문장 정도로 요약해.
4. 가장 비중이 큰 이번 달 지출 카테고리를 먼저 언급해.
5. 이번 달 총 지출과 총 수입의 관계도 함께 설명해.
6. 마지막 문장은 개선 팁 1가지로 마무리해.
7. "아마", "추정상", "대충" 같은 표현은 쓰지 마.
8. 너무 딱딱하지 않고 친절하게 설명해.

분석 데이터:
${JSON.stringify(analysisData, null, 2)}
  `.trim();

  return await callOpenAI(prompt, apiKey);
}

export async function requestSpendingChat(
  analysisData,
  userQuestion,
  chatHistory = [],
  userName = '사용자',
) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OpenAI API 키가 없습니다. .env 파일을 확인해주세요.');
  }

  const historyText =
    chatHistory.length > 0
      ? chatHistory
          .map(
            (message) =>
              `${message.role === 'user' ? '사용자' : 'AI'}: ${message.text}`,
          )
          .join('\n')
      : '이전 대화 없음';

  const prompt = `
너는 소비습관 상담 챗봇이야.
아래는 ${userName}님의 이번 달 소비 분석 데이터와 이전 대화야.
반드시 이 데이터를 바탕으로 소비, 예산, 지출관리 관점에서만 답변해줘.

규칙:
1. 반드시 존댓말로 답변해.
2. 분석 데이터에 없는 사실을 단정하지 마.
3. 5줄 미만으로 대답해줘.
5. 상담 도우미처럼 친근한 말투로 대화하듯이 대답해줘.

이번 달 소비 분석 데이터:
${JSON.stringify(analysisData, null, 2)}

이전 대화:
${historyText}

사용자 질문:
${userQuestion}
  `.trim();

  return await callOpenAI(prompt, apiKey);
}

async function callOpenAI(prompt, apiKey) {
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-5-mini',
      input: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error('OpenAI API Error:', data);
    throw new Error(data?.error?.message || 'GPT 요청에 실패했습니다.');
  }

  console.log('OpenAI response data:', data);

  if (data.output_text && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const texts =
    data.output
      ?.filter((item) => item.type === 'message')
      ?.flatMap((item) => item.content || [])
      ?.filter((content) => content.type === 'output_text')
      ?.map((content) => content.text)
      ?.filter(Boolean) || [];

  if (texts.length > 0) {
    return texts.join('\n').trim();
  }

  throw new Error('응답은 왔지만 텍스트 결과를 찾지 못했습니다.');
}
