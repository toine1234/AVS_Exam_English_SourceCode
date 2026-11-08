import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QuestionBankItem, SkillCategory, SectionCode, MediaType } from '../types';
import {
  Database,
  Search,
  Filter,
  Plus,
  Trash2,
  FileSpreadsheet,
  Sparkles,
  BookOpen,
  Volume2,
  Image as ImageIcon,
  CheckCircle2,
  Sliders,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  Layers
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface QuestionBankManagerProps {
  onOpenExamCreator: () => void;
  onOpenAiReader: () => void;
  onOpenPythonExtractor?: () => void;
}

export const QuestionBankManager: React.FC<QuestionBankManagerProps> = ({
  onOpenExamCreator,
  onOpenAiReader,
  onOpenPythonExtractor
}) => {
  const { questionBank, addQuestionToBank, deleteQuestionFromBank, updateQuestionInBank } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGradeFilter, setSelectedGradeFilter] = useState('ALL');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('ALL');
  const [selectedBookFilter, setSelectedBookFilter] = useState('ALL');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  // Add question modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newBookSeries, setNewBookSeries] = useState('Global Success 6');
  const [newGradeLevel, setNewGradeLevel] = useState('Lớp 6');
  const [newSkill, setNewSkill] = useState<SkillCategory>('Grammar');
  const [newMaPhanTap, setNewMaPhanTap] = useState('D1');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newOptionA, setNewOptionA] = useState('');
  const [newOptionB, setNewOptionB] = useState('');
  const [newOptionC, setNewOptionC] = useState('');
  const [newOptionD, setNewOptionD] = useState('');
  const [newCorrectAnswer, setNewCorrectAnswer] = useState('A');
  const [newExplanation, setNewExplanation] = useState('');
  const [newMediaType, setNewMediaType] = useState<MediaType>('none');
  const [newMediaFile, setNewMediaFile] = useState('');
  const [newPassage, setNewPassage] = useState('');

  // Filtering
  const filteredQuestions = questionBank.filter((q) => {
    const matchSearch =
      q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.explanation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.maPhanTap.toLowerCase().includes(searchTerm.toLowerCase());

    const matchGrade =
      selectedGradeFilter === 'ALL' ||
      q.gradeLevel.toLowerCase().includes(selectedGradeFilter.toLowerCase());

    const matchSkill = selectedSkillFilter === 'ALL' || q.skill.toLowerCase() === selectedSkillFilter.toLowerCase();

    const matchBook = selectedBookFilter === 'ALL' || q.bookSeries.toLowerCase().includes(selectedBookFilter.toLowerCase());

    return matchSearch && matchGrade && matchSkill && matchBook;
  });

  // Calculate statistics
  const totalQuestions = questionBank.length;
  const totalAudio = questionBank.filter((q) => q.mediaType === 'audio').length;
  const totalImages = questionBank.filter((q) => q.mediaType === 'image').length;

  const skillCounts: Record<string, number> = {};
  questionBank.forEach((q) => {
    skillCounts[q.skill] = (skillCounts[q.skill] || 0) + 1;
  });

  // Export full question bank to Excel
  const handleExportBankExcel = () => {
    if (questionBank.length === 0) return;

    const dataRows = questionBank.map((q, idx) => ({
      STT: idx + 1,
      Ma_Phan_Tap: q.maPhanTap,
      Ky_Nang: q.skill,
      Bo_Sach: q.bookSeries,
      Khoi_Lop: q.gradeLevel,
      Noi_Dung_Cau_Hoi: q.questionText,
      Dap_An_A: q.options[0] || '',
      Dap_An_B: q.options[1] || '',
      Dap_An_C: q.options[2] || '',
      Dap_An_D: q.options[3] || '',
      Dap_An_Dung: q.correctAnswer,
      Giai_Thich: q.explanation,
      Media_Type: q.mediaType,
      Media_File: q.mediaFile || '',
      Doan_Van_Doc: q.passage || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'QuestionBank');
    XLSX.writeFile(workbook, `Ngan_Hang_Cau_Hoi_AVS_English_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    addQuestionToBank({
      bookSeries: newBookSeries,
      gradeLevel: newGradeLevel,
      skill: newSkill,
      sectionCode: (newMaPhanTap.slice(0, 1).toUpperCase() as SectionCode) || 'C',
      maPhanTap: newMaPhanTap.trim() || 'C1',
      questionText: newQuestionText.trim(),
      options: [
        newOptionA.trim() || 'A',
        newOptionB.trim() || 'B',
        newOptionC.trim() || 'C',
        newOptionD.trim() || 'D'
      ],
      correctAnswer: newCorrectAnswer,
      explanation: newExplanation.trim() || 'Lời giải thích câu hỏi.',
      mediaType: newMediaType,
      mediaFile: newMediaFile.trim(),
      passage: newPassage.trim() || undefined,
      difficulty: 'medium'
    });

    setIsAddModalOpen(false);
    // Reset form
    setNewQuestionText('');
    setNewOptionA('');
    setNewOptionB('');
    setNewOptionC('');
    setNewOptionD('');
    setNewExplanation('');
    setNewPassage('');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* Top Banner KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wide">
            <span>Tổng số câu trong kho</span>
            <Database className="w-4 h-4 text-pink-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalQuestions}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Sẵn sàng để rút trích tạo đề</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wide">
            <span>Ngữ pháp &amp; Từ vựng</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {(skillCounts['Grammar'] || 0) + (skillCounts['Vocabulary'] || 0)}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Cấu trúc câu &amp; collocations</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wide">
            <span>Bài nghe &amp; Đọc hiểu</span>
            <Volume2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {(skillCounts['Reading'] || 0) + (skillCounts['Listening'] || 0)}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">{totalAudio} bài có audio đính kèm</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wide">
            <span>Bộ sách hỗ trợ</span>
            <Layers className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 mt-1">4+</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Global Success 6-9, PET, IELTS</p>
        </div>
      </div>

      {/* Main Controls Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
        
        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-pink-600" />
              <span>Ngân Hàng Câu Hỏi &amp; Kho Học Liệu (Question Bank)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Quản lý tập trung mọi câu hỏi trắc nghiệm, bài đọc, bài nghe để tái sử dụng và sinh đề thi tự động.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenPythonExtractor && (
              <button
                type="button"
                onClick={onOpenPythonExtractor}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-200 transition-all cursor-pointer ring-2 ring-emerald-400/40"
              >
                <span>🐍</span>
                <span>Bóc tách sách PDF (PyMuPDF)</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenExamCreator}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-pink-200 transition-all cursor-pointer ring-2 ring-pink-400/40"
            >
              <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
              <span>Tạo đề kiểm tra từ Ngân hàng</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm câu hỏi</span>
            </button>

            <button
              type="button"
              onClick={handleExportBankExcel}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              title="Xuất toàn bộ câu hỏi trong ngân hàng ra file Excel"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Xuất Excel (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm nội dung câu hỏi, từ vựng..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-pink-500 focus:outline-hidden"
            />
          </div>

          {/* Grade filter */}
          <div>
            <select
              value={selectedGradeFilter}
              onChange={(e) => setSelectedGradeFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            >
              <option value="ALL">Tất cả Khối lớp / Cấp độ</option>
              <option value="Lớp 6">Lớp 6</option>
              <option value="Lớp 7">Lớp 7</option>
              <option value="Lớp 8">Lớp 8</option>
              <option value="Lớp 9">Lớp 9</option>
              <option value="PET">Cambridge PET (B1)</option>
              <option value="IELTS">IELTS Foundation</option>
            </select>
          </div>

          {/* Skill filter */}
          <div>
            <select
              value={selectedSkillFilter}
              onChange={(e) => setSelectedSkillFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            >
              <option value="ALL">Tất cả Kỹ năng</option>
              <option value="Phonics">Ngữ âm (Phonics - A)</option>
              <option value="Stress">Trọng âm (Stress - B)</option>
              <option value="Vocabulary">Từ vựng (Vocabulary - C)</option>
              <option value="Grammar">Ngữ pháp (Grammar - D)</option>
              <option value="Communication">Giao tiếp (Communication - E)</option>
              <option value="Listening">Kỹ năng Nghe (Listening - L)</option>
              <option value="Reading">Đọc hiểu (Reading - F)</option>
              <option value="Writing">Viết câu (Writing - H)</option>
            </select>
          </div>

          {/* Book filter */}
          <div>
            <select
              value={selectedBookFilter}
              onChange={(e) => setSelectedBookFilter(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            >
              <option value="ALL">Tất cả Nguồn / Bộ sách</option>
              <option value="Global Success 6">Global Success 6</option>
              <option value="Global Success 7">Global Success 7</option>
              <option value="Cambridge PET Objective">Cambridge PET Objective</option>
              <option value="IELTS Preparation">IELTS Preparation</option>
            </select>
          </div>
        </div>

        {/* Results counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Tìm thấy <strong>{filteredQuestions.length}</strong> / {totalQuestions} câu hỏi phù hợp
          </span>
          {(searchTerm || selectedGradeFilter !== 'ALL' || selectedSkillFilter !== 'ALL' || selectedBookFilter !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSelectedGradeFilter('ALL');
                setSelectedSkillFilter('ALL');
                setSelectedBookFilter('ALL');
              }}
              className="text-pink-600 hover:text-pink-700 underline text-xs cursor-pointer"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Questions List */}
        <div className="space-y-3 pt-2">
          {filteredQuestions.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Database className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-600 font-bold">Không tìm thấy câu hỏi nào phù hợp với bộ lọc</p>
              <p className="text-[11px] text-slate-400 mt-1">Thầy cô có thể thêm câu hỏi mới hoặc sử dụng tính năng AI để đọc sách</p>
            </div>
          ) : (
            filteredQuestions.map((q, idx) => {
              const isExpanded = expandedQuestionId === q.id;
              return (
                <div
                  key={q.id || idx}
                  className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-pink-200 hover:shadow-2xs transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs">
                        {idx + 1}
                      </span>

                      <span className="px-2 py-0.5 rounded-md bg-pink-50 text-pink-700 font-bold text-[10px] border border-pink-200/60">
                        {q.skill} ({q.maPhanTap})
                      </span>

                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[10px]">
                        {q.gradeLevel} · {q.bookSeries}
                      </span>

                      {q.mediaType === 'audio' && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                          <Volume2 className="w-3 h-3" />
                          <span>Audio</span>
                        </span>
                      )}

                      {q.mediaType === 'image' && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200">
                          <ImageIcon className="w-3 h-3" />
                          <span>Ảnh</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                        title={isExpanded ? 'Thu gọn' : 'Xem chi tiết'}
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm('Bạn có chắc chắn muốn xóa câu hỏi này khỏi ngân hàng?')) {
                            deleteQuestionFromBank(q.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Xóa câu hỏi khỏi kho"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Question text */}
                  <div className="text-xs font-semibold text-slate-900 leading-relaxed pl-8">
                    {q.questionText}
                  </div>

                  {/* Options (always or expanded) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-8 text-xs">
                    {q.options.map((opt, oIdx) => {
                      const letter = String.fromCharCode(65 + oIdx);
                      const isCorrect = q.correctAnswer === letter || q.correctAnswer === opt;
                      return (
                        <div
                          key={oIdx}
                          className={`p-2 rounded-xl border flex items-center justify-between ${
                            isCorrect
                              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                        >
                          <span>{opt}</span>
                          {isCorrect && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                              Đáp án đúng
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Expanded Section: Explanation, Passage, Audio */}
                  {isExpanded && (
                    <div className="ml-8 pt-3 border-t border-slate-100 space-y-2.5 text-xs animate-in fade-in">
                      {q.passage && (
                        <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70 text-slate-700 leading-relaxed">
                          <span className="font-bold text-amber-900 block mb-1">Đoạn văn đọc hiểu / Lời thoại bài nghe:</span>
                          <p className="whitespace-pre-line text-[11px]">{q.passage}</p>
                        </div>
                      )}

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
                        <span className="font-bold text-slate-900 block mb-0.5">Lời giải thích sư phạm:</span>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{q.explanation}</p>
                      </div>

                      {/* Media display in expanded card */}
                      {q.mediaType === 'image' && q.mediaFile && (
                        <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/80 flex items-center gap-3">
                          <img
                            src={`/uploads/media/${q.mediaFile}`}
                            alt="Question illustration"
                            className="w-24 h-16 object-cover rounded-lg border border-blue-200 bg-white shadow-2xs"
                          />
                          <div className="text-[11px]">
                            <span className="font-bold text-blue-900 block">Hình ảnh minh họa sách giáo khoa:</span>
                            <code className="text-blue-700 font-mono text-[10px]">{q.mediaFile}</code>
                          </div>
                        </div>
                      )}

                      {q.mediaType === 'audio' && q.mediaFile && (
                        <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200/80 space-y-1.5">
                          <div className="flex items-center justify-between text-[11px] font-bold text-purple-900">
                            <span className="flex items-center gap-1.5">
                              <Volume2 className="w-4 h-4 text-purple-600" />
                              <span>Trình phát bài nghe đính kèm:</span>
                            </span>
                            <code className="text-purple-700 font-mono text-[10px]">{q.mediaFile}</code>
                          </div>
                          <audio controls src={`/uploads/media/${q.mediaFile}`} className="w-full h-8">
                            Trình duyệt không hỗ trợ thẻ audio.
                          </audio>
                        </div>
                      )}

                      {q.mediaFile && q.mediaType === 'none' && (
                        <div className="text-[11px] text-slate-400">
                          Tệp đính kèm: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-pink-600">{q.mediaFile}</code>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Modal: Add Question to Bank */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-pink-400" />
                <span>Thêm Câu Hỏi Mới Vào Ngân Hàng Học Liệu</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Khối lớp / Cấp độ:</label>
                  <select
                    value={newGradeLevel}
                    onChange={(e) => setNewGradeLevel(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="Lớp 6">Lớp 6</option>
                    <option value="Lớp 7">Lớp 7</option>
                    <option value="Lớp 8">Lớp 8</option>
                    <option value="Lớp 9">Lớp 9</option>
                    <option value="PET (B1)">Cambridge PET (B1)</option>
                    <option value="IELTS">IELTS Foundation</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kỹ năng chính:</label>
                  <select
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value as SkillCategory)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-pink-700"
                  >
                    <option value="Phonics">Ngữ âm (Phonics - A)</option>
                    <option value="Stress">Trọng âm (Stress - B)</option>
                    <option value="Vocabulary">Từ vựng (Vocabulary - C)</option>
                    <option value="Grammar">Ngữ pháp (Grammar - D)</option>
                    <option value="Communication">Giao tiếp (Communication - E)</option>
                    <option value="Listening">Kỹ năng Nghe (Listening - L)</option>
                    <option value="Reading">Đọc hiểu (Reading - F)</option>
                    <option value="Writing">Viết câu (Writing - H)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bộ sách / Nguồn:</label>
                  <input
                    type="text"
                    value={newBookSeries}
                    onChange={(e) => setNewBookSeries(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mã phần tập (VD: A1, D1, F1):</label>
                  <input
                    type="text"
                    value={newMaPhanTap}
                    onChange={(e) => setNewMaPhanTap(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nội dung câu hỏi *:</label>
                <textarea
                  rows={2}
                  required
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="Nhập nội dung câu hỏi tiếng Anh..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              {/* 4 Choices */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Đáp án A:</label>
                  <input
                    type="text"
                    value={newOptionA}
                    onChange={(e) => setNewOptionA(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    placeholder="Lựa chọn A"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Đáp án B:</label>
                  <input
                    type="text"
                    value={newOptionB}
                    onChange={(e) => setNewOptionB(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    placeholder="Lựa chọn B"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Đáp án C:</label>
                  <input
                    type="text"
                    value={newOptionC}
                    onChange={(e) => setNewOptionC(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    placeholder="Lựa chọn C"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Đáp án D:</label>
                  <input
                    type="text"
                    value={newOptionD}
                    onChange={(e) => setNewOptionD(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                    placeholder="Lựa chọn D"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Đáp án đúng *:</label>
                  <select
                    value={newCorrectAnswer}
                    onChange={(e) => setNewCorrectAnswer(e.target.value)}
                    className="w-full p-2 bg-emerald-50 border border-emerald-300 rounded-xl font-bold text-emerald-800"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Loại Media:</label>
                  <select
                    value={newMediaType}
                    onChange={(e) => setNewMediaType(e.target.value as MediaType)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  >
                    <option value="none">Không có</option>
                    <option value="image">Hình ảnh</option>
                    <option value="audio">Bài nghe (Audio)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tên file Media:</label>
                  <input
                    type="text"
                    value={newMediaFile}
                    onChange={(e) => setNewMediaFile(e.target.value)}
                    placeholder="VD: listening_q1.mp3"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Đoạn văn đọc hiểu / Script (nếu có):</label>
                <textarea
                  rows={2}
                  value={newPassage}
                  onChange={(e) => setNewPassage(e.target.value)}
                  placeholder="Dán đoạn văn đọc hiểu hoặc lời thoại bài nghe tại đây..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lời giải thích sư phạm:</label>
                <textarea
                  rows={2}
                  value={newExplanation}
                  onChange={(e) => setNewExplanation(e.target.value)}
                  placeholder="Giải thích vì sao đáp án này đúng..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Lưu vào Ngân hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
