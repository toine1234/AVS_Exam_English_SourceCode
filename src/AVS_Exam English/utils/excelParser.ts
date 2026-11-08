import * as XLSX from 'xlsx';
import { Exercise, QuestionItem, SectionCode, ExcelQuestionRow, MediaType } from '../types';

export const EXCEL_COLUMNS_INFO = [
  { col: 'A', name: 'STT', desc: 'Số thứ tự câu (1, 2, 3...)' },
  { col: 'B', name: 'Ma_Phan_Tap', desc: 'Mã bài tập (VD: A1, B1, C1, L1, F1...)' },
  { col: 'C', name: 'Noi_Dung_Cau_Hoi', desc: 'Nội dung câu hỏi hoặc đề bài' },
  { col: 'D', name: 'Dap_An_A', desc: 'Lựa chọn A' },
  { col: 'E', name: 'Dap_An_B', desc: 'Lựa chọn B' },
  { col: 'F', name: 'Dap_An_C', desc: 'Lựa chọn C (nếu có)' },
  { col: 'G', name: 'Dap_An_D', desc: 'Lựa chọn D (nếu có)' },
  { col: 'H', name: 'Dap_An_Dung', desc: 'Đáp án đúng (A, B, C, hoặc D)' },
  { col: 'I', name: 'Giai_Thich', desc: 'Lời giải chi tiết cho câu hỏi' },
  { col: 'J', name: 'Media_Type', desc: 'Loại đa phương tiện: none, image, audio, video' },
  { col: 'K', name: 'Media_File', desc: 'Tên file đính kèm (VD: school.png, listening_q1.mp3)' }
];

export const SAMPLE_EXCEL_DATA: ExcelQuestionRow[] = [
  {
    STT: 1,
    Ma_Phan_Tap: 'A1',
    Noi_Dung_Cau_Hoi: 'Choose the word whose underlined part is pronounced differently: study, rubber, ruler, subject',
    Dap_An_A: 'study',
    Dap_An_B: 'rubber',
    Dap_An_C: 'ruler',
    Dap_An_D: 'subject',
    Dap_An_Dung: 'C',
    Giai_Thich: '"ruler" có âm /uː/, các từ còn lại có âm /ʌ/.',
    Media_Type: 'none',
    Media_File: ''
  },
  {
    STT: 2,
    Ma_Phan_Tap: 'A1',
    Noi_Dung_Cau_Hoi: 'Choose the word with different sound in "a": smart, class, father, classmate',
    Dap_An_A: 'smart',
    Dap_An_B: 'class',
    Dap_An_C: 'father',
    Dap_An_D: 'classmate',
    Dap_An_Dung: 'D',
    Giai_Thich: '"classmate" có âm /eɪ/ ở đuôi "-mate", còn lại phát âm là /ɑː/.',
    Media_Type: 'none',
    Media_File: ''
  },
  {
    STT: 3,
    Ma_Phan_Tap: 'B1',
    Noi_Dung_Cau_Hoi: 'Choose the word with different stress pattern:',
    Dap_An_A: 'compass',
    Dap_An_B: 'uniform',
    Dap_An_C: 'rubber',
    Dap_An_D: 'remember',
    Dap_An_Dung: 'D',
    Giai_Thich: '"remember" nhấn trọng âm 2 (/rɪˈmembə/), còn lại nhấn trọng âm 1.',
    Media_Type: 'none',
    Media_File: ''
  },
  {
    STT: 4,
    Ma_Phan_Tap: 'C1',
    Noi_Dung_Cau_Hoi: 'Look at the picture. What is this school object?',
    Dap_An_A: 'school uniform',
    Dap_An_B: 'compass',
    Dap_An_C: 'pencil sharpener',
    Dap_An_D: 'calculator',
    Dap_An_Dung: 'B',
    Giai_Thich: 'Hình ảnh compa dùng trong giờ toán học.',
    Media_Type: 'image',
    Media_File: 'school.png'
  },
  {
    STT: 5,
    Ma_Phan_Tap: 'C1',
    Noi_Dung_Cau_Hoi: 'In a _______ school, students study and live there during the week.',
    Dap_An_A: 'boarding',
    Dap_An_B: 'private',
    Dap_An_C: 'modern',
    Dap_An_D: 'primary',
    Dap_An_Dung: 'A',
    Giai_Thich: '"boarding school" nghĩa là trường nội trú.',
    Media_Type: 'none',
    Media_File: ''
  },
  {
    STT: 6,
    Ma_Phan_Tap: 'L1',
    Noi_Dung_Cau_Hoi: 'Listen to the audio track and choose: What is the name of An\'s new secondary school?',
    Dap_An_A: 'Dream School',
    Dap_An_B: 'Sunrise Lower Secondary School',
    Dap_An_C: 'Da Nang International School',
    Dap_An_D: 'Le Quy Don School',
    Dap_An_Dung: 'B',
    Giai_Thich: 'An nói trong file nghe: "I am a student at Sunrise Lower Secondary School."',
    Media_Type: 'audio',
    Media_File: 'listening_q1.mp3'
  },
  {
    STT: 7,
    Ma_Phan_Tap: 'L1',
    Noi_Dung_Cau_Hoi: 'How many classrooms are there in An\'s school according to the recording?',
    Dap_An_A: '15 classrooms',
    Dap_An_B: '20 classrooms',
    Dap_An_C: '25 classrooms',
    Dap_An_D: '30 classrooms',
    Dap_An_Dung: 'C',
    Giai_Thich: 'An nói: "There are 25 classrooms, a big science lab..."',
    Media_Type: 'audio',
    Media_File: 'listening_q1.mp3'
  },
  {
    STT: 8,
    Ma_Phan_Tap: 'F1',
    Noi_Dung_Cau_Hoi: 'Look at the school campus photo. How many main buildings can you see?',
    Dap_An_A: 'Two buildings',
    Dap_An_B: 'Three buildings',
    Dap_An_C: 'Four buildings',
    Dap_An_D: 'Five buildings',
    Dap_An_Dung: 'B',
    Giai_Thich: 'Trong khuôn viên trường có 3 dãy phòng học chính.',
    Media_Type: 'image',
    Media_File: 'school.png'
  }
];

