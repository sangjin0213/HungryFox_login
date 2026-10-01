import React, { useState } from 'react';
import {
  Mail,
  User,
  Lock,
  Eye,
  EyeOff,
  School,
  BookOpen,
  Check,
  RotateCcw,
  Download,
  Sparkles,
  AlertCircle,
  FileSpreadsheet,
  CheckSquare,
  Square,
  GraduationCap,
  PenTool,
  Bookmark,
} from 'lucide-react';
import { UNIVERSITIES } from '../data/universities';
import { BOOK_GENRES } from '../data/genres';
import { MemberFormData } from '../types';

interface SignUpFormProps {
  onSubmitSuccess: (member: MemberFormData) => void;
}

const INITIAL_FORM: MemberFormData = {
  email: '',
  nickname: '',
  password: '',
  passwordConfirm: '',
  university: '서울대학교',
  customUniversity: '',
  major: '',
  interestGenres: ['한국문학 / 소설', '인문학 / 철학', '시 / 에세이'],
  readingGoalPerMonth: 3,
  readingResolution: '',
  agreeTerms: true,
  createdAt: '',
};

export const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState<MemberFormData>(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Genre toggle
  const toggleGenre = (genreName: string) => {
    setFormData((prev) => {
      const exists = prev.interestGenres.includes(genreName);
      const updated = exists
        ? prev.interestGenres.filter((g) => g !== genreName)
        : [...prev.interestGenres, genreName];
      return { ...prev, interestGenres: updated };
    });
    if (errors.interestGenres) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.interestGenres;
        return next;
      });
    }
  };

  const selectAllGenres = () => {
    setFormData((prev) => ({
      ...prev,
      interestGenres: BOOK_GENRES.map((g) => g.name),
    }));
  };

  const deselectAllGenres = () => {
    setFormData((prev) => ({
      ...prev,
      interestGenres: [],
    }));
  };

  // Form field change handler
  const handleChange = (
    field: keyof MemberFormData,
    value: string | number | boolean | string[]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // Sample data autofill for quick testing
  const handleAutoFillSample = () => {
    const samples = [
      {
        email: 'reading.student@snu.ac.kr',
        nickname: '페르소나서재',
        university: '서울대학교',
        customUniversity: '',
        major: '국어국문학과',
        interestGenres: ['한국문학 / 소설', '인문학 / 철학', '시 / 에세이', '예술 / 건축 / 영화'],
        readingGoalPerMonth: 4,
        readingResolution: '하루 30분, 온전히 나를 위한 활자의 숲 거닐기',
      },
      {
        email: 'campus.bookworm@yonsei.ac.kr',
        nickname: '윤동주처럼',
        university: '연세대학교',
        customUniversity: '',
        major: '철학과',
        interestGenres: ['세계문학 / 고전', '시 / 에세이', '인문학 / 철학', '역사 / 문화'],
        readingGoalPerMonth: 5,
        readingResolution: '밑줄 긋고 사유하는 청춘의 서재 만들기',
      },
      {
        email: 'science.reader@kaist.ac.kr',
        nickname: '별헤는공학도',
        university: 'KAIST (한국과학기술원)',
        customUniversity: '',
        major: '전산학부',
        interestGenres: ['자연과학 / 수학', 'IT / 공학 / AI', '장르문학 (SF / 추리 / 판타지)'],
        readingGoalPerMonth: 3,
        readingResolution: '기술과 인문학의 교차점에서 영감 얻기',
      },
    ];
    const picked = samples[Math.floor(Math.random() * samples.length)];
    setFormData({
      ...INITIAL_FORM,
      ...picked,
      password: 'password123!',
      passwordConfirm: 'password123!',
      agreeTerms: true,
      createdAt: '',
    });
    setErrors({});
    showToast('✨ 샘플 회원 정보가 입력되었습니다. 회원가입하기를 눌러 엑셀을 확인해보세요!');
  };

  // Form Reset
  const handleReset = () => {
    if (
      formData.email ||
      formData.nickname ||
      formData.password ||
      formData.readingResolution
    ) {
      const confirmReset = window.confirm('입력하신 모든 정보가 초기화됩니다. 계속하시겠습니까?');
      if (!confirmReset) return;
    }
    setFormData({
      email: '',
      nickname: '',
      password: '',
      passwordConfirm: '',
      university: '서울대학교',
      customUniversity: '',
      major: '',
      interestGenres: [],
      readingGoalPerMonth: 2,
      readingResolution: '',
      agreeTerms: false,
      createdAt: '',
    });
    setErrors({});
    showToast('입력된 모든 정보가 초기화되었습니다.');
  };

  // Validation & Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Email check
    if (!formData.email.trim()) {
      newErrors.email = '이메일 주소를 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식(예: name@univ.ac.kr)을 입력해주세요.';
    }

    // Nickname check
    if (!formData.nickname.trim()) {
      newErrors.nickname = '활동 닉네임을 입력해주세요.';
    } else if (formData.nickname.trim().length < 2) {
      newErrors.nickname = '닉네임은 2자 이상 입력해주세요.';
    }

    // Password check
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
    }

    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 서로 일치하지 않습니다.';
    }

    // University check
    if (formData.university === '기타 (직접 입력)' && !formData.customUniversity?.trim()) {
      newErrors.customUniversity = '소속 대학교 명칭을 직접 입력해주세요.';
    }

    // Genres check
    if (formData.interestGenres.length === 0) {
      newErrors.interestGenres = '관심 있는 도서 분야를 1개 이상 선택해주세요.';
    }

    // Terms
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = '이용약관 및 개인정보 수집에 동의해야 가입할 수 있습니다.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Scroll to first error
      const firstErrorField = Object.keys(newErrors)[0];
      const el = document.getElementById(`field-${firstErrorField}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Submit & Trigger Excel Generation
    const finalData: MemberFormData = {
      ...formData,
      createdAt: new Date().toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    };

    onSubmitSuccess(finalData);
  };

  const isPasswordMatch =
    formData.password &&
    formData.passwordConfirm &&
    formData.password === formData.passwordConfirm;

  return (
    <div className="relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#354830] text-[#FAF7F0] px-4 py-3 rounded-xl shadow-lg border border-[#4F6C48] text-xs sm:text-sm flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="w-4 h-4 text-[#A7C7A2]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Form Paper Card */}
      <div className="bg-[#FAF7F0] border border-[#DDD3BC] rounded-3xl p-6 sm:p-10 shadow-[0_8px_30px_rgba(74,103,65,0.05)] text-[#2B3828]">
        {/* Card Header & Bookish Quote */}
        <div className="border-b border-[#E7E0CB] pb-7 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E4ECE1] text-[#3E573A] border border-[#C5D5C2]">
              <Bookmark className="w-3.5 h-3.5" />
              캠퍼스 리더스 클럽
            </span>
            <button
              type="button"
              onClick={handleAutoFillSample}
              className="text-xs text-[#5E795B] hover:text-[#2D412A] hover:bg-[#E9F0E6] px-3 py-1 rounded-lg border border-[#CAD8C7] transition-colors cursor-pointer flex items-center gap-1.5 font-medium"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#547351]" />
              <span>테스트용 예시 데이터 채우기</span>
            </button>
          </div>

          <h1 className="font-serif-kr text-2xl sm:text-3xl font-bold tracking-tight text-[#243322] leading-tight">
            대학생 독서기록장 <span className="text-[#4A6741]">배고픈여우</span> 회원가입
          </h1>
          <p className="mt-2 text-sm text-[#736954] font-serif-kr leading-relaxed">
            책장을 넘기는 소리와 캠퍼스 학우들의 사유가 머무는 공간. 가입 즉시 회원 정보가 <strong>정리된 엑셀 명부(.xlsx)</strong>로 다운로드됩니다.
          </p>
        </div>

        {/* The Form */}
        <form onSubmit={handleSubmit} className="space-y-8" noValidate>
          {/* Section 1: Basic Credentials */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-1 border-b border-[#EDE6D4]">
              <span className="w-2 h-2 rounded-full bg-[#4A6741]"></span>
              <h2 className="font-serif-kr text-base font-bold text-[#2A3928]">
                01. 기본 계정 정보
              </h2>
            </div>

            {/* Email Field */}
            <div id="field-email" className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#635A47]">
                이메일 주소 <span className="text-[#AC463B]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A7F69]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="campus_id@university.ac.kr"
                  className={`w-full pl-10 pr-4 py-2.5 bg-[#FCFAF5] border rounded-xl text-sm text-[#273525] placeholder-[#9E947F] focus:outline-none focus:ring-2 transition-all ${
                    errors.email
                      ? 'border-[#C75A4E] focus:ring-[#C75A4E]/30 bg-[#FDF7F6]'
                      : 'border-[#DDD4BE] focus:border-[#4A6741] focus:ring-[#4A6741]/20'
                  }`}
                />
              </div>
              {errors.email ? (
                <p className="text-xs text-[#BA4437] flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.email}
                </p>
              ) : (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-[#867B66]">빠른 입력:</span>
                  {['@snu.ac.kr', '@yonsei.ac.kr', '@korea.ac.kr', '@gmail.com', '@naver.com'].map(
                    (domain) => (
                      <button
                        key={domain}
                        type="button"
                        onClick={() => {
                          const base = formData.email.split('@')[0] || 'student';
                          handleChange('email', `${base}${domain}`);
                        }}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-[#EFE9DA] text-[#635944] hover:bg-[#E3DCBF] border border-[#DDD3BD] transition-colors cursor-pointer"
                      >
                        {domain}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            {/* Nickname Field */}
            <div id="field-nickname" className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#635A47]">
                활동 닉네임 (배고픈여우 명칭) <span className="text-[#AC463B]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A7F69]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  maxLength={16}
                  value={formData.nickname}
                  onChange={(e) => handleChange('nickname', e.target.value)}
                  placeholder="예: 별헤는밤, 문학청년, 책벌레철학도"
                  className={`w-full pl-10 pr-16 py-2.5 bg-[#FCFAF5] border rounded-xl text-sm text-[#273525] placeholder-[#9E947F] focus:outline-none focus:ring-2 transition-all ${
                    errors.nickname
                      ? 'border-[#C75A4E] focus:ring-[#C75A4E]/30 bg-[#FDF7F6]'
                      : 'border-[#DDD4BE] focus:border-[#4A6741] focus:ring-[#4A6741]/20'
                  }`}
                />
                <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[11px] text-[#938871] font-mono">
                  {formData.nickname.length}/16
                </span>
              </div>
              {errors.nickname ? (
                <p className="text-xs text-[#BA4437] flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.nickname}
                </p>
              ) : (
                <p className="text-[11px] text-[#7E745F]">
                  독서 기록 및 서평 작성 시 표시되는 나만의 필명입니다.
                </p>
              )}
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div id="field-password" className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#635A47]">
                  비밀번호 <span className="text-[#AC463B]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A7F69]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="6자 이상 입력"
                    className={`w-full pl-10 pr-10 py-2.5 bg-[#FCFAF5] border rounded-xl text-sm text-[#273525] placeholder-[#9E947F] focus:outline-none focus:ring-2 transition-all ${
                      errors.password
                        ? 'border-[#C75A4E] focus:ring-[#C75A4E]/30 bg-[#FDF7F6]'
                        : 'border-[#DDD4BE] focus:border-[#4A6741] focus:ring-[#4A6741]/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8C816B] hover:text-[#3E523A] cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-[#BA4437] flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div id="field-passwordConfirm" className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#635A47]">
                    비밀번호 확인 <span className="text-[#AC463B]">*</span>
                  </label>
                  {isPasswordMatch && (
                    <span className="text-[11px] text-[#4A6741] flex items-center gap-0.5 font-medium">
                      <Check className="w-3 h-3" /> 일치함
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A7F69]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.passwordConfirm}
                    onChange={(e) => handleChange('passwordConfirm', e.target.value)}
                    placeholder="비밀번호 재입력"
                    className={`w-full pl-10 pr-10 py-2.5 bg-[#FCFAF5] border rounded-xl text-sm text-[#273525] placeholder-[#9E947F] focus:outline-none focus:ring-2 transition-all ${
                      errors.passwordConfirm
                        ? 'border-[#C75A4E] focus:ring-[#C75A4E]/30 bg-[#FDF7F6]'
                        : isPasswordMatch
                        ? 'border-[#9BBF94] focus:border-[#4A6741] focus:ring-[#4A6741]/20 bg-[#F7FAF6]'
                        : 'border-[#DDD4BE] focus:border-[#4A6741] focus:ring-[#4A6741]/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8C816B] hover:text-[#3E523A] cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.passwordConfirm && (
                  <p className="text-xs text-[#BA4437] flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.passwordConfirm}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Campus & Academic Info */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 pb-1 border-b border-[#EDE6D4]">
              <span className="w-2 h-2 rounded-full bg-[#4A6741]"></span>
              <h2 className="font-serif-kr text-base font-bold text-[#2A3928]">
                02. 소속 대학 및 캠퍼스 정보
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* University Dropdown */}
              <div id="field-university" className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#635A47]">
                  소속 대학교 드롭다운 <span className="text-[#AC463B]">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A7F69]">
                    <School className="w-4 h-4" />
                  </div>
                  <select
                    value={formData.university}
                    onChange={(e) => handleChange('university', e.target.value)}
                    className="w-full pl-10 pr-8 py-2.5 bg-[#FCFAF5] border border-[#DDD4BE] rounded-xl text-sm text-[#273525] focus:outline-none focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]/20 transition-all appearance-none cursor-pointer"
                  >
                    {UNIVERSITIES.map((univ) => (
                      <option key={univ.id} value={univ.name}>
                        {univ.name} {univ.region !== '기타' && univ.region !== '전국' ? `(${univ.region})` : ''}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#8A7F69]">
                    <span className="text-xs">▼</span>
                  </div>
                </div>
                <p className="text-[11px] text-[#7E745F]">
                  같은 대학 학우들의 서가(책장)와 도서관 대출 팁을 우선 추천받습니다.
                </p>
              </div>

              {/* Major / Department (Optional for college students) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#635A47]">
                  전공 / 학과 (선택)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A7F69]">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={formData.major || ''}
                    onChange={(e) => handleChange('major', e.target.value)}
                    placeholder="예: 경영학과, 컴퓨터공학과, 심리학과"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FCFAF5] border border-[#DDD4BE] rounded-xl text-sm text-[#273525] placeholder-[#9E947F] focus:outline-none focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]/20 transition-all"
                  />
                </div>
                <p className="text-[11px] text-[#7E745F]">
                  전공 분야 도서 추천 및 캠퍼스 전공별 스터디 매칭에 활용됩니다.
                </p>
              </div>
            </div>

            {/* Custom University input when '기타 (직접 입력)' is selected */}
            {formData.university === '기타 (직접 입력)' && (
              <div id="field-customUniversity" className="p-3.5 bg-[#F4EFE2] border border-[#D9CEB3] rounded-xl space-y-1.5 animate-in fade-in">
                <label className="block text-xs font-bold text-[#554C37]">
                  대학교명 직접 입력 <span className="text-[#AC463B]">*</span>
                </label>
                <input
                  type="text"
                  value={formData.customUniversity || ''}
                  onChange={(e) => handleChange('customUniversity', e.target.value)}
                  placeholder="예: 한국대학교 (캠퍼스명 포함)"
                  className="w-full px-3.5 py-2 bg-[#FAF8F2] border border-[#CFC3A4] rounded-lg text-sm text-[#273525] focus:outline-none focus:border-[#4A6741] focus:ring-1 focus:ring-[#4A6741]"
                />
                {errors.customUniversity && (
                  <p className="text-xs text-[#BA4437] flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.customUniversity}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Section 3: Book Interests Multi-Selection */}
          <div id="field-interestGenres" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-[#EDE6D4]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4A6741]"></span>
                <h2 className="font-serif-kr text-base font-bold text-[#2A3928]">
                  03. 관심 도서 분야 (중복 선택)
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-[#E4ECE1] text-[#3A5336] border border-[#C5D5C2]">
                  {formData.interestGenres.length}개 선택됨
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={selectAllGenres}
                  className="px-2 py-1 text-[#4F6C48] hover:bg-[#E8F0E5] rounded-md transition-colors cursor-pointer"
                >
                  전체 선택
                </button>
                <span className="text-[#B5AC98]">|</span>
                <button
                  type="button"
                  onClick={deselectAllGenres}
                  className="px-2 py-1 text-[#877C65] hover:bg-[#EDE5D3] rounded-md transition-colors cursor-pointer"
                >
                  전체 해제
                </button>
              </div>
            </div>

            <p className="text-xs text-[#7B7059]">
              평소 즐겨 읽거나 이번 학기에 읽고 싶은 카테고리를 자유롭게 복수 선택해주세요. 피드 추천 및 엑셀 명부에 기재됩니다.
            </p>

            {errors.interestGenres && (
              <p className="text-xs text-[#BA4437] flex items-center gap-1 bg-[#FDF4F3] p-2.5 rounded-lg border border-[#F2C2BD]">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {errors.interestGenres}
              </p>
            )}

            {/* Grid of multi-selection cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {BOOK_GENRES.map((genre) => {
                const isSelected = formData.interestGenres.includes(genre.name);
                return (
                  <button
                    key={genre.id}
                    type="button"
                    onClick={() => toggleGenre(genre.name)}
                    className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                      isSelected
                        ? 'bg-[#EAF1E7] border-[#8BA888] shadow-xs ring-1 ring-[#8BA888]/40'
                        : 'bg-[#FCFAF5] border-[#E2D9C3] hover:border-[#CAD7C7] hover:bg-[#F7F4EB]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-lg">{genre.icon}</span>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-[#4A6741] text-[#FAF7F0]'
                              : 'border border-[#C8BEA7] bg-[#FAF7F0] group-hover:border-[#96B392]'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                        </div>
                      </div>
                      <h3
                        className={`text-xs sm:text-sm font-bold tracking-tight ${
                          isSelected ? 'text-[#2D412B]' : 'text-[#3E4D3C]'
                        }`}
                      >
                        {genre.name}
                      </h3>
                      <p className="text-[11px] text-[#7C725D] mt-0.5 line-clamp-1">
                        {genre.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Reading Goals & Resolution (College Student Touch) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-1 border-b border-[#EDE6D4]">
              <span className="w-2 h-2 rounded-full bg-[#4A6741]"></span>
              <h2 className="font-serif-kr text-base font-bold text-[#2A3928]">
                04. 나의 독서 목표 & 한 줄 다짐
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Monthly Goal */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#635A47]">
                  월간 목표 독서량
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A7F69]">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <select
                    value={formData.readingGoalPerMonth || 3}
                    onChange={(e) => handleChange('readingGoalPerMonth', Number(e.target.value))}
                    className="w-full pl-10 pr-8 py-2.5 bg-[#FCFAF5] border border-[#DDD4BE] rounded-xl text-sm text-[#273525] focus:outline-none focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]/20 appearance-none cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                      <option key={num} value={num}>
                        월 {num}권 완독하기
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#8A7F69]">
                    <span className="text-xs">▼</span>
                  </div>
                </div>
              </div>

              {/* Reading Resolution */}
              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#635A47]">
                  한 줄 독서 다짐 (배고픈여우 소개글)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8A7F69]">
                    <PenTool className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={formData.readingResolution || ''}
                    onChange={(e) => handleChange('readingResolution', e.target.value)}
                    placeholder="예: 시험 기간에도 하루 15분 독서 지키기"
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FCFAF5] border border-[#DDD4BE] rounded-xl text-sm text-[#273525] placeholder-[#9E947F] focus:outline-none focus:border-[#4A6741] focus:ring-2 focus:ring-[#4A6741]/20 transition-all font-serif-kr"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Terms Checkbox */}
          <div id="field-agreeTerms" className="p-4 bg-[#F2ECE0]/80 border border-[#DDD3BC] rounded-xl space-y-2">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={(e) => handleChange('agreeTerms', e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-[#BDB29B] text-[#4A6741] focus:ring-[#4A6741] cursor-pointer"
              />
              <span className="text-xs text-[#4F4735] leading-relaxed">
                <strong className="text-[#2F3A2C] font-semibold">[필수]</strong> 개인정보 수집 및 대학생 독서기록 SNS 이용약관에 동의합니다. (입력된 가입 정보는 가입 명부 엑셀 파일(.xlsx)로 암호화 정리되어 다운로드됩니다.)
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="text-xs text-[#BA4437] flex items-center gap-1 ml-7">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.agreeTerms}
              </p>
            )}
          </div>

          {/* Action Buttons: Sign Up (Excel Download) & Reset */}
          <div className="pt-4 border-t border-[#E7E0CB] space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
              {/* Reset Button */}
              <button
                type="button"
                onClick={handleReset}
                className="order-2 sm:order-1 px-5 py-3.5 text-sm font-semibold text-[#665D47] hover:text-[#2E281C] bg-[#EFE8D6] hover:bg-[#E4DCBF] border border-[#D5CBAD] rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <RotateCcw className="w-4 h-4 text-[#7C715A]" />
                <span>입력된 정보 초기화</span>
              </button>

              {/* Sign Up & Excel Download Button */}
              <button
                type="submit"
                className="order-1 sm:order-2 px-7 py-3.5 text-sm font-bold text-[#FAF7F0] bg-[#4A6741] hover:bg-[#3D5537] rounded-xl shadow-[0_4px_16px_rgba(74,103,65,0.25)] hover:shadow-[0_6px_20px_rgba(74,103,65,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2.5 active:scale-[0.98]"
              >
                <FileSpreadsheet className="w-4 h-4 text-[#D8E8D5]" />
                <span>회원가입하기 (엑셀파일로 정리해 다운로드)</span>
                <Download className="w-4 h-4 text-[#D8E8D5]" />
              </button>
            </div>

            <p className="text-[11px] text-center text-[#847963] font-serif-kr pt-2">
              * [회원가입하기]를 누르면 입력하신 내용이 즉시 <strong>Microsoft Excel (.xlsx)</strong> 양식으로 자동 변환되어 저장됩니다.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
