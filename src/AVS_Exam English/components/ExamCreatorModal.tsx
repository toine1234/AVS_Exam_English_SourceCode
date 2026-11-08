import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QuestionBankItem, SkillCategory, PeriodicExam } from '../types';
import {
  X,
  Sparkles,
  Clock,
  BookOpen,
  Sliders,
  CheckCircle2,
  Copy,
  ExternalLink,
  RotateCcw,
  Layers,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface ExamCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExamCreated?: (exam: PeriodicExam) => void;
}

export const ExamCreatorModal: React.FC<ExamCreatorModalProps> = ({
  isOpen,
  onClose,
  onExamCreated
}) => {
  const {
    grades,
    questionBank,
    createPeriodicExam,
    generateRandomExamFromBank,
    openExamView
  } = useApp();

  // Step state
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form state
  const [title, setTitle] = useState('Bài kiểm tra 1 tiết - Global Success 6');
  const [selectedGradeId, setSelectedGradeId] = useState<number | string>(6);
  const [selectedBookSeries, setSelectedBookSeries] = useState('Global Success 6');
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [description, setDescription] = useState(
    'Đề kiểm tra định kỳ 45 phút kiểm tra năng lực ngữ âm, từ vựng, ngữ pháp, kỹ năng đọc và nghe.'
  );

  // Skill matrix configuration
  const [skillMatrix, setSkillMatrix] = useState<Record<SkillCategory, number>>({
    Phonics: 2,
    Stress: 1,
    Vocabulary: 4,
    Grammar: 5,
    Communication: 1,
    Listening: 2,
    Reading: 3,
    Writing: 2
  });

  // Generated preview
  const [previewExam, setPreviewExam] = useState<PeriodicExam | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  // Selected grade object
  const currentGrade = grades.find((g) => String(g.id) === String(selectedGradeId)) || grades[0];

  // Calculate available questions in bank for each skill
  const getAvailableCount = (skill: SkillCategory): number => {
    return questionBank.filter((q) => {
      const matchSkill = q.skill.toLowerCase() === skill.toLowerCase();
      const matchGrade =
        q.gradeLevel.toLowerCase().includes(currentGrade?.name.toLowerCase()) ||
        q.bookSeries.toLowerCase().includes(selectedBookSeries.toLowerCase());
      return matchSkill && matchGrade;
    }).length;
  };

  const totalQuestionsConfigured = Object.values(skillMatrix).reduce((sum, n) => sum + (n || 0), 0);

  // Preset matrices
  const applyPreset = (presetType: '15m' | '45m' | 'pet' | 'ielts') => {
    if (presetType === '15m') {
      setTitle('Đề kiểm tra 15 phút - Vocabulary & Grammar');
      setDurationMinutes(15);
      setSkillMatrix({
        Phonics: 1,
        Stress: 1,
        Vocabulary: 4,
        Grammar: 4,
        Communication: 0,
        Listening: 0,
        Reading: 0,
        Writing: 0
      });
    } else if (presetType === '45m') {
      setTitle(`Bài kiểm tra 1 tiết 45 phút - ${currentGrade.name}`);
      setDurationMinutes(45);
      setSkillMatrix({
        Phonics: 2,
        Stress: 1,
        Vocabulary: 4,
        Grammar: 5,
        Communication: 1,
        Listening: 2,
        Reading: 3,
        Writing: 2
      });
    } else if (presetType === 'pet') {
      setTitle('Đề thi thử Cambridge PET (B1) - Reading & Grammar Test');
      setSelectedGradeId('pet');
      setSelectedBookSeries('Cambridge PET Objective');
      setDurationMinutes(45);
      setSkillMatrix({
        Phonics: 0,
        Stress: 0,
        Vocabulary: 2,
        Grammar: 3,
        Communication: 0,
        Listening: 2,
        Reading: 3,
        Writing: 2
      });
    } else if (presetType === 'ielts') {
      setTitle('IELTS Foundation - Academic Reading & Grammar Mock Test');
      setSelectedGradeId('ielts');
      setSelectedBookSeries('IELTS Preparation');
      setDurationMinutes(60);
      setSkillMatrix({
        Phonics: 0,
        Stress: 0,
        Vocabulary: 3,
        Grammar: 3,
        Communication: 0,
        Listening: 0,
        Reading: 4,
        Writing: 2
      });
    }
  };

  const handleGeneratePreview = () => {
    if (totalQuestionsConfigured === 0) return;

    const exam = generateRandomExamFromBank({
      title: title.trim(),
      gradeLevel: currentGrade?.name || 'Lớp 6',
      gradeId: selectedGradeId,
      bookSeries: selectedBookSeries,
      durationMinutes,
      skillMatrix,
      description
    });

    setPreviewExam(exam);
    setStep(2);
  };

  const handleConfirmCreate = () => {
    if (!previewExam) return;
    if (onExamCreated) onExamCreated(previewExam);
    setStep(3);
  };

  const examDirectUrl = previewExam
    ? `${window.location.origin}${window.location.pathname}#/exam/${previewExam.id}`
    : '';

  const handleCopyLink = () => {
    if (!examDirectUrl) return;
    navigator.clipboard.writeText(examDirectUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Export created exam to Excel
  const handleExportExcel = () => {
    if (!previewExam || previewExam.questions.length === 0) return;

    const dataRows = previewExam.questions.map((q, idx) => ({
      STT: idx + 1,
      Ma_Phan_Tap: q.maPhanTap,
      Ky_Nang: q.skill,
      Noi_Dung_Cau_Hoi: q.questionText,
      Dap_An_A: q.options[0] || '',
      Dap_An_B: q.options[1] || '',
      Dap_An_C: q.options[2] || '',
      Dap_An_D: q.options[3] || '',
      Dap_An_Dung: q.correctAnswer,
      Giai_Thich: q.explanation,
      Media_Type: q.mediaType,
      Media_File: q.mediaFile || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ExamQuestions');
    XLSX.writeFile(workbook, `${previewExam.code}_${previewExam.title.slice(0, 20)}.xlsx`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-pink-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-400/40 text-pink-300 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                  Trình Tạo Đề Thi Định Kỳ (Exam Creator)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/30 text-pink-200 border border-pink-400/30">
                  Rút trích tự động
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Cấu hình ma trận câu hỏi từ Ngân hàng học liệu &amp; tự động tạo link làm bài có đếm giờ
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper indicator */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-xs font-semibold text-slate-600 shrink-0">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-pink-700 font-bold' : ''}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-pink-600 text-white' : 'bg-slate-200'}`}>
              1
            </span>
            <span>1. Cấu hình thông tin &amp; Ma trận</span>
          </div>

          <ChevronRight className="w-4 h-4 text-slate-300" />

          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-pink-700 font-bold' : ''}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-pink-600 text-white' : 'bg-slate-200'}`}>
              2
            </span>
            <span>2. Xem trước &amp; Duyệt câu hỏi</span>
          </div>

          <ChevronRight className="w-4 h-4 text-slate-300" />

          <div className={`flex items-center gap-2 ${step >= 3 ? 'text-pink-700 font-bold' : ''}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200'}`}>
              3
            </span>
            <span>3. Xuất link bài test</span>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* STEP 1: CONFIGURATION */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Quick Presets */}
              <div className="p-4 bg-gradient-to-r from-pink-50/80 to-rose-50/50 rounded-2xl border border-pink-100">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-pink-900 uppercase tracking-wide flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-pink-600" />
                    <span>Mẫu ma trận đề thi đề xuất (1-Click Preset)</span>
                  </span>
                  <span className="text-[11px] text-pink-600 font-medium">Bấm để điền nhanh</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => applyPreset('15m')}
                    className="p-2.5 text-left bg-white hover:bg-pink-100/50 rounded-xl border border-pink-200 transition-all cursor-pointer"
                  >
                    <div className="text-xs font-bold text-slate-800">Kiểm tra 15 phút</div>
                    <div className="text-[11px] text-slate-500">10 câu · Từ vựng &amp; Ngữ pháp</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('45m')}
                    className="p-2.5 text-left bg-white hover:bg-pink-100/50 rounded-xl border border-pink-200 transition-all cursor-pointer ring-1 ring-pink-400"
                  >
                    <div className="text-xs font-bold text-slate-800">Kiểm tra 1 tiết (45p)</div>
                    <div className="text-[11px] text-slate-500">20 câu · Toàn diện 8 kỹ năng</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('pet')}
                    className="p-2.5 text-left bg-white hover:bg-pink-100/50 rounded-xl border border-pink-200 transition-all cursor-pointer"
                  >
                    <div className="text-xs font-bold text-slate-800">Đề thi thử PET (B1)</div>
                    <div className="text-[11px] text-slate-500">12 câu · Reading &amp; Grammar</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset('ielts')}
                    className="p-2.5 text-left bg-white hover:bg-pink-100/50 rounded-xl border border-pink-200 transition-all cursor-pointer"
                  >
                    <div className="text-xs font-bold text-slate-800">IELTS Foundation</div>
                    <div className="text-[11px] text-slate-500">12 câu · Academic Reading</div>
                  </button>
                </div>
              </div>

              {/* General Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tên bài kiểm tra / Đề thi *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-pink-500 focus:outline-hidden"
                    placeholder="VD: Bài kiểm tra 1 tiết Số 1 - Global Success 6"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Khối lớp / Cấp độ áp dụng:
                  </label>
                  <select
                    value={selectedGradeId}
                    onChange={(e) => {
                      const val = e.target.value;
                      const parsed = parseInt(val, 10);
                      const finalVal = isNaN(parsed) ? val : parsed;
                      setSelectedGradeId(finalVal);
                      const matched = grades.find((g) => String(g.id) === String(finalVal));
                      if (matched) {
                        if (String(finalVal) === 'pet') setSelectedBookSeries('Cambridge PET Objective');
                        else if (String(finalVal) === 'ielts') setSelectedBookSeries('IELTS Preparation');
                        else setSelectedBookSeries(`Global Success ${finalVal}`);
                      }
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800"
                  >
                    {grades.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nguồn sách / Ngân hàng học liệu:
                  </label>
                  <select
                    value={selectedBookSeries}
                    onChange={(e) => setSelectedBookSeries(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                  >
                    <option value="Global Success 6">Global Success 6 (Bộ GD&amp;ĐT)</option>
                    <option value="Global Success 7">Global Success 7 (Bộ GD&amp;ĐT)</option>
                    <option value="Cambridge PET Objective">Cambridge PET Objective (B1)</option>
                    <option value="IELTS Preparation">IELTS Cambridge Foundation</option>
                    <option value="ALL">Tất cả tài nguyên trong Ngân hàng</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Thời lượng làm bài (Timer đếm ngược):
                  </label>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <select
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-pink-700"
                    >
                      <option value={15}>15 phút (Kiểm tra nhanh)</option>
                      <option value={20}>20 phút</option>
                      <option value={30}>30 phút</option>
                      <option value={45}>45 phút (Kiểm tra 1 tiết chuẩn)</option>
                      <option value={60}>60 phút (Thi học kỳ)</option>
                      <option value={90}>90 phút (Thi thử chuyên sâu)</option>
                      <option value={0}>Không giới hạn thời gian</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tổng số câu hỏi dự kiến:
                  </label>
                  <div className="p-2.5 bg-pink-50/60 border border-pink-200 rounded-xl text-xs font-black text-pink-700 flex items-center justify-between">
                    <span>{totalQuestionsConfigured} câu hỏi</span>
                    <span className="text-[11px] font-normal text-slate-500">Thang điểm 10</span>
                  </div>
                </div>
              </div>

              {/* Question Distribution Matrix */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      Ma trận rút trích câu hỏi theo kỹ năng (Skill Matrix)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Chọn số lượng câu hỏi mong muốn cho từng kỹ năng. Hệ thống sẽ tự động bốc ngẫu nhiên từ Ngân hàng câu hỏi.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setSkillMatrix({
                        Phonics: 0,
                        Stress: 0,
                        Vocabulary: 0,
                        Grammar: 0,
                        Communication: 0,
                        Listening: 0,
                        Reading: 0,
                        Writing: 0
                      })
                    }
                    className="text-[11px] text-slate-400 hover:text-slate-600 underline"
                  >
                    Đặt lại 0
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {(
                    [
                      { key: 'Phonics', label: 'Ngữ âm (Phonics - A1/A2)', icon: '🗣️' },
                      { key: 'Stress', label: 'Trọng âm (Stress - B1)', icon: '⚡' },
                      { key: 'Vocabulary', label: 'Từ vựng (Vocabulary - C1)', icon: '📚' },
                      { key: 'Grammar', label: 'Ngữ pháp (Grammar - D1)', icon: '✏️' },
                      { key: 'Communication', label: 'Giao tiếp (Communication - E1)', icon: '💬' },
                      { key: 'Listening', label: 'Kỹ năng Nghe (Listening - L1)', icon: '🎧' },
                      { key: 'Reading', label: 'Đọc hiểu (Reading - F1)', icon: '📖' },
                      { key: 'Writing', label: 'Viết lại câu (Writing - H1)', icon: '✍️' }
                    ] as { key: SkillCategory; label: string; icon: string }[]
                  ).map((item) => {
                    const available = getAvailableCount(item.key);
                    const selected = skillMatrix[item.key] || 0;
                    return (
                      <div
                        key={item.key}
                        className={`p-3 rounded-2xl border transition-all ${
                          selected > 0 ? 'bg-pink-50/50 border-pink-300' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <span>{item.icon}</span>
                            <span>{item.key}</span>
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Kho: <strong className="text-slate-600">{available}</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setSkillMatrix((prev) => ({
                                ...prev,
                                [item.key]: Math.max(0, (prev[item.key] || 0) - 1)
                              }))
                            }
                            className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-sm cursor-pointer"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min={0}
                            max={available || 50}
                            value={selected}
                            onChange={(e) => {
                              const val = Math.max(0, parseInt(e.target.value, 10) || 0);
                              setSkillMatrix((prev) => ({ ...prev, [item.key]: val }));
                            }}
                            className="w-full text-center p-1 font-bold text-sm bg-white border border-slate-200 rounded-lg text-slate-900"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setSkillMatrix((prev) => ({
                                ...prev,
                                [item.key]: (prev[item.key] || 0) + 1
                              }))
                            }
                            className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center font-bold text-sm cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PREVIEW QUESTIONS */}
          {step === 2 && previewExam && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-pink-400 font-semibold mb-1">
                    <GraduationCap className="w-4 h-4" />
                    <span>{previewExam.gradeLevel} · {previewExam.bookSeries}</span>
                  </div>
                  <h4 className="font-extrabold text-base text-white">{previewExam.title}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                    <span>Mã đề: <strong>{previewExam.code}</strong></span>
                    <span>·</span>
                    <span>Thời gian: <strong>{previewExam.durationMinutes} phút</strong></span>
                    <span>·</span>
                    <span>Số câu: <strong>{previewExam.questions.length} câu</strong></span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleGeneratePreview}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
                  title="Xáo trộn lại và bốc các câu hỏi khác từ ngân hàng"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Bốc ngẫu nhiên lại</span>
                </button>
              </div>

              {/* Questions List */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                  Danh sách {previewExam.questions.length} câu hỏi được rút trích:
                </div>
                {previewExam.questions.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-pink-100 text-pink-700 font-bold flex items-center justify-center text-xs">
                          {idx + 1}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px]">
                          {q.skill} ({q.maPhanTap})
                        </span>
                        {q.mediaType === 'audio' && (
                          <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold">
                            🎧 Audio
                          </span>
                        )}
                        {q.mediaType === 'image' && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 text-[10px] font-bold">
                            🖼️ Hình ảnh
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400">{q.bookSeries}</span>
                    </div>

                    <div className="font-semibold text-slate-900 leading-relaxed pl-8">
                      {q.questionText}
                    </div>

                    {q.passage && (
                      <div className="ml-8 p-2.5 bg-slate-50 border-l-2 border-pink-400 rounded-r-lg text-[11px] text-slate-600 italic">
                        {q.passage.slice(0, 160)}...
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-8 text-[11px]">
                      {q.options.map((opt, oIdx) => {
                        const optLetter = String.fromCharCode(65 + oIdx);
                        const isCorrect = q.correctAnswer === optLetter || q.correctAnswer === opt;
                        return (
                          <div
                            key={oIdx}
                            className={`p-1.5 px-2.5 rounded-lg border flex items-center justify-between ${
                              isCorrect
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                                : 'bg-slate-50/60 border-slate-200/80 text-slate-600'
                            }`}
                          >
                            <span>{opt}</span>
                            {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS & SHARING */}
          {step === 3 && previewExam && (
            <div className="py-6 text-center space-y-6 animate-in fade-in">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md shadow-emerald-100">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="text-xl font-extrabold text-slate-900">
                  Tạo Đề Thi Định Kỳ Thành Công!
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Đề thi <strong>{previewExam.title}</strong> gồm <strong>{previewExam.questions.length} câu</strong> đã sẵn sàng cho học sinh làm bài với đồng hồ đếm ngược <strong>{previewExam.durationMinutes} phút</strong>.
                </p>
              </div>

              {/* Direct Test Link Card */}
              <div className="max-w-lg mx-auto p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-3">
                <span className="text-xs font-bold text-slate-700 block">
                  Đường dẫn (URL) làm bài của học sinh:
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={examDirectUrl}
                    className="flex-1 p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-700 select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
                  >
                    {copiedLink ? <CheckCircle2 className="w-4 h-4 text-emerald-200" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Đã sao chép!' : 'Sao chép link'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  💡 Thầy cô có thể gửi link này qua Zalo, Messenger hoặc Google Classroom cho học sinh.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    openExamView(previewExam.id);
                    onClose();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold rounded-xl text-xs shadow-md shadow-pink-200 transition-all cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Vào làm bài thử với tư cách Học sinh</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportExcel}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Tải đề thi Excel (.xlsx)</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-semibold"
                >
                  Đóng cửa sổ
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between shrink-0">
          {step === 1 && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Hủy bỏ
              </button>

              <button
                type="button"
                disabled={totalQuestionsConfigured === 0}
                onClick={handleGeneratePreview}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <span>Tiếp tục: Rút trích {totalQuestionsConfigured} câu hỏi</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Quay lại cấu hình
              </button>

              <button
                type="button"
                onClick={handleConfirmCreate}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Hoàn tất &amp; Lưu đề thi vào hệ thống</span>
              </button>
            </>
          )}

          {step === 3 && (
            <div className="w-full flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Xong
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