// Generate downloadable Excel file (.xlsx)
export function generateSampleExcelFile(): Uint8Array {
  const worksheet = XLSX.utils.json_to_sheet(SAMPLE_EXCEL_DATA);

  // Set column widths for comfortable viewing in Excel
  worksheet['!cols'] = [
    { wch: 6 },  // A: STT
    { wch: 14 }, // B: Ma_Phan_Tap
    { wch: 45 }, // C: Noi_Dung_Cau_Hoi
    { wch: 22 }, // D: Dap_An_A
    { wch: 22 }, // E: Dap_An_B
    { wch: 22 }, // F: Dap_An_C
    { wch: 22 }, // G: Dap_An_D
    { wch: 14 }, // H: Dap_An_Dung
    { wch: 35 }, // I: Giai_Thich
    { wch: 14 }, // J: Media_Type
    { wch: 22 }  // K: Media_File
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Cau_Hoi_Bai_Tap');

  return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
}

// Helper to determine section name
function getSectionDetails(ma: string): { section: SectionCode; title: string; defaultName: string } {
  const upper = (ma || 'A1').trim().toUpperCase();
  const letter = upper.charAt(0) as SectionCode;

  switch (letter) {
    case 'A':
      return { section: 'A', title: 'Phonics', defaultName: `${upper}. Pronunciation & Phonics Practice` };
    case 'B':
      return { section: 'B', title: 'Stress', defaultName: `${upper}. Word Stress Examination` };
    case 'C':
      return { section: 'C', title: 'Vocabulary', defaultName: `${upper}. School Vocabulary Practice` };
    case 'D':
      return { section: 'D', title: 'Grammar', defaultName: `${upper}. Grammar & Sentence Structures` };
    case 'E':
      return { section: 'E', title: 'Communication', defaultName: `${upper}. Everyday English & Dialogue` };
    case 'L':
      return { section: 'L', title: 'Listening', defaultName: `${upper}. Listening Comprehension` };
    case 'F':
      return { section: 'F', title: 'Reading', defaultName: `${upper}. Reading Comprehension Passage` };
    case 'G':
      return { section: 'G', title: 'Speaking', defaultName: `${upper}. Speaking & Presentation` };
    case 'H':
      return { section: 'H', title: 'Writing', defaultName: `${upper}. Writing & Sentence Formation` };
    default:
      return { section: 'C', title: 'Vocabulary', defaultName: `${upper}. Practice Exercise` };
  }
}

// Parse raw Excel rows into structured Exercises
export function parseExcelRowsToExercises(rows: any[]): Exercise[] {
  if (!rows || rows.length === 0) return [];

  // Group rows by Ma_Phan_Tap
  const grouped: Record<string, any[]> = {};

  rows.forEach((row, idx) => {
    // Normalise column names (support case insensitive and variations)
    const stt = row.STT ?? row.stt ?? idx + 1;
    const ma = (row.Ma_Phan_Tap || row.ma_phan_tap || row['Mã Phần Tập'] || row['Ma_Bai'] || 'C1').toString().trim().toUpperCase();
    const noiDung = (row.Noi_Dung_Cau_Hoi || row.noi_dung_cau_hoi || row['Nội Dung Câu Hỏi'] || row.Question || '').toString().trim();

    if (!noiDung) return; // Skip empty rows

    const dapAnA = (row.Dap_An_A ?? row.dap_an_a ?? row['A'] ?? '').toString().trim();
    const dapAnB = (row.Dap_An_B ?? row.dap_an_b ?? row['B'] ?? '').toString().trim();
    const dapAnC = (row.Dap_An_C ?? row.dap_an_c ?? row['C'] ?? '').toString().trim();
    const dapAnD = (row.Dap_An_D ?? row.dap_an_d ?? row['D'] ?? '').toString().trim();
    const dapAnDungRaw = (row.Dap_An_Dung ?? row.dap_an_dung ?? row['Đáp Án Đúng'] ?? row.Correct ?? '').toString().trim();
    const giaiThich = (row.Giai_Thich ?? row.giai_thich ?? row['Giải Thích'] ?? row.Explanation ?? '').toString().trim();

    // Media type & file
    const rawMediaType = (row.Media_Type ?? row.media_type ?? row['Media_Type'] ?? 'none').toString().trim().toLowerCase();
    let mediaType: MediaType = 'none';
    if (['image', 'img', 'picture', 'photo'].includes(rawMediaType)) mediaType = 'image';
    else if (['audio', 'mp3', 'sound', 'voice'].includes(rawMediaType)) mediaType = 'audio';
    else if (['video', 'mp4', 'clip'].includes(rawMediaType)) mediaType = 'video';

    const mediaFile = (row.Media_File ?? row.media_file ?? row['Media_File'] ?? '').toString().trim();

    if (!grouped[ma]) {
      grouped[ma] = [];
    }

    grouped[ma].push({
      stt,
      ma,
      noiDung,
      dapAnA,
      dapAnB,
      dapAnC,
      dapAnD,
      dapAnDungRaw,
      giaiThich,
      mediaType,
      mediaFile
    });
  });

  // Convert each group into an Exercise object
  const exercises: Exercise[] = [];

  Object.entries(grouped).forEach(([ma, questionRows]) => {
    const { section, title, defaultName } = getSectionDetails(ma);

    const questions: QuestionItem[] = questionRows.map((qRow, qIndex) => {
      // Build options array
      const options: string[] = [];
      if (qRow.dapAnA) options.push(`A. ${qRow.dapAnA}`);
      if (qRow.dapAnB) options.push(`B. ${qRow.dapAnB}`);
      if (qRow.dapAnC) options.push(`C. ${qRow.dapAnC}`);
      if (qRow.dapAnD) options.push(`D. ${qRow.dapAnD}`);

      // Map correct answer: If "A" or "A.", map to "A. ..." or direct text
      let mappedCorrect = qRow.dapAnDungRaw;
      const upperCorrect = qRow.dapAnDungRaw.toUpperCase().replace('.', '').trim();

      if (upperCorrect === 'A' && qRow.dapAnA) mappedCorrect = `A. ${qRow.dapAnA}`;
      else if (upperCorrect === 'B' && qRow.dapAnB) mappedCorrect = `B. ${qRow.dapAnB}`;
      else if (upperCorrect === 'C' && qRow.dapAnC) mappedCorrect = `C. ${qRow.dapAnC}`;
      else if (upperCorrect === 'D' && qRow.dapAnD) mappedCorrect = `D. ${qRow.dapAnD}`;
      else if (options.length > 0) {
        // Find matching option
        const matched = options.find(
          (opt) => opt.toLowerCase().includes(qRow.dapAnDungRaw.toLowerCase())
        );
        if (matched) mappedCorrect = matched;
      }

      return {
        id: `${ma}_${qRow.stt || qIndex + 1}`,
        questionText: qRow.noiDung,
        options: options.length > 0 ? options : undefined,
        correctAnswer: mappedCorrect,
        explanation: qRow.giaiThich,
        stt: qRow.stt,
        mediaType: qRow.mediaType,
        mediaFile: qRow.mediaFile
      };
    });

    // Check if this exercise has audio questions
    const hasAudio = questions.some((q) => q.mediaType === 'audio');

    exercises.push({
      id: ma,
      section,
      sectionTitle: title,
      name: defaultName,
      instruction: `Hoàn thành các câu hỏi trong phần ${ma}. Nhấp vào nút Nộp bài để kiểm tra đáp án.`,
      type: section === 'L' ? 'listening_mcq' : section === 'F' ? 'reading_mcq' : 'vocabulary_mcq',
      points: 10,
      questions,
      audioScript: hasAudio ? 'Audio track provided via uploaded media file.' : undefined
    });
  });

  return exercises;
}
