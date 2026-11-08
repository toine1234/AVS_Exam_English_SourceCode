import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  Mail,
  Printer,
  X,
  Share2,
  Send,
  Sparkles,
  ExternalLink,
  Award
} from 'lucide-react';

interface SummaryCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SummaryCompletionModal: React.FC<SummaryCompletionModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    activeGrade,
    activeUnit,
    studentInfo,
    currentUnitSubmissions,
    submitEntireUnit
  } = useApp();

  const [mailSentStatus, setMailSentStatus] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // fail gracefully if confetti not ready
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalAvailable = activeUnit?.exercises.length || 23;
  const submittedCount = Object.keys(currentUnitSubmissions).length;
  const totalPoints = Object.values(currentUnitSubmissions).reduce((sum, item) => sum + item.score, 0);
  const averageScore = submittedCount > 0 ? Math.round((totalPoints / submittedCount) * 10) / 10 : 0;

  const handleSendToTeacherMail = () => {
    const result = submitEntireUnit();
    if (!result.success) {
      setMailSentStatus(result.message);
      return;
    }

    // Format email content for Gmail / default mail client
    const subject = encodeURIComponent(
      `[BÀI TẬP BỔ TRỢ] ${studentInfo.fullName} - ${studentInfo.className} nộp bài ${activeUnit?.code}: ${activeUnit?.title}`
    );

    let bodyText = `Kính gửi Cô giáo (${studentInfo.teacherEmail}),\n\n`;
    bodyText += `Em xin phép gửi cô kết quả bài làm ôn tập tiếng Anh của em:\n`;
    bodyText += `--------------------------------------------------\n`;
    bodyText += `• Họ và tên học sinh: ${studentInfo.fullName}\n`;
    bodyText += `• Lớp: ${studentInfo.className} - Trường: ${studentInfo.schoolName || 'THCS'}\n`;
    bodyText += `• Khóa học: Tiếng Anh ${activeGrade?.id} (${activeGrade?.name}) - Bộ sách: Global Success\n`;
    bodyText += `• Bài học: ${activeUnit?.code}: ${activeUnit?.title}\n`;
    bodyText += `• Số bài hoàn thành: ${submittedCount}/${totalAvailable} bài\n`;
    bodyText += `• Điểm trung bình: ${averageScore}/10 điểm\n`;
    bodyText += `• Thời gian nộp: ${new Date().toLocaleString('vi-VN')}\n`;
    bodyText += `--------------------------------------------------\n`;
    bodyText += `Chi tiết điểm từng phần:\n`;

    Object.entries(currentUnitSubmissions).forEach(([exId, sub]) => {
      bodyText += `- ${exId}: ${sub.score}/10đ (Đúng ${sub.correctAnswersCount}/${sub.totalQuestions} câu)\n`;
    });

    bodyText += `\nKính mong cô xem và cho em nhận xét. Em cảm ơn cô!`;

    const mailtoUrl = `mailto:${studentInfo.teacherEmail}?subject=${subject}&body=${encodeURIComponent(
      bodyText
    )}`;

    window.open(mailtoUrl, '_blank');
    setMailSentStatus(`Đã lưu kết quả bài làm và mở hòm thư gửi tới ${studentInfo.teacherEmail}!`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 sm:px-8 py-5 bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold leading-tight">
                Phiếu Tổng Kết &amp; Báo Cáo Điểm Số
              </h3>
              <p className="text-xs text-pink-100">
                {activeGrade?.name} · {activeUnit?.code}: {activeUnit?.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Student Profile Card */}
          <div className="p-4 bg-pink-50/60 rounded-2xl border border-pink-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Học sinh:</span>
              <strong className="text-slate-900 font-bold text-sm">
                {studentInfo.fullName || '(Chưa nhập tên)'}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Lớp:</span>
              <strong className="text-slate-900 font-bold text-sm">
                {studentInfo.className}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Gmail cô giáo:</span>
              <strong className="text-pink-700 font-semibold truncate block">
                {studentInfo.teacherEmail}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Trường:</span>
              <strong className="text-slate-900 font-medium truncate block">
                {studentInfo.schoolName || 'THCS'}
              </strong>
            </div>
          </div>

          {/* Metric Highlights */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-xs text-slate-500 block mb-1">Số bài đã nộp</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900">
                {submittedCount} / {totalAvailable}
              </span>
            </div>

            <div className="p-4 bg-pink-50/80 rounded-2xl border border-pink-200 text-center">
              <span className="text-xs text-pink-700 block mb-1">Điểm Trung Bình</span>
              <span className="text-xl sm:text-2xl font-black text-pink-700">
                {averageScore} <span className="text-xs text-pink-500">/ 10</span>
              </span>
            </div>

            <div className="p-4 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-center">
              <span className="text-xs text-emerald-700 block mb-1">Đánh giá chung</span>
              <span className="text-sm sm:text-base font-bold text-emerald-800 block mt-1">
                {averageScore >= 9.0
                  ? 'Xuất sắc ⭐'
                  : averageScore >= 8.0
                  ? 'Giỏi'
                  : averageScore >= 6.5
                  ? 'Khá'
                  : 'Cần cố gắng'}
              </span>
            </div>
          </div>

          {/* Detailed Exercise Breakdown Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              Bảng kê chi tiết 23 bài tập:
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <div className="max-h-52 overflow-y-auto divide-y divide-slate-100">
                {activeUnit?.exercises.map((ex) => {
                  const sub = currentUnitSubmissions[ex.id];
                  return (
                    <div
                      key={ex.id}
                      className="px-3.5 py-2 flex items-center justify-between hover:bg-slate-50/80"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-800 w-8">{ex.id}</span>
                        <span className="text-slate-600 truncate max-w-[200px] sm:max-w-xs">
                          {ex.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {sub ? (
                          <>
                            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {sub.score}/10đ
                            </span>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          </>
                        ) : (
                          <span className="text-slate-400 italic">Chưa nộp</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Notification status if sent */}
          {mailSentStatus && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{mailSentStatus}</span>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors w-full sm:w-auto justify-center"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>In phiếu điểm</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-transparent rounded-xl transition-colors"
            >
              Đóng
            </button>

            <button
              type="button"
              onClick={handleSendToTeacherMail}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 rounded-xl shadow-xs transition-all w-full sm:w-auto justify-center cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Gửi báo cáo cho cô giáo qua Gmail</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
