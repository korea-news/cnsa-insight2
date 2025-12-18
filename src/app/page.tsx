'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, FileText, Sparkles, Clock, Settings, LogOut, FileSpreadsheet } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const storedName = localStorage.getItem('cnsa_user_name');
    if (!storedName) {
      router.push('/login');
    } else {
      setUserName(storedName);
    }
  }, [router]);

  if (!userName) return null;

  return (
    <div className="min-h-screen p-6 md:p-10">
      <nav className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold text-blue-600">CNSA Insight</h1>
        <div className="flex gap-2">
          <button onClick={() => router.push('/settings')} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="설정">
            <Settings className="w-5 h-5 text-gray-600" />
          </button>
          <button onClick={() => { localStorage.clear(); router.push('/login'); }} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="로그아웃">
            <LogOut className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </nav>

      <section className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          반갑습니다, <span className="text-blue-600">{userName}</span>!
        </h2>
        <p className="text-gray-500">오늘도 학생들의 소중한 성장을 기록해 볼까요?</p>
      </section>

      {/* Deep-ACT™ Section */}
      <section className="mb-10 bg-gradient-to-r from-blue-50 via-purple-50 to-emerald-50 rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-bold text-gray-800">Deep-ACT™로 더 깊이 있는 기록을</h3>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 py-4">
          <ActStep letter="A" name="Anchor" desc="핵심 역량 파악" color="blue" />
          <span className="text-gray-300 text-2xl hidden md:block">→</span>
          <span className="text-gray-300 text-2xl block md:hidden rotate-90">→</span>
          <ActStep letter="C" name="Contemplate" desc="교육적 의미 숙고" color="purple" />
          <span className="text-gray-300 text-2xl hidden md:block">→</span>
          <span className="text-gray-300 text-2xl block md:hidden rotate-90">→</span>
          <ActStep letter="T" name="Transcribe" desc="의미 있는 기록" color="emerald" />
        </div>
        <p className="text-center text-sm text-gray-600 mt-2">
          단순 생성이 아닌, <strong>구조화된 사고의 과정</strong>을 통해 학생의 성장을 깊이 있게 기록합니다.
        </p>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <ActionCard title="새 생기부 작성" desc="관찰 내용을 바탕으로 새로운 기록을 생성합니다." icon={<Plus className="w-6 h-6" />} color="blue" onClick={() => router.push('/record')} btnText="작성 시작하기" />
        <ActionCard title="엑셀 일괄 생성" desc="학생부 엑셀을 업로드하여 일괄 생성합니다." icon={<FileSpreadsheet className="w-6 h-6" />} color="emerald" onClick={() => router.push('/batch')} btnText="엑셀 업로드" />
        <ActionCard title="나만의 템플릿" desc="자주 쓰는 표현을 템플릿으로 관리하세요." icon={<FileText className="w-6 h-6" />} color="purple" onClick={() => router.push('/template')} btnText="템플릿 관리" />
        <ActionCard title="최근 기록" desc="최근 작업한 학생들이 표시됩니다." icon={<Clock className="w-6 h-6" />} color="gray" onClick={() => { }} btnText="기록 더보기" />
      </section>

      {/* Tips */}
      <section className="bg-white/50 rounded-2xl p-6 border border-gray-200">
        <h3 className="font-bold text-gray-800 mb-4">💡 CNSA Insight 활용 팁</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span><strong>[설정]</strong> 메뉴에서 개인 API Key를 등록해야 분석 엔진을 사용할 수 있습니다.</li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span><strong>[템플릿]</strong>을 먼저 잘 만들어두면, 내용만 입력하여 빠르게 초안을 만들 수 있습니다.</li>
          <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>작성된 내용은 브라우저에만 임시 저장되므로, 완료 후 반드시 복사하여 NEIS에 붙여넣으세요.</li>
        </ul>
      </section>
    </div>
  );
}

function ActStep({ letter, name, desc, color }: { letter: string; name: string; desc: string; color: string }) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    emerald: 'bg-emerald-100 text-emerald-600',
  };
  const textColor: Record<string, string> = { blue: 'text-blue-800', purple: 'text-purple-800', emerald: 'text-emerald-800' };
  return (
    <div className="flex flex-col items-center gap-2 group">
      <div className={`w-16 h-16 rounded-full ${colorClasses[color]} flex items-center justify-center font-bold text-2xl shadow-sm group-hover:scale-110 transition-transform`}>{letter}</div>
      <span className={`text-sm font-bold ${textColor[color]}`}>{name}</span>
      <span className="text-xs text-gray-500 text-center max-w-[100px]">{desc}</span>
    </div>
  );
}

function ActionCard({ title, desc, icon, color, onClick, btnText }: { title: string; desc: string; icon: React.ReactNode; color: string; onClick: () => void; btnText: string }) {
  const colorClasses: Record<string, { bg: string; border: string; iconBg: string; iconText: string }> = {
    blue: { bg: 'bg-white', border: 'border-blue-100', iconBg: 'bg-blue-100', iconText: 'text-blue-600' },
    purple: { bg: 'bg-white', border: 'border-purple-100', iconBg: 'bg-purple-100', iconText: 'text-purple-600' },
    emerald: { bg: 'bg-white', border: 'border-emerald-100', iconBg: 'bg-emerald-100', iconText: 'text-emerald-600' },
  };
  const c = colorClasses[color];
  return (
    <div className={`${c.bg} ${c.border} border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group`}>
      <div className={`w-12 h-12 rounded-xl ${c.iconBg} ${c.iconText} flex items-center justify-center mb-4`}>{icon}</div>
      <h4 className="text-xl font-bold mb-2">{title}</h4>
      <p className="text-sm text-gray-500 mb-6">{desc}</p>
      <button onClick={onClick} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer">{btnText}</button>
    </div>
  );
}
