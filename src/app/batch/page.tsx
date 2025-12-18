'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Sparkles, Download, Loader2, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

interface StudentRow {
    id: string;           // 반/번호
    name: string;         // 성명
    status: string;       // 학적변동구분
    memo: string;         // 관찰 메모 (입력)
    generated: string;    // AI 생성 결과
    isGenerating: boolean;
}

export default function BatchPage() {
    const router = useRouter();
    const [students, setStudents] = useState<StudentRow[]>([]);
    const [fileName, setFileName] = useState<string>('');
    const [isGeneratingAll, setIsGeneratingAll] = useState(false);
    const [aiModel, setAiModel] = useState<'gemini' | 'claude' | 'groq'>('gemini');

    // 엑셀 파일 파싱
    const handleFileUpload = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];

                // 학생 데이터 추출 (반/번호, 성명 패턴 찾기)
                const extractedStudents: StudentRow[] = [];

                for (let i = 0; i < jsonData.length; i++) {
                    const row = jsonData[i];
                    if (!row) continue;

                    // 반/번호 패턴 찾기 (예: 1/22, 4/27 등)
                    for (let j = 0; j < row.length; j++) {
                        const cell = String(row[j] || '').trim();
                        if (/^\d+\/\d+$/.test(cell)) {
                            // 반/번호 발견
                            const id = cell;
                            const name = String(row[j + 1] || '').trim();
                            const status = String(row[j + 3] || '').trim();
                            const existingMemo = String(row[j + 4] || '').trim();

                            if (name && name !== '성명') {
                                extractedStudents.push({
                                    id,
                                    name,
                                    status: status || '재학',
                                    memo: existingMemo === '.' ? '' : existingMemo,
                                    generated: '',
                                    isGenerating: false,
                                });
                            }
                            break;
                        }
                    }
                }

                setStudents(extractedStudents);
                setFileName(file.name);
            } catch (error) {
                console.error('엑셀 파싱 오류:', error);
                alert('엑셀 파일을 읽는 중 오류가 발생했습니다.');
            }
        };
        reader.readAsArrayBuffer(file);
    }, []);

    // 드래그 앤 드롭 핸들러
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
            handleFileUpload(file);
        } else {
            alert('엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.');
        }
    }, [handleFileUpload]);

    // 파일 선택 핸들러
    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
    }, [handleFileUpload]);

    // 메모 수정
    const updateMemo = (index: number, memo: string) => {
        setStudents(prev => prev.map((s, i) => i === index ? { ...s, memo } : s));
    };

    // 개별 학생 AI 생성
    const generateForStudent = async (index: number) => {
        const student = students[index];
        if (!student.memo.trim()) {
            alert('관찰 메모를 입력해주세요.');
            return;
        }

        setStudents(prev => prev.map((s, i) => i === index ? { ...s, isGenerating: true } : s));

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentName: student.name,
                    observation: student.memo,
                    aiModel,
                }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            setStudents(prev => prev.map((s, i) =>
                i === index ? { ...s, generated: data.text, isGenerating: false } : s
            ));
        } catch (error) {
            console.error('생성 오류:', error);
            setStudents(prev => prev.map((s, i) =>
                i === index ? { ...s, isGenerating: false } : s
            ));
            alert(error instanceof Error ? error.message : '생성 실패');
        }
    };

    // 전체 학생 AI 생성
    const generateAll = async () => {
        const studentsWithMemo = students.filter(s => s.memo.trim());
        if (studentsWithMemo.length === 0) {
            alert('관찰 메모가 입력된 학생이 없습니다.');
            return;
        }

        setIsGeneratingAll(true);

        for (let i = 0; i < students.length; i++) {
            if (students[i].memo.trim()) {
                await generateForStudent(i);
                // 각 요청 사이에 약간의 딜레이 (API 제한 방지)
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        setIsGeneratingAll(false);
    };

    // 엑셀 다운로드
    const downloadExcel = () => {
        const exportData = students.map(s => ({
            '반/번호': s.id,
            '성명': s.name,
            '학적변동': s.status,
            '관찰 메모': s.memo,
            '세부능력 및 특기사항': s.generated,
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, '생기부');

        const outputName = fileName.replace(/\.(xlsx|xls)$/, '_AI생성.xlsx');
        XLSX.writeFile(wb, outputName);
    };

    return (
        <div className="min-h-screen p-6 md:p-10">
            {/* Header */}
            <nav className="flex items-center gap-4 mb-8">
                <button onClick={() => router.push('/')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-gray-800">엑셀 일괄 생성</h1>
            </nav>

            <div className="max-w-6xl mx-auto space-y-6">
                {/* 파일 업로드 영역 */}
                {students.length === 0 ? (
                    <div
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer"
                    >
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <FileSpreadsheet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-lg font-medium text-gray-600 mb-2">
                                학생부 엑셀 파일을 여기에 드래그하세요
                            </p>
                            <p className="text-sm text-gray-400">
                                또는 클릭하여 파일 선택 (.xlsx, .xls)
                            </p>
                        </label>
                    </div>
                ) : (
                    <>
                        {/* 파일 정보 및 AI 모델 선택 */}
                        <div className="flex flex-wrap items-center justify-between gap-4 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3">
                                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                                <span className="font-medium">{fileName}</span>
                                <span className="text-sm text-gray-500">({students.length}명)</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-600">AI 엔진:</span>
                                <select
                                    value={aiModel}
                                    onChange={(e) => setAiModel(e.target.value as 'gemini' | 'claude' | 'groq')}
                                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm"
                                >
                                    <option value="gemini">Gemini (gemini-2.5-flash)</option>
                                    <option value="claude">Claude (claude-3-5-sonnet)</option>
                                    <option value="groq">Groq (llama-3.3-70b)</option>
                                </select>
                            </div>
                        </div>

                        {/* 학생 목록 테이블 */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-20">반/번호</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-24">성명</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 w-1/3">관찰 메모</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">생성된 초안</th>
                                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-600 w-24">작업</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {students.map((student, index) => (
                                            <tr key={index} className="hover:bg-gray-50/50">
                                                <td className="px-4 py-3 text-sm text-gray-800">{student.id}</td>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900">{student.name}</td>
                                                <td className="px-4 py-3">
                                                    <textarea
                                                        value={student.memo}
                                                        onChange={(e) => updateMemo(index, e.target.value)}
                                                        placeholder="간단한 관찰 내용 입력..."
                                                        rows={2}
                                                        className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none resize-none"
                                                    />
                                                </td>
                                                <td className="px-4 py-3">
                                                    {student.generated ? (
                                                        <div className="text-sm text-gray-700 max-h-24 overflow-y-auto">
                                                            {student.generated}
                                                        </div>
                                                    ) : (
                                                        <span className="text-sm text-gray-400">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <button
                                                        onClick={() => generateForStudent(index)}
                                                        disabled={student.isGenerating || !student.memo.trim()}
                                                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {student.isGenerating ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            '생성'
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 액션 버튼 */}
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={generateAll}
                                disabled={isGeneratingAll}
                                className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {isGeneratingAll ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Sparkles className="w-5 h-5" />
                                )}
                                전체 AI 생성
                            </button>
                            <button
                                onClick={downloadExcel}
                                disabled={students.every(s => !s.generated)}
                                className="px-6 py-3 rounded-xl font-medium bg-emerald-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                <Download className="w-5 h-5" />
                                엑셀 다운로드
                            </button>
                        </div>

                        {/* 새 파일 업로드 */}
                        <div className="text-center">
                            <label className="text-sm text-gray-500 hover:text-blue-600 cursor-pointer">
                                <input
                                    type="file"
                                    accept=".xlsx,.xls"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                다른 파일 업로드
                            </label>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
