'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, FileText, Trash2, Edit3 } from 'lucide-react';

interface Template {
    id: string;
    name: string;
    content: string;
    createdAt: string;
}

export default function TemplatePage() {
    const router = useRouter();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newName, setNewName] = useState('');
    const [newContent, setNewContent] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem('cnsa_templates');
        if (stored) {
            setTemplates(JSON.parse(stored));
        }
    }, []);

    const saveTemplates = (updated: Template[]) => {
        setTemplates(updated);
        localStorage.setItem('cnsa_templates', JSON.stringify(updated));
    };

    const handleCreate = () => {
        if (!newName.trim() || !newContent.trim()) return;

        const newTemplate: Template = {
            id: Date.now().toString(),
            name: newName.trim(),
            content: newContent.trim(),
            createdAt: new Date().toLocaleDateString('ko-KR'),
        };

        saveTemplates([...templates, newTemplate]);
        setNewName('');
        setNewContent('');
        setIsCreating(false);
    };

    const handleDelete = (id: string) => {
        if (confirm('이 템플릿을 삭제하시겠습니까?')) {
            saveTemplates(templates.filter(t => t.id !== id));
        }
    };

    return (
        <div className="min-h-screen p-6 md:p-10">
            <nav className="flex items-center gap-4 mb-8">
                <button onClick={() => router.push('/')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-gray-800">나만의 템플릿</h1>
            </nav>

            <div className="max-w-4xl mx-auto">
                {/* Create Button */}
                {!isCreating && (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="mb-6 w-full py-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 transition-all flex items-center justify-center gap-2 text-gray-500 hover:text-blue-600"
                    >
                        <Plus className="w-5 h-5" />
                        새 템플릿 만들기
                    </button>
                )}

                {/* Create Form */}
                {isCreating && (
                    <section className="mb-6 bg-white rounded-2xl p-6 border border-blue-200 shadow-sm">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <Edit3 className="w-5 h-5 text-blue-600" />
                            새 템플릿 작성
                        </h2>
                        <input
                            type="text"
                            placeholder="템플릿 이름 (예: 창의적 문제해결 역량)"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all mb-4"
                        />
                        <textarea
                            placeholder="템플릿 내용을 입력하세요. {학생이름}, {활동내용} 등의 변수를 사용할 수 있습니다."
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                            rows={5}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
                        />
                        <div className="mt-4 flex gap-3">
                            <button
                                onClick={handleCreate}
                                disabled={!newName.trim() || !newContent.trim()}
                                className="flex-1 py-3 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                저장하기
                            </button>
                            <button
                                onClick={() => { setIsCreating(false); setNewName(''); setNewContent(''); }}
                                className="px-6 py-3 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
                            >
                                취소
                            </button>
                        </div>
                    </section>
                )}

                {/* Template List */}
                {templates.length === 0 && !isCreating ? (
                    <div className="text-center py-16 text-gray-400">
                        <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p>아직 만든 템플릿이 없습니다.</p>
                        <p className="text-sm mt-1">위 버튼을 눌러 첫 템플릿을 만들어보세요!</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {templates.map(template => (
                            <div key={template.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-bold text-gray-800">{template.name}</h3>
                                        <p className="text-xs text-gray-400 mt-1">{template.createdAt} 생성</p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(template.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="mt-3 text-sm text-gray-600 line-clamp-3">{template.content}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
