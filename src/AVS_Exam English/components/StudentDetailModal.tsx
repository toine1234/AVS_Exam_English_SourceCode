import React, { useState } from 'react';
import { StudentUnitRecord } from '../types';
import {
  X,
  User,
  Calendar,
  CheckCircle2,
  Trophy,
  Mail,
  Send,
  Save,
  Check
} from 'lucide-react';

interface StudentDetailModalProps {
  record: StudentUnitRecord | null;
  onClose: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({ record, onClose }) => {
  const [feedback, setFeedback] = useState('');
  const [feedbackSaved, setFeedbackSaved] = useState(false);

  if (!record) return null;

  const handleSaveFeedback = () => {
    setFeedbackSaved(true);
    setTimeout(() => setFeedbackSaved(false), 2000);
  };

  const handleSendFeedbackEmail = () => {
    const subject = encodeURIComponent(`[NHẬN XÉT CỦA CÔ] Bài tập tiếng Anh ${record.unitTitle}`);
    const body = encodeURIComponent(
      `Chào em ${record.studentInfo.fullName},\n\n` +
      `Cô đã xem và chấm bài tập ${record.unitTitle} của em.\n` +
      `• Điểm trung bình của em đạt: ${record.averageScore}/10 điểm.\n` +
      `• Số bài hoàn thành: ${record.totalSubmitted}/${record.totalAvailable} bài.\n\n` +
      `Nhận xét của cô:\n${feedback || 'Em làm bài rất tốt, tiếp tục phát huy nhé!'}\n\n` +
      `Chúc em học tốt môn Tiếng Anh!`
    );
    window.open(`mailto:${record.studentInfo.teacherEmail}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-pink-500 text-white flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold leading-tight">
                Chi Tiết Bài Làm: {record.studentInfo.fullName}
              </h3>
              <p className="text-xs text-slate-400">
                Lớp: {record.studentInfo.className} · {record.unitTitle}
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
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Metadata Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block mb-0.5">Thời gian nộp:</span>
              <strong className="text-slate-800 block">{record.updatedAt}</strong>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block mb-0.5">Tiến độ bài làm:</span>
              <strong className="text-slate-800 block">
                {record.totalSubmitted} / {record.totalAvailable} bài
              </strong>
            </div>

            <div className="p-3 bg-pink-50 rounded-xl border border-pink-200">
              <span className="text-pink-600 block mb-0.5">Điểm Trung Bình:</span>
              <strong className="text-pink-700 text-base font-extrabold block">
                {record.averageScore} / 10
              </strong>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-400 block mb-0.5">Trường:</span>
              <strong className="text-slate-800 truncate block">
                {record.studentInfo.schoolName || 'THCS'}
              </strong>
            </div>
          </div>

          {/* List of completed exercises */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Danh sách các bài tập đã nộp &amp; câu trả lời:
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-60 overflow-y-auto text-xs">
              {Object.entries(record.completedExercises).map(([exId, sub]) => (
                <div key={exId} className="p-3 hover:bg-slate-50 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      Bài {exId}
                    </span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {sub.score}/10 điểm ({sub.correctAnswersCount}/{sub.totalQuestions} câu đúng)
                    </span>
                  </div>

                  {/* Answers summary */}
                  <div className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-100 font-mono">
                    {sub.answers && Object.keys(sub.answers).length > 0 ? (
                      Object.entries(sub.answers).map(([qKey, val]) => (
                        <div key={qKey} className="truncate">
                          <span className="text-slate-400">{qKey}:</span>{' '}
                          <span className="text-slate-800 font-semibold">{String(val)}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-400">Không có dữ liệu văn bản</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Teacher Feedback textarea */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-900">
                Ghi chú &amp; Lời phê của cô giáo dành cho em:
              </label>
              {feedbackSaved && (
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Đã lưu lời phê
                </span>
              )}
            </div>
            <textarea
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="VD: Em phát âm rất chuẩn, cần chú ý thêm phần phân biệt thì Hiện tại tiếp diễn ở câu 4 bài D2 nhé!..."
              className="w-full p-2.5 text-xs bg-white border border-amber-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-amber-500 font-sans leading-relaxed"
            />
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={handleSaveFeedback}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-900 bg-white border border-amber-300 rounded-lg hover:bg-amber-100/60 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu lời phê</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-transparent rounded-xl"
          >
            Đóng
          </button>

          <button
            type="button"
            onClick={handleSendFeedbackEmail}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-pink-600 hover:bg-pink-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Gửi phản hồi cho học sinh qua Gmail</span>
          </button>
        </div>

      </div>
    </div>
  );
};
