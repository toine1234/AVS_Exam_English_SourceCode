import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Grade,
  Unit,
  StudentInfo,
  ExerciseSubmission,
  StudentUnitRecord,
  Exercise,
  QuestionBankItem,
  PeriodicExam,
  ExamSubmission,
  SkillCategory
} from '../types';
import { INITIAL_GRADES, SAMPLE_STUDENT_SUBMISSIONS } from '../data/curriculumData';
import { INITIAL_QUESTION_BANK, INITIAL_PERIODIC_EXAMS } from '../data/questionBankData';

export type AppView = 'student' | 'admin' | 'exam';

interface AppContextType {
  grades: Grade[];
  activeGradeId: number | string;
  activeUnitId: string;
  activeGrade: Grade | undefined;
  activeUnit: Unit | undefined;
  currentView: AppView;
  studentInfo: StudentInfo;
  currentUnitSubmissions: Record<string, ExerciseSubmission>;
  allStudentRecords: StudentUnitRecord[];
  activeFilterSection: string; // 'ALL', 'A', 'B', 'C', 'D', 'E', 'L', 'F', 'G', 'H'
  setActiveFilterSection: (sec: string) => void;
  setActiveGradeAndUnit: (gradeId: number | string, unitId: string) => void;
  setCurrentView: (view: AppView) => void;
  setStudentInfo: React.Dispatch<React.SetStateAction<StudentInfo>>;
  submitExercise: (
    exerciseId: string,
    answers: Record<string, any>,
    score: number,
    totalQuestions: number,
    correctCount: number
  ) => void;
  resetExercise: (exerciseId: string) => void;
  submitEntireUnit: () => { success: boolean; message: string; recordId?: string };
  // Admin actions
  addGrade: (name: string, description: string, code?: string, category?: any) => void;
  addUnit: (gradeId: number | string, unit: Omit<Unit, 'id'>) => void;
  deleteUnit: (gradeId: number | string, unitId: string) => void;
  importCurriculumData: (data: any) => { success: boolean; count: number; error?: string };
  deleteStudentRecord: (recordId: string) => void;
  resetToDefaultCurriculum: () => void;
  importExcelExercises: (
    gradeId: number | string,
    unitId: string,
    exercises: Exercise[],
    mode?: 'replace' | 'append'
  ) => { success: boolean; count: number; error?: string };

  // NEW: Question Bank (Ngân hàng câu hỏi)
  questionBank: QuestionBankItem[];
  addQuestionToBank: (item: Omit<QuestionBankItem, 'id' | 'createdAt'>) => QuestionBankItem;
  deleteQuestionFromBank: (id: string) => void;
  updateQuestionInBank: (id: string, updates: Partial<QuestionBankItem>) => void;
  importQuestionsToBank: (questions: QuestionBankItem[]) => number;

