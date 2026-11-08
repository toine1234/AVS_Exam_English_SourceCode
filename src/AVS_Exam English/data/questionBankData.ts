import { QuestionBankItem, PeriodicExam, Grade } from '../types';

export const INITIAL_QUESTION_BANK: QuestionBankItem[] = [
  // ================= GLOBAL SUCCESS 6 - PHONICS =================
  {
    id: 'qb_g6_pho_01',
    bookSeries: 'Global Success 6',
    gradeLevel: 'Lớp 6',
    unitTag: 'Unit 1: My New School',
    skill: 'Phonics',
    sectionCode: 'A',
    maPhanTap: 'A1',
    questionText: 'Choose the word whose underlined part is pronounced differently from that of the others: study, rubber, ruler, subject',
    options: ['A. study', 'B. rubber', 'C. ruler', 'D. subject'],
    correctAnswer: 'C',
    explanation: '"ruler" có phần gạch chân phát âm là /uː/, còn "study", "rubber", "subject" phát âm là /ʌ/.',
    mediaType: 'none',
    difficulty: 'easy',
    createdAt: '2026-11-01'
  },
  {
    id: 'qb_g6_pho_02',
    bookSeries: 'Global Success 6',
    gradeLevel: 'Lớp 6',
    unitTag: 'Unit 1: My New School',
    skill: 'Phonics',
    sectionCode: 'A',
    maPhanTap: 'A1',
    questionText: 'Which word has the underlined "a" pronounced as /ɑː/?',
    options: ['A. smart', 'B. classmate', 'C. calculator', 'D. active'],
    correctAnswer: 'A',
    explanation: '"smart" phát âm là /smɑːt/ với âm /ɑː/, trong khi classmate (/eɪ/), calculator (/æ/), active (/æ/).',
    mediaType: 'none',
    difficulty: 'medium',
    createdAt: '2026-11-01'
  },
  {
    id: 'qb_g6_pho_03',
    bookSeries: 'Global Success 6',
    gradeLevel: 'Lớp 6',
    unitTag: 'Unit 2: My House',
    skill: 'Phonics',
    sectionCode: 'A',
    maPhanTap: 'A1',
    questionText: 'Which word has the final "-s" pronounced as /ɪz/?',
    options: ['A. houses', 'B. beds', 'C. clocks', 'D. lamps'],
    correctAnswer: 'A',
    explanation: 'Từ kết thúc bằng âm xát /s/ như "house" khi thêm "-s/-es" phát âm là /ɪz/ -> /ˈhaʊ.zɪz/.',
    mediaType: 'none',
    difficulty: 'medium',
    createdAt: '2026-11-01'
  },

  // ================= GLOBAL SUCCESS 6 - STRESS =================
  {
    id: 'qb_g6_str_01',
    bookSeries: 'Global Success 6',
    gradeLevel: 'Lớp 6',
    unitTag: 'Unit 1: My New School',
    skill: 'Stress',
    sectionCode: 'B',
    maPhanTap: 'B1',
    questionText: 'Which word has the main stress placed differently from the others?',
    options: ['A. compass', 'B. uniform', 'C. rubber', 'D. remember'],
    correctAnswer: 'D',
    explanation: '"remember" nhấn trọng âm ở âm tiết thứ 2 (re\'member), các từ còn lại nhấn âm 1.',
    mediaType: 'none',
    difficulty: 'medium',
    createdAt: '2026-11-01'
  },
  {
    id: 'qb_g6_str_02',
    bookSeries: 'Global Success 6',
    gradeLevel: 'Lớp 6',
    unitTag: 'Unit 3: My Friends',
    skill: 'Stress',
    sectionCode: 'B',
    maPhanTap: 'B1',
    questionText: 'Which word has the main stress placed on the first syllable?',
    options: ['A. creative', 'B. talkative', 'C. impatient', 'D. politely'],
    correctAnswer: 'B',
    explanation: '\'talkative nhấn âm 1, còn cre\'ative, im\'patient, po\'litely đều nhấn âm 2.',
    mediaType: 'none',
    difficulty: 'hard',
    createdAt: '2026-11-01'
  },

  // ================= GLOBAL SUCCESS 6 - VOCABULARY =================
  {
    id: 'qb_g6_voc_01',
    bookSeries: 'Global Success 6',
    gradeLevel: 'Lớp 6',
    unitTag: 'Unit 1: My New School',
    skill: 'Vocabulary',
    sectionCode: 'C',
    maPhanTap: 'C1',
    questionText: 'Students at a _______ school study and live there during the school year.',
    options: ['A. secondary', 'B. primary', 'C. boarding', 'D. international'],
    correctAnswer: 'C',
    explanation: '"boarding school" có nghĩa là trường nội trú, nơi học sinh ăn ở và học tập suốt năm học.',
    mediaType: 'none',
    difficulty: 'easy',
    createdAt: '2026-11-01'
  },
  {
    id: 'qb_g6_voc_02',
    bookSeries: 'Global Success 6',
    gradeLevel: 'Lớp 6',
    unitTag: 'Unit 1: My New School',
    skill: 'Vocabulary',
    sectionCode: 'C',
    maPhanTap: 'C2',
    questionText: 'Every afternoon, Duy and his classmates _______ judo in the school gymnasium.',
    options: ['A. play', 'B. do', 'C. study', 'D. have'],
    correctAnswer: 'B',
    explanation: 'Với các môn võ thuật hoặc hoạt động cá nhân không dùng bóng, ta dùng động từ "do" (do judo, do karate).',
    mediaType: 'none',
    difficulty: 'easy',
    createdAt: '2026-11-01'
  },
  {
    id: 'qb_g6_voc_03',
    bookSeries: 'Global Success 6',
    gradeLevel: 'Lớp 6',
    unitTag: 'Unit 2: My House',
    skill: 'Vocabulary',
    sectionCode: 'C',
    maPhanTap: 'C1',
    questionText: 'Look at the school plan: Which equipment is used to draw circles in geometry class?',
    options: ['A. Pencil sharpener', 'B. Compass', 'C. Ruler', 'D. Calculator'],
    correctAnswer: 'B',
    explanation: '"Compass" có nghĩa là cái com-pa, dùng để vẽ đường tròn trong môn hình học.',
    mediaType: 'image',
    mediaFile: 'school.png',
    difficulty: 'easy',
    createdAt: '2026-11-01'
  },
  {
    id: 'qb_g6_voc_04',
    bookSeries: 'Global Success 6',
    gradeLevel: 'Lớp 6',
    unitTag: 'Unit 3: My Friends',
    skill: 'Vocabulary',
    sectionCode: 'C',
    maPhanTap: 'C1',
    questionText: 'Mai is very _______. She always shares her food and school supplies with other classmates.',
    options: ['A. selfish', 'B. shy', 'C. kind and generous', 'D. lazy'],
    correctAnswer: 'C',
    explanation: '"kind and generous" (tốt bụng và hào phóng), phù hợp với hành động luôn sẻ chia đồ ăn và dụng cụ học tập.',
    mediaType: 'none',
    difficulty: 'easy',
    createdAt: '2026-11-01'
  },

  // ================= GLOBAL SUCCESS 6 - GRAMMAR =================
  {
    id: 'qb_g6_gra_01',
    bookSeries: 'Global Success 6',
    gradeLevel: 'Lớp 6',
    unitTag: 'Unit 1: My New School',
    skill: 'Grammar',
    sectionCode: 'D',
    maPhanTap: 'D1',
    questionText: 'Phong usually _______ his bicycle to school every morning, but today he is walking.',
    options: ['A. rides', 'B. is riding', 'C. rode', 'D. ride'],
    correctAnswer: 'A',
    explanation: 'Dấu hiệu "usually" chỉ thói quen trong hiện tại đơn, chủ ngữ "Phong" là ngôi thứ 3 số ít nên động từ chia là "rides".',
    mediaType: 'none',
    difficulty: 'easy',
    createdAt: '2026-11-01'
  },
  {
    id: 'qb_g6_gra_02',
    bookSeries: 'Global Success 6',
    gradeLevel: 'Lớp 6',
    unitTag: 'Unit 1: My New School',
    skill: 'Grammar',
    sectionCode: 'D',
    maPhanTap: 'D1',
    questionText: 'Choose the correct word order with adverbs of frequency:',
    options: [
      'A. She always is late for school.',
      'B. She is always late for school.',
      'C. She late always is for school.',
      'D. Always she is late for school.'
    ],
    correctAnswer: 'B',
    explanation: 'Quy tắc vị trí trạng từ chỉ tần suất: đứng sau động từ "to be" (is always late) và đứng trước động từ thường.',
    mediaType: 'none',
    difficulty: 'medium',
    createdAt: '2026-11-01'
  },
  {
    id: 'qb_g6_gra_03',
    bookSeries: 'Global Success 6',
    gradeLevel: 'Lớp 6',
    unitTag: 'Unit 1: My New School',
    skill: 'Grammar',
    sectionCode: 'D',
    maPhanTap: 'D4',
    questionText: 'Find the underlined part that needs correction: "There (A) are a large (B) computer room (C) on the third floor of (D) our school."',
    options: ['A. are', 'B. computer room', 'C. on', 'D. of'],
    correctAnswer: 'A',
    explanation: 'Vì danh từ phía sau là số ít "a large computer room", nên động từ to be phải là "is" thay vì "are".',
    mediaType: 'none',
    difficulty: 'medium',
    createdAt: '2026-11-01'
  },
  {
    id: 'qb_g6_gra_04',
    bookSeries: 'Global Success 6',
    gradeLevel: 'Lớp 6',
    unitTag: 'Unit 2: My House',
    skill: 'Grammar',
    sectionCode: 'D',
    maPhanTap: 'D1',
    questionText: 'There _______ two comfortable armchairs and a big television in the living room.',
    options: ['A. is', 'B. are', 'C. have', 'D. has'],
    correctAnswer: 'B',
    explanation: 'Cấu trúc "There are + danh từ số nhiều" (two comfortable armchairs).',
    mediaType: 'none',
    difficulty: 'easy',
    createdAt: '2026-11-01'
  },
  {
    id: 'qb_g6_gra_05',
    bookSeries: 'Global Success 6',
    gradeLevel: 'Lớp 6',
    unitTag: 'Unit 3: My Friends',
    skill: 'Grammar',
    sectionCode: 'D',
    maPhanTap: 'D1',
    questionText: 'Listen! Someone _______ at the front classroom door.',
    options: ['A. knocks', 'B. is knocking', 'C. knocked', 'D. knock'],
    correctAnswer: 'B',
    explanation: 'Dấu hiệu "Listen!" thể hiện hành động đang xảy ra tại thời điểm nói -> chia hiện tại tiếp diễn "is knocking".',
    mediaType: 'none',
    difficulty: 'easy',
    createdAt: '2026-11-01'
  },

  // ================= GLOBAL SUCCESS 6 - COMMUNICATION =================
  {
    id: 'qb_g6_com_01',
    bookSeries: 'Global Success 6',
    gradeLevel: 'Lớp 6',
    unitTag: 'Unit 1: My New School',
    skill: 'Communication',
    sectionCode: 'E',
    maPhanTap: 'E1',
    questionText: 'Teacher: "Good morning, class. Welcome to your new school year!" - Students: "_______"',
    options: [
      'A. You are welcome, teacher!',
      'B. Good morning, teacher. Nice to see you again!',
      'C. Yes, we are fine.',
      'D. Not at all, thank you.'
    ],
    correctAnswer: 'B',
    explanation: 'Lời chào trang trọng và lịch sự của học sinh đáp lại lời chào của giáo viên vào đầu năm học mới.',
    mediaType: 'none',
    difficulty: 'easy',
    createdAt: '2026-11-01'
  },
  {
    id: 'qb_g6_com_02',
    bookSeries: 'Global Success 6',
    gradeLevel: 'Lớp 6',
    unitTag: 'Unit 1: My New School',
    skill: 'Communication',
    sectionCode: 'E',
    maPhanTap: 'E1',
    questionText: 'An: "Can I borrow your pencil sharpener for a moment, please?" - Vy: "_______"',
    options: [
      'A. Yes, here you are.',
      'B. No, thanks.',
      'C. You are right.',
      'D. Never mind.'
    ],
    correctAnswer: 'A',
    explanation: '"Yes, here you are" (Vâng, của bạn đây) là lời đáp đồng ý khi bạn hỏi mượn đồ dùng học tập.',
    mediaType: 'none',
    difficulty: 'easy',
    createdAt: '2026-11-01'
  },

  // ================= GLOBAL SUCCESS 6 - LISTENING =================
  {
    id: 'qb_g6_lis_01',
    bookSeries: 'Global Success 6',
    gradeLevel: 'Lớp 6',
    unitTag: 'Unit 1: My New School',
    skill: 'Listening',
    sectionCode: 'L',
    maPhanTap: 'L1',
    questionText: 'Listen to the interview with Vy: What is Vy\'s favorite subject at An Son School?',
    options: ['A. History and Geography', 'B. English and Science', 'C. Mathematics and Art', 'D. Physical Education'],
    correctAnswer: 'B',
    explanation: 'Theo đoạn ghi âm bài học, Vy chia sẻ: "My favorite subjects are English and Science because I love experiments and languages."',
    mediaType: 'audio',
    mediaFile: 'listening_q1.mp3',
    passage: 'Audio Transcript: "Hello everyone, my name is Vy. I am a sixth-grader at An Son Secondary School. Our school has twenty modern classrooms. My favorite subjects are English and Science because our teachers make every lesson exciting!"',
    difficulty: 'medium',
    createdAt: '2026-11-01'
  },
  {
    id: 'qb_g6_lis_02',
    bookSeries: 'Global Success 6',
    gradeLevel: 'Lớp 6',
    unitTag: 'Unit 1: My New School',
    skill: 'Listening',
    sectionCode: 'L',
    maPhanTap: 'L1',
    questionText: 'Listen and choose TRUE or FALSE: "Students have to wear uniforms every school day."',
    options: ['A. TRUE', 'B. FALSE', 'C. NOT GIVEN', 'D. DOES NOT APPLY'],
    correctAnswer: 'A',
    explanation: 'Trong bài nghe, trường quy định học sinh mặc đồng phục từ thứ Hai đến thứ Sáu.',
    mediaType: 'audio',
    mediaFile: 'listening_q1.mp3',
    passage: 'Audio Transcript: "All students in our school wear uniform on weekdays: white shirts and dark blue trousers or skirts."',
    difficulty: 'easy',
    createdAt: '2026-11-01'
  },

  // ================= GLOBAL SUCCESS 6 - READING =================
  {
    id: 'qb_g6_rea_01',
    bookSeries: 'Global Success 6',
    gradeLevel: 'Lớp 6',
    unitTag: 'Unit 1: My New School',
    skill: 'Reading',
    sectionCode: 'F',
    maPhanTap: 'F1',
    questionText: 'Where is An Son Secondary School located according to the text?',
    options: [
      'A. In the noisy center of the city',
      'B. In a peaceful countryside village',
      'C. Next to a busy railway station',
      'D. On the top of a high mountain'
    ],
    correctAnswer: 'B',
    explanation: 'Dẫn chứng đoạn văn: "An Son is a boarding school surrounded by green mountains in a peaceful countryside village."',
    mediaType: 'none',
    passage: 'Reading Passage:\nAn Son is a beautiful secondary school situated in a peaceful countryside village surrounded by lush green hills. The school has twenty-five spacious classrooms equipped with projectors and air-conditioners. There is also a large computer lab and an open library with thousands of books. Students study in the morning and take part in various clubs like judo, art, and music in the afternoon. They always keep the school yard clean and tidy.',
    difficulty: 'easy',
    createdAt: '2026-11-01'
  },
  {
    id: 'qb_g6_rea_02',
    bookSeries: 'Global Success 6',
    gradeLevel: 'Lớp 6',
    unitTag: 'Unit 1: My New School',
    skill: 'Reading',
    sectionCode: 'F',
    maPhanTap: 'F1',
    questionText: 'What do students do in the afternoon at An Son School?',
    options: [
      'A. They sleep in the dormitory all afternoon.',
      'B. They take part in clubs like judo, art, and music.',
      'C. They go to the supermarket with their parents.',
      'D. They sit in exam rooms.'
    ],
    correctAnswer: 'B',
    explanation: 'Dẫn chứng: "Students study in the morning and take part in various clubs like judo, art, and music in the afternoon."',
    mediaType: 'none',
    passage: 'Reading Passage:\nAn Son is a beautiful secondary school situated in a peaceful countryside village surrounded by lush green hills. The school has twenty-five spacious classrooms equipped with projectors and air-conditioners. There is also a large computer lab and an open library with thousands of books. Students study in the morning and take part in various clubs like judo, art, and music in the afternoon. They always keep the school yard clean and tidy.',
    difficulty: 'medium',
    createdAt: '2026-11-01'
  },

  // ================= GLOBAL SUCCESS 6 - WRITING =================
  {
    id: 'qb_g6_wri_01',
    bookSeries: 'Global Success 6',
    gradeLevel: 'Lớp 6',
    unitTag: 'Unit 1: My New School',
    skill: 'Writing',
    sectionCode: 'H',
    maPhanTap: 'H1',
    questionText: 'Reorder the words to make a correct sentence: "has / thirty / my / classrooms / modern / school / ."',
    options: [
      'A. My school has thirty modern classrooms.',
      'B. My modern classrooms school has thirty.',
      'C. Thirty modern classrooms my school has.',
      'D. School has modern thirty classrooms my.'
    ],
    correctAnswer: 'A',
    explanation: 'Cấu trúc câu chuẩn: S (My school) + V (has) + O (thirty modern classrooms).',
    mediaType: 'none',
    difficulty: 'easy',
    createdAt: '2026-11-01'
  },
  {
    id: 'qb_g6_wri_02',
    bookSeries: 'Global Success 6',
    gradeLevel: 'Lớp 6',
    unitTag: 'Unit 1: My New School',
    skill: 'Writing',
    sectionCode: 'H',
    maPhanTap: 'H2',
    questionText: 'Rewrite: "There are forty students in my classroom." -> "My classroom _______."',
    options: [
      'A. has forty students',
      'B. is forty students',
      'C. have forty students',
      'D. there has forty students'
    ],
    correctAnswer: 'A',
    explanation: '"There are + số lượng + in S" = "S (số ít) + has + số lượng".',
    mediaType: 'none',
    difficulty: 'easy',
    createdAt: '2026-11-01'
  },

  // ================= CAMBRIDGE PET (B1 PRELIMINARY) =================
  {
    id: 'qb_pet_rea_01',
    bookSeries: 'Cambridge PET Objective',
    gradeLevel: 'PET (B1)',
    unitTag: 'Reading Part 1: Notices',
    skill: 'Reading',
    sectionCode: 'F',
    maPhanTap: 'F1',
    questionText: 'Notice: "LIBRARY NOTICE: Books must be returned to the front desk before 5:00 PM on Friday." What does the notice say?',
    options: [
      'A. The library is closed all day on Friday.',
      'B. You cannot borrow books on Friday afternoon.',
      'C. You have to give books back by 5:00 PM on Friday.',
      'D. Books can be returned on the weekend.'
    ],
    correctAnswer: 'C',
    explanation: '"Books must be returned before 5:00 PM" = "You have to give books back by 5:00 PM".',
    mediaType: 'none',
    difficulty: 'medium',
    createdAt: '2026-11-02'
  },
  {
    id: 'qb_pet_gra_01',
    bookSeries: 'Cambridge PET Objective',
    gradeLevel: 'PET (B1)',
    unitTag: 'Grammar: Present Perfect vs Past Simple',
    skill: 'Grammar',
    sectionCode: 'D',
    maPhanTap: 'D1',
    questionText: 'I _______ in this seaside town since I was eight years old.',
    options: ['A. lived', 'B. have lived', 'C. am living', 'D. was living'],
    correctAnswer: 'B',
    explanation: 'Với mốc thời gian "since + mệnh đề quá khứ đơn", ta dùng thì Hiện tại hoàn thành (have lived) để diễn tả hành động bắt đầu trong quá khứ và còn tiếp diễn.',
    mediaType: 'none',
    difficulty: 'medium',
    createdAt: '2026-11-02'
  },
  {
    id: 'qb_pet_gra_02',
    bookSeries: 'Cambridge PET Objective',
    gradeLevel: 'PET (B1)',
    unitTag: 'Grammar: Conditional Sentences',
    skill: 'Grammar',
    sectionCode: 'D',
    maPhanTap: 'D1',
    questionText: 'If it _______ tomorrow morning, we will cancel the outdoor cycling tour.',
    options: ['A. rains', 'B. will rain', 'C. rained', 'D. would rain'],
    correctAnswer: 'A',
    explanation: 'Câu điều kiện loại 1 (First Conditional): Mệnh đề If dùng Hiện tại đơn (rains), mệnh đề chính dùng "will + V-inf".',
    mediaType: 'none',
    difficulty: 'medium',
    createdAt: '2026-11-02'
  },
  {
    id: 'qb_pet_voc_01',
    bookSeries: 'Cambridge PET Objective',
    gradeLevel: 'PET (B1)',
    unitTag: 'Vocabulary: Travel & Accommodation',
    skill: 'Vocabulary',
    sectionCode: 'C',
    maPhanTap: 'C1',
    questionText: 'We decided to _______ a youth hostel near the train station to save money.',
    options: ['A. book', 'B. take', 'C. check', 'D. land'],
    correctAnswer: 'A',
    explanation: '"to book a hostel/hotel" có nghĩa là đặt phòng khách sạn/nhà trọ.',
    mediaType: 'none',
    difficulty: 'easy',
    createdAt: '2026-11-02'
  },
  {
    id: 'qb_pet_lis_01',
    bookSeries: 'Cambridge PET Objective',
    gradeLevel: 'PET (B1)',
    unitTag: 'Listening Part 2: Everyday Life',
    skill: 'Listening',
    sectionCode: 'L',
    maPhanTap: 'L1',
    questionText: 'Listen to the airport announcement: Where should passengers traveling to Rome go?',
    options: ['A. Gate 12', 'B. Gate 24', 'C. Baggage carousel 3', 'D. Information desk'],
    correctAnswer: 'B',
    explanation: 'Thông báo sân bay nêu rõ: "Passengers for flight AZ620 to Rome, please proceed immediately to Gate 24."',
    mediaType: 'audio',
    mediaFile: 'listening_q1.mp3',
    passage: 'Audio: "This is a final boarding call for flight AZ620 to Rome. All ticketed passengers please proceed to Gate 24. Doors will close in ten minutes."',
    difficulty: 'medium',
    createdAt: '2026-11-02'
  },
  {
    id: 'qb_pet_wri_01',
    bookSeries: 'Cambridge PET Objective',
    gradeLevel: 'PET (B1)',
    unitTag: 'Writing Part 1: Sentence Transformations',
    skill: 'Writing',
    sectionCode: 'H',
    maPhanTap: 'H2',
    questionText: 'The museum ticket was so expensive that we couldn\'t afford it. -> The ticket was _______ expensive for us to afford.',
    options: ['A. too', 'B. such', 'C. very', 'D. enough'],
    correctAnswer: 'A',
    explanation: 'Cấu trúc tương đương: "so + adj + that..." = "too + adj + for someone to do something".',
    mediaType: 'none',
    difficulty: 'hard',
    createdAt: '2026-11-02'
  },

  // ================= IELTS FOUNDATION =================
  {
    id: 'qb_ielts_rea_01',
    bookSeries: 'IELTS Cambridge Prep',
    gradeLevel: 'IELTS',
    unitTag: 'Academic Reading: Environment',
    skill: 'Reading',
    sectionCode: 'F',
    maPhanTap: 'F1',
    questionText: 'According to the paragraph, what is the primary consequence of urban deforestation?',
    options: [
      'A. Acceleration of local air pollution and urban heat island effects',
      'B. Decrease in public transportation use',
      'C. Immediate rise in agricultural yields',
      'D. Expansion of rural biodiversity'
    ],
    correctAnswer: 'A',
    explanation: 'Dẫn chứng học thuật: "Loss of canopy trees intensifies the urban heat island phenomenon and degrades regional air quality."',
    mediaType: 'none',
    passage: 'IELTS Academic Extract:\nUrbanization over the past three decades has drastically reduced canopy coverage across major metropolitan areas. Scientific investigations confirm that the loss of canopy trees intensifies the urban heat island phenomenon, resulting in a temperature increase of up to 4.5 degrees Celsius in densely populated quarters and degrading regional air quality.',
    difficulty: 'hard',
    createdAt: '2026-11-03'
  },
  {
    id: 'qb_ielts_gra_01',
    bookSeries: 'IELTS Cambridge Prep',
    gradeLevel: 'IELTS',
    unitTag: 'Grammar: Complex Sentences & Inversion',
    skill: 'Grammar',
    sectionCode: 'D',
    maPhanTap: 'D1',
    questionText: 'Seldom _______ such dramatic fluctuations in international commodity prices.',
    options: [
      'A. economists have witnessed',
      'B. have economists witnessed',
      'C. economists witnessing',
      'D. did economists witnessed'
    ],
    correctAnswer: 'B',
    explanation: 'Đảo ngữ với phó từ phủ định đứng đầu câu: "Seldom + trợ động từ (have) + S (economists) + V3 (witnessed)".',
    mediaType: 'none',
    difficulty: 'hard',
    createdAt: '2026-11-03'
  },
  {
    id: 'qb_ielts_voc_01',
    bookSeries: 'IELTS Cambridge Prep',
    gradeLevel: 'IELTS',
    unitTag: 'Vocabulary: Academic Word List',
    skill: 'Vocabulary',
    sectionCode: 'C',
    maPhanTap: 'C1',
    questionText: 'The proposed technological upgrade is expected to _______ overall productivity across the manufacturing chain.',
    options: ['A. enhance', 'B. deteriorate', 'C. suppress', 'D. obstruct'],
    correctAnswer: 'A',
    explanation: '"enhance" (nâng cao, gia tăng), thuộc nhóm từ vựng học thuật AWL mang nghĩa tích cực.',
    mediaType: 'none',
    difficulty: 'medium',
    createdAt: '2026-11-03'
  }
];

