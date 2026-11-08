import React, { useState } from 'react';
import { Grade, Unit } from '../types';
import { X, Copy, Check, QrCode, ExternalLink, Send } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  grade?: Grade;
  unit?: Unit;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  grade,
  unit
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  if (!isOpen) return null;

  const directUrl = `${window.location.origin}/class/grade-${grade?.id || 6}/${unit?.id || 'unit-1'}`;
  const universalUrl = `${window.location.origin}#/class/grade-${grade?.id || 6}/${unit?.id || 'unit-1'}`;
  const currentUrl = universalUrl;

  const teacherMessageTemplate = `🔔 [BÀI TẬP BỔ TRỢ TIẾNG ANH] - ${grade?.name || 'LỚP 6'} · GLOBAL SUCCESS\n📚 ${unit?.code || 'Unit 1'}: ${unit?.title || 'My New School'}\n👉 Các em học sinh nhấp vào đường link dưới đây để làm và nộp trực tiếp:\n${currentUrl}\n✨ Nhớ điền đúng Họ tên, Lớp và Gmail của cô để hệ thống tự động chấm điểm và báo cáo nhé!`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(teacherMessageTemplate);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-pink-500 text-white flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Chia sẻ link bài tập
              </h3>
              <p className="text-xs text-slate-500">
                {grade?.name} · {unit?.code}: {unit?.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Direct link input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Đường dẫn trực tiếp cho học sinh:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-mono focus:outline-hidden select-all"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors shrink-0 shadow-xs"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Đã chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick teacher template for Zalo / Classroom */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Mẫu tin nhắn gửi nhóm Zalo / Lớp học:
              </label>
              <button
                type="button"
                onClick={handleCopyMessage}
                className="text-[11px] font-semibold text-pink-600 hover:text-pink-700 flex items-center gap-1"
              >
                {copiedMessage ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Đã chép tin nhắn</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Chép tin nhắn</span>
                  </>
                )}
              </button>
            </div>
            <textarea
              readOnly
              rows={4}
              value={teacherMessageTemplate}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-sans leading-relaxed resize-none focus:outline-hidden"
            />
          </div>

          {/* Simulated QR Code for classroom projector or scanning */}
          <div className="p-4 bg-pink-50/50 rounded-xl border border-pink-100 flex items-center gap-4">
            <div className="w-20 h-20 bg-white p-1.5 rounded-lg border border-pink-200 shrink-0 flex items-center justify-center shadow-2xs">
              <div className="grid grid-cols-4 gap-1 w-full h-full p-1 bg-slate-900 rounded-xs">
                <div className="bg-white col-span-2 row-span-2 rounded-2xs"></div>
                <div className="bg-white col-span-1"></div>
                <div className="bg-white col-span-1"></div>
                <div className="bg-white col-span-2"></div>
                <div className="bg-white col-span-2 row-span-2 rounded-2xs"></div>
              </div>
            </div>
            <div className="text-xs text-slate-600">
              <span className="font-semibold text-slate-900 block mb-0.5">
                Mã QR học trực tiếp trên máy tính bảng / điện thoại
              </span>
              <span>
                Giáo viên có thể trình chiếu mã này trên màn hình lớp học để học sinh quét camera và vào làm ngay mà không cần tạo tài khoản phức tạp.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Đóng
          </button>
        </div>

      </div>
    </div>
  );
};
