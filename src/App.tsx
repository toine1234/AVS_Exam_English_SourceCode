/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './AVS_Exam English/context/AppContext';
import { Navbar } from './AVS_Exam English/components/Navbar';
import { StudentPracticeView } from './AVS_Exam English/components/StudentPracticeView';
import { StudentExamView } from './AVS_Exam English/components/StudentExamView';
import { AdminDashboard } from './AVS_Exam English/components/AdminDashboard';
import { BookOpen, Heart } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentView, activeGrade, activeUnit } = useApp();

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col font-sans text-slate-800">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentView === 'exam' ? (
          <StudentExamView />
        ) : currentView === 'student' ? (
          <StudentPracticeView />
        ) : (
          <AdminDashboard />
        )}
      </main>

      {/* Clean Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-8 px-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-pink-500 text-white flex items-center justify-center font-bold text-xs">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800">
              AVS Exam English · Global Success Practice Platform
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <span>Chương trình Tiếng Anh THCS</span>
            <span aria-hidden="true">·</span>
            <span>23 Dạng bài tập bổ trợ A1 - H3</span>
            <span aria-hidden="true">·</span>
            <span>Phiên bản sư phạm 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
