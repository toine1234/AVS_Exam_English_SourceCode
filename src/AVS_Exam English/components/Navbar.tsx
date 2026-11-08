import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, User, ShieldCheck, Share2, ChevronDown, Check, Sparkles, Download } from 'lucide-react';
import { ShareModal } from './ShareModal';

export const Navbar: React.FC = () => {
  const {
    grades,
    activeGradeId,
    activeUnitId,
    activeGrade,
    activeUnit,
    currentView,
    setCurrentView,
    setActiveGradeAndUnit,
    periodicExams,
    activeExam,
    openExamView
  } = useApp();

  const [isGradeMenuOpen, setIsGradeMenuOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-pink-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            
            {/* Zone 1: Brand & Grade Selector */}
            <div className="flex items-center gap-3">
              <a
                href="#top"
                className="flex items-center gap-2 group text-decoration-none"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-sm shadow-pink-200">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-lg font-bold text-slate-900 tracking-tight block leading-tight">
                    AVS English
                  </span>
                  <span className="text-xs text-pink-600 font-medium">
                    Global Success Practice
                  </span>
                </div>
              </a>

              {/* Dynamic Grade & Unit Dropdown Selector */}
              <div className="relative ml-2 sm:ml-4">
                <button
                  type="button"
                  onClick={() => setIsGradeMenuOpen(!isGradeMenuOpen)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-pink-50/80 hover:bg-pink-100/80 border border-pink-200/70 rounded-lg transition-all"
                >
                  {currentView === 'exam' && activeExam ? (
                    <>
                      <span className="px-1.5 py-0.5 rounded bg-pink-600 text-white font-bold text-[10px]">Đề thi</span>
                      <span className="truncate max-w-[130px] sm:max-w-[180px] font-bold text-pink-700">{activeExam.title}</span>
                    </>
                  ) : (
                    <>
                      <span className="text-pink-700 font-bold">{activeGrade?.name}</span>
                      <span className="text-slate-400">·</span>
                      <span className="truncate max-w-[130px] sm:max-w-[180px]">{activeUnit?.code}: {activeUnit?.title}</span>
                    </>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {isGradeMenuOpen && (
                  <div
                    className="absolute left-0 mt-2 w-72 sm:w-88 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-1"
                    onMouseLeave={() => setIsGradeMenuOpen(false)}
                  >
                    {/* Section 1: Periodic Exams */}
                    {periodicExams.length > 0 && (
                      <div className="p-2 border-b border-slate-100 bg-pink-50/40">
                        <div className="text-[11px] font-bold text-pink-700 uppercase tracking-wider px-2 mb-1 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-pink-500" />
                            <span>Đề kiểm tra định kỳ (Exam Creator)</span>
                          </span>
                          <span className="text-[10px] bg-pink-200/60 text-pink-800 px-1.5 rounded-full font-bold">
                            {periodicExams.length} đề
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          {periodicExams.slice(0, 3).map((exam) => (
                            <button
                              key={exam.id}
                              onClick={() => {
                                openExamView(exam.id);
                                setIsGradeMenuOpen(false);
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                                currentView === 'exam' && activeExam?.id === exam.id
                                  ? 'bg-pink-600 text-white font-bold'
                                  : 'text-slate-700 hover:bg-pink-100/60'
                              }`}
                            >
                              <div className="truncate">
                                <span className="font-bold mr-1">[{exam.durationMinutes}p]</span>
                                <span>{exam.title}</span>
                              </div>
                              <span className="text-[10px] shrink-0 text-slate-400 ml-1">
                                {exam.totalQuestions} câu
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Chọn Lớp &amp; Unit ôn tập
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {grades.map((grade) => (
                        <div key={grade.id} className="p-2">
                          <div className="text-xs font-bold text-slate-900 mb-1 px-2 flex items-center justify-between">
                            <span>{grade.name}</span>
                            <span className="text-[10px] font-normal text-slate-400">{grade.units.length} Units</span>
                          </div>
                          <div className="space-y-0.5">
                            {grade.units.map((unit) => {
                              const isSelected =
                                currentView !== 'exam' &&
                                String(grade.id) === String(activeGradeId) &&
                                unit.id === activeUnitId;
                              return (
                                <button
                                  key={unit.id}
                                  onClick={() => {
                                    setActiveGradeAndUnit(grade.id, unit.id);
                                    if (currentView === 'exam') setCurrentView('student');
                                    setIsGradeMenuOpen(false);
                                  }}
                                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                                    isSelected
                                      ? 'bg-pink-500 text-white font-medium shadow-xs'
                                      : 'text-slate-600 hover:bg-pink-50/70 hover:text-slate-900'
                                  }`}
                                >
                                  <div className="truncate">
                                    <span className={isSelected ? 'text-white' : 'font-semibold text-pink-700 mr-1'}>
                                      {unit.code}:
                                    </span>
                                    <span>{unit.title}</span>
                                  </div>
                                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1 text-white" />}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Zone 2: Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
              <a
                href="#exercises-section"
                className="hover:text-pink-600 transition-colors whitespace-nowrap"
              >
                23 Bài tập bổ trợ
              </a>
              <a
                href="#score-dashboard"
                className="hover:text-pink-600 transition-colors whitespace-nowrap"
              >
                Bảng điểm trực quan
              </a>
              <a
                href="#submission-guide"
                className="hover:text-pink-600 transition-colors whitespace-nowrap"
              >
                Quy định nộp bài
              </a>
            </nav>

            {/* Zone 3: Actions (Share + Role Switch) */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Download source code button */}
              <a
                href="/api/download-source-zip"
                download="AVS_Exam_English_SourceCode.zip"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-pink-50 hover:bg-pink-100/80 border border-pink-200 text-decoration-none rounded-lg shadow-2xs transition-colors"
                title="Tải toàn bộ file zip mã nguồn của dự án"
              >
                <Download className="w-3.5 h-3.5 text-pink-600" />
                <span className="hidden md:inline">Tải mã nguồn (.zip)</span>
              </a>

              {/* Share link button */}
              <button
                type="button"
                onClick={() => setIsShareModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors"
                title="Chia sẻ đường link bài test"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Chia sẻ link</span>
              </button>

              {/* View Switcher: Student Mode vs Teacher Admin */}
              <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setCurrentView('student')}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    currentView === 'student'
                      ? 'bg-white text-pink-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Học sinh</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentView('admin')}
                  className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    currentView === 'admin'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Giáo viên</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        grade={activeGrade}
        unit={activeUnit}
      />
    </>
  );
};