  // NEW: Periodic Exams (Tạo bài test định kỳ)
  periodicExams: PeriodicExam[];
  activeExamId: string | null;
  activeExam: PeriodicExam | undefined;
  examSubmissions: ExamSubmission[];
  setActiveExamId: (examId: string | null) => void;
  openExamView: (examId: string) => void;
  createPeriodicExam: (exam: Omit<PeriodicExam, 'id' | 'createdAt'>) => PeriodicExam;
  deletePeriodicExam: (id: string) => void;
  submitPeriodicExam: (submission: Omit<ExamSubmission, 'id' | 'submittedAt'>) => ExamSubmission;
  generateRandomExamFromBank: (config: {
    title: string;
    gradeLevel: string;
    gradeId: number | string;
    bookSeries: string;
    durationMinutes: number;
    skillMatrix: Record<string, number>;
    description?: string;
  }) => PeriodicExam;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  GRADES: 'avs_grades_data_v1',
  STUDENT_INFO: 'avs_student_info_v1',
  STUDENT_RECORDS: 'avs_student_records_v1',
  ACTIVE_GRADE: 'avs_active_grade_id',
  ACTIVE_UNIT: 'avs_active_unit_id',
  QUESTION_BANK: 'avs_question_bank_v1',
  PERIODIC_EXAMS: 'avs_periodic_exams_v1',
  EXAM_SUBMISSIONS: 'avs_exam_submissions_v1'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load grades from localStorage or defaults
  const [grades, setGrades] = useState<Grade[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.GRADES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading grades from localStorage', e);
    }
    return INITIAL_GRADES;
  });

  // URL Hash/Path Parsing to support deep linking e.g. /class/grade-6/unit-1 or #/class/grade-6/unit-1 or #/exam/exam_id
  const getInitialRouting = () => {
    try {
      const hash = window.location.hash;
      const pathname = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      let gradeId: number | string = 6;
      let unitId = 'unit-1';
      let view: AppView = (params.get('view') as any) || 'student';
      let examId: string | null = null;

      const fullUrl = pathname + hash;

      // Check for exam link e.g. #/exam/exam_id or /exam/exam_id or ?exam=exam_id
      const examMatch = fullUrl.match(/(?:exam\/|#exam=|\?exam=)([a-zA-Z0-9_-]+)/);
      if (examMatch && examMatch[1]) {
        examId = examMatch[1];
        view = 'exam';
      }

      // Match pattern /class/grade-6/unit-1 or #/class/grade-6/unit-1
      const classMatch = fullUrl.match(/class\/grade-([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)/);
      if (classMatch) {
        const rawG = classMatch[1];
        const parsedG = parseInt(rawG, 10);
        gradeId = isNaN(parsedG) ? rawG : parsedG;
        unitId = classMatch[2].split('?')[0];
      } else if (hash.includes('/grade/')) {
        const parts = hash.replace('#/', '').split('/');
        const gIdx = parts.indexOf('grade');
        if (gIdx !== -1 && parts[gIdx + 1]) {
          const rawG = parts[gIdx + 1];
          const parsedG = parseInt(rawG, 10);
          gradeId = isNaN(parsedG) ? rawG : parsedG;
        }
        const uIdx = parts.indexOf('unit');
        if (uIdx !== -1 && parts[uIdx + 1]) {
          unitId = parts[uIdx + 1].split('?')[0];
        }
      }

      if (hash.includes('view=admin') || params.get('view') === 'admin') {
        view = 'admin';
      }

      return { gradeId, unitId, view, examId };
    } catch {
      return { gradeId: 6, unitId: 'unit-1', view: 'student' as const, examId: null };
    }
  };

  const initialRoute = getInitialRouting();
  const [activeGradeId, setActiveGradeId] = useState<number | string>(initialRoute.gradeId);
  const [activeUnitId, setActiveUnitId] = useState<string>(initialRoute.unitId);
  const [currentView, setCurrentView] = useState<AppView>(initialRoute.view);
  const [activeFilterSection, setActiveFilterSection] = useState<string>('ALL');
  const [activeExamId, setActiveExamId] = useState<string | null>(initialRoute.examId);

  // Question Bank state
  const [questionBank, setQuestionBank] = useState<QuestionBankItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.QUESTION_BANK);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_QUESTION_BANK;
  });

  // Periodic Exams state
  const [periodicExams, setPeriodicExams] = useState<PeriodicExam[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.PERIODIC_EXAMS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_PERIODIC_EXAMS;
  });

  // Exam Submissions state
  const [examSubmissions, setExamSubmissions] = useState<ExamSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.EXAM_SUBMISSIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Student info state
  const [studentInfo, setStudentInfo] = useState<StudentInfo>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.STUDENT_INFO);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      fullName: '',
      className: '6A1',
      teacherEmail: 'cogiang.tienganh@gmail.com',
      schoolName: 'THCS Lê Quý Đôn',
      notes: ''
    };
  });

  // All student records (teacher dashboard)
  const [allStudentRecords, setAllStudentRecords] = useState<StudentUnitRecord[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.STUDENT_RECORDS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return SAMPLE_STUDENT_SUBMISSIONS as StudentUnitRecord[];
  });

  // Submissions for the current unit & student
  const [currentUnitSubmissions, setCurrentUnitSubmissions] = useState<Record<string, ExerciseSubmission>>({});

  // Active Grade and Unit
  const activeGrade = grades.find((g) => String(g.id) === String(activeGradeId)) || grades[0];
  const activeUnit = activeGrade?.units.find((u) => u.id === activeUnitId) || activeGrade?.units[0];
  const activeExam = periodicExams.find((e) => e.id === activeExamId) || periodicExams[0];

  // Save Question Bank and Periodic Exams to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.QUESTION_BANK, JSON.stringify(questionBank));
    } catch (e) {
      console.error(e);
    }
  }, [questionBank]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.PERIODIC_EXAMS, JSON.stringify(periodicExams));
    } catch (e) {
      console.error(e);
    }
  }, [periodicExams]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.EXAM_SUBMISSIONS, JSON.stringify(examSubmissions));
    } catch (e) {
      console.error(e);
    }
  }, [examSubmissions]);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.GRADES, JSON.stringify(grades));
    } catch (e) {
      console.error(e);
    }
  }, [grades]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.STUDENT_INFO, JSON.stringify(studentInfo));
    } catch (e) {
      console.error(e);
    }
  }, [studentInfo]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.STUDENT_RECORDS, JSON.stringify(allStudentRecords));
    } catch (e) {
      console.error(e);
    }
  }, [allStudentRecords]);

  // Update hash when active grade/unit/view/exam changes
  useEffect(() => {
    if (currentView === 'exam' && activeExamId) {
      const newHash = `#/exam/${activeExamId}`;
      if (window.location.hash !== newHash) {
        window.history.replaceState(null, '', newHash);
      }
    } else if (activeUnit) {
      const newHash = `#/grade/${activeGradeId}/unit/${activeUnitId}${currentView === 'admin' ? '?view=admin' : ''}`;
      if (window.location.hash !== newHash) {
        window.history.replaceState(null, '', newHash);
      }
    }
  }, [activeGradeId, activeUnitId, currentView, activeUnit, activeExamId]);

  // Load existing current unit submissions if this student already submitted
  useEffect(() => {
    if (!studentInfo.fullName || !activeUnit) {
      setCurrentUnitSubmissions({});
      return;
    }
    const existingRecord = allStudentRecords.find(
      (r) =>
        r.studentInfo.fullName.trim().toLowerCase() === studentInfo.fullName.trim().toLowerCase() &&
        r.gradeId === activeGradeId &&
        r.unitId === activeUnitId
    );
    if (existingRecord) {
      setCurrentUnitSubmissions(existingRecord.completedExercises || {});
    } else {
      setCurrentUnitSubmissions({});
    }
  }, [activeGradeId, activeUnitId, studentInfo.fullName, allStudentRecords]);

  const setActiveGradeAndUnit = (gradeId: number | string, unitId: string) => {
    setActiveGradeId(gradeId);
    setActiveUnitId(unitId);
    setActiveFilterSection('ALL');
  };

  const submitExercise = (
    exerciseId: string,
    answers: Record<string, any>,
    score: number,
    totalQuestions: number,
    correctCount: number
  ) => {
    const newSubmission: ExerciseSubmission = {
      exerciseId,
      score: Math.round(score * 10) / 10,
      totalQuestions,
      correctAnswersCount: correctCount,
      answers,
      submittedAt: new Date().toLocaleString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    };

    setCurrentUnitSubmissions((prev) => {
      const updated = { ...prev, [exerciseId]: newSubmission };

      // Also persist to allStudentRecords if student has a name
      if (studentInfo.fullName.trim()) {
        const now = new Date().toLocaleString('vi-VN');
        setAllStudentRecords((records) => {
          const existingIndex = records.findIndex(
            (r) =>
              r.studentInfo.fullName.trim().toLowerCase() === studentInfo.fullName.trim().toLowerCase() &&
              r.gradeId === activeGradeId &&
              r.unitId === activeUnitId
          );

          const totalSub = Object.keys(updated).length;
          const totalAvail = activeUnit?.exercises.length || 23;
          const totalPoints = Object.values(updated).reduce((acc, curr) => acc + curr.score, 0);
          const avg = totalSub > 0 ? Math.round((totalPoints / totalSub) * 10) / 10 : 0;

          if (existingIndex >= 0) {
            const next = [...records];
            next[existingIndex] = {
              ...next[existingIndex],
              studentInfo: { ...studentInfo },
              completedExercises: updated,
              totalSubmitted: totalSub,
              totalAvailable: totalAvail,
              averageScore: avg,
              updatedAt: now
            };
            return next;
          } else {
            const newRecord: StudentUnitRecord = {
              id: `sub_${Date.now()}`,
              studentInfo: { ...studentInfo },
              gradeId: activeGradeId,
              unitId: activeUnitId,
              unitTitle: `${activeUnit?.code || 'Unit'}: ${activeUnit?.title || ''}`,
              completedExercises: updated,
              totalSubmitted: totalSub,
              totalAvailable: totalAvail,
              averageScore: avg,
              createdAt: now,
              updatedAt: now
            };
            return [newRecord, ...records];
          }
        });
      }

      return updated;
    });
  };

  const resetExercise = (exerciseId: string) => {
    setCurrentUnitSubmissions((prev) => {
      const copy = { ...prev };
      delete copy[exerciseId];
      return copy;
    });
  };

  const submitEntireUnit = () => {
    if (!studentInfo.fullName.trim()) {
      return { success: false, message: 'Vui lòng điền Họ và tên học sinh trước khi nộp bài tổng kết.' };
    }
    const submittedCount = Object.keys(currentUnitSubmissions).length;
    if (submittedCount === 0) {
      return { success: false, message: 'Bạn chưa hoàn thành bài tập nào. Hãy làm ít nhất 1 bài để nộp nhé!' };
    }

    const now = new Date().toLocaleString('vi-VN');
    const totalAvail = activeUnit?.exercises.length || 23;
    const totalPoints = Object.values(currentUnitSubmissions).reduce((acc, curr) => acc + curr.score, 0);
    const avg = Math.round((totalPoints / submittedCount) * 10) / 10;

    let recordId = '';

    setAllStudentRecords((records) => {
      const existingIndex = records.findIndex(
        (r) =>
          r.studentInfo.fullName.trim().toLowerCase() === studentInfo.fullName.trim().toLowerCase() &&
          r.gradeId === activeGradeId &&
          r.unitId === activeUnitId
      );

      if (existingIndex >= 0) {
        recordId = records[existingIndex].id;
        const next = [...records];
        next[existingIndex] = {
          ...next[existingIndex],
          studentInfo: { ...studentInfo },
          completedExercises: currentUnitSubmissions,
          totalSubmitted: submittedCount,
          totalAvailable: totalAvail,
          averageScore: avg,
          updatedAt: now
        };
        return next;
      } else {
        recordId = `sub_${Date.now()}`;
        const newRecord: StudentUnitRecord = {
          id: recordId,
          studentInfo: { ...studentInfo },
          gradeId: activeGradeId,
          unitId: activeUnitId,
          unitTitle: `${activeUnit?.code || 'Unit'}: ${activeUnit?.title || ''}`,
          completedExercises: currentUnitSubmissions,
          totalSubmitted: submittedCount,
          totalAvailable: totalAvail,
          averageScore: avg,
          createdAt: now,
          updatedAt: now
        };
        return [newRecord, ...records];
      }
    });

    return {
      success: true,
      message: `Đã nộp thành công ${submittedCount}/${totalAvail} bài tập đến hòm thư giáo viên: ${studentInfo.teacherEmail}!`,
      recordId
    };
  };

  // Admin methods
  const addGrade = (name: string, description: string, code?: string, category?: any) => {
    const rawIds = grades.map((g) => (typeof g.id === 'number' ? g.id : 0));
    const newId = Math.max(...rawIds, 0) + 1;
    const newGrade: Grade = {
      id: newId,
      name,
      code: code || `G${newId}`,
      category: category || 'thcs',
      description,
      units: []
    };
    setGrades((prev) => [...prev, newGrade]);
  };

  const addUnit = (gradeId: number | string, unitData: Omit<Unit, 'id'>) => {
    const unitId = `unit-${Date.now().toString(36)}`;
    const newUnit: Unit = {
      ...unitData,
      id: unitId,
      gradeId: gradeId as any
    };

    setGrades((prev) =>
      prev.map((g) => {
        if (String(g.id) === String(gradeId)) {
          return {
            ...g,
            units: [...g.units, newUnit]
          };
        }
        return g;
      })
    );
  };

  const deleteUnit = (gradeId: number | string, unitId: string) => {
    setGrades((prev) =>
      prev.map((g) => {
        if (String(g.id) === String(gradeId)) {
          return {
            ...g,
            units: g.units.filter((u) => u.id !== unitId)
          };
        }
        return g;
      })
    );
  };

  const importCurriculumData = (data: any): { success: boolean; count: number; error?: string } => {
    try {
      let parsed = data;
      if (typeof data === 'string') {
        parsed = JSON.parse(data);
      }

      // Check if it is a list of exercises
      if (Array.isArray(parsed)) {
        if (activeUnit) {
          const validExercises = parsed.filter((item) => item.id && item.name && item.questions);
          if (validExercises.length === 0) {
            return { success: false, count: 0, error: 'Không tìm thấy bài tập hợp lệ trong dữ liệu nhập.' };
          }

          setGrades((prev) =>
            prev.map((g) => {
              if (String(g.id) === String(activeGradeId)) {
                return {
                  ...g,
                  units: g.units.map((u) => {
                    if (u.id === activeUnitId) {
                      return {
                        ...u,
                        exercises: [...u.exercises, ...validExercises]
                      };
                    }
                    return u;
                  })
                };
              }
              return g;
            })
          );
          return { success: true, count: validExercises.length };
        }
      }

      // Check if it is full Grades structure
      if (parsed.grades && Array.isArray(parsed.grades)) {
        setGrades(parsed.grades);
        return { success: true, count: parsed.grades.length };
      }

      // Check if it is a single Unit object
      if (parsed.code && parsed.title && Array.isArray(parsed.exercises)) {
        addUnit(activeGradeId, {
          gradeId: activeGradeId as any,
          code: parsed.code,
          title: parsed.title,
          subtitle: parsed.subtitle || '',
          semester: parsed.semester || 'Học kỳ 1',
          bookSeries: parsed.bookSeries || 'Global Success',
          skills: parsed.skills || ['Phonics', 'Vocabulary', 'Grammar'],
          bannerSubtitle: parsed.bannerSubtitle || '',
          exercises: parsed.exercises
        });
        return { success: true, count: parsed.exercises.length };
      }

      return { success: false, count: 0, error: 'Định dạng dữ liệu không khớp với mẫu hỗ trợ.' };
    } catch (err: any) {
      return { success: false, count: 0, error: err?.message || 'Lỗi xử lý file' };
    }
  };

  const deleteStudentRecord = (recordId: string) => {
    setAllStudentRecords((prev) => prev.filter((r) => r.id !== recordId));
  };

  const resetToDefaultCurriculum = () => {
    setGrades(INITIAL_GRADES);
    setActiveGradeId(6);
    setActiveUnitId('unit-1');
  };

  const importExcelExercises = (
    gradeId: number | string,
    unitId: string,
    importedExercises: Exercise[],
    mode: 'replace' | 'append' = 'replace'
  ) => {
    if (!importedExercises || importedExercises.length === 0) {
      return { success: false, count: 0, error: 'Không có bài tập nào để nhập' };
    }

    setGrades((prev) =>
      prev.map((g) => {
        if (String(g.id) === String(gradeId)) {
          return {
            ...g,
            units: g.units.map((u) => {
              if (u.id === unitId) {
                const updatedExercises =
                  mode === 'replace'
                    ? importedExercises
                    : [
                        ...u.exercises.filter((ex) => !importedExercises.some((ie) => ie.id === ex.id)),
                        ...importedExercises
                      ];
                return {
                  ...u,
                  exercises: updatedExercises
                };
              }
              return u;
            })
          };
        }
        return g;
      })
    );

    setActiveGradeId(gradeId);
    setActiveUnitId(unitId);

    const totalQuestions = importedExercises.reduce((sum, ex) => sum + ex.questions.length, 0);
    return { success: true, count: totalQuestions };
  };

  // ================= QUESTION BANK METHODS =================
  const addQuestionToBank = (item: Omit<QuestionBankItem, 'id' | 'createdAt'>): QuestionBankItem => {
    const newItem: QuestionBankItem = {
      ...item,
      id: `qb_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setQuestionBank((prev) => [newItem, ...prev]);
    return newItem;
  };

  const deleteQuestionFromBank = (id: string) => {
    setQuestionBank((prev) => prev.filter((q) => q.id !== id));
  };

  const updateQuestionInBank = (id: string, updates: Partial<QuestionBankItem>) => {
    setQuestionBank((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const importQuestionsToBank = (questions: QuestionBankItem[]): number => {
    if (!questions || questions.length === 0) return 0;
    setQuestionBank((prev) => [...questions, ...prev]);
    return questions.length;
  };

  // ================= PERIODIC EXAM METHODS =================
  const openExamView = (examId: string) => {
    setActiveExamId(examId);
    setCurrentView('exam');
    window.location.hash = `#/exam/${examId}`;
  };

  const createPeriodicExam = (exam: Omit<PeriodicExam, 'id' | 'createdAt'>): PeriodicExam => {
    const newExam: PeriodicExam = {
      ...exam,
      id: `exam_${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
      totalSubmissionsCount: 0,
      averageScore: 0
    };
    setPeriodicExams((prev) => [newExam, ...prev]);
    return newExam;
  };

  const deletePeriodicExam = (id: string) => {
    setPeriodicExams((prev) => prev.filter((e) => e.id !== id));
  };

  const submitPeriodicExam = (
    submission: Omit<ExamSubmission, 'id' | 'submittedAt'>
  ): ExamSubmission => {
    const submissionId = `esub_${Date.now()}`;
    const now = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const newSubmission: ExamSubmission = {
      ...submission,
      id: submissionId,
      submittedAt: now
    };

    setExamSubmissions((prev) => [newSubmission, ...prev]);

    // Update Periodic Exam counters
    setPeriodicExams((prev) =>
      prev.map((exam) => {
        if (exam.id === submission.examId) {
          const curCount = exam.totalSubmissionsCount || 0;
          const curAvg = exam.averageScore || 0;
          const newCount = curCount + 1;
          const newAvg = Math.round(((curAvg * curCount + submission.score) / newCount) * 10) / 10;
          return {
            ...exam,
            totalSubmissionsCount: newCount,
            averageScore: newAvg
          };
        }
        return exam;
      })
    );

    // Also add to allStudentRecords so it shows in teacher's gradebook!
    const unitRecord: StudentUnitRecord = {
      id: `rec_${submissionId}`,
      studentInfo: submission.studentInfo,
      gradeId: submission.gradeLevel,
      unitId: submission.examId,
      unitTitle: `[Đề kiểm tra] ${submission.examTitle}`,
      completedExercises: {
        exam: {
          exerciseId: 'exam',
          score: submission.score,
          totalQuestions: submission.totalQuestions,
          correctAnswersCount: submission.correctCount,
          answers: submission.answers,
          submittedAt: now
        }
      },
      totalSubmitted: submission.totalQuestions,
      totalAvailable: submission.totalQuestions,
      averageScore: submission.score,
      createdAt: now,
      updatedAt: now
    };

    setAllStudentRecords((prev) => [unitRecord, ...prev]);

    return newSubmission;
  };

  const generateRandomExamFromBank = (config: {
    title: string;
    gradeLevel: string;
    gradeId: number | string;
    bookSeries: string;
    durationMinutes: number;
    skillMatrix: Record<string, number>;
    description?: string;
  }): PeriodicExam => {
    const selectedQuestions: QuestionBankItem[] = [];

    // For each skill in the matrix
    Object.entries(config.skillMatrix).forEach(([skillName, requestedCount]) => {
      if (requestedCount <= 0) return;

      // Filter candidates by skill
      const candidates = questionBank.filter(
        (q) => q.skill.toLowerCase() === skillName.toLowerCase()
      );

      // Prefer questions matching the selected gradeLevel or bookSeries
      const matchingGrade = candidates.filter(
        (q) =>
          q.gradeLevel.toLowerCase().includes(config.gradeLevel.toLowerCase()) ||
          (config.bookSeries && q.bookSeries.toLowerCase().includes(config.bookSeries.toLowerCase()))
      );

      const pool = matchingGrade.length >= requestedCount ? matchingGrade : candidates;

      // Shuffle pool
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      const picked = shuffled.slice(0, requestedCount);
      selectedQuestions.push(...picked);
    });

    const examId = `exam_${Date.now()}`;
    const examCode = `EXAM-${String(config.gradeId).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const newExam: PeriodicExam = {
      id: examId,
      title: config.title,
      code: examCode,
      gradeLevel: config.gradeLevel,
      gradeId: config.gradeId,
      bookSeries: config.bookSeries,
      durationMinutes: config.durationMinutes,
      totalQuestions: selectedQuestions.length,
      maxScore: 10,
      skillMatrix: config.skillMatrix,
      questions: selectedQuestions,
      description:
        config.description ||
        `Đề kiểm tra định kỳ ${config.durationMinutes} phút bám sát ma trận năng lực ${config.gradeLevel}.`,
      createdAt: new Date().toISOString().slice(0, 10),
      totalSubmissionsCount: 0,
      averageScore: 0
    };

    setPeriodicExams((prev) => [newExam, ...prev]);
    return newExam;
  };

  return (
    <AppContext.Provider
      value={{
        grades,
        activeGradeId,
        activeUnitId,
        activeGrade,
        activeUnit,
        currentView,
        studentInfo,
        currentUnitSubmissions,
        allStudentRecords,
        activeFilterSection,
        setActiveFilterSection,
        setActiveGradeAndUnit,
        setCurrentView,
        setStudentInfo,
        submitExercise,
        resetExercise,
        submitEntireUnit,
        addGrade,
        addUnit,
        deleteUnit,
        importCurriculumData,
        deleteStudentRecord,
        resetToDefaultCurriculum,
        importExcelExercises,
        questionBank,
        addQuestionToBank,
        deleteQuestionFromBank,
        updateQuestionInBank,
        importQuestionsToBank,
        periodicExams,
        activeExamId,
        activeExam,
        examSubmissions,
        setActiveExamId,
        openExamView,
        createPeriodicExam,
        deletePeriodicExam,
        submitPeriodicExam,
        generateRandomExamFromBank
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
