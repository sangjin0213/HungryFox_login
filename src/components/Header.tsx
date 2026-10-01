import React from 'react';
import { BookOpen, Sparkles, FileSpreadsheet, BookmarkCheck } from 'lucide-react';

interface HeaderProps {
  memberCount: number;
  onOpenMemberList: () => void;
}

export const Header: React.FC<HeaderProps> = ({ memberCount, onOpenMemberList }) => {
  return (
    <header className="border-b border-[#E3DCBF] bg-[#FAF7F0]/90 backdrop-blur-sm sticky top-0 z-30 transition-all">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E6EFE4] border border-[#BDCEBA] flex items-center justify-center text-[#3D5537] shadow-sm">
            <BookOpen className="w-5 h-5" strokeWidth={1.8} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-kr text-xl sm:text-2xl font-bold tracking-tight text-[#2B3B28]">
                배고픈여우
              </span>
              <span className="text-[11px] uppercase tracking-widest text-[#698B60] font-semibold px-2 py-0.5 rounded-full bg-[#E6EFE4] border border-[#C9D8C6]">
                배고픈여우 · CAMPUS
              </span>
            </div>
            <p className="text-xs text-[#7B735F] hidden sm:block font-serif-kr">
              대학생을 위한 미니멀 독서기록 & 문장 아카이빙 SNS
            </p>
          </div>
        </div>

        {/* Action / Member counter badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenMemberList}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#3D5537] bg-[#EBF1E8] hover:bg-[#DFE9DB] border border-[#C9D8C6] transition-colors cursor-pointer"
            title="최근 가입 명부 및 누적 엑셀 다운로드"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#4A6741]" />
            <span className="font-medium">가입 명부</span>
            {memberCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#3D5537] text-[#FAF7F0]">
                {memberCount}
              </span>
            )}
          </button>

          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 text-[11px] text-[#786F58] bg-[#F2EBDA] rounded-lg border border-[#E3DCBF]">
            <BookmarkCheck className="w-3.5 h-3.5 text-[#587A4F]" />
            <span>엑셀 즉시 자동 생성</span>
          </div>
        </div>
      </div>
    </header>
  );
};