// ================= EXTENDED GRADES / COURSES =================
export const EXTENDED_GRADES: Grade[] = [
  {
    id: 6,
    name: 'Lớp 6',
    code: 'G6',
    description: 'Chương trình Tiếng Anh 6 - Global Success chuẩn Bộ Giáo Dục & Đào Tạo',
    category: 'thcs',
    units: []
  },
  {
    id: 7,
    name: 'Lớp 7',
    code: 'G7',
    description: 'Chương trình Tiếng Anh 7 - Global Success nâng cao năng lực giao tiếp & ngữ pháp',
    category: 'thcs',
    units: []
  },
  {
    id: 8,
    name: 'Lớp 8',
    code: 'G8',
    description: 'Chương trình Tiếng Anh 8 - Global Success phát triển toàn diện 4 kỹ năng',
    category: 'thcs',
    units: []
  },
  {
    id: 9,
    name: 'Lớp 9',
    code: 'G9',
    description: 'Chương trình Tiếng Anh 9 - Global Success ôn thi vào lớp 10 THPT công lập & chuyên',
    category: 'thcs',
    units: []
  },
  {
    id: 'pet',
    name: 'Luyện thi Cambridge PET (B1)',
    code: 'PET',
    description: 'Khóa luyện thi chứng chỉ quốc tế B1 Preliminary (PET) Cambridge dành cho học sinh THCS',
    category: 'cambridge',
    units: []
  },
  {
    id: 'ielts',
    name: 'Luyện thi IELTS Foundation',
    code: 'IELTS',
    description: 'Chương trình xây dựng nền tảng học thuật IELTS Band 4.5 - 6.0 cho học sinh',
    category: 'ielts',
    units: []
  }
];

