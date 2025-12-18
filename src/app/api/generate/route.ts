import { NextRequest, NextResponse } from 'next/server';
import { generateStudentRecord as generateWithGemini } from '@/lib/gemini';
import { generateStudentRecord as generateWithClaude } from '@/lib/claude';
import { generateStudentRecord as generateWithGroq } from '@/lib/groq';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { studentName, observation, template, aiModel = 'gemini' } = body;

        if (!studentName || !observation) {
            return NextResponse.json(
                { error: '학생 이름과 관찰 내용은 필수입니다.' },
                { status: 400 }
            );
        }

        let generatedText: string;

        if (aiModel === 'claude') {
            generatedText = await generateWithClaude({
                studentName,
                observation,
                template,
            });
        } else if (aiModel === 'groq') {
            generatedText = await generateWithGroq({
                studentName,
                observation,
                template,
            });
        } else {
            generatedText = await generateWithGemini({
                studentName,
                observation,
                template,
            });
        }

        return NextResponse.json({ text: generatedText, model: aiModel });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'AI 초안 생성에 실패했습니다.' },
            { status: 500 }
        );
    }
}
