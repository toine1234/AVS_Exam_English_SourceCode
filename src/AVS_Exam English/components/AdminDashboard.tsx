import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudentUnitRecord, Unit } from '../types';
import {
  Users,
  BookOpen,
  Upload,
  Download,
  Plus,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  Eye,
  Mail,
  RotateCcw,
  Sparkles,
  School,
  FileSpreadsheet,
  GraduationCap
} from 'lucide-react';
import { DataImporterModal } from './DataImporterModal';
import { StudentDetailModal } from './StudentDetailModal';
import { AiTextbookReaderModal } from './AiTextbookReaderModal';
import { ExamCreatorModal } from './ExamCreatorModal';
import { QuestionBankManager } from './QuestionBankManager';
import { PythonPdfExtractorModal } from './PythonPdfExtractorModal';
import { Clock, Database, Copy } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    grades,
    activeGradeId,
    activeUnitId,
    allStudentRecords,
    addGrade,
    addUnit,
    deleteUnit,
    deleteStudentRecord,
    setActiveGradeAndUnit,
    setCurrentView,
    resetToDefaultCurriculum,
    periodicExams,
    deletePeriodicExam,
    openExamView,
    questionBank
  } = useApp();

  const [activeTab, setActiveTab] = useState<'submissions' | 'bank' | 'exams' | 'units'>('submissions');
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [unitFilter, setUnitFilter] = useState('ALL');

  // Modals state
  const [isImporterOpen, setIsImporterOpen] = useState(false);
  const [isAiReaderOpen, setIsAiReaderOpen] = useState(false);
  const [isPythonExtractorOpen, setIsPythonExtractorOpen] = useState(false);
  const [isExamCreatorOpen, setIsExamCreatorOpen] = useState(false);
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<StudentUnitRecord | null>(
    null
  );
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [copiedExamId, setCopiedExamId] = useState<string | null>(null);

  // New Unit Form state
  const [newUnitGradeId, setNewUnitGradeId] = useState<number>(6);
  const [newUnitCode, setNewUnitCode] = useState('Unit 4');
  const [newUnitTitle, setNewUnitTitle] = useState('My Neighbourhood');
  const [newUnitSubtitle, setNewUnitSubtitle] = useState('Khu phố của em');
  const [newUnitDescription, setNewUnitDescription] = useState('Chương trình ôn tập bổ trợ Tiếng Anh 6');

  // Unique classes for filter
  const uniqueClasses = Array.from(new Set(allStudentRecords.map((r) => r.studentInfo.className))).filter(
    Boolean
  );

  // Filtered submissions
  const filteredRecords = allStudentRecords.filter((record) => {
    const matchSearch =
      record.studentInfo.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.studentInfo.className.toLowerCase().includes(searchTerm.toLowerCase());
    const matchClass = classFilter === 'ALL' || record.studentInfo.className === classFilter;
    const matchUnit = unitFilter === 'ALL' || record.unitId === unitFilter;
    return matchSearch && matchClass && matchUnit;
  });

  // Calculate statistics
  const totalSubmissions = allStudentRecords.length;
  const avgOverallScore =
    totalSubmissions > 0
      ? Math.round(
          (allStudentRecords.reduce((sum, r) => sum + r.averageScore, 0) / totalSubmissions) * 10
        ) / 10
      : 0;
  const perfectCompletions = allStudentRecords.filter((r) => r.totalSubmitted >= 23).length;

  // Export submissions to CSV
  const handleExportCSV = () => {
    if (filteredRecords.length === 0) return;

    let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
    csvContent += 'Họ và tên,Lớp,Gmail cô giáo,Unit / Đề test,Số bài nộp,Điểm trung bình,Ngày nộp\n';

    filteredRecords.forEach((r) => {
      const row = [
        `"${r.studentInfo.fullName}"`,
        `"${r.studentInfo.className}"`,
        `"${r.studentInfo.teacherEmail}"`,
        `"${r.unitTitle}"`,
        `"${r.totalSubmitted}/${r.totalAvailable}"`,
        `"${r.averageScore}"`,
        `"${r.updatedAt}"`
      ];
      csvContent += row.join(',') + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `danh_sach_diem_tieng_anh_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleCreateUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnitCode.trim() || !newUnitTitle.trim()) return;

    // Use default templates for initial exercises
    addUnit(newUnitGradeId, {
      gradeId: newUnitGradeId,
      code: newUnitCode.trim(),
      title: newUnitTitle.trim(),
      subtitle: newUnitSubtitle.trim(),
      semester: 'Học kỳ 1',
      bookSeries: 'Global Success',
      skills: ['Phonics', 'Vocabulary', 'Grammar', 'Reading', 'Writing'],
      bannerSubtitle: newUnitDescription.trim(),
      exercises: []
    });

    setIsAddUnitModalOpen(false);
    setActiveTab('units');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      
      {/* Admin Title Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-pink-400 mb-1.5">
              <GraduationCap className="w-4 h-4" />
              <span>CỔNG QUẢN TRỊ DÀNH CHO GIÁO VIÊN TIẾNG ANH</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-white">
              Bảng Điều Khiển Quản Lý Bài Học &amp; Điểm Số
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Dễ dàng theo dõi bài nộp của học sinh, xuất bảng điểm ra Excel, thêm sửa xóa bài test Unit và nạp tự động đề thi từ tệp dữ liệu.
            </p>
          </div>

          {/* Quick action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsExamCreatorOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 hover:from-pink-700 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer ring-2 ring-pink-400/50 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
              <span>✨ Tạo Đề Định Kỳ (Exam Creator)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPythonExtractorOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer ring-2 ring-emerald-400/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="text-sm">🐍</span>
              <span>PyMuPDF Trích Xuất Sách</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAiReaderOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all cursor-pointer backdrop-blur-xs"
            >
              <Sparkles className="w-4 h-4 text-pink-300" />
              <span>AI Đọc Sách</span>
            </button>

            <button
              type="button"
              onClick={() => setIsImporterOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Import Excel</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('student')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-xs transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Học sinh</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Lượt Học Sinh Nộp Bài
            </span>
            <Users className="w-4 h-4 text-pink-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{totalSubmissions}</div>
          <p className="text-[11px] text-slate-400 mt-1">Đã lưu trong hệ thống</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Điểm Trung Bình Chung
            </span>
            <Sparkles className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">
            {avgOverallScore} <span className="text-xs text-slate-400 font-normal">/ 10</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Đánh giá chung toàn bộ bài thi</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Hoàn Thành Trọn Bộ 23 Bài
            </span>
            <CheckCircle2 className="w-4 h-4 text-pink-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{perfectCompletions}</div>
          <p className="text-[11px] text-slate-400 mt-1">Học sinh hoàn thành 100%</p>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              Tổng Số Đề Thi &amp; Units
            </span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">
            {grades.reduce((acc, g) => acc + g.units.length, 0)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Phân bố trên 4 khối lớp</p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'submissions'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Danh sách bài làm &amp; Điểm số ({filteredRecords.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bank')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'bank'
              ? 'bg-pink-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Ngân hàng câu hỏi ({questionBank.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('exams')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'exams'
              ? 'bg-pink-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Đề kiểm tra định kỳ ({periodicExams.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('units')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'units'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Quản lý Lớp học &amp; Units</span>
        </button>
      </div>

      {/* ================= TAB 1: SUBMISSIONS LIST ================= */}
      {activeTab === 'submissions' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 space-y-5">
          {/* Controls: Search, Filters, Export */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm tên học sinh hoặc lớp..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-pink-500"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Class Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400">Lớp:</span>
                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-hidden"
                >
                  <option value="ALL">Tất cả lớp</option>
                  {uniqueClasses.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Export to CSV */}
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Xuất file Excel / CSV</span>
              </button>
            </div>
          </div>

          {/* Submissions Table */}
          <div className="overflow-x-auto">
            {filteredRecords.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                Không tìm thấy bài nộp nào phù hợp với điều kiện tìm kiếm.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-bold">
                    <th className="py-3 px-3">Học sinh</th>
                    <th className="py-3 px-3">Lớp</th>
                    <th className="py-3 px-3">Unit / Bài tập</th>
                    <th className="py-3 px-3 text-center">Tiến độ nộp</th>
                    <th className="py-3 px-3 text-center">Điểm TB</th>
                    <th className="py-3 px-3">Ngày nộp</th>
                    <th className="py-3 px-3 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-pink-50/30 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-900">
                        {r.studentInfo.fullName}
                      </td>
                      <td className="py-3 px-3 text-slate-700">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-semibold">
                          {r.studentInfo.className}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 font-medium">
                        {r.unitTitle}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-bold text-slate-800">
                          {r.totalSubmitted} / {r.totalAvailable}
                        </span>
                        <div className="w-16 bg-slate-100 rounded-full h-1.5 mx-auto mt-1 overflow-hidden">
                          <div
                            className="bg-pink-500 h-1.5 rounded-full"
                            style={{
                              width: `${(r.totalSubmitted / r.totalAvailable) * 100}%`
                            }}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-extrabold text-pink-700 bg-pink-50 px-2 py-0.5 rounded border border-pink-200">
                          {r.averageScore} / 10
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {r.updatedAt}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedStudentForDetail(r)}
                            className="p-1.5 text-pink-700 hover:bg-pink-50 rounded-lg transition-colors"
                            title="Xem chi tiết bài làm & chấm điểm"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteStudentRecord(r.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Xóa bài làm này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: QUESTION BANK ================= */}
      {activeTab === 'bank' && (
        <QuestionBankManager
          onOpenExamCreator={() => setIsExamCreatorOpen(true)}
          onOpenAiReader={() => setIsAiReaderOpen(true)}
          onOpenPythonExtractor={() => setIsPythonExtractorOpen(true)}
        />
      )}

      {/* ================= TAB 3: PERIODIC EXAMS ================= */}
      {activeTab === 'exams' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight flex items-center gap-2">
                <Clock className="w-5 h-5 text-pink-600" />
                <span>Danh Sách Đề Kiểm Tra Định Kỳ (Periodic Exams)</span>
              </h2>
              <p className="text-xs text-slate-500">
                Các bài test có tính giờ đếm ngược tự động được tạo từ Ngân hàng câu hỏi. Mỗi đề có đường link làm bài riêng để gửi học sinh.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsExamCreatorOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-pink-200 transition-all cursor-pointer ring-2 ring-pink-400/40 shrink-0"
            >
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>+ Tạo Đề Kiểm Tra Mới</span>
            </button>
          </div>

          {periodicExams.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200">
              <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800">Chưa có đề kiểm tra định kỳ nào</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Hãy bấm "Tạo Đề Kiểm Tra Mới" để cấu hình ma trận kỹ năng và tạo link làm bài có đếm giờ gửi cho học sinh.
              </p>
              <button
                type="button"
                onClick={() => setIsExamCreatorOpen(true)}
                className="mt-4 px-4 py-2 bg-pink-600 text-white text-xs font-bold rounded-xl"
              >
                Tạo đề ngay
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {periodicExams.map((exam) => {
                const directUrl = `${window.location.origin}${window.location.pathname}#/exam/${exam.id}`;
                const isCopied = copiedExamId === exam.id;

                return (
                  <div
                    key={exam.id}
                    className="p-5 bg-white rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-pink-50 text-pink-700 border border-pink-200">
                          {exam.gradeLevel}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {exam.code}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                        {exam.title}
                      </h3>

                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {exam.description}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-slate-600 pt-1">
                        <span className="flex items-center gap-1 font-bold text-slate-800">
                          <Clock className="w-3.5 h-3.5 text-pink-600" />
                          <span>{exam.durationMinutes > 0 ? `${exam.durationMinutes} phút` : 'Tự do'}</span>
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                          <span><strong>{exam.totalQuestions}</strong> câu hỏi</span>
                        </span>
                      </div>

                      {/* Skill tags */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {Object.entries(exam.skillMatrix || {}).map(([skill, count]) => {
                          if (!count) return null;
                          return (
                            <span
                              key={skill}
                              className="px-2 py-0.5 bg-slate-100 rounded-md text-[10px] font-medium text-slate-600"
                            >
                              {skill}: {count}
                            </span>
                          );
                        })}
                      </div>

                      {/* Submissions & Score */}
                      <div className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                        <span className="text-slate-500">
                          Đã nộp: <strong className="text-slate-800">{exam.totalSubmissionsCount || 0}</strong> bài
                        </span>
                        <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                          Điểm TB: {exam.averageScore || 0}/10
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={directUrl}
                          className="flex-1 p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-mono text-slate-600 select-all truncate"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(directUrl);
                            setCopiedExamId(exam.id);
                            setTimeout(() => setCopiedExamId(null), 2000);
                          }}
                          className="p-1.5 bg-pink-50 hover:bg-pink-100 text-pink-700 rounded-lg border border-pink-200 transition-colors shrink-0"
                          title="Sao chép link làm bài gửi học sinh"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {isCopied && (
                        <span className="text-[10px] font-bold text-emerald-600 block text-right">
                          ✓ Đã sao chép đường link!
                        </span>
                      )}

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => openExamView(exam.id)}
                          className="flex-1 py-1.5 px-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>Làm bài thử</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Bạn có chắc chắn muốn xóa đề thi "${exam.title}"?`)) {
                              deletePeriodicExam(exam.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Xóa đề thi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 4: GRADE & UNIT MANAGEMENT ================= */}
      {activeTab === 'units' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                Cấu Trúc Lớp Học &amp; Các Unit Đang Giảng Dạy
              </h2>
              <p className="text-xs text-slate-500">
                Thầy cô có thể thêm Unit mới hoặc nhấp để vào xem đề bài như một học sinh
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsAiReaderOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                <span>AI Đọc Sách Tạo Unit</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAddUnitModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Thêm Unit mới</span>
              </button>

              <button
                type="button"
                onClick={resetToDefaultCurriculum}
                className="inline-flex items-center gap-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                title="Khôi phục lại đề thi mẫu gốc chuẩn Bộ GD"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Khôi phục đề chuẩn</span>
              </button>
            </div>
          </div>

          {/* Grades Accordion / Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {grades.map((grade) => (
              <div
                key={grade.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden"
              >
                {/* Grade Card Header */}
                <div className="px-5 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-700 font-extrabold flex items-center justify-center text-sm">
                      {grade.id}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{grade.name}</h3>
                      <p className="text-[11px] text-slate-500 truncate max-w-xs">
                        {grade.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                    {grade.units.length} Units
                  </span>
                </div>

                {/* Units List */}
                <div className="p-4 divide-y divide-slate-100 space-y-3">
                  {grade.units.map((unit) => (
                    <div
                      key={unit.id}
                      className="pt-3 first:pt-0 flex items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-pink-700">{unit.code}:</span>
                          <span className="text-xs font-bold text-slate-900">{unit.title}</span>
                          {unit.subtitle && (
                            <span className="text-[11px] text-slate-400 hidden sm:inline">
                              ({unit.subtitle})
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {unit.exercises.length} bài tập · Bộ sách: {unit.bookSeries}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveGradeAndUnit(grade.id, unit.id);
                            setCurrentView('student');
                          }}
                          className="px-2.5 py-1 text-xs font-semibold text-pink-700 hover:bg-pink-50 rounded-lg border border-pink-200 transition-colors flex items-center gap-1"
                        >
                          <span>Làm bài</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteUnit(grade.id, unit.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          title="Xóa Unit này"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Add Unit Form */}
      {isAddUnitModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Thêm Unit / Đề Test Mới</h3>
              <button
                onClick={() => setIsAddUnitModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateUnit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Chọn Lớp học:</label>
                <select
                  value={newUnitGradeId}
                  onChange={(e) => setNewUnitGradeId(parseInt(e.target.value, 10))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                >
                  {grades.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mã bài (Ví dụ: Unit 4):</label>
                <input
                  type="text"
                  required
                  value={newUnitCode}
                  onChange={(e) => setNewUnitCode(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên bài học tiếng Anh:</label>
                <input
                  type="text"
                  required
                  value={newUnitTitle}
                  onChange={(e) => setNewUnitTitle(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tiêu đề phụ / Dịch nghĩa:</label>
                <input
                  type="text"
                  value={newUnitSubtitle}
                  onChange={(e) => setNewUnitSubtitle(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mô tả tóm tắt nội dung ôn tập:</label>
                <textarea
                  rows={2}
                  value={newUnitDescription}
                  onChange={(e) => setNewUnitDescription(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUnitModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Tạo Unit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Connected Modals */}
      <DataImporterModal
        isOpen={isImporterOpen}
        onClose={() => setIsImporterOpen(false)}
      />

      <AiTextbookReaderModal
        isOpen={isAiReaderOpen}
        onClose={() => setIsAiReaderOpen(false)}
      />

      <PythonPdfExtractorModal
        isOpen={isPythonExtractorOpen}
        onClose={() => setIsPythonExtractorOpen(false)}
        onImportSuccess={() => setActiveTab('bank')}
      />

      <ExamCreatorModal
        isOpen={isExamCreatorOpen}
        onClose={() => setIsExamCreatorOpen(false)}
        onExamCreated={() => setActiveTab('exams')}
      />

      <StudentDetailModal
        record={selectedStudentForDetail}
        onClose={() => setSelectedStudentForDetail(null)}
      />

    </div>
  );
};
