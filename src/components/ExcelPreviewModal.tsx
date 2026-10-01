import React from 'react';
import { CheckCircle2, Download, FileSpreadsheet, X, Sparkles, University, BookCheck, Shield } from 'lucide-react';
import { MemberFormData } from '../types';
import { exportSingleMemberToExcel } from '../utils/excelExporter';

interface ExcelPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: MemberFormData | null;
  fileName: string;
}

export const ExcelPreviewModal: React.FC<ExcelPreviewModalProps> = ({
  isOpen,
  onClose,
  member,
  fileName,
}) => {
  if (!isOpen || !member) return null;

  const handleDownloadAgain = () => {
    exportSingleMemberToExcel(member);
  };

  const uniDisplay = member.university === '기타 (직접 입력)' && member.customUniversity
    ? `기타 (${member.customUniversity})`
    : member.university;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#233121]/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-[#FAF7F0] border border-[#DED4BA] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#E7EFE5] border-b border-[#C7D7C4] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#4A6741] text-[#FAF7F0] flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-kr text-lg font-bold text-[#283824]">
                회원가입 완료 & 엑셀 파일 생성
              </h3>
              <p className="text-xs text-[#526D4D]">
                입력하신 정보가 엑셀 파일로 정리되어 브라우저로 다운로드되었습니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#647C60] hover:text-[#283824] p-1.5 rounded-lg hover:bg-[#D5E4D2] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* File Card */}
          <div className="p-3.5 bg-[#F2ECE0] border border-[#DDD3BC] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#4A6741] text-[#FAF7F0] flex items-center justify-center shadow-xs">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div className="truncate max-w-[280px] sm:max-w-sm">
                <p className="text-xs font-semibold text-[#303E2D] truncate">
                  {fileName}
                </p>
                <p className="text-[11px] text-[#7E7460]">
                  Microsoft Excel 워크시트 (.xlsx) 형식
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDownloadAgain}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4A6741] hover:bg-[#3D5537] text-[#FAF7F0] text-xs font-medium rounded-lg shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>재다운로드</span>
            </button>
          </div>

          {/* Formatted Data Table Preview */}
          <div className="border border-[#E0D7C1] rounded-xl bg-[#FCFAF5] overflow-hidden">
            <div className="bg-[#EFE9D9] px-4 py-2 border-b border-[#E0D7C1] flex items-center justify-between text-xs font-semibold text-[#544B36]">
              <span>엑셀 정리 데이터 미리보기 (Sheet: 데이터명부_DB용)</span>
              <span className="text-[11px] text-[#7F745D]">UTF-8 인코딩 완료</span>
            </div>
            <div className="divide-y divide-[#EFE8D6] text-xs">
              <div className="grid grid-cols-3 px-4 py-2.5 bg-[#FAF7EF]">
                <span className="text-[#7A6F57] font-medium">이메일 계정</span>
                <span className="col-span-2 text-[#2B3929] font-medium font-mono">{member.email}</span>
              </div>
              <div className="grid grid-cols-3 px-4 py-2.5">
                <span className="text-[#7A6F57] font-medium">활동 닉네임</span>
                <span className="col-span-2 text-[#2B3929] font-semibold">{member.nickname}</span>
              </div>
              <div className="grid grid-cols-3 px-4 py-2.5 bg-[#FAF7EF]">
                <span className="text-[#7A6F57] font-medium">소속 대학교</span>
                <span className="col-span-2 text-[#3D5537] font-semibold flex items-center gap-1">
                  <University className="w-3.5 h-3.5 text-[#5B7A50]" />
                  {uniDisplay} {member.major ? `(${member.major})` : ''}
                </span>
              </div>
              <div className="grid grid-cols-3 px-4 py-2.5">
                <span className="text-[#7A6F57] font-medium">관심 도서 분야</span>
                <div className="col-span-2 flex flex-wrap gap-1">
                  {member.interestGenres.length > 0 ? (
                    member.interestGenres.map((genre) => (
                      <span
                        key={genre}
                        className="inline-block px-2 py-0.5 text-[10px] font-medium bg-[#E7EFE5] text-[#374C33] border border-[#C6D8C4] rounded-md"
                      >
                        {genre}
                      </span>
                    ))
                  ) : (
                    <span className="text-[#998F7A]">선택 없음</span>
                  )}
                </div>
              </div>
              {member.readingGoalPerMonth && (
                <div className="grid grid-cols-3 px-4 py-2.5 bg-[#FAF7EF]">
                  <span className="text-[#7A6F57] font-medium">월간 독서 목표</span>
                  <span className="col-span-2 text-[#2B3929]">
                    한 달에 <strong className="text-[#4A6741]">{member.readingGoalPerMonth}권</strong> 읽기
                  </span>
                </div>
              )}
              {member.readingResolution && (
                <div className="grid grid-cols-3 px-4 py-2.5">
                  <span className="text-[#7A6F57] font-medium">한 줄 독서 다짐</span>
                  <span className="col-span-2 text-[#464032] italic font-serif-kr">
                    "{member.readingResolution}"
                  </span>
                </div>
              )}
              <div className="grid grid-cols-3 px-4 py-2.5 bg-[#FAF7EF]">
                <span className="text-[#7A6F57] font-medium">가입 신청일시</span>
                <span className="col-span-2 text-[#6D634C] text-[11px]">
                  {member.createdAt}
                </span>
              </div>
            </div>
          </div>

          {/* Guide tip */}
          <div className="p-3 bg-[#EEF5EC] border border-[#CDE0CB] rounded-xl text-xs text-[#3E5839] flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#53774D] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>엑셀 시트 구성 안내:</strong> 파일 내부에는 읽기 쉬운 레이아웃의 <strong>[회원등록카드]</strong> 시트와, DB 임포트 및 필터링이 가능한 <strong>[데이터명부_DB용]</strong> 시트가 함께 포함되어 있습니다.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#F2ECE0] border-t border-[#DED4BA] px-6 py-3.5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-[#3E523A] bg-[#FAF7F0] hover:bg-[#EFE8D6] border border-[#CFCAA3] rounded-lg transition-colors cursor-pointer"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
