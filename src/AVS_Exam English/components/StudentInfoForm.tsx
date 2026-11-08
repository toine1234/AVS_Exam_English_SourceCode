import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, Mail, School, AlertCircle, Info, ChevronDown, ChevronUp, Check, Save } from 'lucide-react';

export const StudentInfoForm: React.FC = () => {
  const { studentInfo, setStudentInfo } = useApp();
  const [isGuideOpen, setIsGuideOpen] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (field: string, value: string) => {
    setStudentInfo((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveNotification = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div id="submission-guide" className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-6 mb-8">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-700 flex items-center justify-center font-bold">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              Thông tin học sinh nộp bài
            </h2>
            <p className="text-xs text-slate-500">
              Vui lòng nhập chính xác để điểm số được ghi nhận vào bảng kết quả của giáo viên
            </p>
          </div>
        </div>

        {saveSuccess && (
          <span className="inline-flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md font-medium">
            <Check className="w-3.5 h-3.5" />
            Đã lưu thông tin
          </span>
        )}
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Họ và tên học sinh <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="VD: Nguyễn Hoàng Minh"
              value={studentInfo.fullName}
              onChange={(e) => {
                handleChange('fullName', e.target.value);
                handleSaveNotification();
              }}
              className={`w-full px-3.5 py-2 text-sm bg-slate-50 border rounded-xl text-slate-900 transition-colors focus:bg-white focus:outline-hidden ${
                !studentInfo.fullName.trim()
                  ? 'border-amber-300 focus:border-amber-500 ring-2 ring-amber-100'
                  : 'border-slate-200 focus:border-pink-500'
              }`}
            />
          </div>
          {!studentInfo.fullName.trim() && (
            <p className="mt-1 text-[11px] text-amber-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3 shrink-0" />
              Bắt buộc nhập họ tên để hệ thống chấm điểm
            </p>
          )}
        </div>

        {/* Class */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Lớp học <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="VD: 6A1"
            value={studentInfo.className}
            onChange={(e) => handleChange('className', e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-hidden focus:border-pink-500"
          />
        </div>

        {/* Teacher's Gmail */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
            <span>Gmail của cô giáo <span className="text-rose-500">*</span></span>
          </label>
          <div className="relative">
            <input
              type="email"
              placeholder="cogiang.tienganh@gmail.com"
              value={studentInfo.teacherEmail}
              onChange={(e) => handleChange('teacherEmail', e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-hidden focus:border-pink-500"
            />
          </div>
        </div>

        {/* School Name */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            Trường THCS
          </label>
          <input
            type="text"
            placeholder="VD: THCS Lê Quý Đôn"
            value={studentInfo.schoolName || ''}
            onChange={(e) => handleChange('schoolName', e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:outline-hidden focus:border-pink-500"
          />
        </div>
      </div>

      {/* Collapsible Guidance Box: Hướng dẫn chi tiết quy định nộp bài */}
      <div className="rounded-xl border border-pink-100 bg-pink-50/40 overflow-hidden">
        <button
          type="button"
          onClick={() => setIsGuideOpen(!isGuideOpen)}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-pink-50/80 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-pink-600 shrink-0" />
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
              Hộp hướng dẫn chi tiết quy định nộp bài &amp; cơ chế chấm điểm
            </span>
          </div>
          <div className="text-xs text-pink-700 font-semibold flex items-center gap-1">
            <span>{isGuideOpen ? 'Thu gọn' : 'Xem quy định'}</span>
            {isGuideOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {isGuideOpen && (
          <div className="px-4 pb-4 pt-1 border-t border-pink-100/60 text-xs text-slate-700 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-pink-200 text-pink-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  1
                </span>
                <p>
                  <strong className="text-slate-900">Thực hiện 23 bài tập theo các kỹ năng:</strong> Làm lần lượt từ phần Phonics (A1, A2), Stress (B1), Vocabulary (C1-C4), Grammar (D1-D4), Communication (E1), Listening (L1-L3), Reading (F1-F3) đến Speaking và Writing (G1-H3).
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-pink-200 text-pink-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  2
                </span>
                <p>
                  <strong className="text-slate-900">Nút "Nộp bài..." ở cuối mỗi bài:</strong> Sau khi hoàn thành bài nào, nhấp nút nộp bài của bài đó để hệ thống chấm điểm tự động (thang điểm 10) và hiển thị đáp án, lời giải thích chi tiết.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-pink-200 text-pink-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  3
                </span>
                <p>
                  <strong className="text-slate-900">Bảng điểm tự động cập nhật:</strong> Mỗi ô trên bảng điểm tương ứng từ A1 đến H3 sẽ đổi sang trạng thái <span className="text-emerald-700 font-semibold">"Đã nộp"</span> kèm điểm số cụ thể. Em có thể bấm vào ô để nhảy nhanh đến bài tập đó.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-pink-200 text-pink-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  4
                </span>
                <p>
                  <strong className="text-slate-900">Báo cáo đến giáo viên:</strong> Dữ liệu làm bài được lưu giữ an toàn. Khi làm xong, em có thể bấm "Nộp toàn bộ &amp; Báo cáo" để gửi phiếu điểm tổng hợp về Gmail của cô giáo.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
