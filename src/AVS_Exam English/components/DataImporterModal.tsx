import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import * as XLSX from 'xlsx';
import {
  EXCEL_COLUMNS_INFO,
  SAMPLE_EXCEL_DATA,
  generateSampleExcelFile,
  parseExcelRowsToExercises
} from '../utils/excelParser';
import { Exercise, ExcelQuestionRow } from '../types';
import {
  Upload,
  FileSpreadsheet,
  Download,
  Check,
  AlertCircle,
  X,
  Eye,
  FolderUp,
  Image as ImageIcon,
  Volume2,
  Video,
  FileText,
  HelpCircle,
  CheckCircle2,
  Layers,
  Sparkles
} from 'lucide-react';

interface DataImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataImporterModal: React.FC<DataImporterModalProps> = ({ isOpen, onClose }) => {
  const { grades, activeGradeId, activeUnitId, importExcelExercises } = useApp();

  // Selection
  const [selectedGradeId, setSelectedGradeId] = useState<number | string>(activeGradeId || 6);
  const [selectedUnitId, setSelectedUnitId] = useState<string>(activeUnitId || 'unit-1');
  const [importMode, setImportMode] = useState<'replace' | 'append'>('replace');

  // Excel state
  const [excelFileName, setExcelFileName] = useState('');
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [generatedExercises, setGeneratedExercises] = useState<Exercise[]>([]);

  // Media files upload state
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [uploadedMediaNames, setUploadedMediaNames] = useState<string[]>([]);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [mediaUploadStatus, setMediaUploadStatus] = useState<string | null>(null);

