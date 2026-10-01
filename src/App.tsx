/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SignUpForm } from './components/SignUpForm';
import { ExcelPreviewModal } from './components/ExcelPreviewModal';
import { MemberListModal } from './components/MemberListModal';
import { MemberFormData } from './types';
import {
  exportSingleMemberToExcel,
  getStoredMembers,
  saveMemberToStorage,
  clearStoredMembers,
} from './utils/excelExporter';
import {
  BookOpen,
  FileSpreadsheet,
  CheckCircle2,
  Users,
  Sparkles,
  Bookmark,
  GraduationCap,
  Quote,
} from 'lucide-react';

export default function App() {
  const [members, setMembers] = useState<MemberFormData[]>([]);
  const [currentMember, setCurrentMember] = useState<MemberFormData | null>(null);
  const [lastFileName, setLastFileName] = useState<string>('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMemberListOpen, setIsMemberListOpen] = useState(false);

  // Load saved members on mount
  useEffect(() => {
    const saved = getStoredMembers();
    setMembers(saved);
  }, []);

  // When form is submitted:
  // 1. Export Excel file and trigger download immediately as requested
  // 2. Save member to history list / localStorage
  // 3. Open preview modal with details
  const handleSignUpSuccess = (newMember: MemberFormData) => {
    try {
      const fileName = exportSingleMemberToExcel(newMember);
      const updated = saveMemberToStorage(newMember);
      setMembers(updated);
      setLastFileName(fileName);
      setCurrentMember(newMember);
      setIsPreviewOpen(true);
    } catch (error) {
      console.error('Excel generation failed:', error);
      alert('엑셀 파일 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleClearMembers = () => {
    if (window.confirm('저장된 전체 명부 목록을 비우시겠습니까?')) {
      clearStoredMembers();
      setMembers([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5EE] text-[#283726] flex flex-col selection:bg-[#D5E3D2] selection:text-[#263C24]">
      {/* Top Header */}
      <Header
        memberCount={members.length}
        onOpenMemberList={() => setIsMemberListOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Subtle Poetic Editorial Banner */}
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-[#EAF0E7] border border-[#CCDBC9] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#4A6741] text-[#FAF7F0] flex items-center justify-center shrink-0 mt-0.5">
              <Quote className="w-4 h-4" />
            </div>
            <div>
              <p className="font-serif-kr text-xs sm:text-sm font-semibold text-[#2F422C]">
                "책을 읽는다는 것은 타인의 생각을 빌려 자신의 고유한 사유를 짓는 일이다."
              </p>
              <p className="text-[11px] text-[#637C5F] mt-0.5">
                대학생 독서기록 SNS <strong className="font-semibold text-[#3D5537]">배고픈여우</strong>에서 캠퍼스 학우들과 영감을 나누세요.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#FAF7F0] text-[#3D5537] border border-[#BDCEBA] shadow-2xs">
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#4A6741]" />
              엑셀 자동 저장 지원
            </span>
          </div>
        </div>

        {/* The Registration Form */}
        <SignUpForm onSubmitSuccess={handleSignUpSuccess} />

        {/* Feature Highlights Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#F4EFE3] border border-[#DDD3BA] space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-[#E3EBDD] border border-[#BFD2BC] flex items-center justify-center text-[#3D5537]">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h4 className="font-serif-kr text-sm font-bold text-[#32402E]">
              캠퍼스 독서 커뮤니티
            </h4>
            <p className="text-xs text-[#706650] leading-relaxed">
              소속 대학 학우들과 같은 책을 읽고 서평을 나누며, 캠퍼스 도서관 대출 현황과 추천 서가를 공유합니다.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F4EFE3] border border-[#DDD3BA] space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-[#E3EBDD] border border-[#BFD2BC] flex items-center justify-center text-[#3D5537]">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <h4 className="font-serif-kr text-sm font-bold text-[#32402E]">
              원클릭 엑셀 명부 정리
            </h4>
            <p className="text-xs text-[#706650] leading-relaxed">
              가입 시 입력된 이메일, 대학, 관심 분야가 표준 엑셀 워크시트(.xlsx)로 즉시 다운로드되어 체계적으로 보관됩니다.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F4EFE3] border border-[#DDD3BA] space-y-1.5">
            <div className="w-7 h-7 rounded-lg bg-[#E3EBDD] border border-[#BFD2BC] flex items-center justify-center text-[#3D5537]">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="font-serif-kr text-sm font-bold text-[#32402E]">
              감성 미니멀 디자인
            </h4>
            <p className="text-xs text-[#706650] leading-relaxed">
              눈이 편안한 옅은 녹색과 온화한 미색(누런색) 종이 질감의 팔레트로 장시간 독서 기록에 최적화되었습니다.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5DECA] bg-[#F4EFE3] py-8 text-center text-xs text-[#786F58]">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <p className="font-serif-kr font-semibold text-[#3C4A38]">
            배고픈여우 · 대학생을 위한 감성 독서기록장 SNS
          </p>
          <p className="text-[11px] text-[#8C826B]">
            본 페이지는 독서기록장 회원가입 입력을 받아 엑셀 파일(.xlsx)로 자동 정리하여 다운로드하는 시스템입니다.
          </p>
          <p className="text-[10px] text-[#A59A83] font-mono pt-1">
            Pale Green & Warm Parchment Minimalist Palette © 2026 배고픈여우 CAMPUS
          </p>
        </div>
      </footer>

      {/* Excel Download Preview Modal */}
      <ExcelPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        member={currentMember}
        fileName={lastFileName}
      />

      {/* Member List Drawer / Modal */}
      <MemberListModal
        isOpen={isMemberListOpen}
        onClose={() => setIsMemberListOpen(false)}
        members={members}
        onClearMembers={handleClearMembers}
      />
    </div>
  );
}
