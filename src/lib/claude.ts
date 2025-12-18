import Anthropic from '@anthropic-ai/sdk';

// 환경 변수에서 API Key를 가져옴
const API_KEY = process.env.CLAUDE_API_KEY || '';

const anthropic = new Anthropic({
    apiKey: API_KEY,
});

export interface GenerateRecordParams {
    studentName: string;
    observation: string;
    template?: string;
}

export async function generateStudentRecord(params: GenerateRecordParams): Promise<string> {
    const { studentName, observation, template } = params;

    const systemPrompt = `당신은 숙련된 고등학교 교사로서 학생 생활기록부(생기부) 작성을 돕는 전문가입니다.

**Deep-ACT™ 프로세스를 따라 작성하세요:**

1. **Anchor (핵심 역량 파악)**: 관찰 내용에서 학생의 핵심 역량과 강점을 파악합니다.
2. **Contemplate (교육적 의미 숙고)**: 해당 활동이 학생의 성장에 어떤 교육적 의미가 있는지 숙고합니다.
3. **Transcribe (의미 있는 기록)**: 위 분석을 바탕으로 구체적이고 의미 있는 기록을 작성합니다.

**작성 규칙:**
- 학생의 구체적인 행동과 태도를 중심으로 기술
- 성장 과정과 변화를 포함
- 교육적 의미와 역량을 명시
- 한국어로 자연스럽게 작성
- 200~300자 내외로 작성
- 문어체 사용 (예: ~하였음, ~보임)`;

    const userPrompt = `## 학생 정보
- 학생 이름: ${studentName}

## 관찰 내용
${observation}

${template ? `## 참고 템플릿\n${template}` : ''}

위 정보를 바탕으로 학생 생활기록부 세부능력 및 특기사항을 작성해주세요.`;

    try {
        const message = await anthropic.messages.create({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 1024,
            system: systemPrompt,
            messages: [
                { role: 'user', content: userPrompt }
            ],
        });

        const textContent = message.content.find(block => block.type === 'text');
        return textContent ? textContent.text : '';
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Claude API Error:', errorMessage, error);
        throw new Error(`Claude API 오류: ${errorMessage}`);
    }
}
