import * as XLSX from 'xlsx';
import { MemberFormData } from '../types';

const STORAGE_KEY = 'seojae_reading_sns_members_v1';

export function saveMemberToStorage(member: MemberFormData): MemberFormData[] {
  const existing = getStoredMembers();
  const updated = [member, ...existing];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
  return updated;
}

export function getStoredMembers(): MemberFormData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function clearStoredMembers(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear localStorage', e);
  }
}

// Convert member list to structured 2D array or object array with Korean headers
function formatMemberRows(members: MemberFormData[]) {
  return members.map((m, index) => {
    const uniDisplay = m.university === '기타 (직접 입력)' && m.customUniversity 
      ? `기타 (${m.customUniversity})` 
      : m.university;

    return {
      '연번': index + 1,
      '가입 신청일시': m.createdAt || new Date().toLocaleString('ko-KR'),
      '이메일 계정': m.email,
      '닉네임': m.nickname,
      '소속 대학교': uniDisplay,
      '전공/학과': m.major || '미입력',
      '관심 도서 분야': m.interestGenres.join(', '),
      '관심 분야 개수': m.interestGenres.length,
      '월 목표 독서량': m.readingGoalPerMonth ? `${m.readingGoalPerMonth}권` : '자유 독서',
      '한 줄 독서 다짐': m.readingResolution || '책과 함께 성장하는 대학 생활',
      '약관 및 개인정보 동의': m.agreeTerms ? '동의함 (Y)' : '미동의 (N)',
    };
  });
}

/**
 * Single member export to Excel (.xlsx)
 */
export function exportSingleMemberToExcel(member: MemberFormData): string {
  const uniDisplay = member.university === '기타 (직접 입력)' && member.customUniversity
    ? `기타 (${member.customUniversity})`
    : member.university;

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  const safeNickname = (member.nickname || '회원').replace(/[^\wㄱ-ㅎㅏ-ㅣ가-힣]/g, '_');
  const fileName = `독서기록장SNS_회원가입_${safeNickname}_${dateStr}_${timeStr}.xlsx`;

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Sheet 1: 회원가입 상세 명세표 (Editorial Layout)
  const detailAOA: (string | number)[][] = [
    ['[ 배고픈여우 대학생 독서기록 SNS - 신규 회원가입 등록 명세서 ]'],
    ['* 본 문서는 독서기록장 SNS 회원가입 시 자동 생성된 엑셀 데이터 파일입니다.'],
    [''],
    ['항목', '입력 내용', '비고 / 비즈니스 필드'],
    ['신청 일시', member.createdAt || now.toLocaleString('ko-KR'), 'KST 기준'],
    ['이메일 주소', member.email, '로그인 아이디 및 인증용'],
    ['활동 닉네임', member.nickname, '커뮤니티 서재 프로필명'],
    ['소속 대학교', uniDisplay, '캠퍼스 독서 클럽 연계'],
    ['전공 / 학과', member.major || '미입력', '선택 기재'],
    ['관심 도서 분야 (상세)', member.interestGenres.join(' | '), `총 ${member.interestGenres.length}개 분야 선택`],
    ['선택 분야 수', member.interestGenres.length, '도서 피드 추천 가중치'],
    ['월간 독서 목표', member.readingGoalPerMonth ? `${member.readingGoalPerMonth}권` : '설정 안 함', '배고픈여우 대시보드 반영'],
    ['한 줄 독서 다짐', member.readingResolution || '기록이 머무는 곳, 나의 서재', '프로필 상단 소개문구'],
    ['약관 동의 상태', member.agreeTerms ? '동의 완료 (VERIFIED)' : '미동의', '개인정보 처리 방침'],
    [''],
    ['[ 배고픈여우 플랫폼 안내 ]'],
    ['서비스명', '배고픈여우 - 대학생을 위한 감성 독서기록 SNS'],
    ['핵심 기능', '캠퍼스별 독서 아카이빙, 밑줄 필사 공유, 도서 교환 커뮤니티'],
    ['발급 시스템', '배고픈여우 Client-side Excel Exporter Engine v1.0'],
  ];

  const wsDetail = XLSX.utils.aoa_to_sheet(detailAOA);

  // Column width styling
  wsDetail['!cols'] = [
    { wch: 22 }, // 항목
    { wch: 45 }, // 입력 내용
    { wch: 32 }, // 비고
  ];

  // Sheet 2: 데이터베이스 표준 로우 (Database Format for DB import)
  const rows = formatMemberRows([member]);
  const wsTable = XLSX.utils.json_to_sheet(rows);
  wsTable['!cols'] = [
    { wch: 6 },
    { wch: 22 },
    { wch: 26 },
    { wch: 16 },
    { wch: 20 },
    { wch: 18 },
    { wch: 40 },
    { wch: 14 },
    { wch: 15 },
    { wch: 35 },
    { wch: 20 },
  ];

  XLSX.utils.book_append_sheet(wb, wsDetail, '회원등록카드');
  XLSX.utils.book_append_sheet(wb, wsTable, '데이터명부_DB용');

  // Trigger download
  XLSX.writeFile(wb, fileName);

  return fileName;
}

/**
 * Bulk export all registered members
 */
export function exportAllMembersToExcel(members: MemberFormData[]): string {
  if (members.length === 0) return '';

  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const timeStr = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
  const fileName = `독서기록장SNS_전체회원명부_${dateStr}_${timeStr}.xlsx`;

  const wb = XLSX.utils.book_new();

  // Sheet 1: Table format
  const rows = formatMemberRows(members);
  const wsTable = XLSX.utils.json_to_sheet(rows);

  wsTable['!cols'] = [
    { wch: 6 },
    { wch: 22 },
    { wch: 26 },
    { wch: 16 },
    { wch: 20 },
    { wch: 18 },
    { wch: 40 },
    { wch: 14 },
    { wch: 15 },
    { wch: 35 },
    { wch: 20 },
  ];

  // Sheet 2: University & Genre Statistics Summary
  const uniCount: Record<string, number> = {};
  const genreCount: Record<string, number> = {};

  members.forEach(m => {
    const uni = m.university === '기타 (직접 입력)' && m.customUniversity ? m.customUniversity : m.university;
    uniCount[uni] = (uniCount[uni] || 0) + 1;
    m.interestGenres.forEach(g => {
      genreCount[g] = (genreCount[g] || 0) + 1;
    });
  });

  const statsAOA: (string | number)[][] = [
    ['[ 배고픈여우 대학생 독서기록 SNS - 가입 현황 통계 요약 ]'],
    ['총 가입 신청 인원', `${members.length}명`],
    ['명부 추출 일시', now.toLocaleString('ko-KR')],
    [''],
    ['소속 대학별 집계', '인원수'],
    ...Object.entries(uniCount).sort((a, b) => b[1] - a[1]).map(([u, c]) => [u, `${c}명`]),
    [''],
    ['관심 도서 분야별 선호도', '선택 횟수'],
    ...Object.entries(genreCount).sort((a, b) => b[1] - a[1]).map(([g, c]) => [g, `${c}회`]),
  ];

  const wsStats = XLSX.utils.aoa_to_sheet(statsAOA);
  wsStats['!cols'] = [{ wch: 28 }, { wch: 16 }];

  XLSX.utils.book_append_sheet(wb, wsTable, '전체회원명부');
  XLSX.utils.book_append_sheet(wb, wsStats, '통계요약');

  XLSX.writeFile(wb, fileName);
  return fileName;
}
