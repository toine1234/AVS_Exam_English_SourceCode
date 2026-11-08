import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { parseExcelRowsToExercises } from '../utils/excelParser';
import * as XLSX from 'xlsx';
import {
  Sparkles,
  FileText,
  Upload,
  Link as LinkIcon,
  BookOpen,
  Check,
  AlertCircle,
  X,
  Plus,
  Trash2,
  Download,
  ExternalLink,
  Loader2,
  FileSpreadsheet,
  Image as ImageIcon,
  Volume2,
  Video,
  CheckCircle2,
  Copy,
  Layers,
  ArrowRight
} from 'lucide-react';

interface AiTextbookReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface EditableRow {
  STT: number;
  Ma_Phan_Tap: string;
  Noi_Dung_Cau_Hoi: string;
  Dap_An_A: string;
  Dap_An_B: string;
  Dap_An_C: string;
  Dap_An_D: string;
  Dap_An_Dung: string;
  Giai_Thich: string;
  Media_Type: string;
  Media_File: string;
}

export const AiTextbookReaderModal: React.FC<AiTextbookReaderModalProps> = ({ isOpen, onClose }) => {
  const {
    grades,
    activeGradeId,
    activeUnitId,
    importExcelExercises,
    setCurrentView,
    setActiveGradeAndUnit,
    importQuestionsToBank
  } = useApp();

  // Tab mode: 'pdf' | 'drive' | 'preset'
  const [inputTab, setInputTab] = useState<'pdf' | 'drive' | 'preset'>('pdf');

  // Input states
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [driveUrl, setDriveUrl] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('g6_u1');
  const [targetGradeId, setTargetGradeId] = useState<number | string>(activeGradeId || 6);
  const [targetUnitCode, setTargetUnitCode] = useState('Unit 1');
  const [targetUnitTitle, setTargetUnitTitle] = useState('My New School');
  const [questionCount, setQuestionCount] = useState<number>(10);

  // AI loading and progress state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  const [errorText, setErrorText] = useState<string | null>(null);

  // Extracted rows ready for review
  const [reviewedRows, setReviewedRows] = useState<EditableRow[]>([]);
  const [activeFilterSkill, setActiveFilterSkill] = useState('ALL');

  // Success dialog after import
  const [importedSuccessInfo, setImportedSuccessInfo] = useState<{
    unitCode: string;
    unitTitle: string;
    gradeId: number;
    unitId: string;
    count: number;
    testUrl: string;
  } | null>(null);

  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  // Global Success textbook presets
  const textbookPresets = [
    {
      id: 'g6_u1',
      grade: 6,
      code: 'Unit 1',
      title: 'My New School',
      desc: 'Trường học mới của em (Từ vựng đồ dùng học tập, âm /ɑː/ & /ʌ/, Present Simple)',
      pages: 'Trang 6 - 15 Sách Học Sinh Tiếng Anh 6 Global Success'
    },
    {
      id: 'g6_u2',
      grade: 6,
      code: 'Unit 2',
      title: 'My House',
      desc: 'Ngôi nhà của em (Các phòng, đồ gia dụng, giới từ chỉ nơi chốn, There is/are)',
      pages: 'Trang 16 - 25 Sách Học Sinh Tiếng Anh 6 Global Success'
    },
    {
      id: 'g6_u3',
      grade: 6,
      code: 'Unit 3',
      title: 'My Friends',
      desc: 'Những người bạn của em (Tính từ miêu tả ngoại hình & tính cách, Present Continuous)',
      pages: 'Trang 26 - 35 Sách Học Sinh Tiếng Anh 6 Global Success'
    },
    {
      id: 'g6_u4',
      grade: 6,
      code: 'Unit 4',
      title: 'My Neighbourhood',
      desc: 'Khu phố của em (Địa điểm công cộng, tính từ so sánh hơn, chỉ đường)',
      pages: 'Trang 38 - 47 Sách Học Sinh Tiếng Anh 6 Global Success'
    },
    {
      id: 'g7_u1',
      grade: 7,
      code: 'Unit 1',
      title: 'Hobbies',
      desc: 'Sở thích cá nhân (Động từ yêu thích like/enjoy + V-ing, âm /ə/ và /ɜː/)',
      pages: 'Trang 8 - 17 Sách Học Sinh Tiếng Anh 7 Global Success'
    }
  ];

  const handleSelectPreset = (pId: string) => {
    setSelectedPreset(pId);
    const p = textbookPresets.find((item) => item.id === pId);
    if (p) {
      setTargetGradeId(p.grade);
      setTargetUnitCode(p.code);
      setTargetUnitTitle(p.title);
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
      setErrorText(null);
    }
  };

  // Trigger AI Textbook Analysis
  const handleStartAnalysis = async () => {
    setIsAnalyzing(true);
    setErrorText(null);
    setAnalysisStep('1. Đang nạp và quét cấu trúc trang sách giáo khoa...');

    try {
      const formData = new FormData();
      formData.append('gradeId', String(targetGradeId));
      formData.append('unitCode', targetUnitCode);
      formData.append('unitTitle', targetUnitTitle);
      formData.append('questionCount', String(questionCount));

      if (inputTab === 'pdf' && pdfFile) {
        formData.append('pdfFile', pdfFile);
        formData.append('topic', `Sách giáo khoa Tiếng Anh Lớp ${targetGradeId} - ${targetUnitCode}: ${targetUnitTitle}`);
      } else if (inputTab === 'drive' && driveUrl) {
        formData.append('driveUrl', driveUrl);
        formData.append('topic', `Google Drive file: ${driveUrl}`);
      } else {
        const preset = textbookPresets.find((p) => p.id === selectedPreset);
        formData.append('topic', preset ? `${preset.title} - ${preset.desc} (${preset.pages})` : targetUnitTitle);
        formData.append('textbookText', preset?.desc || '');
      }

      setAnalysisStep('2. AI đang bóc tách ngữ âm, từ vựng, ngữ pháp, bài nghe và đọc hiểu...');

      const response = await fetch('/api/ai/analyze-textbook', {
        method: 'POST',
        body: formData
      });

      setAnalysisStep('3. Đang phân loại vào cấu trúc 11 cột Excel và tạo lời giải sư phạm...');

      let data: any = null;
      try {
        const text = await response.text();
        data = JSON.parse(text);
      } catch {
        throw new Error('Máy chủ phản hồi không đúng định dạng. Vui lòng thử lại sau giây lát.');
      }

      if (!data || !data.success || !data.rows || data.rows.length === 0) {
        throw new Error(data?.message || 'Không thể trích xuất câu hỏi từ tài liệu này.');
      }

      const rows: EditableRow[] = data.rows.map((r: any, idx: number) => ({
        STT: idx + 1,
        Ma_Phan_Tap: r.Ma_Phan_Tap || 'C1',
        Noi_Dung_Cau_Hoi: r.Noi_Dung_Cau_Hoi || '',
        Dap_An_A: r.Dap_An_A || '',
        Dap_An_B: r.Dap_An_B || '',
        Dap_An_C: r.Dap_An_C || '',
        Dap_An_D: r.Dap_An_D || '',
        Dap_An_Dung: (r.Dap_An_Dung || 'A').toUpperCase().replace('.', '').trim(),
        Giai_Thich: r.Giai_Thich || '',
        Media_Type: r.Media_Type || 'none',
        Media_File: r.Media_File || ''
      }));

      setReviewedRows(rows);
    } catch (err: any) {
      console.error('Error in AI analysis:', err);
      setErrorText(err?.message || 'Lỗi khi AI phân tích sách. Vui lòng thử lại hoặc chọn bộ sách mẫu.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };

  // Inline cell edit in review table
  const handleCellChange = (index: number, field: keyof EditableRow, value: any) => {
    setReviewedRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  // Add row
  const handleAddRow = () => {
    const newRow: EditableRow = {
      STT: reviewedRows.length + 1,
      Ma_Phan_Tap: 'C1',
      Noi_Dung_Cau_Hoi: 'Câu hỏi mới thêm vào...',
      Dap_An_A: 'Lựa chọn A',
      Dap_An_B: 'Lựa chọn B',
      Dap_An_C: 'Lựa chọn C',
      Dap_An_D: 'Lựa chọn D',
      Dap_An_Dung: 'A',
      Giai_Thich: 'Lời giải chi tiết cho câu hỏi.',
      Media_Type: 'none',
      Media_File: ''
    };
    setReviewedRows((prev) => [...prev, newRow]);
  };

  // Delete row
  const handleDeleteRow = (index: number) => {
    setReviewedRows((prev) => prev.filter((_, i) => i !== index).map((r, i) => ({ ...r, STT: i + 1 })));
  };

  // Export reviewed table to .xlsx
  const handleExportReviewedExcel = () => {
    if (reviewedRows.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(reviewedRows);
    worksheet['!cols'] = [
      { wch: 6 },
      { wch: 14 },
      { wch: 45 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 14 },
      { wch: 35 },
      { wch: 14 },
      { wch: 20 }
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'AI_Extracted_Questions');
    const u8 = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([u8 as unknown as BlobPart], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AI_DeThi_${targetUnitCode.replace(/\s+/g, '_')}_Lop${targetGradeId}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Save and Import into AppContext
  const handleSaveAndImport = () => {
    if (reviewedRows.length === 0) return;

    const exercises = parseExcelRowsToExercises(reviewedRows);

    // Target unit id in grade: e.g. 'unit-1' or slug
    const targetUnitSlug = targetUnitCode.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const unitId = `unit-${targetUnitCode.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

    const res = importExcelExercises(targetGradeId, unitId, exercises, 'replace');

    // Also archive these questions into the Question Bank
    try {
      const bankItems = reviewedRows.map((r, idx) => {
        const sec = (r.Ma_Phan_Tap.slice(0, 1).toUpperCase() as any) || 'C';
        const skillLookup: Record<string, any> = {
          A: 'Phonics',
          B: 'Stress',
          C: 'Vocabulary',
          D: 'Grammar',
          E: 'Communication',
          L: 'Listening',
          F: 'Reading',
          H: 'Writing'
        };
        return {
          id: `qb_ai_${Date.now()}_${idx}`,
          bookSeries: `Global Success ${targetGradeId}`,
          gradeLevel: `Lớp ${targetGradeId}`,
          unitTag: `${targetUnitCode}: ${targetUnitTitle}`,
          skill: skillLookup[sec] || 'Vocabulary',
          sectionCode: sec,
          maPhanTap: r.Ma_Phan_Tap,
          questionText: r.Noi_Dung_Cau_Hoi,
          options: [r.Dap_An_A || '', r.Dap_An_B || '', r.Dap_An_C || '', r.Dap_An_D || ''],
          correctAnswer: r.Dap_An_Dung || 'A',
          explanation: r.Giai_Thich || 'Lời giải chi tiết cho câu hỏi.',
          mediaType: (r.Media_Type as any) || 'none',
          mediaFile: r.Media_File || '',
          difficulty: 'medium' as const,
          createdAt: new Date().toISOString().slice(0, 10)
        };
      });
      importQuestionsToBank(bankItems);
    } catch (bankErr) {
      console.warn('Could not archive to question bank:', bankErr);
    }

    const testLink = `${window.location.origin}/class/grade-${targetGradeId}/${unitId}`;

    setImportedSuccessInfo({
      unitCode: targetUnitCode,
      unitTitle: targetUnitTitle,
      gradeId: targetGradeId as any,
      unitId,
      count: reviewedRows.length,
      testUrl: testLink
    });
  };

  const handleGoToStudentView = () => {
    if (importedSuccessInfo) {
      setActiveGradeAndUnit(importedSuccessInfo.gradeId, importedSuccessInfo.unitId);
      setCurrentView('student');
      onClose();
    }
  };

  const handleCopyLink = () => {
    if (importedSuccessInfo) {
      navigator.clipboard.writeText(importedSuccessInfo.testUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Filter reviewed rows by skill
  const displayedRows =
    activeFilterSkill === 'ALL'
      ? reviewedRows
      : reviewedRows.filter((r) => r.Ma_Phan_Tap.toUpperCase().startsWith(activeFilterSkill));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in">
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold leading-tight font-display">
                  AI Tự Động Đọc Sách Giáo Khoa &amp; Tạo Bộ Câu Hỏi
                </h3>
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-bold text-amber-200 uppercase tracking-wider">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-pink-100">
                Phân tích trang sách từ Google Drive hoặc file PDF, tự động bóc tách 11 cột Excel chuẩn Bộ Giáo Dục
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[82vh] overflow-y-auto text-xs">
          
          {/* STEP 1: Input source selection & parameters */}
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-bold text-slate-800 text-xs uppercase tracking-wide flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-pink-600" />
                <span>Bước 1: Chọn nguồn sách và thiết lập thông tin bài học</span>
              </span>

              {/* Tabs */}
              <div className="flex items-center p-1 bg-white rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setInputTab('pdf')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    inputTab === 'pdf' ? 'bg-pink-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Tải file PDF sách</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInputTab('drive')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    inputTab === 'drive' ? 'bg-pink-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Link Google Drive</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInputTab('preset')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    inputTab === 'preset' ? 'bg-pink-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Sách mẫu Global Success</span>
                </button>
              </div>
            </div>

            {/* Input Panels */}
            {inputTab === 'pdf' && (
              <div className="border-2 border-dashed border-pink-300 hover:border-pink-500 rounded-2xl p-6 text-center bg-pink-50/20 transition-colors">
                <Upload className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                <p className="font-bold text-slate-800 text-sm mb-1">
                  {pdfFile ? pdfFile.name : 'Kéo thả hoặc nhấp để tải file PDF trang sách'}
                </p>
                <p className="text-[11px] text-slate-500 mb-3">
                  Hỗ trợ tài liệu PDF sách giáo khoa, bài tập bổ trợ Global Success (Tối đa 35MB)
                </p>
                <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl cursor-pointer shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Chọn file PDF từ máy tính...</span>
                  <input type="file" accept=".pdf" className="hidden" onChange={handlePdfUpload} />
                </label>
              </div>
            )}

            {inputTab === 'drive' && (
              <div className="space-y-2">
                <label className="block font-bold text-slate-700">
                  Dán đường link Google Drive của file sách PDF:
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="url"
                      placeholder="https://drive.google.com/file/d/1A2B3C.../view?usp=sharing"
                      value={driveUrl}
                      onChange={(e) => setDriveUrl(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:border-pink-500 font-mono"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  💡 <em>Lưu ý:</em> Đảm bảo file Google Drive được mở quyền <strong>&quot;Bất kỳ ai có đường liên kết&quot;</strong> để AI có thể đọc trực tiếp.
                </p>
              </div>
            )}

            {inputTab === 'preset' && (
              <div>
                <label className="block font-bold text-slate-700 mb-2">
                  Chọn bài học trong bộ sách Global Success để AI trích xuất mẫu ngay:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {textbookPresets.map((preset) => {
                    const isSelected = selectedPreset === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-pink-50 border-pink-400 ring-1 ring-pink-400'
                            : 'bg-white border-slate-200 hover:bg-pink-50/40 hover:border-pink-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-extrabold text-pink-700 text-xs">
                            Lớp {preset.grade} · {preset.code}
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-pink-600" />}
                        </div>
                        <div className="font-bold text-slate-900 text-xs mb-1">{preset.title}</div>
                        <div className="text-[10px] text-slate-500 line-clamp-2">{preset.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Target Grade, Unit Code and Title Settings */}
            <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Khối Lớp:</label>
                <select
                  value={targetGradeId}
                  onChange={(e) => setTargetGradeId(parseInt(e.target.value, 10))}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900"
                >
                  {grades.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mã Unit:</label>
                <input
                  type="text"
                  value={targetUnitCode}
                  onChange={(e) => setTargetUnitCode(e.target.value)}
                  placeholder="VD: Unit 1"
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên bài học (Title):</label>
                <input
                  type="text"
                  value={targetUnitTitle}
                  onChange={(e) => setTargetUnitTitle(e.target.value)}
                  placeholder="VD: My New School"
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Số lượng câu tạo:</label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-pink-700"
                >
                  <option value={10}>10 câu (Tiêu chuẩn)</option>
                  <option value={15}>15 câu (Mở rộng)</option>
                  <option value={23}>Trọn bộ 23 câu (A1 đến H3)</option>
                </select>
              </div>
            </div>

            {/* Launch AI analysis button */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-slate-500">
                AI sẽ trích xuất: Phát âm (A1), Trọng âm (B1), Từ vựng (C1-C4), Ngữ pháp (D1), Nghe (L1), Đọc (F1), Viết (H1)
              </div>

              <button
                type="button"
                disabled={isAnalyzing}
                onClick={handleStartAnalysis}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-600 via-rose-600 to-pink-700 hover:from-pink-700 hover:to-rose-700 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Đang phân tích sách...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-200" />
                    <span>Bắt đầu AI Phân tích &amp; Bóc tách câu hỏi</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Analysis loading state */}
          {isAnalyzing && (
            <div className="p-6 bg-pink-50/70 border border-pink-200 rounded-2xl text-center space-y-3 animate-pulse">
              <Loader2 className="w-8 h-8 text-pink-600 animate-spin mx-auto" />
              <div className="font-bold text-slate-900 text-sm">
                AI đang làm việc với tài liệu sách giáo khoa...
              </div>
              <div className="text-xs text-pink-700 font-medium">{analysisStep}</div>
            </div>
          )}

          {/* Error Message */}
          {errorText && (
            <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorText}</span>
            </div>
          )}

          {/* STEP 2: Interactive Editable Review Table */}
          {reviewedRows.length > 0 && !isAnalyzing && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      Bảng Xem Trước &amp; Chỉnh Sửa Trực Tiếp ({reviewedRows.length} câu hỏi theo chuẩn 11 cột Excel):
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[11px]">
                      Hoàn thành bóc tách
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Thầy cô có thể nhấp trực tiếp vào bất kỳ ô nào để chỉnh sửa nội dung, thêm hoặc xóa dòng trước khi lưu.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Skill filters */}
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px]">
                    {['ALL', 'A', 'B', 'C', 'D', 'E', 'L', 'F', 'H'].map((sec) => (
                      <button
                        key={sec}
                        type="button"
                        onClick={() => setActiveFilterSkill(sec)}
                        className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                          activeFilterSkill === sec
                            ? 'bg-white text-pink-700 shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {sec}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-lg shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-pink-600" />
                    <span>Thêm câu hỏi</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportReviewedExcel}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 font-bold rounded-lg shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Xuất file Excel (.xlsx)</span>
                  </button>
                </div>
              </div>

              {/* Editable Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white max-h-80 overflow-y-auto">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 sticky top-0 z-10">
                      <th className="py-2.5 px-2 w-10 text-center">STT</th>
                      <th className="py-2.5 px-2 w-16">Mã bài</th>
                      <th className="py-2.5 px-3 min-w-[220px]">Nội dung câu hỏi</th>
                      <th className="py-2.5 px-2 min-w-[120px]">Đáp án A</th>
                      <th className="py-2.5 px-2 min-w-[120px]">Đáp án B</th>
                      <th className="py-2.5 px-2 min-w-[120px]">Đáp án C</th>
                      <th className="py-2.5 px-2 min-w-[120px]">Đáp án D</th>
                      <th className="py-2.5 px-2 w-16 text-center">Đáp án đúng</th>
                      <th className="py-2.5 px-3 min-w-[180px]">Giải thích</th>
                      <th className="py-2.5 px-2 w-20">Media_Type</th>
                      <th className="py-2.5 px-2 min-w-[120px]">Media_File</th>
                      <th className="py-2.5 px-2 w-10 text-center">Xóa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayedRows.map((row, idx) => {
                      const actualIdx = reviewedRows.findIndex((r) => r.STT === row.STT);
                      return (
                        <tr key={row.STT} className="hover:bg-pink-50/30">
                          {/* STT */}
                          <td className="py-1.5 px-2 text-center font-bold text-slate-400">
                            {row.STT}
                          </td>

                          {/* Ma_Phan_Tap */}
                          <td className="py-1 px-1.5">
                            <input
                              type="text"
                              value={row.Ma_Phan_Tap}
                              onChange={(e) => handleCellChange(actualIdx, 'Ma_Phan_Tap', e.target.value.toUpperCase())}
                              className="w-14 p-1 bg-pink-50/70 border border-pink-200 rounded font-bold text-pink-700 text-center"
                            />
                          </td>

                          {/* Noi_Dung_Cau_Hoi */}
                          <td className="py-1 px-2">
                            <textarea
                              rows={2}
                              value={row.Noi_Dung_Cau_Hoi}
                              onChange={(e) => handleCellChange(actualIdx, 'Noi_Dung_Cau_Hoi', e.target.value)}
                              className="w-full p-1 border border-slate-200 rounded font-medium text-slate-800 leading-snug resize-y"
                            />
                          </td>

                          {/* Dap_An_A */}
                          <td className="py-1 px-1.5">
                            <input
                              type="text"
                              value={row.Dap_An_A}
                              onChange={(e) => handleCellChange(actualIdx, 'Dap_An_A', e.target.value)}
                              className="w-full p-1 border border-slate-200 rounded text-slate-700"
                            />
                          </td>

                          {/* Dap_An_B */}
                          <td className="py-1 px-1.5">
                            <input
                              type="text"
                              value={row.Dap_An_B}
                              onChange={(e) => handleCellChange(actualIdx, 'Dap_An_B', e.target.value)}
                              className="w-full p-1 border border-slate-200 rounded text-slate-700"
                            />
                          </td>

                          {/* Dap_An_C */}
                          <td className="py-1 px-1.5">
                            <input
                              type="text"
                              value={row.Dap_An_C}
                              onChange={(e) => handleCellChange(actualIdx, 'Dap_An_C', e.target.value)}
                              className="w-full p-1 border border-slate-200 rounded text-slate-700"
                            />
                          </td>

                          {/* Dap_An_D */}
                          <td className="py-1 px-1.5">
                            <input
                              type="text"
                              value={row.Dap_An_D}
                              onChange={(e) => handleCellChange(actualIdx, 'Dap_An_D', e.target.value)}
                              className="w-full p-1 border border-slate-200 rounded text-slate-700"
                            />
                          </td>

                          {/* Dap_An_Dung */}
                          <td className="py-1 px-1.5 text-center">
                            <select
                              value={row.Dap_An_Dung}
                              onChange={(e) => handleCellChange(actualIdx, 'Dap_An_Dung', e.target.value)}
                              className="p-1 font-black text-emerald-800 bg-emerald-50 border border-emerald-300 rounded text-center"
                            >
                              <option value="A">A</option>
                              <option value="B">B</option>
                              <option value="C">C</option>
                              <option value="D">D</option>
                            </select>
                          </td>

                          {/* Giai_Thich */}
                          <td className="py-1 px-2">
                            <textarea
                              rows={2}
                              value={row.Giai_Thich}
                              onChange={(e) => handleCellChange(actualIdx, 'Giai_Thich', e.target.value)}
                              className="w-full p-1 border border-slate-200 rounded text-slate-600 text-[10px] resize-y"
                            />
                          </td>

                          {/* Media_Type */}
                          <td className="py-1 px-1.5">
                            <select
                              value={row.Media_Type}
                              onChange={(e) => handleCellChange(actualIdx, 'Media_Type', e.target.value)}
                              className="w-full p-1 border border-slate-200 rounded text-[10px] font-bold"
                            >
                              <option value="none">none</option>
                              <option value="image">image</option>
                              <option value="audio">audio</option>
                              <option value="video">video</option>
                            </select>
                          </td>

                          {/* Media_File */}
                          <td className="py-1 px-1.5">
                            <input
                              type="text"
                              placeholder="school.png"
                              value={row.Media_File}
                              onChange={(e) => handleCellChange(actualIdx, 'Media_File', e.target.value)}
                              className="w-full p-1 border border-slate-200 rounded text-slate-700 font-mono text-[10px]"
                            />
                          </td>

                          {/* Delete */}
                          <td className="py-1 px-1.5 text-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteRow(actualIdx)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                              title="Xóa dòng này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Success Dialog when imported */}
          {importedSuccessInfo && (
            <div className="p-5 bg-emerald-50/90 border border-emerald-200 rounded-2xl space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>
                  Đã Lưu &amp; Tạo Thành Công Link Bài Test Cho {importedSuccessInfo.unitCode}: {importedSuccessInfo.unitTitle}!
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-700">
                  <span className="font-semibold block text-slate-900">
                    Đường dẫn làm bài trực tiếp cho học sinh:
                  </span>
                  <code className="text-pink-700 font-mono text-[11px] select-all break-all">
                    {importedSuccessInfo.testUrl}
                  </code>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-xs transition-colors"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Đã sao chép' : 'Chép link'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGoToStudentView}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-2xs transition-colors"
                  >
                    <span>Xem bài test ngay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-transparent rounded-xl"
          >
            Đóng
          </button>

          {reviewedRows.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleExportReviewedExcel}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold rounded-xl text-xs transition-colors"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                <span>Tải bảng Excel (.xlsx)</span>
              </button>

              <button
                type="button"
                onClick={handleSaveAndImport}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer text-xs"
              >
                <Check className="w-4 h-4" />
                <span>Lưu &amp; Import vào hệ thống ({reviewedRows.length} câu)</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
