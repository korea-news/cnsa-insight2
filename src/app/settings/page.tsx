'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Key, Save, Trash2, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
    const router = useRouter();
    const [apiKey, setApiKey] = useState('');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const storedKey = localStorage.getItem('cnsa_gemini_api_key');
        if (storedKey) {
            setApiKey(storedKey);
        }
    }, []);

    const handleSave = () => {
        if (apiKey.trim()) {
            localStorage.setItem('cnsa_gemini_api_key', apiKey.trim());
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }
    };

    const handleDelete = () => {
        localStorage.removeItem('cnsa_gemini_api_key');
        setApiKey('');
    };

    return (
        <div className="min-h-screen p-6 md:p-10">
            <nav className="flex items-center gap-4 mb-8">
                <button onClick={() => router.push('/')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-gray-800">설정</h1>
            </nav>

            <div className="max-w-2xl mx-auto">
                <section className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Key className="w-5 h-5 text-blue-600" />
                        Gemini API Key
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">
                        AI 초안 생성 기능을 사용하려면 Google AI Studio에서 발급받은 API Key를 입력하세요.
                        <br />
                        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            → API Key 발급받기
                        </a>
                    </p>

                    <div className="flex gap-3">
                        <input
                            type="password"
                            placeholder="API Key를 입력하세요"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                        />
                        <button
                            onClick={handleSave}
                            disabled={!apiKey.trim()}
                            className="px-6 py-3 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {saved ? <CheckCircle className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                            {saved ? '저장됨!' : '저장'}
                        </button>
                    </div>

                    {apiKey && (
                        <button
                            onClick={handleDelete}
                            className="mt-4 text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
                        >
                            <Trash2 className="w-4 h-4" />
                            API Key 삭제
                        </button>
                    )}
                </section>

                <section className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
                    <h3 className="font-bold text-purple-800 mb-2">💡 보안 안내</h3>
                    <ul className="text-sm text-purple-700 space-y-1">
                        <li>• API Key는 브라우저 로컬 저장소에만 보관됩니다.</li>
                        <li>• 서버로 전송되거나 외부에 저장되지 않습니다.</li>
                        <li>• 다른 컴퓨터나 브라우저에서는 다시 입력해야 합니다.</li>
                    </ul>
                </section>
            </div>
        </div>
    );
}
