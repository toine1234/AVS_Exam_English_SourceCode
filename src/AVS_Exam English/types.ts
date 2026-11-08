export type SectionCode = 'A' | 'B' | 'C' | 'D' | 'E' | 'L' | 'F' | 'G' | 'H';

export type MediaType = 'none' | 'image' | 'audio' | 'video';

export interface QuestionItem {
  id: string;
  questionText: string;
  options?: string[]; // For MCQ or True/False
  correctAnswer: string | string[] | Record<string, string>;
  explanation?: string;
  hint?: string;
  underlinedWord?: string; // For phonics/stress
  prefix?: string;
  suffix?: string;
  stt?: number | string;
  mediaType?: MediaType;
  mediaFile?: string;
}

export interface ExcelQuestionRow {
  STT?: number | string;
  Ma_Phan_Tap: string; // VD: A1, B1, C1, L1, F1...
  Noi_Dung_Cau_Hoi: string;
  Dap_An_A?: string;
  Dap_An_B?: string;
  Dap_An_C?: string;
  Dap_An_D?: string;
  Dap_An_Dung: string;
  Giai_Thich?: string;
  Media_Type?: MediaType | string;
  Media_File?: string;
}

export type ExerciseType =
  | 'phonics_mcq'
  | 'phonics_classify'
  | 'stress_mcq'
  | 'vocabulary_mcq'
  | 'vocabulary_matching'
  | 'vocabulary_fill'
  | 'vocabulary_odd'
  | 'grammar_mcq'
  | 'grammar_verb'
  | 'grammar_adverbs'
  | 'grammar_error'
  | 'communication_mcq'
  | 'listening_mcq'
  | 'listening_tf'
  | 'listening_fill'
  | 'reading_mcq'
  | 'reading_tf'
  | 'reading_qa'
  | 'speaking_prompt'
  | 'speaking_dialogue'
  | 'writing_reorder'
  | 'writing_rewrite'
  | 'writing_paragraph';

export interface Exercise {
  id: string; // e.g. 'A1', 'A2', 'B1', 'C1', 'C2', 'C3', 'C4', 'D1', 'D2', 'D3', 'D4', 'E1', 'L1', 'L2', 'L3', 'F1', 'F2', 'F3', 'G1', 'G2', 'H1', 'H2', 'H3'
  section: SectionCode;
  sectionTitle: string;
  name: string;
  instruction: string;
  type: ExerciseType;
  points: number; // usually 10
  passage?: string; // For reading or listening audio script
  audioScript?: string; // For listening player
  wordBank?: string[]; // For classify, fill, matching
  columns?: { key: string; label: string; soundIpa?: string }[]; // For classification tables
  matchPairs?: { left: string; options: string[] }[]; // For matching verbs
  questions: QuestionItem[];
  sampleAnswer?: string;
  rubrics?: string[];
}

export interface Unit {
  id: string; // e.g. 'unit-1'
  gradeId: number; // 6, 7, 8, 9
  code: string; // 'Unit 1'
  title: string; // 'My New School'
  subtitle?: string;
  semester: string; // 'Học kỳ 1'
  bookSeries: string; // 'Global Success'
  skills: string[];
  bannerSubtitle?: string;
  exercises: Exercise[];
}

export interface Grade {
  id: number | string; // 6, 7, 8, 9, 'pet', 'ielts'
  name: string; // 'Lớp 6', 'Luyện thi PET (B1)', 'Luyện thi IELTS'
  code?: string;
  description: string;
  category?: 'thcs' | 'cambridge' | 'ielts' | 'other';
  units: Unit[];
}

export interface StudentInfo {
  fullName: string;
  className: string;
  teacherEmail: string;
  schoolName?: string;
  notes?: string;
}

export interface ExerciseSubmission {
  exerciseId: string;
  score: number; // out of 10
  totalQuestions: number;
  correctAnswersCount: number;
  answers: Record<string, any>;
  submittedAt: string;
  feedback?: string;
}

export interface StudentUnitRecord {
  id: string; // submission unique id
  studentInfo: StudentInfo;
  gradeId: number | string;
  unitId: string;
  unitTitle: string;
  completedExercises: Record<string, ExerciseSubmission>;
  totalSubmitted: number;
  totalAvailable: number;
  averageScore: number;
  createdAt: string;
  updatedAt: string;
}

// ================= QUESTION BANK & PERIODIC EXAM =================

export type SkillCategory =
  | 'Phonics'
  | 'Stress'
  | 'Vocabulary'
  | 'Grammar'
  | 'Communication'
  | 'Listening'
  | 'Reading'
  | 'Writing';

export interface QuestionBankItem {
  id: string; // e.g. 'qb_001'
  bookSeries: string; // 'Global Success 6', 'Global Success 7', 'Cambridge PET', 'IELTS Foundation'
  gradeLevel: string; // 'Lớp 6', 'Lớp 7', 'Lớp 8', 'Lớp 9', 'PET (B1)', 'IELTS'
  unitTag?: string; // 'Unit 1: My New School', 'Midterm Review', etc.
  skill: SkillCategory;
  sectionCode: SectionCode; // A, B, C, D, E, L, F, H
  maPhanTap: string; // A1, B1, C1, D1, L1, F1, H1...
  questionText: string;
  options: string[]; // ['A. ...', 'B. ...', 'C. ...', 'D. ...']
  correctAnswer: string; // 'A', 'B', 'C', 'D' or exact string
  explanation: string;
  mediaType: MediaType;
  mediaFile?: string;
  passage?: string; // Reading passage or listening transcript
  difficulty?: 'easy' | 'medium' | 'hard';
  createdAt: string;
}

export interface PeriodicExam {
  id: string; // e.g. 'exam_17310001'
  title: string; // 'Bài kiểm tra 1 tiết Số 1 - Unit 1 & 2'
  code: string; // 'EXAM-G6-01'
  gradeLevel: string; // 'Lớp 6'
  gradeId: number | string; // 6 or 'pet'
  bookSeries: string; // 'Global Success 6'
  durationMinutes: number; // e.g. 15, 45, 60
  totalQuestions: number;
  maxScore: number; // usually 10
  questions: QuestionBankItem[];
  skillMatrix: Record<string, number>; // { 'Grammar': 10, 'Reading': 5, ... }
  description?: string;
  createdAt: string;
  totalSubmissionsCount?: number;
  averageScore?: number;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  examTitle: string;
  gradeLevel: string;
  studentInfo: StudentInfo;
  score: number; // 0 - 10
  totalQuestions: number;
  correctCount: number;
  answers: Record<string, string>; // questionId -> selected answer
  timeSpentSeconds: number;
  submittedAt: string;
}

