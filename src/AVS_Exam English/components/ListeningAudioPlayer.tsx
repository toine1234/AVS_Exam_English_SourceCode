import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, FileText, ChevronDown, ChevronUp } from 'lucide-react';

interface ListeningAudioPlayerProps {
  script: string;
  title: string;
}

export const ListeningAudioPlayer: React.FC<ListeningAudioPlayerProps> = ({ script, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [showScript, setShowScript] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSupported(true);
    } else {
      setSpeechSupported(false);
    }

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (!speechSupported) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel(); // Reset previous speech
      const utterance = new SpeechSynthesisUtterance(script);
      utterance.rate = playbackRate;
      utterance.lang = 'en-US';

      // Try selecting an English voice if available
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(
        (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('English'))
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.onend = () => {
        setIsPlaying(false);
      };
      utterance.onerror = () => {
        setIsPlaying(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const handleReplay = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
    setTimeout(() => {
      handlePlayPause();
    }, 150);
  };

  const handleRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(script);
        utterance.rate = rate;
        utterance.lang = 'en-US';
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }, 100);
    }
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 mb-5 shadow-md border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Track Info */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center border border-pink-500/30 shrink-0">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-pink-400 uppercase tracking-wider">
              BĂNG NGHE CHUẨN TIẾNG ANH (AUDIO TRACK)
            </div>
            <div className="text-sm font-bold text-white leading-snug">
              {title}
            </div>
          </div>
        </div>

        {/* Controls: Play/Pause, Replay, Speed */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Animated sound equalizer bars when playing */}
          {isPlaying && (
            <div className="flex items-center gap-1 h-5 px-2 bg-pink-950/60 rounded-md border border-pink-500/30">
              <span className="w-1 bg-pink-400 rounded-full animate-bounce h-3"></span>
              <span className="w-1 bg-pink-400 rounded-full animate-bounce h-5 delay-75"></span>
              <span className="w-1 bg-pink-400 rounded-full animate-bounce h-2 delay-150"></span>
              <span className="w-1 bg-pink-400 rounded-full animate-bounce h-4 delay-100"></span>
            </div>
          )}

          {/* Speed selector */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => handleRateChange(0.8)}
              className={`px-2 py-1 rounded-md transition-colors ${
                playbackRate === 0.8 ? 'bg-pink-600 text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
              title="Tốc độ chậm"
            >
              0.8x
            </button>
            <button
              type="button"
              onClick={() => handleRateChange(1.0)}
              className={`px-2 py-1 rounded-md transition-colors ${
                playbackRate === 1.0 ? 'bg-pink-600 text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
              title="Tốc độ chuẩn"
            >
              1.0x
            </button>
            <button
              type="button"
              onClick={() => handleRateChange(1.2)}
              className={`px-2 py-1 rounded-md transition-colors ${
                playbackRate === 1.2 ? 'bg-pink-600 text-white font-bold' : 'text-slate-300 hover:text-white'
              }`}
              title="Tốc độ nhanh"
            >
              1.2x
            </button>
          </div>

          {/* Replay button */}
          <button
            type="button"
            onClick={handleReplay}
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-slate-700"
            title="Phát lại từ đầu"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={handlePlayPause}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-sm ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-pink-600 hover:bg-pink-700'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Tạm dừng</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Phát âm thanh</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Script Accordion */}
      <div className="mt-3 pt-3 border-t border-slate-800 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setShowScript(!showScript)}
          className="inline-flex items-center gap-1 text-xs text-pink-400 hover:text-pink-300 font-medium self-start"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{showScript ? 'Ẩn lời thoại (Audio Script)' : 'Xem lời thoại (Audio Script)'}</span>
          {showScript ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showScript && (
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans animate-in fade-in">
            {script}
          </div>
        )}
      </div>
    </div>
  );
};
