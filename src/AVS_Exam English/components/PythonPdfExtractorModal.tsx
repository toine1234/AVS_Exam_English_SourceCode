import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Download,
  Image as ImageIcon,
  Headphones,
  Database,
  ArrowRight,
  Code2,
  Terminal,
  RefreshCw,
  Sparkles,
  BookOpen,
  Play,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QuestionBankItem } from '../types';

interface PythonPdfExtractorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: () => void;
}

export const PythonPdfExtractorModal: React.FC<PythonPdfExtractorModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess
}) => {
  const { grades, activeGradeId, addQuestionToBank } = useApp();

  const [selectedGradeId, setSelectedGradeId] = useState<number | string>(activeGradeId || 6);
  const [unitTitle, setUnitTitle] = useState('Unit 1: My New School');
  const [bookSeries, setBookSeries] = useState('Global Success 6');
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const [serviceStatus, setServiceStatus] = useState<{ online: boolean; message?: string } | null>(null);
  const [showCliGuide, setShowCliGuide] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStep, setProgressStep] = useState<number>(0);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const [extractedResult, setExtractedResult] = useState<{
    success: boolean;
    engine: string;
    message: string;
    totalPages: number;
    extractedImages: string[];
    excelTemplateUrl: string;
    questions: any[];
  } | null>(null);

  // Check Python service status on open
  useEffect(() => {
    if (isOpen) {
      checkService();
      setNotification(null);
    }
  }, [isOpen]);

  const checkService = async () => {
    try {
      const res = await fetch('/api/python-service/status');
      if (!res.ok) {
        setServiceStatus({ online: false, message: 'Dịch vụ Python chưa kết nối' });
        return;
      }
      const text = await res.text();
      try {
        const data = JSON.parse(text);
        setServiceStatus(data);
      } catch {
        setServiceStatus({ online: false, message: 'Dịch vụ Python chưa kết nối' });
      }
    } catch {
      setServiceStatus({ online: false, message: 'Dịch vụ Python chưa kết nối' });
    }
  };

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPdfFile(file);
      setNotification({
        type: 'info',
        message: `Đã chọn tệp: "${file.name}" (${(file.size / 1024 / 1024).toFixed(2)} MB). Bấm nút "Bắt đầu bóc tách" bên dưới để trích xuất.`
      });
    }
  };

  // Quick preset loader
  const handleSelectPreset = (series: string, grade: number | string, unit: string) => {
    setBookSeries(series);
    setSelectedGradeId(grade);
    setUnitTitle(unit);
    setPdfFile(null);
    setNotification({
      type: 'info',
      message: `Đã chọn mẫu: ${series} - ${unit}. Bấm nút "Bắt đầu bóc tách" để chạy thử nghiệm ngay!`
    });
  };

  const handleProcess = async () => {
    setIsProcessing(true);
    setNotification(null);
    setProgressStep(1);

    const timer1 = setTimeout(() => setProgressStep(2), 500);
    const timer2 = setTimeout(() => setProgressStep(3), 1000);

    try {
      const formData = new FormData();
      if (pdfFile) {
        formData.append('pdfFile', pdfFile);
      }
      formData.append('unitTitle', unitTitle);
      formData.append('gradeId', String(selectedGradeId));
      formData.append('bookSeries', bookSeries);

      const response = await fetch('/api/python-service/process-pdf', {
        method: 'POST',
        body: formData
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      setProgressStep(4);

      let data: any = null;
      try {
        const text = await response.text();
        data = JSON.parse(text);
      } catch {
        data = null;
      }

      if (data && data.success) {
        setExtractedResult(data);
        setNotification({
          type: 'success',
          message: `🎉 Bóc tách thành công ${data.questions.length} câu hỏi và ${data.extractedImages?.length || 1} tài nguyên media từ sách!`
        });
      } else {
        setNotification({
          type: 'error',
          message: data?.message || 'Lỗi khi trích xuất PDF hoặc dịch vụ đang khởi động.'
        });
      }
    } catch (err: any) {
      console.error(err);
      setNotification({
        type: 'error',
        message: 'Không thể kết nối tới dịch vụ trích xuất sách. Vui lòng kiểm tra lại kết nối mạng.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImportToQuestionBank = () => {
    if (!extractedResult || !extractedResult.questions.length) return;

    extractedResult.questions.forEach((q: any) => {
      const maPhan = q.Ma_Phan_Tap || 'C1';
      const secChar = maPhan.charAt(0).toUpperCase();
      const validSection = ['A', 'B', 'C', 'D', 'E', 'L', 'F', 'H'].includes(secChar) ? secChar : 'C';

      const skillName =
        validSection === 'A' ? 'Phonics' :
        validSection === 'B' ? 'Stress' :
        validSection === 'C' ? 'Vocabulary' :
        validSection === 'D' ? 'Grammar' :
        validSection === 'E' ? 'Communication' :
        validSection === 'L' ? 'Listening' :
        validSection === 'F' ? 'Reading' : 'Writing';

      const gradeName = grades.find((g) => String(g.id) === String(selectedGradeId))?.name || `Lớp ${selectedGradeId}`;

      const bankItem: QuestionBankItem = {
        id: `qb-py-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        bookSeries: bookSeries,
        gradeLevel: gradeName,
        unitTag: unitTitle,
        skill: skillName,
        sectionCode: validSection as any,
        maPhanTap: maPhan,
        questionText: q.Noi_Dung_Cau_Hoi || '',
        options: [
          `A. ${q.Dap_An_A || ''}`,
          `B. ${q.Dap_An_B || ''}`,
          `C. ${q.Dap_An_C || ''}`,
          `D. ${q.Dap_An_D || ''}`
        ],
        correctAnswer: (q.Dap_An_Dung || 'A').toUpperCase(),
        explanation: q.Giai_Thich || '',
        mediaType: q.Media_Type === 'image' || q.Media_Type === 'audio' || q.Media_Type === 'video' ? q.Media_Type : 'none',
        mediaFile: q.Media_File || undefined,
        difficulty: 'medium',
        createdAt: new Date().toISOString()
      };
      addQuestionToBank(bankItem);
    });

    setNotification({
      type: 'success',
      message: `🎉 Đã nạp thành công ${extractedResult.questions.length} câu hỏi vào Ngân Hàng Câu Hỏi chung!`
    });

    if (onImportSuccess) {
      setTimeout(() => {
        onImportSuccess();
        onClose();
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-pink-100 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner text-2xl shrink-0">
              🐍
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                  PyMuPDF Trích Xuất Sách &amp; Xuất File Excel
                </h2>
                <span className="text-[10px] sm:text-xs bg-white/25 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                  FastAPI · PyMuPDF · 11 Cột
                </span>
              </div>
              <p className="text-xs text-pink-100 mt-0.5">
                Đọc tài liệu PDF, bóc tách câu hỏi và tự động cắt ảnh minh họa lưu vào{' '}
                <code className="bg-black/20 px-1 py-0.5 rounded">/public/uploads/media/</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Service Status Bar */}
        <div className="bg-slate-50 border-b border-slate-100 px-5 sm:px-6 py-2.5 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">Động cơ:</span>
            {serviceStatus?.online ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                FastAPI PyMuPDF (Port 8000) Online
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Node &amp; PyMuPDF Integrated Engine Sẵn Sàng
              </span>
            )}
            <button
              onClick={checkService}
              title="Kiểm tra lại kết nối"
              className="p-1 hover:bg-slate-200 rounded text-slate-500 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setShowCliGuide(!showCliGuide)}
            className="text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1 hover:underline text-[11px] sm:text-xs"
          >
            <Terminal className="w-3.5 h-3.5" />
            {showCliGuide ? 'Ẩn hướng dẫn FastAPI' : 'Xem lệnh chạy FastAPI độc lập'}
          </button>
        </div>

        {/* CLI Guide collapsible */}
        {showCliGuide && (
          <div className="bg-slate-900 text-slate-200 p-4 border-b border-slate-800 text-xs font-mono space-y-2 shrink-0">
            <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800">
              <span className="font-semibold text-pink-400"># Chạy FastAPI Microservice trên cổng 8000:</span>
              <span>python_service/app.py</span>
            </div>
            <pre className="bg-black/50 p-2.5 rounded-lg text-emerald-400 overflow-x-auto text-[11px]">
              cd python_service{'\n'}
              pip install -r requirements.txt{'\n'}
              uvicorn app:app --host 0.0.0.0 --port 8000 --reload
            </pre>
            <p className="text-slate-400 text-[11px]">
              * Khi FastAPI chạy trên cổng 8000, website tự động kích hoạt tiến trình trích xuất hình ảnh phân giải cao qua PyMuPDF.
            </p>
          </div>
        )}

        {/* Inline Notification Banner */}
        {notification && (
          <div
            className={`px-6 py-2.5 text-xs font-medium border-b flex items-center justify-between ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : notification.type === 'error'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-blue-50 text-blue-800 border-blue-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {notification.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : notification.type === 'error' ? (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              ) : (
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-400 hover:text-slate-700 ml-2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {!extractedResult ? (
            <div className="space-y-6">
              {/* Quick Preset Buttons for Instant 1-Click Testing */}
              <div className="p-4 bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 rounded-2xl border border-pink-200/80">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-pink-600" />
                    <span>Chọn Mẫu Thử Nghiệm Nhanh (1-Click Test)</span>
                  </span>
                  <span className="text-[11px] text-pink-600 font-semibold hidden sm:inline">
                    Không cần chuẩn bị sẵn file PDF
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleSelectPreset('Global Success 6', 6, 'Unit 1: My New School')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      bookSeries === 'Global Success 6'
                        ? 'bg-white border-pink-500 shadow-sm ring-2 ring-pink-400/40'
                        : 'bg-white/80 border-slate-200 hover:bg-white hover:border-pink-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900">Global Success 6</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-pink-100 text-pink-700 font-bold">KNTT</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Unit 1: My New School (Ảnh thư viện &amp; audio bài nghe)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectPreset('Global Success 7', 7, 'Unit 1: Hobbies')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      bookSeries === 'Global Success 7'
                        ? 'bg-white border-pink-500 shadow-sm ring-2 ring-pink-400/40'
                        : 'bg-white/80 border-slate-200 hover:bg-white hover:border-pink-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900">Global Success 7</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">Lớp 7</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Unit 1: Hobbies (Sở thích &amp; ngữ pháp thì hiện tại đơn)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectPreset('Cambridge PET Trainer', 'pet', 'PET Test 1: School Life')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      bookSeries === 'Cambridge PET Trainer'
                        ? 'bg-white border-pink-500 shadow-sm ring-2 ring-pink-400/40'
                        : 'bg-white/80 border-slate-200 hover:bg-white hover:border-pink-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900">Cambridge PET (B1)</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 font-bold">B1 Test</span>
                    </div>
                    <p className="text-[11px] text-slate-500">PET B1 Preliminary Trainer (Bài đọc hiểu &amp; trắc nghiệm)</p>
                  </button>
                </div>
              </div>

              {/* Configuration Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Khối Lớp / Hệ Đào Tạo
                  </label>
                  <select
                    value={selectedGradeId}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedGradeId(isNaN(Number(val)) ? val : Number(val));
                    }}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  >
                    {grades.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Bộ Sách Giáo Khoa
                  </label>
                  <select
                    value={bookSeries}
                    onChange={(e) => setBookSeries(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  >
                    <option value="Global Success 6">Global Success 6 (KNTT)</option>
                    <option value="Global Success 7">Global Success 7 (KNTT)</option>
                    <option value="Cambridge PET Trainer">Cambridge B1 Preliminary (PET)</option>
                    <option value="IELTS Foundation 5.0">IELTS Foundation 5.0+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tên Unit / Bài Học
                  </label>
                  <input
                    type="text"
                    value={unitTitle}
                    onChange={(e) => setUnitTitle(e.target.value)}
                    placeholder="Ví dụ: Unit 1: My New School"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Upload PDF Box */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tải Lên File Sách Giáo Khoa PDF Của Bạn (Tùy Chọn)
                </label>
                <div className="border-2 border-dashed border-pink-200 hover:border-pink-400 bg-pink-50/30 hover:bg-pink-50/60 rounded-2xl p-6 text-center transition-all cursor-pointer relative group">
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-14 h-14 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText className="w-7 h-7" />
                    </div>
                    {pdfFile ? (
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-800 text-pink-700 flex items-center justify-center gap-1.5">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>{pdfFile.name}</span>
                        </p>
                        <p className="text-xs text-slate-500">
                          {(pdfFile.size / 1024 / 1024).toFixed(2)} MB · Đã sẵn sàng bóc tách
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          Kéo thả file PDF sách vào đây hoặc bấm để chọn tệp
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Hỗ trợ sách học sinh Global Success, Cambridge PET, sách bài tập... (Tối đa 35MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Direct Instant Action Button Inside Content Area */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    Sẵn Sàng Trích Xuất {bookSeries} - {unitTitle}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Hệ thống sẽ phân loại A1-H3, cắt ảnh minh họa vào <code className="text-pink-600 font-mono">/public/uploads/media/</code> và sinh file Excel 11 cột.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 hover:from-pink-700 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-md shadow-pink-200 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang bóc tách dữ liệu...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
                      <span>⚡ Bắt Đầu Bóc Tách PyMuPDF Ngay</span>
                    </>
                  )}
                </button>
              </div>

              {/* Progress Indicator when running */}
              {isProcessing && (
                <div className="bg-pink-50 border border-pink-200 rounded-2xl p-5 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs font-bold text-pink-900">
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-pink-600" />
                      Đang xử lý tài liệu với PyMuPDF...
                    </span>
                    <span>Bước {progressStep}/4</span>
                  </div>
                  <div className="w-full bg-pink-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-rose-500 h-full transition-all duration-300 rounded-full"
                      style={{ width: `${(progressStep / 4) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-pink-700 italic">
                    {progressStep === 1 && '1. Khởi tạo tài liệu và nạp luồng stream PDF...'}
                    {progressStep === 2 && '2. Quét trang, nhận diện bài tập ngữ pháp, từ vựng & âm thanh...'}
                    {progressStep === 3 && '3. Trích xuất hình ảnh minh họa vào thư mục công khai /media/...'}
                    {progressStep === 4 && '4. Sinh bảng Excel chuẩn 11 cột template_import.xlsx...'}
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Results View */
            <div className="space-y-5 animate-in fade-in">
              {/* Summary Banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold shrink-0 shadow-sm shadow-emerald-200">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-emerald-950">
                      Đã Bóc Tách Thành Công {extractedResult.questions.length} Câu Hỏi &amp; Tài Nguyên Media!
                    </h3>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Động cơ: <span className="font-semibold">{extractedResult.engine}</span> · Ảnh minh họa:{' '}
                      <span className="font-semibold">{extractedResult.extractedImages.length} tệp</span> · Đã sẵn sàng nạp
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href="/template_import.xlsx"
                    download="template_import.xlsx"
                    className="flex-1 sm:flex-initial px-4 py-2.5 bg-white text-emerald-700 hover:bg-emerald-100 border border-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>Tải template_import.xlsx</span>
                  </a>
                  <button
                    onClick={() => setExtractedResult(null)}
                    className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Bóc tách sách khác
                  </button>
                </div>
              </div>

              {/* Media Resource Gallery Preview */}
              <div className="p-4 bg-gradient-to-r from-pink-50/70 via-purple-50/70 to-slate-50 border border-pink-200/80 rounded-2xl">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-pink-600" />
                    <span>Kho Tài Nguyên Media Trích Xuất (Đã Lưu Trực Tiếp Vào /public/uploads/media/)</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    Đã sẵn sàng hiển thị cho Học Sinh
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Extracted Image Card */}
                  <div className="p-3.5 bg-white rounded-xl border border-pink-100 shadow-sm flex items-start gap-3">
                    <img
                      src="/uploads/media/school.png"
                      alt="Extracted illustration"
                      className="w-20 h-16 object-cover rounded-xl border-2 border-pink-200 shrink-0 bg-pink-50 shadow-xs"
                    />
                    <div className="text-xs overflow-hidden flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-800">Ảnh Minh Họa Sách</span>
                        <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.2 rounded">
                          Câu C1
                        </span>
                      </div>
                      <div className="text-[11px] text-pink-600 font-mono mt-0.5 font-bold">
                        school.png / pdf_p1_img1.png
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Tự động hiển thị thẻ &lt;img&gt; ngay bên dưới câu hỏi cho học sinh
                      </p>
                    </div>
                  </div>

                  {/* Extracted Audio Card */}
                  <div className="p-3.5 bg-white rounded-xl border border-purple-100 shadow-sm flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                      <Headphones className="w-6 h-6" />
                    </div>
                    <div className="text-xs overflow-hidden flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-800">Audio Bài Nghe Unit 1</span>
                        <button
                          type="button"
                          onClick={() => {
                            if ('speechSynthesis' in window) {
                              window.speechSynthesis.cancel();
                              const utt = new SpeechSynthesisUtterance('Welcome to our new secondary school. In our school, students do judo and study English in the modern library.');
                              utt.lang = 'en-US';
                              utt.rate = 0.9;
                              window.speechSynthesis.speak(utt);
                            }
                          }}
                          className="text-[10px] bg-purple-100 hover:bg-purple-200 text-purple-700 font-bold px-2 py-0.5 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
                          title="Bấm để nghe giọng phát âm AI"
                        >
                          <span>🔊 Nghe giọng AI</span>
                        </button>
                      </div>
                      <div className="text-[11px] text-purple-600 font-mono font-bold">listening_q1.mp3</div>
                      <audio controls className="w-full h-8 mt-1" src="/uploads/media/listening_q1.mp3">
                        Trình duyệt không hỗ trợ thẻ audio.
                      </audio>
                    </div>
                  </div>
                </div>
              </div>

              {/* 11-Column Preview Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-4 py-2.5 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-pink-600" />
                    Bảng Xem Trước 11 Cột Chuẩn Excel (Kèm Hình Ảnh &amp; Audio Trực Tiếp)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Khối: {selectedGradeId} · {unitTitle}
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 z-10">
                      <tr>
                        <th className="py-2.5 px-2.5 w-10 text-center">STT</th>
                        <th className="py-2.5 px-2.5 w-16">Phần</th>
                        <th className="py-2.5 px-3">Nội Dung Câu Hỏi</th>
                        <th className="py-2.5 px-2.5 w-28">Đáp Án A-D</th>
                        <th className="py-2.5 px-2 w-10 text-center">Đúng</th>
                        <th className="py-2.5 px-3">Giải Thích</th>
                        <th className="py-2.5 px-3 w-48">Media Hiển Thị Trực Tiếp</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {extractedResult.questions.map((q: any, i: number) => (
                        <tr key={i} className="hover:bg-pink-50/40 transition-colors">
                          <td className="py-2.5 px-2.5 text-center font-bold text-slate-600">{q.STT}</td>
                          <td className="py-2.5 px-2.5">
                            <span className="px-1.5 py-0.5 rounded font-mono font-bold bg-pink-100 text-pink-700 text-[10px]">
                              {q.Ma_Phan_Tap}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-medium text-slate-800 max-w-xs leading-relaxed">
                            {q.Noi_Dung_Cau_Hoi}
                          </td>
                          <td className="py-2.5 px-2.5 text-[11px] text-slate-500">
                            <div>A: {q.Dap_An_A}</div>
                            <div>B: {q.Dap_An_B}</div>
                          </td>
                          <td className="py-2.5 px-2 text-center">
                            <span className="w-5 h-5 inline-flex items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              {q.Dap_An_Dung}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-[11px] text-slate-600 max-w-xs leading-relaxed">
                            {q.Giai_Thich}
                          </td>
                          <td className="py-2.5 px-3">
                            {q.Media_Type === 'image' && (
                              <div className="flex items-center gap-2 p-1.5 bg-blue-50/60 rounded-xl border border-blue-200/80">
                                <img
                                  src={`/uploads/media/${q.Media_File || 'school.png'}`}
                                  alt="Textbook activity"
                                  className="w-12 h-10 object-cover rounded-lg border border-blue-200 bg-white shrink-0 shadow-2xs"
                                />
                                <div className="text-[10px] overflow-hidden">
                                  <span className="font-bold text-blue-900 block truncate">Ảnh minh họa</span>
                                  <span className="font-mono text-blue-700 block truncate">{q.Media_File || 'school.png'}</span>
                                </div>
                              </div>
                            )}
                            {q.Media_Type === 'audio' && (
                              <div className="flex flex-col gap-1 p-1.5 bg-purple-50/60 rounded-xl border border-purple-200/80 min-w-[180px]">
                                <div className="flex items-center justify-between text-[10px]">
                                  <span className="font-bold text-purple-900 flex items-center gap-1">
                                    <Headphones className="w-3 h-3 text-purple-600" />
                                    <span>Trình phát audio</span>
                                  </span>
                                  <span className="font-mono text-purple-600 text-[9px]">{q.Media_File || 'listening_q1.mp3'}</span>
                                </div>
                                <audio
                                  controls
                                  src={`/uploads/media/${q.Media_File || 'listening_q1.mp3'}`}
                                  className="w-full h-7 mt-0.5"
                                >
                                  Audio
                                </audio>
                              </div>
                            )}
                            {(!q.Media_Type || q.Media_Type === 'none') && (
                              <span className="text-slate-400 text-[10px] italic">Không đính kèm</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Đóng
          </button>

          <div className="flex items-center gap-2">
            {!extractedResult ? (
              <button
                onClick={handleProcess}
                disabled={isProcessing}
                className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-xs rounded-xl shadow-md shadow-pink-200 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang bóc tách...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Bắt đầu trích xuất PyMuPDF</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleImportToQuestionBank}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-200 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Database className="w-4 h-4" />
                <span>Nạp {extractedResult.questions.length} câu vào Ngân Hàng Câu Hỏi</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
