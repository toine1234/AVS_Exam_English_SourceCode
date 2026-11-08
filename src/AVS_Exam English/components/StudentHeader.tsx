import React from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, BookOpen, Clock, Award, CheckCircle2 } from 'lucide-react';

export const StudentHeader: React.FC = () => {
  const { activeGrade, activeUnit, currentUnitSubmissions } = useApp();

  const totalExercises = activeUnit?.exercises.length || 23;
  const completedCount = Object.keys(currentUnitSubmissions).length;
  const progressPercent = Math.round((completedCount / totalExercises) * 100);

  const skillsList = [
    { name: 'Phonics', desc: 'Ngữ âm' },
    { name: 'Stress', desc: 'Trọng âm' },
    { name: 'Vocabulary', desc: 'Từ vựng' },
    { name: 'Grammar', desc: 'Ngữ pháp' },
    { name: 'Communication', desc: 'Giao tiếp' },
    { name: 'Listening', desc: 'Nghe hiểu' },
    { name: 'Reading', desc: 'Đọc hiểu' },
    { name: 'Speaking', desc: 'Nói' },
    { name: 'Writing', desc: 'Viết' }
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-pink-100 via-rose-50 to-pink-50 border border-pink-200/90 p-6 sm:p-10 shadow-xs mb-8">
      {/* Subtle decorative background blur spots */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-pink-200/40 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-rose-200/40 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl">
        {/* Kicker */}
        <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-pink-700 mb-2">
          <span className="w-2 h-2 rounded-full bg-pink-500"></span>
          <span>CHƯƠNG TRÌNH CHUẨN CỦA BỘ GIÁO DỤC VÀ ĐÀO TẠO</span>
          <span aria-hidden="true">·</span>
          <span>HỌC KỲ 1</span>
        </div>

        {/* Large Title requested: 'TIẾNG ANH 6 · GLOBAL SUCCESS · BÀI TẬP BỔ TRỢ' */}
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2 font-display">
          TIẾNG ANH {activeGrade?.id || 6} · GLOBAL SUCCESS · BÀI TẬP BỔ TRỢ
        </h1>

        {/* Unit Name and subtitle */}
        <div className="flex flex-wrap items-baseline gap-3 mb-4">
          <span className="text-xl sm:text-2xl font-bold text-pink-700">
            {activeUnit?.code}: {activeUnit?.title}
          </span>
          {activeUnit?.subtitle && (
            <span className="text-sm sm:text-base text-slate-600 font-medium">
              ({activeUnit.subtitle})
            </span>
          )}
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mb-6 max-w-2xl">
          {activeUnit?.bannerSubtitle ||
            'Hệ thống 23 bài tập trọn gói từ A1 đến H3 được thiết kế chuẩn sư phạm, hỗ trợ tự động chấm điểm, hiển thị lời giải chi tiết và nộp báo cáo trực tiếp đến cô giáo.'}
        </p>

        {/* Skill Tags */}
        <div className="mb-6">
          <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
            CÁC PHẦN KỸ NĂNG TRỌNG TÂM:
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {skillsList.map((skill) => (
              <div
                key={skill.name}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 border border-pink-200/80 rounded-xl text-xs font-semibold text-slate-800 shadow-2xs hover:border-pink-300 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                <span>{skill.name}</span>
                <span className="text-[10px] text-pink-600 font-normal">({skill.desc})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress summary banner */}
        <div className="inline-flex flex-wrap items-center gap-4 p-3 bg-white/80 backdrop-blur-xs rounded-2xl border border-pink-200/70 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Tiến độ làm bài:</span>
            <strong className="text-slate-900 font-bold">
              {completedCount}/{totalExercises} bài ({progressPercent}%)
            </strong>
          </div>
          <div className="w-32 bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-pink-500 to-rose-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-pink-700 font-semibold text-[11px]">
            {completedCount === totalExercises
              ? '🎉 Xuất sắc! Em đã hoàn thành toàn bộ bài tập.'
              : `Còn ${totalExercises - completedCount} bài chưa nộp`}
          </div>
        </div>
      </div>
    </div>
  );
};
