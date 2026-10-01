import React from 'react';
import { X, FileSpreadsheet, Download, Trash2, Users, Building, Sparkles } from 'lucide-react';
import { MemberFormData } from '../types';
import { exportAllMembersToExcel } from '../utils/excelExporter';

interface MemberListModalProps {
  isOpen: boolean;
  onClose: () => void;
  members: MemberFormData[];
  onClearMembers: () => void;
}

export const MemberListModal: React.FC<MemberListModalProps> = ({
  isOpen,
  onClose,
  members,
  onClearMembers,
}) => {
  if (!isOpen) return null;

  const handleBulkExport = () => {
    if (members.length === 0) return;
    exportAllMembersToExcel(members);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#233121]/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-[#FAF7F0] border border-[#DED4BA] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#E7EFE5] border-b border-[#C7D7C4] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#4A6741] text-[#FAF7F0] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-kr text-lg font-bold text-[#283824]">
                누적 회원가입 명부 ({members.length}명)
              </h3>
              <p className="text-xs text-[#526D4D]">
                가입된 회원 정보를 확인하고 전체 명부를 통합 엑셀 파일로 다운로드할 수 있습니다.
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

        {/* Action bar */}
        <div className="bg-[#F2ECE0] border-b border-[#DDD3BC] px-6 py-2.5 flex items-center justify-between">
          <div className="text-xs text-[#6B6149]">
            총 등록 인원: <span className="font-bold text-[#3D5537]">{members.length}명</span>
          </div>
          <div className="flex items-center gap-2">
            {members.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={onClearMembers}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs text-[#9E453B] hover:bg-[#EBDDD9] rounded-md transition-colors cursor-pointer"
                  title="명부 목록 비우기"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>목록 초기화</span>
                </button>
                <button
                  type="button"
                  onClick={handleBulkExport}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4A6741] hover:bg-[#3D5537] text-[#FAF7F0] text-xs font-medium rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>전체 명부 엑셀 다운로드 (.xlsx)</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto flex-1">
          {members.length === 0 ? (
            <div className="text-center py-12 text-[#8C836F] space-y-3">
              <FileSpreadsheet className="w-12 h-12 mx-auto text-[#B7C7B3] stroke-1" />
              <p className="font-serif-kr text-base font-semibold text-[#544D3B]">
                아직 등록된 가입 정보가 없습니다
              </p>
              <p className="text-xs max-w-sm mx-auto text-[#7D7460]">
                회원가입 폼을 작성하고 [회원가입하기] 버튼을 누르면 실시간으로 엑셀 파일이 생성되고 이곳에 명부가 보관됩니다.
              </p>
            </div>
          ) : (
            <div className="border border-[#E0D7C1] rounded-xl overflow-hidden bg-[#FCFAF5]">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#EFE8D6] text-[#59503B] font-semibold uppercase tracking-wider border-b border-[#E0D7C1]">
                    <tr>
                      <th className="py-2.5 px-3">No</th>
                      <th className="py-2.5 px-3">닉네임</th>
                      <th className="py-2.5 px-3">이메일</th>
                      <th className="py-2.5 px-3">소속 대학</th>
                      <th className="py-2.5 px-3">관심 분야</th>
                      <th className="py-2.5 px-3">가입일시</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFE8D6]">
                    {members.map((m, idx) => {
                      const uni = m.university === '기타 (직접 입력)' && m.customUniversity
                        ? m.customUniversity
                        : m.university;
                      return (
                        <tr key={idx} className="hover:bg-[#F5EFE0]/60 transition-colors">
                          <td className="py-2.5 px-3 font-mono text-[#827863]">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-semibold text-[#2F3D2C]">{m.nickname}</td>
                          <td className="py-2.5 px-3 font-mono text-[#6A6048]">{m.email}</td>
                          <td className="py-2.5 px-3 text-[#3E5839]">{uni}</td>
                          <td className="py-2.5 px-3 max-w-[200px]">
                            <div className="truncate text-[#685F49]" title={m.interestGenres.join(', ')}>
                              {m.interestGenres.slice(0, 2).join(', ')}
                              {m.interestGenres.length > 2 && ` 외 ${m.interestGenres.length - 2}개`}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-[11px] text-[#867B66] whitespace-nowrap">
                            {m.createdAt}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#F2ECE0] border-t border-[#DED4BA] px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-[#687C63]">
            <Sparkles className="w-3.5 h-3.5 text-[#52774C]" />
            <span>엑셀 파일은 브라우저 내에서 안전하게 즉시 암호화/생성됩니다.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-[#3D5239] bg-[#FAF7F0] hover:bg-[#EFE8D6] border border-[#CFCAA3] rounded-lg transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
