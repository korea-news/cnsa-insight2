'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheck, UserCheck, Search, BookOpen, AlertCircle, Lock } from 'lucide-react';

// 접속 비밀번호
const ACCESS_PASSWORD = 'a1234567!';

export default function LoginPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = () => {
        if (password !== ACCESS_PASSWORD) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        localStorage.setItem('cnsa_user_name', '선생님');
        localStorage.setItem('cnsa_user_agreed', 'true');
        localStorage.setItem('cnsa_authenticated', 'true');
        router.push('/');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    const staggerContainer = {
        visible: { transition: { staggerChildren: 0.1 } },
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-8">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="glass-panel max-w-2xl w-full p-8 md:p-12 relative overflow-hidden"
            >
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-100 rounded-full blur-3xl opacity-30 pointer-events-none"></div>

                <motion.div variants={fadeInUp} className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-blue-600 mb-2">CNSA Insight</h1>
                    <p className="text-lg text-gray-500">Student Growth Record Assistant</p>
                </motion.div>

                <motion.div variants={fadeInUp} className="mb-8 space-y-4">
                    <div className="bg-white/50 p-6 rounded-xl border border-blue-100">
                        <h2 className="text-xl font-bold mb-3 flex items-center gap-2 text-blue-600">
                            <ShieldCheck className="w-6 h-6" />
                            교육부 가이드라인 안내
                        </h2>
                        <p className="text-sm leading-relaxed text-gray-700">
                            선생님, 생기부 작성으로 고민이 많으시죠?<br />
                            교육부 가이드라인에 따라 <strong>&apos;초안 작성 및 윤문 보조&apos;</strong> 목적으로만 활용하신다면,<br />
                            AI는 선생님의 든든한 보조 교사가 될 수 있습니다.
                        </p>
                    </div>

                    <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-purple-800">
                            <strong>데이터 안심 정책:</strong> 입력하신 자료는 서버에 저장되지 않으며, 브라우저 종료 시 <strong>즉시 삭제</strong>됩니다.
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="mb-8">
                    <h3 className="text-lg font-bold mb-4">슬기로운 활용 안내</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <GuidelineItem icon={<UserCheck className="w-5 h-5" />} title="[주체성]" desc="최종 내용은 선생님께서 검토하고 책임집니다." />
                        <GuidelineItem icon={<Search className="w-5 h-5" />} title="[팩트체크]" desc="실제 활동과 일치하는지 확인해주세요." />
                        <GuidelineItem icon={<ShieldCheck className="w-5 h-5" />} title="[보안]" desc="민감한 개인정보는 입력하지 마세요." />
                        <GuidelineItem icon={<BookOpen className="w-5 h-5" />} title="[목적]" desc="학생 성장을 위한 기록에 활용하세요." />
                    </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="pt-4 border-t border-gray-100 space-y-4">
                    {/* 비밀번호 입력 */}
                    <div>
                        <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2">
                            <Lock className="w-4 h-4" />
                            접속 비밀번호
                        </label>
                        <input
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setError(''); }}
                            onKeyPress={handleKeyPress}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        />
                        {error && (
                            <p className="text-red-500 text-sm mt-2">{error}</p>
                        )}
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full py-4 rounded-xl font-bold text-lg transition-all transform duration-200 bg-blue-600 text-white shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] cursor-pointer"
                    >
                        확인하고 시작하기
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
}

function GuidelineItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
    return (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50/70 border border-gray-100">
            <span className="text-blue-500 mt-0.5">{icon}</span>
            <div>
                <span className="text-sm font-bold text-gray-800">{title}</span>
                <p className="text-xs text-gray-600">{desc}</p>
            </div>
        </div>
    );
}
