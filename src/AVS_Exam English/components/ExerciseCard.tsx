import React, { useState, useEffect } from 'react';
import { Exercise, QuestionItem } from '../types';
import { useApp } from '../context/AppContext';
import { ListeningAudioPlayer } from './ListeningAudioPlayer';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Send,
  Sparkles,
  BookOpen,
  Award,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Image as ImageIcon,
  Volume2,
  Video
} from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, index }) => {
  const { currentUnitSubmissions, submitExercise, resetExercise, studentInfo } = useApp();

  const submission = currentUnitSubmissions[exercise.id];
  const isSubmitted = !!submission;

  // Local answers state
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [showExplanation, setShowExplanation] = useState(isSubmitted);
  const [validationError, setValidationError] = useState('');

  // Synchronize if submission exists
  useEffect(() => {
    if (submission) {
      setUserAnswers(submission.answers || {});
      setShowExplanation(true);
    } else {
      setUserAnswers({});
      setShowExplanation(false);
    }
  }, [submission]);

  const handleSelectAnswer = (questionId: string, answerValue: any) => {
    if (isSubmitted) return; // locked after submission unless reset
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answerValue
    }));
    setValidationError('');
  };

  // Grade calculation
  const handleSubmit = () => {
    // If student name not provided, remind them gently
    if (!studentInfo.fullName.trim()) {
      setValidationError('Vui lòng nhập Họ và tên học sinh ở khung trên trước khi nộp bài.');
      const studentInput = document.getElementById('submission-guide');
      if (studentInput) {
        studentInput.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    let correctCount = 0;
    const totalQuestions = exercise.questions.length;

    // Check answers for objective questions
    if (
      exercise.type === 'speaking_prompt' ||
      exercise.type === 'writing_paragraph'
    ) {
      // Freeform writing/speaking gets completion score based on word length / effort
      const text = userAnswers[exercise.questions[0]?.id] || '';
      const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
      correctCount = 1;
      let calculatedScore = 8.5;
      if (wordCount >= 40) calculatedScore = 10;
      else if (wordCount >= 20) calculatedScore = 8.0;
      else if (wordCount > 5) calculatedScore = 6.0;
      else calculatedScore = 4.0;

      submitExercise(exercise.id, userAnswers, calculatedScore, 1, 1);
      setShowExplanation(true);
      return;
    }

    exercise.questions.forEach((q) => {
      const studentAns = userAnswers[q.id];
      if (!studentAns) return;

      if (typeof q.correctAnswer === 'string') {
        const cleanStudent = String(studentAns).trim().toLowerCase();
        const cleanCorrect = q.correctAnswer.trim().toLowerCase();
        const studentLetter = cleanStudent.charAt(0);
        const correctLetter = cleanCorrect.charAt(0);

        // Check exact match, prefix match or letter match (e.g. 'c' with 'c. ruler')
        if (
          cleanStudent === cleanCorrect ||
          cleanStudent.startsWith(cleanCorrect) ||
          cleanCorrect.startsWith(cleanStudent) ||
          (cleanCorrect.length === 1 && studentLetter === cleanCorrect) ||
          (cleanStudent.length === 1 && correctLetter === cleanStudent)
        ) {
          correctCount++;
        }
      }
    });

    const score = totalQuestions > 0 ? (correctCount / totalQuestions) * 10 : 10;
    submitExercise(exercise.id, userAnswers, score, totalQuestions, correctCount);
    setShowExplanation(true);
  };

  const handleReset = () => {
    resetExercise(exercise.id);
    setUserAnswers({});
    setShowExplanation(false);
  };

  // Skill badge color helper
  const getSectionBadgeColor = (sec: string) => {
    switch (sec) {
      case 'A':
      case 'B':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'C':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'D':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'E':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'L':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'F':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'G':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'H':
        return 'bg-pink-100 text-pink-700 border-pink-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <article
      id={`exercise-${exercise.id}`}
      className={`rounded-2xl border transition-all duration-300 p-6 sm:p-7 mb-8 scroll-mt-24 ${
        isSubmitted
          ? 'bg-white border-emerald-200 shadow-xs'
          : 'bg-white border-slate-200/90 shadow-2xs hover:border-pink-300/80'
      }`}
    >
      {/* Exercise Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <span
            className={`px-2.5 py-1 text-xs font-bold rounded-lg border uppercase tracking-wider ${getSectionBadgeColor(
              exercise.section
            )}`}
          >
            {exercise.sectionTitle} · {exercise.id}
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            {exercise.name}
          </h3>
        </div>

        {/* Status & Points badge */}
        <div className="flex items-center gap-2 shrink-0">
          {isSubmitted ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Đã nộp: {submission.score}/10 điểm</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-50 text-slate-500 border border-slate-200 rounded-lg text-xs font-medium">
              <span>Thang điểm: 10đ</span>
            </div>
          )}
        </div>
      </div>

      {/* Instruction */}
      <div className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200/80 mb-5 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
        <span className="font-bold text-pink-700 mr-1.5">Hướng dẫn:</span>
        {exercise.instruction}
      </div>

      {/* Embedded Audio Player if listening exercise */}
      {exercise.audioScript && (
        <ListeningAudioPlayer
          script={exercise.audioScript}
          title={`Audio Track - ${exercise.name}`}
        />
      )}

      {/* Reading Passage if provided */}
      {exercise.passage && (
        <div className="p-5 bg-pink-50/40 border border-pink-100 rounded-2xl mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-pink-700 uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Đoạn văn đọc hiểu (Reading Passage)</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-serif">
            {exercise.passage}
          </p>
        </div>
      )}

      {/* Word Bank if provided */}
      {exercise.wordBank && exercise.type !== 'phonics_classify' && (
        <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl mb-5 flex items-center gap-2 flex-wrap text-xs">
          <span className="font-bold text-indigo-900">Khung từ vựng gợi ý:</span>
          {exercise.wordBank.map((word) => (
            <span
              key={word}
              className="px-2.5 py-1 bg-white border border-indigo-200 text-indigo-700 font-semibold rounded-lg shadow-2xs"
            >
              {word}
            </span>
          ))}
        </div>
      )}

      {/* ================= SPECIAL RENDERER: Phonics Sound Classification (A2) ================= */}
      {exercise.type === 'phonics_classify' && exercise.columns && (
        <div className="mb-6 space-y-4">
          <div className="p-3 bg-pink-50/60 border border-pink-100 rounded-xl text-xs text-pink-900">
            <strong>Cách làm:</strong> Bấm chọn nút âm /ɑː/ hoặc /ʌ/ tương ứng với từng từ để phân nhóm chính xác.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exercise.columns.map((col) => {
              const matchedQuestions = exercise.questions.filter(
                (q) => userAnswers[q.id] === col.key
              );

              return (
                <div
                  key={col.key}
                  className="p-4 bg-slate-50/90 border border-slate-200 rounded-2xl min-h-[140px]"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
                    <span className="font-bold text-slate-900 text-sm">{col.label}</span>
                    <span className="text-xs font-mono font-bold text-pink-600 bg-white px-2 py-0.5 rounded border border-pink-200">
                      {col.soundIpa}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {matchedQuestions.length === 0 ? (
                      <span className="text-xs text-slate-400 italic">Chưa có từ nào được chọn vào cột này</span>
                    ) : (
                      matchedQuestions.map((q) => (
                        <span
                          key={q.id}
                          className="px-2.5 py-1 bg-white border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg shadow-2xs flex items-center gap-1.5"
                        >
                          <span>{q.questionText}</span>
                          {!isSubmitted && (
                            <button
                              type="button"
                              onClick={() => handleSelectAnswer(q.id, null)}
                              className="text-slate-400 hover:text-rose-500 font-bold ml-1"
                            >
                              &times;
                            </button>
                          )}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Word selectors */}
          <div className="p-4 bg-white border border-slate-200 rounded-2xl">
            <div className="text-xs font-bold text-slate-700 mb-2">
              Danh sách từ cần phân loại:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {exercise.questions.map((q) => {
                const currentVal = userAnswers[q.id];
                const isCorrect = isSubmitted && currentVal === q.correctAnswer;
                const isWrong = isSubmitted && currentVal !== q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className={`p-2.5 rounded-xl border flex flex-col justify-between gap-2 ${
                      isCorrect
                        ? 'bg-emerald-50/80 border-emerald-300'
                        : isWrong
                        ? 'bg-rose-50/80 border-rose-300'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="font-bold text-slate-900 text-sm flex items-center justify-between">
                      <span>{q.questionText}</span>
                      {isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      {isWrong && <XCircle className="w-3.5 h-3.5 text-rose-500" />}
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[11px]">
                      <button
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => handleSelectAnswer(q.id, 'sound_a_long')}
                        className={`py-1 px-1.5 rounded-lg border text-center font-semibold transition-colors ${
                          currentVal === 'sound_a_long'
                            ? 'bg-pink-600 text-white border-pink-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-pink-50'
                        }`}
                      >
                        /ɑː/
                      </button>
                      <button
                        type="button"
                        disabled={isSubmitted}
                        onClick={() => handleSelectAnswer(q.id, 'sound_wedge')}
                        className={`py-1 px-1.5 rounded-lg border text-center font-semibold transition-colors ${
                          currentVal === 'sound_wedge'
                            ? 'bg-pink-600 text-white border-pink-600'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-pink-50'
                        }`}
                      >
                        /ʌ/
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= STANDARD QUESTIONS LIST ================= */}
      {exercise.type !== 'phonics_classify' && (
        <div className="space-y-4 mb-6">
          {exercise.questions.map((q, qIndex) => {
            const studentVal = userAnswers[q.id];
            const hasAnswered = studentVal !== undefined && studentVal !== '';
            const isCorrect =
              isSubmitted &&
              typeof q.correctAnswer === 'string' &&
              String(studentVal).trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
            const isWrong = isSubmitted && hasAnswered && !isCorrect;

            return (
              <div
                key={q.id}
                className={`p-4 rounded-xl border transition-colors ${
                  isCorrect
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : isWrong
                    ? 'bg-rose-50/40 border-rose-200'
                    : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-50'
                }`}
              >
                {/* Question Prompt */}
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                    {q.questionText}
                  </div>
                  {isSubmitted && (
                    <div className="shrink-0">
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Đúng
                        </span>
                      ) : isWrong ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600">
                          <XCircle className="w-3.5 h-3.5 text-rose-500" /> Sai
                        </span>
                      ) : null}
                    </div>
                  )}
                </div>

                {/* Media Attachment Rendering based on Media_Type & Media_File */}
                {q.mediaType === 'image' && q.mediaFile && (
                  <div className="my-3">
                    <img
                      src={`/uploads/media/${q.mediaFile}`}
                      alt={q.questionText}
                      className="max-h-72 w-auto rounded-xl border border-slate-200 object-contain shadow-xs bg-white"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                        const fallback = document.getElementById(`media-fallback-${q.id}`);
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div
                      id={`media-fallback-${q.id}`}
                      style={{ display: 'none' }}
                      className="p-3 bg-pink-50 border border-pink-200 rounded-xl text-xs text-pink-800 flex items-center gap-2"
                    >
                      <ImageIcon className="w-4 h-4 text-pink-600 shrink-0" />
                      <span>
                        Tệp hình ảnh: <strong>{q.mediaFile}</strong> (Vui lòng tải tệp này lên thư mục media tại trang Quản trị để hiển thị)
                      </span>
                    </div>
                  </div>
                )}

                {q.mediaType === 'audio' && q.mediaFile && (
                  <div className="my-3 p-3 bg-slate-900 text-white rounded-xl border border-slate-800 flex flex-col gap-1.5 shadow-xs">
                    <div className="flex items-center justify-between text-xs text-pink-400 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <Volume2 className="w-4 h-4" />
                        <span>File nghe đính kèm: {q.mediaFile}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">audio/mp3</span>
                    </div>
                    <audio
                      controls
                      src={`/uploads/media/${q.mediaFile}`}
                      className="w-full h-9 mt-1"
                      onError={(e) => {
                        console.warn(`Audio file /uploads/media/${q.mediaFile} not found yet.`);
                      }}
                    >
                      Trình duyệt không hỗ trợ thẻ audio.
                    </audio>
                  </div>
                )}

                {q.mediaType === 'video' && q.mediaFile && (
                  <div className="my-3 rounded-xl overflow-hidden border border-slate-800 bg-black shadow-xs">
                    <video controls src={`/uploads/media/${q.mediaFile}`} className="w-full max-h-72">
                      Trình duyệt không hỗ trợ thẻ video.
                    </video>
                  </div>
                )}

                {/* Multiple choice options */}
                {q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {q.options.map((option) => {
                      const isOptionSelected = studentVal === option;
                      const isOptionCorrectAnswer =
                        isSubmitted &&
                        (option === q.correctAnswer || option.startsWith(String(q.correctAnswer)));

                      let btnStyle =
                        'bg-white text-slate-700 border-slate-200 hover:bg-pink-50/60 hover:border-pink-300';
                      if (isOptionSelected) {
                        btnStyle = 'bg-pink-50 text-pink-900 border-pink-400 font-bold ring-1 ring-pink-400';
                      }
                      if (isSubmitted) {
                        if (isOptionCorrectAnswer) {
                          btnStyle =
                            'bg-emerald-50 text-emerald-900 border-emerald-400 font-bold ring-1 ring-emerald-400';
                        } else if (isOptionSelected && !isCorrect) {
                          btnStyle =
                            'bg-rose-50 text-rose-900 border-rose-300 line-through opacity-80';
                        }
                      }

                      return (
                        <button
                          key={option}
                          type="button"
                          disabled={isSubmitted}
                          onClick={() => handleSelectAnswer(q.id, option)}
                          className={`p-2.5 rounded-xl border text-left text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer ${btnStyle}`}
                        >
                          <span className="leading-snug">{option}</span>
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-2 ${
                              isOptionSelected
                                ? 'border-pink-600 bg-pink-600 text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isOptionSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Text input for fill blanks, verb form or reading QA */}
                {!q.options &&
                  exercise.type !== 'speaking_prompt' &&
                  exercise.type !== 'writing_paragraph' && (
                    <div className="mt-2">
                      <input
                        type="text"
                        disabled={isSubmitted}
                        placeholder="Nhập câu trả lời của em..."
                        value={studentVal || ''}
                        onChange={(e) => handleSelectAnswer(q.id, e.target.value)}
                        className={`w-full px-3 py-2 text-xs sm:text-sm bg-white border rounded-xl text-slate-900 focus:outline-hidden transition-colors ${
                          isCorrect
                            ? 'border-emerald-300 bg-emerald-50/30'
                            : isWrong
                            ? 'border-rose-300 bg-rose-50/30'
                            : 'border-slate-200 focus:border-pink-500'
                        }`}
                      />
                    </div>
                  )}

                {/* Large Textarea for Freeform Draft/Paragraph */}
                {(exercise.type === 'speaking_prompt' ||
                  exercise.type === 'writing_paragraph') && (
                  <div className="mt-2 space-y-2">
                    <textarea
                      disabled={isSubmitted}
                      rows={6}
                      placeholder="Em hãy viết nội dung bài vào khung này (hệ thống sẽ đếm số từ tự động)..."
                      value={studentVal || ''}
                      onChange={(e) => handleSelectAnswer(q.id, e.target.value)}
                      className="w-full p-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-hidden focus:border-pink-500 resize-y leading-relaxed font-sans"
                    />
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>
                        Số từ đã viết:{' '}
                        <strong className="text-pink-700">
                          {studentVal ? studentVal.trim().split(/\s+/).length : 0} từ
                        </strong>
                      </span>
                      <span>(Độ dài yêu cầu: 60 - 80 từ)</span>
                    </div>

                    {/* Rubrics checklist */}
                    {exercise.rubrics && (
                      <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-xs space-y-1">
                        <div className="font-bold text-amber-900">Tiêu chí chấm điểm (Rubrics):</div>
                        <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                          {exercise.rubrics.map((r, i) => (
                            <li key={i}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Inline explanation when submitted */}
                {isSubmitted && q.explanation && (
                  <div className="mt-2.5 p-2.5 bg-slate-100/90 rounded-lg text-xs text-slate-700 border border-slate-200/80">
                    <span className="font-bold text-pink-700 mr-1">Đáp án &amp; Lời giải:</span>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Sample Answer Box if available */}
      {isSubmitted && exercise.sampleAnswer && (
        <div className="mb-6 p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wide mb-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Bài mẫu tham khảo đạt điểm 10/10 (Model Answer)</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed font-sans">
            {exercise.sampleAnswer}
          </p>
        </div>
      )}

      {/* Validation alert */}
      {validationError && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Bottom Actions: Nộp bài... button requested */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs text-slate-500">
          {isSubmitted ? (
            <span className="text-emerald-700 font-semibold">
              ✓ Bài tập đã hoàn thành lúc {submission.submittedAt}.
            </span>
          ) : (
            <span>Sau khi nộp, hệ thống sẽ tự động cập nhật lên Bảng điểm.</span>
          )}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {isSubmitted && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Làm lại bài này</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            className={`inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer ${
              isSubmitted
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitted ? 'Nộp lại bài tập này' : 'Nộp bài tập này'}</span>
          </button>
        </div>
      </div>
    </article>
  );
};
