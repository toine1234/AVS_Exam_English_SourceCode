import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { QuestionBankItem, ExamSubmission } from '../types';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  Volume2,
  RotateCcw,
  BookOpen,
  ArrowLeft,
  GraduationCap,
  Sparkles,
  Trophy,
  Check,
  X as XIcon,
  HelpCircle,
  Play,
  Square
} from 'lucide-react';

export const StudentExamView: React.FC = () => {
  const {
    activeExam,
    studentInfo,
    setStudentInfo,
    setCurrentView,
    submitPeriodicExam,
    grades
  } = useApp();

  // If no active exam
  if (!activeExam) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-3xl bg-pink-100 text-pink-600 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Không tìm thấy bài kiểm tra</h2>
        <p className="text-xs text-slate-500 mt-1">
          Đường dẫn bài kiểm tra không hợp lệ hoặc bài thi đã bị xóa.
        </p>
        <button
          type="button"
          onClick={() => setCurrentView('student')}
          className="mt-6 px-5 py-2.5 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl text-xs"
        >
          Quay lại trang Luyện tập Unit
        </button>
      </div>
    );
  }

  // Student answer state: questionId -> selected letter ('A', 'B', 'C', 'D')
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<ExamSubmission | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Time state (seconds remaining)
  const initialSeconds = (activeExam.durationMinutes || 45) * 60;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(initialSeconds);
  const [hasStarted, setHasStarted] = useState<boolean>(true);
  const [timeSpentSeconds, setTimeSpentSeconds] = useState<number>(0);

  // Audio player state for listening questions
  const [activeAudioScript, setActiveAudioScript] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Refs for smooth scroll
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Countdown timer
  useEffect(() => {
    if (isSubmitted || activeExam.durationMinutes === 0) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto submit when time runs out!
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
      setTimeSpentSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, activeExam.durationMinutes]);

  const handleSelectAnswer = (qId: string, choiceLetter: string) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qId]: choiceLetter
    }));
  };

  const handleAutoSubmit = () => {
    performSubmission(true);
  };

  const performSubmission = (isTimeOut: boolean = false) => {
    let correctCount = 0;
    const totalQ = activeExam.questions.length;

    activeExam.questions.forEach((q) => {
      const studentChoice = selectedAnswers[q.id];
      const correctChoice = q.correctAnswer.toUpperCase().trim();
      if (studentChoice && studentChoice.toUpperCase().trim() === correctChoice) {
        correctCount++;
      }
    });

    const finalScore = totalQ > 0 ? Math.round((correctCount / totalQ) * 10 * 10) / 10 : 0;

    const result = submitPeriodicExam({
      examId: activeExam.id,
      examTitle: activeExam.title,
      gradeLevel: activeExam.gradeLevel,
      studentInfo: {
        fullName: studentInfo.fullName.trim() || 'Học sinh kiểm tra',
        className: studentInfo.className.trim() || '6A1',
        teacherEmail: studentInfo.teacherEmail.trim() || 'cogiang.tienganh@gmail.com',
        schoolName: studentInfo.schoolName || 'THCS Global Success'
      },
      score: finalScore,
      totalQuestions: totalQ,
      correctCount,
      answers: selectedAnswers,
      timeSpentSeconds: timeSpentSeconds || (initialSeconds - secondsRemaining)
    });

    setSubmissionResult(result);
    setIsSubmitted(true);
    setShowConfirmModal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitClick = () => {
    const answeredCount = Object.keys(selectedAnswers).length;
    const totalCount = activeExam.questions.length;

    if (answeredCount < totalCount) {
      setShowConfirmModal(true);
    } else {
      performSubmission(false);
    }
  };

  // Format time MM:SS
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isTimerCritical = secondsRemaining <= 60 && activeExam.durationMinutes > 0;
  const isTimerWarning = secondsRemaining <= 300 && secondsRemaining > 60 && activeExam.durationMinutes > 0;

  const answeredQuestionsCount = Object.keys(selectedAnswers).length;
  const totalQuestionsCount = activeExam.questions.length;
  const progressPercent =
    totalQuestionsCount > 0 ? Math.round((answeredQuestionsCount / totalQuestionsCount) * 100) : 0;

  // Web Speech API text-to-speech for listening questions
  const playAudioScript = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (isPlayingAudio && activeAudioScript === text) {
      setIsPlayingAudio(false);
      return;
    }
    const clean = text.replace(/Audio Transcript:?/gi, '').trim();
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    setActiveAudioScript(text);
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-in fade-in">
      
      {/* Return to Practice Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCurrentView('student')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-pink-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại bài ôn tập Unit thông thường</span>
        </button>

        <span className="text-[11px] text-slate-400 font-medium">
          Mã đề thi: <strong className="font-mono text-slate-700">{activeExam.code}</strong>
        </span>
      </div>

      {/* Sticky Exam Status Bar & Timer */}
      <div className="sticky top-18 z-30 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-md p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center font-bold shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                {activeExam.title}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-50 text-pink-700 border border-pink-200">
                {activeExam.gradeLevel}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
              <span>Đã làm: <strong>{answeredQuestionsCount}</strong> / {totalQuestionsCount} câu ({progressPercent}%)</span>
              <span>·</span>
              <span>Thang điểm: 10</span>
            </div>
          </div>
        </div>

        {/* Live Timer Indicator */}
        <div className="flex items-center gap-3 shrink-0">
          {activeExam.durationMinutes > 0 ? (
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono text-sm font-black transition-all ${
                isTimerCritical
                  ? 'bg-rose-50 border-rose-400 text-rose-700 animate-pulse'
                  : isTimerWarning
                  ? 'bg-amber-50 border-amber-300 text-amber-800'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <Clock className={`w-4 h-4 ${isTimerCritical ? 'text-rose-600' : 'text-slate-500'}`} />
              <span>{formatTime(secondsRemaining)}</span>
              {isTimerCritical && <span className="text-[10px] uppercase font-sans font-bold">Sắp hết giờ!</span>}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-xl text-xs text-slate-600 font-medium">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Không giới hạn giờ</span>
            </div>
          )}

          {!isSubmitted && (
            <button
              type="button"
              onClick={handleSubmitClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold rounded-xl text-xs shadow-md shadow-pink-200 transition-all cursor-pointer ring-2 ring-pink-400/40"
            >
              <Send className="w-4 h-4" />
              <span>Nộp bài thi</span>
            </button>
          )}
        </div>
      </div>

      {/* POST-SUBMISSION RESULTS SUMMARY */}
      {isSubmitted && submissionResult && (
        <div className="p-6 bg-gradient-to-br from-white via-pink-50/30 to-amber-50/20 rounded-3xl border border-pink-200 shadow-md text-center space-y-4 animate-in fade-in zoom-in-95">
          <div className="w-16 h-16 rounded-3xl bg-pink-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-pink-300">
            <Trophy className="w-8 h-8" />
          </div>

          <div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-pink-100 text-pink-800 uppercase tracking-wide">
              {submissionResult.score >= 9
                ? '🎉 Xuất sắc'
                : submissionResult.score >= 8
                ? '⭐ Giỏi'
                : submissionResult.score >= 6.5
                ? '👍 Khá'
                : '💪 Cần cố gắng hơn'}
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">
              Kết Quả Bài Kiểm Tra: {submissionResult.score} / 10.0
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Học sinh: <strong>{submissionResult.studentInfo.fullName}</strong> ({submissionResult.studentInfo.className}) · Thời gian làm: <strong>{Math.floor(submissionResult.timeSpentSeconds / 60)} phút {submissionResult.timeSpentSeconds % 60} giây</strong>
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto pt-2">
            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Điểm quy đổi</span>
              <div className="text-xl font-black text-pink-700 mt-0.5">{submissionResult.score} / 10</div>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Số câu đúng</span>
              <div className="text-xl font-black text-emerald-700 mt-0.5">
                {submissionResult.correctCount} / {submissionResult.totalQuestions}
              </div>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Tỷ lệ chính xác</span>
              <div className="text-xl font-black text-blue-700 mt-0.5">
                {Math.round((submissionResult.correctCount / submissionResult.totalQuestions) * 100)}%
              </div>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Gửi kết quả</span>
              <div className="text-xs font-bold text-slate-700 truncate mt-1" title={submissionResult.studentInfo.teacherEmail}>
                Đã lưu bảng điểm
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setSelectedAnswers({});
                setSecondsRemaining(initialSeconds);
                setTimeSpentSeconds(0);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Làm lại bài kiểm tra</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentView('student')}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 text-xs font-semibold"
            >
              Xem trang Luyện tập khác
            </button>
          </div>
        </div>
      )}

      {/* Main Container: Sidebar question palette + Question cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Question Palette Navigation */}
        <div className="lg:col-span-1">
          <div className="sticky top-40 bg-white rounded-3xl border border-slate-200/90 p-4 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                Bảng Câu Hỏi ({totalQuestionsCount})
              </span>
              <span className="text-[11px] font-bold text-pink-700">
                {answeredQuestionsCount}/{totalQuestionsCount} đã chọn
              </span>
            </div>

            {/* Question bubbles grid */}
            <div className="grid grid-cols-5 gap-1.5 max-h-60 overflow-y-auto p-1">
              {activeExam.questions.map((q, idx) => {
                const isAnswered = Boolean(selectedAnswers[q.id]);
                const isCorrect =
                  isSubmitted &&
                  selectedAnswers[q.id]?.toUpperCase().trim() === q.correctAnswer.toUpperCase().trim();
                const isWrong = isSubmitted && isAnswered && !isCorrect;

                return (
                  <button
                    key={q.id || idx}
                    type="button"
                    onClick={() => {
                      const el = questionRefs.current[q.id];
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className={`h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                      isSubmitted
                        ? isCorrect
                          ? 'bg-emerald-500 text-white shadow-2xs'
                          : isWrong
                          ? 'bg-rose-500 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-400'
                        : isAnswered
                        ? 'bg-pink-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Student info fields */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <span className="font-bold text-slate-700 block text-[11px] uppercase">Thông tin học sinh:</span>
              <div>
                <input
                  type="text"
                  disabled={isSubmitted}
                  value={studentInfo.fullName}
                  onChange={(e) => setStudentInfo((prev) => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Họ và tên học sinh *"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  disabled={isSubmitted}
                  value={studentInfo.className}
                  onChange={(e) => setStudentInfo((prev) => ({ ...prev, className: e.target.value }))}
                  placeholder="Lớp (vd: 6A1)"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
                <input
                  type="email"
                  disabled={isSubmitted}
                  value={studentInfo.teacherEmail}
                  onChange={(e) => setStudentInfo((prev) => ({ ...prev, teacherEmail: e.target.value }))}
                  placeholder="Gmail cô giáo"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs truncate"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Questions List */}
        <div className="lg:col-span-3 space-y-4">
          {activeExam.questions.map((q, idx) => {
            const studentChoice = selectedAnswers[q.id];
            const isCorrect =
              isSubmitted && studentChoice?.toUpperCase().trim() === q.correctAnswer.toUpperCase().trim();
            const isWrong = isSubmitted && studentChoice && !isCorrect;

            return (
              <div
                key={q.id || idx}
                ref={(el) => {
                  questionRefs.current[q.id] = el;
                }}
                className={`p-5 bg-white rounded-3xl border transition-all ${
                  isSubmitted
                    ? isCorrect
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : isWrong
                      ? 'border-rose-300 bg-rose-50/20'
                      : 'border-slate-200'
                    : 'border-slate-200/90 shadow-2xs hover:border-pink-200'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-pink-100 text-pink-700 font-extrabold flex items-center justify-center text-xs">
                      {idx + 1}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold text-[11px]">
                      {q.skill} · {q.maPhanTap}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {q.mediaType === 'audio' && (
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200 flex items-center gap-1">
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Bài nghe</span>
                      </span>
                    )}
                    {isSubmitted && (
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold ${
                          isCorrect
                            ? 'bg-emerald-100 text-emerald-800'
                            : isWrong
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {isCorrect ? '✓ Đúng (+0.4đ)' : isWrong ? '✗ Sai (0đ)' : 'Chưa làm'}
                      </span>
                    )}
                  </div>
                </div>

                {/* Audio script player if listening */}
                {q.passage && q.mediaType === 'audio' && (
                  <div className="mb-4 p-3 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-blue-900">
                      <Volume2 className="w-4 h-4 text-blue-600" />
                      <span>Audio Recording Player: Nhấp để nghe phát âm bài học</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => playAudioScript(q.passage || '')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      {isPlayingAudio && activeAudioScript === q.passage ? (
                        <>
                          <Square className="w-3 h-3 fill-current" />
                          <span>Dừng nghe</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-current" />
                          <span>Phát âm thanh</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Reading Passage */}
                {q.passage && q.mediaType !== 'audio' && (
                  <div className="mb-4 p-4 bg-amber-50/50 border border-amber-200/80 rounded-2xl text-xs text-slate-700 leading-relaxed font-serif">
                    <span className="font-bold font-sans text-amber-900 block mb-1">
                      Đoạn văn đọc hiểu (Reading Passage):
                    </span>
                    <p className="whitespace-pre-line">{q.passage}</p>
                  </div>
                )}

                {/* Question Text */}
                <div className="text-sm font-bold text-slate-900 mb-3 leading-relaxed">
                  {q.questionText}
                </div>

                {/* Media Image */}
                {q.mediaType === 'image' && q.mediaFile && (
                  <div className="mb-4 p-2 bg-slate-50 border border-slate-200 rounded-2xl max-w-sm">
                    <img
                      src={`/uploads/media/${q.mediaFile}`}
                      alt="Question illustration"
                      className="w-full h-auto rounded-xl object-contain max-h-48"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Option Choices A, B, C, D */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((optionText, oIdx) => {
                    const choiceLetter = String.fromCharCode(65 + oIdx); // 'A', 'B', 'C', 'D'
                    const isSelected = studentChoice === choiceLetter;
                    const isCorrectChoice =
                      isSubmitted && q.correctAnswer.toUpperCase().trim() === choiceLetter;
                    const isSelectedWrong = isSubmitted && isSelected && !isCorrectChoice;

                    return (
                      <button
                        key={oIdx}
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => handleSelectAnswer(q.id, choiceLetter)}
                        className={`p-3 rounded-2xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                          isSubmitted
                            ? isCorrectChoice
                              ? 'bg-emerald-100/80 border-emerald-400 text-emerald-900 font-bold shadow-2xs'
                              : isSelectedWrong
                              ? 'bg-rose-100/80 border-rose-400 text-rose-900 line-through'
                              : 'bg-slate-50/60 border-slate-200/80 text-slate-500'
                            : isSelected
                            ? 'bg-pink-50 border-pink-500 text-pink-900 font-bold shadow-xs ring-2 ring-pink-400/40'
                            : 'bg-slate-50/70 border-slate-200/90 text-slate-700 hover:bg-pink-50/40 hover:border-pink-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'bg-pink-600 text-white'
                                : 'bg-white border border-slate-200 text-slate-700'
                            }`}
                          >
                            {choiceLetter}
                          </span>
                          <span className="leading-snug">{optionText}</span>
                        </div>

                        {isSubmitted && isCorrectChoice && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {isSubmitted && isSelectedWrong && (
                          <XIcon className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation (Shown after submission) */}
                {isSubmitted && (
                  <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1 animate-in fade-in">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-pink-600" />
                      <span>Đáp án đúng: <strong className="text-emerald-700">{q.correctAnswer}</strong></span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Bottom Submit Banner */}
          {!isSubmitted && (
            <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-slate-900">Hoàn thành bài kiểm tra?</h4>
                <p className="text-xs text-slate-500">
                  Bạn đã trả lời <strong>{answeredQuestionsCount}</strong> / {totalQuestionsCount} câu hỏi.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSubmitClick}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-bold rounded-2xl text-xs shadow-md shadow-pink-200 transition-all cursor-pointer ring-2 ring-pink-400/40"
              >
                <Send className="w-4 h-4" />
                <span>Nộp bài &amp; Xem điểm số</span>
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Confirmation Modal when submitting with unanswered questions */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="font-extrabold text-base text-slate-900">
                Bạn vẫn còn {totalQuestionsCount - answeredQuestionsCount} câu chưa làm!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Các câu chưa làm sẽ được tính 0 điểm. Bạn có chắc chắn muốn nộp bài ngay bây giờ không?
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Làm tiếp
              </button>
              <button
                type="button"
                onClick={() => performSubmission(false)}
                className="flex-1 py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Vẫn nộp bài
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