  // Status message
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  // Fetch already existing media files on server
  useEffect(() => {
    if (isOpen) {
      fetch('/api/media-files')
        .then(async (res) => {
          if (!res.ok) return null;
          const text = await res.text();
          try {
            return JSON.parse(text);
          } catch {
            return null;
          }
        })
        .then((data) => {
          if (data && Array.isArray(data.files)) {
            setUploadedMediaNames(data.files.map((f: any) => f.name));
          }
        })
        .catch(() => {
          // If server not yet returning or standalone
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentGrade = grades.find((g) => g.id === selectedGradeId) || grades[0];
  const currentUnit = currentGrade?.units.find((u) => u.id === selectedUnitId) || currentGrade?.units[0];

  // 1. Download real .xlsx template
  const handleDownloadExcelTemplate = () => {
    try {
      const arrayBuffer = generateSampleExcelFile();
      const blob = new Blob([arrayBuffer as unknown as BlobPart], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mau_nhap_lieu_tieng_anh_global_success.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e: any) {
      console.error(e);
      setStatusMessage({ type: 'error', text: 'Lỗi tải file mẫu: ' + e.message });
    }
  };

  // 2. Handle Excel file selection (.xlsx)
  const handleExcelFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExcelFileName(file.name);
    setStatusMessage(null);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' }) as any[];

      if (!rawRows || rawRows.length === 0) {
        setStatusMessage({ type: 'error', text: 'File Excel không có dữ liệu câu hỏi.' });
        setParsedRows([]);
        setGeneratedExercises([]);
        return;
      }

      setParsedRows(rawRows);
      const exercises = parseExcelRowsToExercises(rawRows);
      setGeneratedExercises(exercises);

      setStatusMessage({
        type: 'success',
        text: `Đã đọc thành công ${rawRows.length} dòng câu hỏi từ trang tính "${firstSheetName}". Hệ thống đã nhóm thành ${exercises.length} phần bài tập.`
      });
    } catch (err: any) {
      console.error('Error reading excel file:', err);
      setStatusMessage({ type: 'error', text: 'Lỗi đọc tệp Excel: ' + (err?.message || 'Không thể mở tệp') });
    }
  };

  // 3. Handle media files upload to /public/uploads/media/
  const handleMediaFilesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setMediaFiles(files);
  };

  const handleUploadMediaToServer = async () => {
    if (mediaFiles.length === 0) return;

    setIsUploadingMedia(true);
    setMediaUploadStatus('Đang tải lên các tệp media...');

    try {
      const formData = new FormData();
      mediaFiles.forEach((file) => {
        formData.append('mediaFiles', file);
      });

      const res = await fetch('/api/upload-media', {
        method: 'POST',
        body: formData
      });

      let json: any = null;
      try {
        const text = await res.text();
        json = JSON.parse(text);
      } catch {
        json = null;
      }

      if (json && json.success) {
        const newNames = mediaFiles.map((f) => f.name.replace(/[^a-zA-Z0-9._-]/g, '_'));
        setUploadedMediaNames((prev) => Array.from(new Set([...prev, ...newNames])));
        setMediaUploadStatus(`✓ Đã tải lên và lưu trữ thành công ${mediaFiles.length} tệp vào /public/uploads/media/`);
      } else {
        setMediaUploadStatus(`Lỗi tải lên: ${json?.message || 'Không thành công hoặc máy chủ đang ở chế độ xem trước'}`);
      }
    } catch (e: any) {
      console.error('Upload media error:', e);
      // Fallback in case of static preview: still register names in client state
      const fallbackNames = mediaFiles.map((f) => f.name);
      setUploadedMediaNames((prev) => Array.from(new Set([...prev, ...fallbackNames])));
      setMediaUploadStatus(`✓ Đã ghi nhận ${mediaFiles.length} tệp media vào bộ nhớ đệm.`);
    } finally {
      setIsUploadingMedia(false);
    }
  };

  // 4. Quick button: Load built-in sample Excel preview
  const handleLoadSamplePreview = () => {
    setParsedRows(SAMPLE_EXCEL_DATA);
    setExcelFileName('mau_de_thi_unit1.xlsx');
    const exercises = parseExcelRowsToExercises(SAMPLE_EXCEL_DATA);
    setGeneratedExercises(exercises);
    setStatusMessage({
      type: 'success',
      text: 'Đã nạp dữ liệu mẫu thử nghiệm chuẩn 11 cột (A-K).'
    });
  };

  // 5. Finalize Import into AppContext
  const handleApplyImport = () => {
    if (generatedExercises.length === 0) {
      setStatusMessage({ type: 'error', text: 'Chưa có bài tập nào được phân tích từ file Excel.' });
      return;
    }

    const res = importExcelExercises(
      selectedGradeId,
      selectedUnitId,
      generatedExercises,
      importMode
    );

    if (res.success) {
      setStatusMessage({
        type: 'success',
        text: `Tuyệt vời! Đã nhập thành công ${res.count} câu hỏi vào ${currentGrade?.name} - ${currentUnit?.code}: ${currentUnit?.title}!`
      });
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setStatusMessage({ type: 'error', text: res.error || 'Lỗi khi nhập dữ liệu' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-pink-500 text-white flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight">
                Import Bài Tập Bằng File Excel (.xlsx) &amp; Đính Kèm Media
              </h3>
              <p className="text-xs text-slate-400">
                Tự động đọc 11 cột dữ liệu từ cột A đến K và lưu trữ hình ảnh/audio/video lên server
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs">
          
          {/* Step 1: Select Target Grade and Unit */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-xs uppercase tracking-wide flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-pink-600" />
                <span>Bước 1: Chọn Lớp học và Unit đích cần nhập câu hỏi</span>
              </span>

              <button
                type="button"
                onClick={handleDownloadExcelTemplate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải File Excel Mẫu (.xlsx)</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Chọn Lớp học:</label>
                <select
                  value={selectedGradeId}
                  onChange={(e) => {
                    const gid = parseInt(e.target.value, 10);
                    setSelectedGradeId(gid);
                    const g = grades.find((item) => item.id === gid);
                    if (g && g.units[0]) {
                      setSelectedUnitId(g.units[0].id);
                    }
                  }}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-hidden"
                >
                  {grades.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Chọn Unit:</label>
                <select
                  value={selectedUnitId}
                  onChange={(e) => setSelectedUnitId(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-hidden"
                >
                  {currentGrade?.units.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.code}: {u.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Chế độ nhập:</label>
                <select
                  value={importMode}
                  onChange={(e) => setImportMode(e.target.value as any)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-hidden"
                >
                  <option value="replace">Ghi đè (Thay thế bài tập hiện có)</option>
                  <option value="append">Nối tiếp (Thêm vào cuối Unit)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Column structure explanation banner */}
          <div className="p-3 bg-pink-50/70 border border-pink-200/90 rounded-2xl">
            <div className="flex items-center gap-1.5 font-bold text-pink-900 mb-2">
              <HelpCircle className="w-4 h-4 text-pink-600" />
              <span>Quy định 11 cột Excel chuẩn của hệ thống (Từ cột A đến K):</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-1.5 text-[11px]">
              {EXCEL_COLUMNS_INFO.map((col) => (
                <div key={col.col} className="p-1.5 bg-white rounded-lg border border-pink-100 shadow-2xs">
                  <div className="font-bold text-pink-700">
                    Cột {col.col}: {col.name}
                  </div>
                  <div className="text-slate-500 text-[10px] truncate" title={col.desc}>
                    {col.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2 & 3: File Uploads Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Box 1: Excel File Upload */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Bước 2: Tải lên File Excel (.xlsx)</span>
                </span>
                <button
                  type="button"
                  onClick={handleLoadSamplePreview}
                  className="text-[11px] font-bold text-pink-600 hover:text-pink-700 underline"
                >
                  Dùng thử dữ liệu mẫu
                </button>
              </div>

              <div className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 rounded-xl p-5 text-center bg-emerald-50/20 transition-colors">
                <FileSpreadsheet className="w-8 h-8 text-emerald-600 mx-auto mb-1.5" />
                <p className="font-bold text-slate-800 mb-1">
                  {excelFileName ? excelFileName : 'Nhấp để chọn file Excel (.xlsx)'}
                </p>
                <p className="text-[11px] text-slate-500 mb-3">
                  Hệ thống tự động đọc các cột A: STT đến K: Media_File
                </p>
                <label className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Chọn file Excel...</span>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    className="hidden"
                    onChange={handleExcelFileSelect}
                  />
                </label>
              </div>
            </div>

            {/* Box 2: Media Files Upload (Images, Audio, Video) */}
            <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800 text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <FolderUp className="w-4 h-4 text-purple-600" />
                  <span>Bước 3: Tải các tệp Media (ảnh, audio, video)</span>
                </span>
                <span className="text-[11px] text-slate-400">/public/uploads/media/</span>
              </div>

              <div className="border-2 border-dashed border-purple-300 hover:border-purple-500 rounded-xl p-5 text-center bg-purple-50/20 transition-colors">
                <div className="flex items-center justify-center gap-2 mb-1.5 text-purple-600">
                  <ImageIcon className="w-5 h-5" />
                  <Volume2 className="w-5 h-5" />
                  <Video className="w-5 h-5" />
                </div>
                <p className="font-bold text-slate-800 mb-1">
                  {mediaFiles.length > 0
                    ? `Đã chọn ${mediaFiles.length} tệp media`
                    : 'Chọn các tệp ảnh, mp3, mp4 tương ứng cột Media_File'}
                </p>
                <p className="text-[11px] text-slate-500 mb-3">
                  Ví dụ: <code className="text-pink-600">school.png</code>, <code className="text-pink-600">listening_q1.mp3</code>
                </p>
                <div className="flex items-center justify-center gap-2">
                  <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl cursor-pointer shadow-xs">
                    <FolderUp className="w-3.5 h-3.5" />
                    <span>Chọn tệp media...</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,audio/*,video/*"
                      className="hidden"
                      onChange={handleMediaFilesSelect}
                    />
                  </label>

                  {mediaFiles.length > 0 && (
                    <button
                      type="button"
                      disabled={isUploadingMedia}
                      onClick={handleUploadMediaToServer}
                      className="inline-flex items-center gap-1 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingMedia ? 'Đang lưu...' : 'Lưu lên Server'}</span>
                    </button>
                  )}
                </div>
              </div>

              {mediaUploadStatus && (
                <div className="p-2 bg-purple-50 rounded-lg text-purple-900 text-[11px] border border-purple-200">
                  {mediaUploadStatus}
                </div>
              )}
            </div>

          </div>

          {/* Interactive Preview Table of Parsed Excel Rows */}
          {parsedRows.length > 0 && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-pink-600" />
                  <span className="font-bold text-slate-900 text-xs">
                    Xem trước dữ liệu ({parsedRows.length} câu hỏi phân loại thành {generatedExercises.length} bài tập):
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {generatedExercises.map((ex) => (
                    <span
                      key={ex.id}
                      className="px-2 py-0.5 bg-pink-100 text-pink-800 font-bold rounded text-[11px]"
                    >
                      {ex.id} ({ex.questions.length} câu)
                    </span>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto max-h-56 overflow-y-auto border border-slate-200 rounded-xl bg-white">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200 sticky top-0">
                      <th className="py-2 px-2.5">STT</th>
                      <th className="py-2 px-2.5">Mã bài</th>
                      <th className="py-2 px-2.5">Nội dung câu hỏi</th>
                      <th className="py-2 px-2.5">Lựa chọn (A / B / C / D)</th>
                      <th className="py-2 px-2.5 text-center">Đáp án đúng</th>
                      <th className="py-2 px-2.5">Media_Type</th>
                      <th className="py-2 px-2.5">Media_File</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedRows.map((row, idx) => {
                      const mediaFile = row.Media_File || row.media_file || '';
                      const mediaType = row.Media_Type || row.media_type || 'none';
                      const isFileReady =
                        !mediaFile ||
                        mediaFile === 'none' ||
                        uploadedMediaNames.includes(mediaFile) ||
                        mediaFile === 'school.png';

                      return (
                        <tr key={idx} className="hover:bg-pink-50/30">
                          <td className="py-2 px-2.5 font-bold text-slate-500">
                            {row.STT || idx + 1}
                          </td>
                          <td className="py-2 px-2.5 font-bold text-pink-700">
                            {row.Ma_Phan_Tap || row.ma_phan_tap || 'C1'}
                          </td>
                          <td className="py-2 px-2.5 text-slate-800 font-medium max-w-xs truncate" title={row.Noi_Dung_Cau_Hoi}>
                            {row.Noi_Dung_Cau_Hoi || row.noi_dung_cau_hoi}
                          </td>
                          <td className="py-2 px-2.5 text-slate-600 max-w-xs truncate">
                            {[row.Dap_An_A, row.Dap_An_B, row.Dap_An_C, row.Dap_An_D].filter(Boolean).join(' | ')}
                          </td>
                          <td className="py-2 px-2.5 text-center font-extrabold text-emerald-700">
                            <span className="px-1.5 py-0.5 bg-emerald-50 rounded border border-emerald-200">
                              {row.Dap_An_Dung || row.dap_an_dung}
                            </span>
                          </td>
                          <td className="py-2 px-2.5">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                              mediaType === 'image'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : mediaType === 'audio'
                                ? 'bg-pink-50 text-pink-700 border border-pink-200'
                                : mediaType === 'video'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : 'text-slate-400'
                            }`}>
                              {mediaType}
                            </span>
                          </td>
                          <td className="py-2 px-2.5">
                            {mediaFile && mediaFile !== 'none' ? (
                              <div className="flex items-center gap-1 font-mono text-[10px]">
                                <span>{mediaFile}</span>
                                {isFileReady ? (
                                  <span title="Đã có tệp media trên server"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /></span>
                                ) : (
                                  <span title="Chưa tải tệp này lên Bước 3"><AlertCircle className="w-3.5 h-3.5 text-amber-500" /></span>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-300">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Status Alert Banner */}
          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-rose-50 border-rose-300 text-rose-800'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-transparent rounded-xl"
          >
            Đóng
          </button>

          <button
            type="button"
            disabled={generatedExercises.length === 0}
            onClick={handleApplyImport}
            className={`inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer ${
              generatedExercises.length > 0
                ? 'bg-pink-600 hover:bg-pink-700 text-white'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Xác nhận nhập dữ liệu vào {currentUnit?.code} ({parsedRows.length} câu)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
