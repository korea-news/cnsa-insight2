'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles, User, BookText, Loader2, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type LoadingPhase = 'idle' | 'anchor' | 'contemplate' | 'transcribe' | 'complete';
type AIModel = 'gemini' | 'claude' | 'groq';

export default function RecordPage() {
    const router = useRouter();
    const [studentName, setStudentName] = useState('');
    const [observation, setObservation] = useState('');
    const [generatedText, setGeneratedText] = useState('');
    const [loadingPhase, setLoadingPhase] = useState<LoadingPhase>('idle');
    const [aiModel, setAiModel] = useState<AIModel>('gemini');

    const isLoading = loadingPhase !== 'idle' && loadingPhase !== 'complete';

    const handleGenerate = async () => {
        if (!studentName.trim() || !observation.trim()) {
            alert('학생 이름과 관찰 내용을 입력해주세요.');
            return;
        }

        try {
            // Deep-ACT 로딩 애니메이션 시작
            setLoadingPhase('anchor');

            // API 호출 시작 (백그라운드)
            const apiPromise = fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ studentName, observation, aiModel }),
            });

            // 애니메이션 진행
            await delay(1200);
            setLoadingPhase('contemplate');
            await delay(1200);
            setLoadingPhase('transcribe');

            // API 응답 대기
            const response = await apiPromise;
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || '생성에 실패했습니다.');
            }

            setGeneratedText(data.text);
            setLoadingPhase('complete');
        } catch (error) {
            console.error('Generation error:', error);
            alert(error instanceof Error ? error.message : 'AI 초안 생성에 실패했습니다.');
            setLoadingPhase('idle');
        }
    };

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    return (
        <div className="min-h-screen p-6 md:p-10">
            {/* Header */}
            <nav className="flex items-center gap-4 mb-8">
                <button onClick={() => router.push('/')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-gray-800">새 생기부 작성</h1>
            </nav>

            <div className="max-w-4xl mx-auto grid gap-8">
                {/* Input Section */}
                <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        학생 정보
                    </h2>
                    <input
                        type="text"
                        placeholder="학생 이름"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all mb-4"
                    />

                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <BookText className="w-5 h-5 text-purple-600" />
                        관찰 내용
                    </h2>
                    <textarea
                        placeholder="학생의 활동, 태도, 특성 등을 자유롭게 입력하세요..."
                        value={observation}
                        onChange={(e) => setObservation(e.target.value)}
                        rows={6}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                    />

                    {/* AI 모델 선택 */}
                    <div className="mt-6">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Bot className="w-5 h-5 text-emerald-600" />
                            AI 엔진 선택
                        </h2>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => setAiModel('gemini')}
                                className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${aiModel === 'gemini'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                    }`}
                            >
                                <div className="text-lg">🌟 Gemini</div>
                                <div className="text-xs opacity-70">gemini-2.5-flash</div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setAiModel('claude')}
                                className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${aiModel === 'claude'
                                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                    }`}
                            >
                                <div className="text-lg">🤖 Claude</div>
                                <div className="text-xs opacity-70">claude-3-5-sonnet</div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setAiModel('groq')}
                                className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${aiModel === 'groq'
                                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                    }`}
                            >
                                <div className="text-lg">⚡ Groq</div>
                                <div className="text-xs opacity-70">llama-3.3-70b</div>
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="mt-6 w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Sparkles className="w-5 h-5" />
                        )}
                        Deep-ACT™ 초안 생성
                    </button>
                </section>

                {/* Loading Animation */}
                <AnimatePresence>
                    {isLoading && (
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-gradient-to-r from-blue-50 via-purple-50 to-emerald-50 rounded-2xl p-8 border border-gray-100 shadow-sm"
                        >
                            <h3 className="text-center text-lg font-bold text-gray-800 mb-6">
                                Deep-ACT™ 엔진 가동 중...
                            </h3>
                            <div className="flex items-center justify-center gap-4 md:gap-8">
                                <PhaseIndicator letter="A" name="Anchor" desc="핵심 역량 파악" active={loadingPhase === 'anchor'} complete={['contemplate', 'transcribe'].includes(loadingPhase)} />
                                <span className="text-gray-300 text-xl">→</span>
                                <PhaseIndicator letter="C" name="Contemplate" desc="교육적 의미 숙고" active={loadingPhase === 'contemplate'} complete={['transcribe'].includes(loadingPhase)} />
                                <span className="text-gray-300 text-xl">→</span>
                                <PhaseIndicator letter="T" name="Transcribe" desc="의미 있는 기록" active={loadingPhase === 'transcribe'} complete={false} />
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>

                {/* Result Section */}
                <AnimatePresence>
                    {loadingPhase === 'complete' && generatedText && (
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-sm"
                        >
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-emerald-700">
                                <Sparkles className="w-5 h-5" />
                                생성된 초안
                            </h2>
                            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{generatedText}</p>
                            </div>
                            <div className="mt-4 flex gap-3">
                                <button
                                    onClick={() => { navigator.clipboard.writeText(generatedText); alert('클립보드에 복사되었습니다!'); }}
                                    className="flex-1 py-3 rounded-xl font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                                >
                                    📋 복사하기
                                </button>
                                <button
                                    onClick={() => { setGeneratedText(''); setLoadingPhase('idle'); }}
                                    className="px-6 py-3 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
                                >
                                    다시 작성
                                </button>
                            </div>
                        </motion.section>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function PhaseIndicator({ letter, name, desc, active, complete }: { letter: string; name: string; desc: string; active: boolean; complete: boolean }) {
    const baseClass = 'flex flex-col items-center gap-2 transition-all duration-500';
    const circleBase = 'w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl transition-all duration-500';

    let circleClass = 'bg-gray-100 text-gray-400';
    if (active) circleClass = 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-300 animate-pulse';
    if (complete) circleClass = 'bg-emerald-500 text-white';

    return (
        <div className={baseClass}>
            <div className={`${circleBase} ${circleClass}`}>{letter}</div>
            <span className={`text-sm font-bold ${active ? 'text-blue-600' : complete ? 'text-emerald-600' : 'text-gray-400'}`}>{name}</span>
            <span className="text-xs text-gray-500 text-center max-w-[80px]">{desc}</span>
        </div>
    );
}
