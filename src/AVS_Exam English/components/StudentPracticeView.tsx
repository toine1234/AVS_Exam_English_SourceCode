import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudentHeader } from './StudentHeader';
import { StudentInfoForm } from './StudentInfoForm';
import { ExerciseNavigation } from './ExerciseNavigation';
import { ScoreDashboardGrid } from './ScoreDashboardGrid';
import { ExerciseCard } from './ExerciseCard';
import { SummaryCompletionModal } from './SummaryCompletionModal';
import { Sparkles, Trophy, ArrowUp, Clock, ExternalLink, Home, ChevronRight } from 'lucide-react';

export const StudentPracticeView: React.FC = () => {
  const {
    activeUnit,
    activeFilterSection,
    currentUnitSubmissions,
    activeGrade,
    periodicExams,
    openExamView,
    setCurrentView
  } = useApp();
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  // Relevant exams for current grade
  const gradeExams = periodicExams.filter(
    (e) =>
      String(e.gradeId) === String(activeGrade?.id) ||
      e.gradeLevel.toLowerCase().includes(activeGrade?.name.toLowerCase() || '')
  );

  const exercises = activeUnit?.exercises || [];

  // Filter exercises if specific section selected
  const displayedExercises =
    activeFilterSection === 'ALL'
      ? exercises
      : exercises.filter((ex) => ex.section === activeFilterSection);

  const totalExercises = exercises.length || 23;
  const submittedCount = Object.keys(currentUnitSubmissions).length;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* Breadcrumb Navigation & Dynamic Route */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 mb-4 overflow-x-auto whitespace-nowrap bg-white/70 backdrop-blur-xs p-2.5 rounded-2xl border border-pink-100 shadow-2xs">
        <button
          onClick={() => setCurrentView('student')}
          className="hover:text-pink-600 transition-colors flex items-center gap-1 font-semibold text-slate-600 cursor-pointer"
        >
          <Home className="w-3.5 h-3.5 text-pink-500" />
          <span>Trang chủ</span>
        </button>
        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
        <span className="font-bold text-pink-700 bg-pink-50 border border-pink-200/80 px-2 py-0.5 rounded-lg">
          {activeGrade?.name}
        </span>
        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
        <span className="font-extrabold text-slate-800 truncate">
          {activeUnit?.code}: {activeUnit?.title}
        </span>
        <span className="ml-auto text-[11px] font-mono text-slate-400 hidden sm:inline bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
          🔗 /class/{activeGrade?.code || 'grade-6'}/{activeUnit?.id || 'unit-1'}
        </span>
      </nav>

      {/* 1. Header & Pastel Pink Banner */}
      <StudentHeader />

      {/* Periodic Exams Available for this Grade */}
      {gradeExams.length > 0 && (
        <div className="mb-6 p-4 sm:p-5 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 rounded-3xl text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-white shrink-0">
              <Clock className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/25 text-white">
                  Đề kiểm tra định kỳ có tính giờ
                </span>
                <span className="text-xs text-pink-100 hidden sm:inline">
                  {gradeExams.length} đề thi sẵn sàng
                </span>
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-white mt-0.5">
                {gradeExams[0].title}
              </h3>
              <p className="text-xs text-white/90">
                Thời lượng: <strong>{gradeExams[0].durationMinutes} phút</strong> · <strong>{gradeExams[0].totalQuestions} câu hỏi</strong> · Thang điểm 10 có chấm tự động
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => openExamView(gradeExams[0].id)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white text-pink-700 hover:bg-pink-50 rounded-xl text-xs font-black shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              <span>Vào thi ngay</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 2. Form Thông Tin Học Sinh & Quy Định Nộp Bài */}
      <StudentInfoForm />

      {/* 3. Thanh Điều Hướng Bài Tập & Bảng Điểm Dashboard */}
      <ExerciseNavigation />

      <ScoreDashboardGrid onOpenSummaryModal={() => setIsSummaryModalOpen(true)} />

      {/* 4. Danh sách Chi Tiết 23 Bài Tập */}
      <section id="exercises-section" className="space-y-6">
        <div className="flex items-center justify-between pb-2 mb-4 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              {activeFilterSection === 'ALL'
                ? `Danh Sách Toàn Bộ ${exercises.length} Bài Tập (A1 - H3)`
                : `Phần Bài Tập: ${activeFilterSection}`}
            </h2>
            <p className="text-xs text-slate-500">
              Làm lần lượt từng câu và bấm &quot;Nộp bài tập này&quot; ở cuối mỗi bài để ghi điểm
            </p>
          </div>

          <span className="text-xs font-semibold text-pink-700 bg-pink-50 px-3 py-1 rounded-xl border border-pink-200">
            Hiển thị {displayedExercises.length} bài
          </span>
        </div>

        {displayedExercises.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-sm">
            Chưa có bài tập nào trong phần này. Giáo viên có thể nhập thêm bài qua Cổng Quản Trị.
          </div>
        ) : (
          displayedExercises.map((exercise, idx) => (
            <ExerciseCard key={exercise.id} exercise={exercise} index={idx} />
          ))
        )}
      </section>

      {/* Floating Bottom Quick Action Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 max-w-lg w-[92%] bg-slate-900/90 backdrop-blur-md text-white p-3 px-5 rounded-2xl shadow-xl border border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <Trophy className="w-4 h-4 text-pink-400" />
          <span className="text-slate-300">Đã nộp:</span>
          <strong className="text-white font-bold">
            {submittedCount}/{totalExercises} bài
          </strong>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={scrollToTop}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Lên đầu trang"
          >
            <ArrowUp className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsSummaryModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-pink-600 hover:bg-pink-700 rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nộp bài &amp; Xem điểm</span>
          </button>
        </div>
      </div>

      {/* Summary Completion Modal */}
      <SummaryCompletionModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
      />
    </div>
  );
};
