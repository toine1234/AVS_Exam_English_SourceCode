import React from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, CheckCircle, Clock, ArrowDownCircle, Send, Sparkles } from 'lucide-react';

interface ScoreDashboardGridProps {
  onOpenSummaryModal: () => void;
}

export const ScoreDashboardGrid: React.FC<ScoreDashboardGridProps> = ({ onOpenSummaryModal }) => {
  const { activeUnit, currentUnitSubmissions, setActiveFilterSection } = useApp();

  // All 23 exercises in canonical sequence as required:
  // A1, A2, B1, C1-C4, D1-D4, E1, L1-L3, F1-F3, G1-G2, H1-H3
  const canonicalExerciseList = [
    { id: 'A1', section: 'A', name: 'Phonics 1' },
    { id: 'A2', section: 'A', name: 'Phonics 2' },
    { id: 'B1', section: 'B', name: 'Stress 1' },
    { id: 'C1', section: 'C', name: 'Vocab 1' },
    { id: 'C2', section: 'C', name: 'Vocab 2' },
    { id: 'C3', section: 'C', name: 'Vocab 3' },
    { id: 'C4', section: 'C', name: 'Vocab 4' },
    { id: 'D1', section: 'D', name: 'Grammar 1' },
    { id: 'D2', section: 'D', name: 'Grammar 2' },
    { id: 'D3', section: 'D', name: 'Grammar 3' },
    { id: 'D4', section: 'D', name: 'Grammar 4' },
    { id: 'E1', section: 'E', name: 'Comm 1' },
    { id: 'L1', section: 'L', name: 'Listen 1' },
    { id: 'L2', section: 'L', name: 'Listen 2' },
    { id: 'L3', section: 'L', name: 'Listen 3' },
    { id: 'F1', section: 'F', name: 'Read 1' },
    { id: 'F2', section: 'F', name: 'Read 2' },
    { id: 'F3', section: 'F', name: 'Read 3' },
    { id: 'G1', section: 'G', name: 'Speak 1' },
    { id: 'G2', section: 'G', name: 'Speak 2' },
    { id: 'H1', section: 'H', name: 'Write 1' },
    { id: 'H2', section: 'H', name: 'Write 2' },
    { id: 'H3', section: 'H', name: 'Write 3' }
  ];

  const totalSubmitted = Object.keys(currentUnitSubmissions).length;
  const totalAvailable = canonicalExerciseList.length;

  const totalPoints = Object.values(currentUnitSubmissions).reduce((sum, item) => sum + item.score, 0);
  const averageScore = totalSubmitted > 0 ? Math.round((totalPoints / totalSubmitted) * 10) / 10 : 0;

  const handleScrollToExercise = (exerciseId: string, sectionCode: string) => {
    setActiveFilterSection('ALL'); // ensure visible
    setTimeout(() => {
      const el = document.getElementById(`exercise-${exerciseId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-2', 'ring-pink-500');
        setTimeout(() => el.classList.remove('ring-2', 'ring-pink-500'), 2000);
      }
    }, 100);
  };

  return (
    <div id="score-dashboard" className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 mb-8">
      {/* Top Header of Score Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              Bảng điểm theo dõi 23 bài tập (A1 - H3)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Nhấp vào bất kỳ ô nào để cuộn nhanh đến bài tập đó
          </p>
        </div>

        {/* Quick Summary Pill & Final Submission Button */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <span className="text-slate-500">Điểm TB: </span>
            <span className="font-extrabold text-pink-700 text-sm">{averageScore}</span>
            <span className="text-slate-400">/10</span>
          </div>

          <button
            type="button"
            onClick={onOpenSummaryModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 rounded-xl shadow-xs transition-all hover:shadow-md cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nộp toàn bộ &amp; Xem tổng kết</span>
          </button>
        </div>
      </div>

      {/* Grid of 23 exercises: A1, A2, B1, C1-C4, D1-D4, E1, L1-L3, F1-F3, G1-G2, H1-H3 */}
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2.5 pt-4">
        {canonicalExerciseList.map((item) => {
          const submission = currentUnitSubmissions[item.id];
          const isSubmitted = !!submission;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleScrollToExercise(item.id, item.section)}
              className={`p-2.5 rounded-xl border text-left transition-all duration-200 group flex flex-col justify-between h-[86px] cursor-pointer ${
                isSubmitted
                  ? 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-300 hover:shadow-2xs'
                  : 'bg-slate-50/80 border-slate-200/90 hover:bg-pink-50/50 hover:border-pink-300'
              }`}
            >
              {/* Exercise Code & Skill Name */}
              <div className="flex items-center justify-between w-full">
                <span className={`text-xs font-extrabold tracking-wide ${isSubmitted ? 'text-emerald-900' : 'text-slate-900'}`}>
                  {item.id}
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  {item.name}
                </span>
              </div>

              {/* Status Badge: 'Chưa làm' or 'Đã nộp' with score */}
              <div className="w-full">
                {isSubmitted ? (
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700">
                      <CheckCircle className="w-3 h-3 text-emerald-600 shrink-0" />
                      Đã nộp
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-white px-1.5 py-0.5 rounded-md border border-emerald-200 shadow-2xs">
                      {submission.score}đ
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-400">
                      <Clock className="w-3 h-3 text-slate-300 shrink-0" />
                      Chưa làm
                    </span>
                    <span className="text-[10px] text-pink-600 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                      Làm ngay &rarr;
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom hint */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-100 border border-emerald-300 inline-block"></span>
            Đã nộp bài (có điểm)
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-100 border border-slate-300 inline-block"></span>
            Chưa làm
          </span>
        </div>
        <span>Mẹo: Điểm số của từng bài được lưu tự động trên trình duyệt ngay khi em nộp.</span>
      </div>
    </div>
  );
};
