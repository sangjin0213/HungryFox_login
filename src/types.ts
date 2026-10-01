export interface MemberFormData {
  email: string;
  emailDomain?: string;
  nickname: string;
  password: string;
  passwordConfirm: string;
  university: string;
  customUniversity?: string;
  major?: string;
  interestGenres: string[];
  readingGoalPerMonth?: number;
  readingResolution?: string;
  agreeTerms: boolean;
  createdAt: string;
}

export interface University {
  id: string;
  name: string;
  region: string;
}

export interface BookGenre {
  id: string;
  name: string;
  englishName: string;
  icon: string;
  description: string;
}