// ================= PRESET PERIODIC EXAMS =================
export const INITIAL_PERIODIC_EXAMS: PeriodicExam[] = [
  {
    id: 'exam_g6_midterm_01',
    title: 'Bài kiểm tra 1 tiết Số 1 - Global Success 6 (Unit 1 & 2)',
    code: 'EXAM-G6-01',
    gradeLevel: 'Lớp 6',
    gradeId: 6,
    bookSeries: 'Global Success 6',
    durationMinutes: 45,
    totalQuestions: 15,
    maxScore: 10,
    skillMatrix: {
      Phonics: 3,
      Stress: 2,
      Vocabulary: 4,
      Grammar: 4,
      Reading: 2
    },
    questions: INITIAL_QUESTION_BANK.filter((q) => q.gradeLevel === 'Lớp 6').slice(0, 15),
    description: 'Đề kiểm tra định kỳ 45 phút bám sát cấu trúc đề thi giữa học kỳ I trường THCS chuẩn Bộ GD&ĐT.',
    createdAt: '2026-11-05',
    totalSubmissionsCount: 14,
    averageScore: 8.6
  },
  {
    id: 'exam_g6_quiz_15m',
    title: 'Đề khảo sát năng lực 15 phút - Grammar & Vocabulary Unit 1',
    code: 'QUIZ-G6-15M',
    gradeLevel: 'Lớp 6',
    gradeId: 6,
    bookSeries: 'Global Success 6',
    durationMinutes: 15,
    totalQuestions: 8,
    maxScore: 10,
    skillMatrix: {
      Vocabulary: 4,
      Grammar: 4
    },
    questions: INITIAL_QUESTION_BANK.filter(
      (q) => q.gradeLevel === 'Lớp 6' && (q.skill === 'Vocabulary' || q.skill === 'Grammar')
    ).slice(0, 8),
    description: 'Bài kiểm tra nhanh đầu giờ giúp học sinh củng cố thì Hiện tại đơn và từ vựng đồ dùng học tập.',
    createdAt: '2026-11-06',
    totalSubmissionsCount: 22,
    averageScore: 9.1
  },
  {
    id: 'exam_pet_mock_01',
    title: 'Đề thi thử Cambridge PET (B1) - Reading & Grammar Mock Test 1',
    code: 'MOCK-PET-01',
    gradeLevel: 'PET (B1)',
    gradeId: 'pet',
    bookSeries: 'Cambridge PET Objective',
    durationMinutes: 45,
    totalQuestions: 6,
    maxScore: 10,
    skillMatrix: {
      Reading: 2,
      Grammar: 2,
      Vocabulary: 1,
      Listening: 1
    },
    questions: INITIAL_QUESTION_BANK.filter((q) => q.gradeLevel === 'PET (B1)'),
    description: 'Đề thi thử định dạng chuẩn Cambridge Preliminary for Schools với các phần đọc thông báo, ngữ pháp và nghe.',
    createdAt: '2026-11-07',
    totalSubmissionsCount: 8,
    averageScore: 8.2
  }
];
