import React from 'react';
import { useApp } from '../context/AppContext';
import { SectionCode } from '../types';
import { Layers, CheckCircle, BarChart3 } from 'lucide-react';

interface SectionTab {
  code: string;
  label: string;
  fullName: string;
  count: number;
}

export const ExerciseNavigation: React.FC = () => {
  const {
    activeUnit,
    activeFilterSection,
    setActiveFilterSection,
    currentUnitSubmissions
  } = useApp();

  const totalExercises = activeUnit?.exercises.length || 23;
  const submittedCount = Object.keys(currentUnitSubmissions).length;

  const sections: SectionTab[] = [
    { code: 'ALL', label: 'Tất cả (23)', fullName: 'Tất cả bài tập', count: 23 },
    { code: 'A', label: 'A. Phonics (2)', fullName: 'A. Ngữ âm (A1, A2)', count: 2 },
    { code: 'B', label: 'B. Stress (1)', fullName: 'B. Trọng âm (B1)', count: 1 },
    { code: 'C', label: 'C. Vocabulary (4)', fullName: 'C. Từ vựng (C1-C4)', count: 4 },
    { code: 'D', label: 'D. Grammar (4)', fullName: 'D. Ngữ pháp (D1-D4)', count: 4 },
    { code: 'E', label: 'E. Communication (1)', fullName: 'E. Giao tiếp (E1)', count: 1 },
    { code: 'L', label: 'L. Listening (3)', fullName: 'L. Nghe hiểu (L1-L3)', count: 3 },
    { code: 'F', label: 'F. Reading (3)', fullName: 'F. Đọc hiểu (F1-F3)', count: 3 },
    { code: 'G', label: 'G. Speaking (2)', fullName: 'G. Nói (G1, G2)', count: 2 },
    { code: 'H', label: 'H. Writing (3)', fullName: 'H. Viết (H1-H3)', count: 3 }
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100">
        
        {/* Title & Counter */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              Điều hướng bài tập theo kỹ năng
            </h3>
            <p className="text-xs text-slate-500">
              Chọn phần bài tập để xem và làm bài nhanh
            </p>
          </div>
        </div>

        {/* Real-time Submission counter requested: 'Đã nộp 0/23 bài' */}
        <div className="flex items-center gap-3 px-3.5 py-1.5 bg-pink-50/70 border border-pink-200/80 rounded-xl shrink-0 self-start md:self-auto">
          <CheckCircle className={`w-4 h-4 ${submittedCount > 0 ? 'text-pink-600' : 'text-slate-400'}`} />
          <div className="text-xs">
            <span className="text-slate-600 font-medium">Trạng thái: </span>
            <span className="font-bold text-pink-700">
              Đã nộp {submittedCount}/{totalExercises} bài
            </span>
            <span className="text-slate-400 font-normal ml-1">
              ({Math.round((submittedCount / totalExercises) * 100)}%)
            </span>
          </div>
        </div>

      </div>

      {/* Button Row A through H */}
      <div className="pt-3 overflow-x-auto pb-1 scrollbar-thin">
        <div className="flex items-center gap-1.5 min-w-max">
          {sections.map((sec) => {
            const isActive = activeFilterSection === sec.code;
            return (
              <button
                key={sec.code}
                type="button"
                onClick={() => setActiveFilterSection(sec.code)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-pink-600 text-white shadow-xs ring-1 ring-pink-700/20'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-pink-50/50 border border-slate-200/80'
                }`}
              >
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
