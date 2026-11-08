import { Grade, Unit, Exercise } from '../types';

export const DEFAULT_UNIT_1_GRADE_6_EXERCISES: Exercise[] = [
  // ================= A. PHONICS (A1, A2) =================
  {
    id: 'A1',
    section: 'A',
    sectionTitle: 'Phonics',
    name: 'A1. Pronunciation: Different sound in the underlined part',
    instruction: 'Choose the word whose underlined part is pronounced differently from that of the others. (Chọn từ có phần gạch chân phát âm khác)',
    type: 'phonics_mcq',
    points: 10,
    questions: [
      {
        id: 'A1_1',
        questionText: '1. Which word has the underlined "u" pronounced differently?',
        options: ['A. study', 'B. rubber', 'C. ruler', 'D. subject'],
        correctAnswer: 'C. ruler',
        explanation: '"ruler" có âm /uː/, trong khi "study", "rubber", "subject" có âm /ʌ/.'
      },
      {
        id: 'A1_2',
        questionText: '2. Which word has the underlined "a" pronounced differently?',
        options: ['A. smart', 'B. class', 'C. father', 'D. classmate'],
        correctAnswer: 'D. classmate',
        explanation: '"classmate" có âm /eɪ/ ở đuôi "-mate", còn "smart", "class", "father" phát âm là /ɑː/.'
      },
      {
        id: 'A1_3',
        questionText: '3. Which word has the underlined "o" pronounced differently?',
        options: ['A. compass', 'B. month', 'C. mother', 'D. post'],
        correctAnswer: 'D. post',
        explanation: '"post" có âm /əʊ/, các từ còn lại "compass", "month", "mother" phát âm là /ʌ/.'
      },
      {
        id: 'A1_4',
        questionText: '4. Which word has the underlined "ar" pronounced differently?',
        options: ['A. star', 'B. park', 'C. sharpener', 'D. warm'],
        correctAnswer: 'D. warm',
        explanation: '"warm" có âm /ɔː/, trong khi "star", "park", "sharpener" có âm /ɑː/.'
      },
      {
        id: 'A1_5',
        questionText: '5. Which word has the underlined part pronounced differently?',
        options: ['A. brother', 'B. cupboard', 'C. judo', 'D. funny'],
        correctAnswer: 'C. judo',
        explanation: '"judo" có âm /uː/, còn "brother", "cupboard", "funny" có âm /ʌ/.'
      }
    ]
  },
  {
    id: 'A2',
    section: 'A',
    sectionTitle: 'Phonics',
    name: 'A2. Sound Classification: /ɑː/ and /ʌ/',
    instruction: 'Classify the following words into two columns according to their vowel sound /ɑː/ or /ʌ/. (Phân loại các từ sau vào hai nhóm âm)',
    type: 'phonics_classify',
    points: 10,
    columns: [
      { key: 'sound_a_long', label: 'Sound /ɑː/ (âm a dài)', soundIpa: '/ɑː/' },
      { key: 'sound_wedge', label: 'Sound /ʌ/ (âm á ngắn)', soundIpa: '/ʌ/' }
    ],
    wordBank: ['smart', 'subject', 'class', 'rubber', 'garden', 'lunch', 'star', 'brother'],
    questions: [
      {
        id: 'A2_smart',
        questionText: 'smart',
        options: ['sound_a_long', 'sound_wedge'],
        correctAnswer: 'sound_a_long',
        explanation: '/smɑːt/ thuộc nhóm âm /ɑː/'
      },
      {
        id: 'A2_subject',
        questionText: 'subject',
        options: ['sound_a_long', 'sound_wedge'],
        correctAnswer: 'sound_wedge',
        explanation: '/ˈsʌbdʒɪkt/ thuộc nhóm âm /ʌ/'
      },
      {
        id: 'A2_class',
        questionText: 'class',
        options: ['sound_a_long', 'sound_wedge'],
        correctAnswer: 'sound_a_long',
        explanation: '/klɑːs/ thuộc nhóm âm /ɑː/'
      },
      {
        id: 'A2_rubber',
        questionText: 'rubber',
        options: ['sound_a_long', 'sound_wedge'],
        correctAnswer: 'sound_wedge',
        explanation: '/ˈrʌbə/ thuộc nhóm âm /ʌ/'
      },
      {
        id: 'A2_garden',
        questionText: 'garden',
        options: ['sound_a_long', 'sound_wedge'],
        correctAnswer: 'sound_a_long',
        explanation: '/ˈɡɑːdn/ thuộc nhóm âm /ɑː/'
      },
      {
        id: 'A2_lunch',
        questionText: 'lunch',
        options: ['sound_a_long', 'sound_wedge'],
        correctAnswer: 'sound_wedge',
        explanation: '/lʌntʃ/ thuộc nhóm âm /ʌ/'
      },
      {
        id: 'A2_star',
        questionText: 'star',
        options: ['sound_a_long', 'sound_wedge'],
        correctAnswer: 'sound_a_long',
        explanation: '/stɑː/ thuộc nhóm âm /ɑː/'
      },
      {
        id: 'A2_brother',
        questionText: 'brother',
        options: ['sound_a_long', 'sound_wedge'],
        correctAnswer: 'sound_wedge',
        explanation: '/ˈbrʌðə/ thuộc nhóm âm /ʌ/'
      }
    ]
  },

  // ================= B. STRESS (B1) =================
  {
    id: 'B1',
    section: 'B',
    sectionTitle: 'Stress',
    name: 'B1. Word Stress: Different primary stress',
    instruction: 'Choose the word that has a different stress pattern from the others. (Chọn từ có trọng âm chính khác với các từ còn lại)',
    type: 'stress_mcq',
    points: 10,
    questions: [
      {
        id: 'B1_1',
        questionText: '1. Select the word with a different stress position:',
        options: ['A. compass', 'B. uniform', 'C. rubber', 'D. remember'],
        correctAnswer: 'D. remember',
        explanation: '"remember" nhấn trọng âm 2 (/rɪˈmembə/), còn lại "compass", "uniform", "rubber" nhấn trọng âm 1.'
      },
      {
        id: 'B1_2',
        questionText: '2. Select the word with a different stress position:',
        options: ['A. boarding', 'B. creative', 'C. pencil', 'D. subject'],
        correctAnswer: 'B. creative',
        explanation: '"creative" nhấn trọng âm 2 (/kriˈeɪtɪv/), còn lại đều nhấn trọng âm 1.'
      },
      {
        id: 'B1_3',
        questionText: '3. Select the word with a different stress position:',
        options: ['A. activity', 'B. calculator', 'C. classmate', 'D. textbook'],
        correctAnswer: 'A. activity',
        explanation: '"activity" nhấn âm 2 (/ækˈtɪvəti/), còn lại đều nhấn âm 1.'
      },
      {
        id: 'B1_4',
        questionText: '4. Select the word with a different stress position:',
        options: ['A. equipment', 'B. excited', 'C. favourite', 'D. surrounding'],
        correctAnswer: 'C. favourite',
        explanation: '"favourite" nhấn âm 1 (/ˈfeɪvərɪt/), các từ còn lại nhấn âm 2.'
      },
      {
        id: 'B1_5',
        questionText: '5. Select the word with a different stress position:',
        options: ['A. international', 'B. secondary', 'C. library', 'D. history'],
        correctAnswer: 'A. international',
        explanation: '"international" nhấn trọng âm 3 (/ˌɪntəˈnæʃnəl/), các từ còn lại nhấn trọng âm 1.'
      }
    ]
  },

  // ================= C. VOCABULARY (C1-C4) =================
  {
    id: 'C1',
    section: 'C',
    sectionTitle: 'Vocabulary',
    name: 'C1. School Vocabulary in Context',
    instruction: 'Choose the best answer A, B, C or D to complete each sentence. (Chọn đáp án đúng nhất)',
    type: 'vocabulary_mcq',
    points: 10,
    questions: [
      {
        id: 'C1_1',
        questionText: '1. Students in Vietnam usually wear their school _______ on Mondays.',
        options: ['A. uniform', 'B. clothes', 'C. bags', 'D. shoes'],
        correctAnswer: 'A. uniform',
        explanation: '"school uniform" nghĩa là đồng phục học sinh.'
      },
      {
        id: 'C1_2',
        questionText: '2. I need a _______ to draw circles for my geometry lesson.',
        options: ['A. calculator', 'B. compass', 'C. rubber', 'D. sharpener'],
        correctAnswer: 'B. compass',
        explanation: '"compass" nghĩa là compa (dùng để vẽ hình tròn trong môn hình học).'
      },
      {
        id: 'C1_3',
        questionText: '3. In a _______ school, students study and live there during the week.',
        options: ['A. modern', 'B. private', 'C. boarding', 'D. primary'],
        correctAnswer: 'C. boarding',
        explanation: '"boarding school" nghĩa là trường nội trú.'
      },
      {
        id: 'C1_4',
        questionText: '4. At break time, we can borrow books from the school _______.',
        options: ['A. computer room', 'B. canteen', 'C. gym', 'D. library'],
        correctAnswer: 'D. library',
        explanation: '"library" là thư viện, nơi học sinh mượn sách.'
      },
      {
        id: 'C1_5',
        questionText: '5. Look at the school illustration below. My new school is surrounded by green mountains and _______ fields.',
        options: ['A. large', 'B. quiet', 'C. peaceful', 'D. modern'],
        correctAnswer: 'C. peaceful',
        explanation: '"peaceful fields" là những cánh đồng yên bình.',
        mediaType: 'image',
        mediaFile: 'school.png'
      }
    ]
  },
  {
    id: 'C2',
    section: 'C',
    sectionTitle: 'Vocabulary',
    name: 'C2. Verb Collocations: PLAY / DO / STUDY / HAVE',
    instruction: 'Choose the correct verb (PLAY, DO, STUDY or HAVE) that goes with each noun. (Chọn động từ thích hợp đi kèm danh từ)',
    type: 'vocabulary_matching',
    points: 10,
    questions: [
      {
        id: 'C2_1',
        questionText: '1. _______ judo / karate / exercise',
        options: ['play', 'do', 'study', 'have'],
        correctAnswer: 'do',
        explanation: 'Ta dùng động từ "do" với các môn võ và bài tập: do judo, do exercise.'
      },
      {
        id: 'C2_2',
        questionText: '2. _______ football / badminton / chess',
        options: ['play', 'do', 'study', 'have'],
        correctAnswer: 'play',
        explanation: 'Ta dùng "play" với các môn thể thao có bóng hoặc trò chơi đối kháng: play football, play chess.'
      },
      {
        id: 'C2_3',
        questionText: '3. _______ English / history / science',
        options: ['play', 'do', 'study', 'have'],
        correctAnswer: 'study',
        explanation: 'Ta dùng "study" với các môn học: study English, study history.'
      },
      {
        id: 'C2_4',
        questionText: '4. _______ breakfast / lunch / a lesson',
        options: ['play', 'do', 'study', 'have'],
        correctAnswer: 'have',
        explanation: 'Ta dùng "have" với các bữa ăn và tiết học: have breakfast, have a lesson.'
      },
      {
        id: 'C2_5',
        questionText: '5. _______ homework / projects',
        options: ['play', 'do', 'study', 'have'],
        correctAnswer: 'do',
        explanation: 'Ta dùng "do" với bài tập về nhà: do homework, do projects.'
      }
    ]
  },
  {
    id: 'C3',
    section: 'C',
    sectionTitle: 'Vocabulary',
    name: 'C3. Fill in the Blanks with Words from the Box',
    instruction: 'Complete each sentence with a suitable word from the box: [creative, excited, equipment, classmates, international]. (Điền từ trong khung vào chỗ trống)',
    type: 'vocabulary_fill',
    points: 10,
    wordBank: ['creative', 'excited', 'equipment', 'classmates', 'international'],
    questions: [
      {
        id: 'C3_1',
        questionText: '1. All students are very _______ about their first day at secondary school.',
        correctAnswer: 'excited',
        explanation: '"be excited about" có nghĩa là hào hứng, phấn khích về điều gì.'
      },
      {
        id: 'C3_2',
        questionText: '2. My new school has modern _______ in the science laboratory and gym.',
        correctAnswer: 'equipment',
        explanation: '"equipment" là trang thiết bị học tập/thể thao.'
      },
      {
        id: 'C3_3',
        questionText: '3. Linh is a _______ girl; she paints beautiful pictures and writes poems.',
        correctAnswer: 'creative',
        explanation: '"creative" nghĩa là có tính sáng tạo.'
      },
      {
        id: 'C3_4',
        questionText: '4. Students from many countries study at this _______ school in Hanoi.',
        correctAnswer: 'international',
        explanation: '"international school" là trường quốc tế.'
      },
      {
        id: 'C3_5',
        questionText: '5. My _______ are friendly and always help me with difficult exercises.',
        correctAnswer: 'classmates',
        explanation: '"classmates" là những bạn cùng lớp.'
      }
    ]
  },
  {
    id: 'C4',
    section: 'C',
    sectionTitle: 'Vocabulary',
    name: 'C4. Odd One Out: School Terms',
    instruction: 'Circle the odd one out in each group. (Chọn từ không cùng nhóm với các từ còn lại)',
    type: 'vocabulary_odd',
    points: 10,
    questions: [
      {
        id: 'C4_1',
        questionText: '1. Group 1:',
        options: ['A. compass', 'B. pencil sharpener', 'C. teacher', 'D. rubber'],
        correctAnswer: 'C. teacher',
        explanation: '"teacher" (giáo viên) là người, còn lại là đồ dùng học tập.'
      },
      {
        id: 'C4_2',
        questionText: '2. Group 2:',
        options: ['A. science', 'B. physics', 'C. history', 'D. football'],
        correctAnswer: 'D. football',
        explanation: '"football" là môn thể thao, còn lại là môn học.'
      },
      {
        id: 'C4_3',
        questionText: '3. Group 3:',
        options: ['A. playing', 'B. studying', 'C. classroom', 'D. doing'],
        correctAnswer: 'C. classroom',
        explanation: '"classroom" là danh từ chỉ nơi chốn, còn lại là dạng V-ing của động từ.'
      },
      {
        id: 'C4_4',
        questionText: '4. Group 4:',
        options: ['A. friendly', 'B. smart', 'C. uniform', 'D. creative'],
        correctAnswer: 'C. uniform',
        explanation: '"uniform" là danh từ (đồng phục), còn lại là tính từ miêu tả tính cách.'
      },
      {
        id: 'C4_5',
        questionText: '5. Group 5:',
        options: ['A. library', 'B. cafeteria', 'C. laboratory', 'D. judo'],
        correctAnswer: 'D. judo',
        explanation: '"judo" là môn võ, còn lại là phòng/khu vực trong trường học.'
      }
    ]
  },

  // ================= D. GRAMMAR (D1-D4) =================
  {
    id: 'D1',
    section: 'D',
    sectionTitle: 'Grammar',
    name: 'D1. Present Simple & Adverbs of Frequency MCQ',
    instruction: 'Choose the best answer A, B, C or D to complete each sentence. (Chọn đáp án đúng nhất về thì Hiện tại đơn & Trạng từ chỉ tần suất)',
    type: 'grammar_mcq',
    points: 10,
    questions: [
      {
        id: 'D1_1',
        questionText: '1. Minh _______ judo with his club every Wednesday afternoon.',
        options: ['A. plays', 'B. does', 'C. studies', 'D. has'],
        correctAnswer: 'B. does',
        explanation: 'Chủ ngữ "Minh" số ít, đi với môn võ judo dùng "does".'
      },
      {
        id: 'D1_2',
        questionText: '2. My brother _______ late for school. He is very punctual.',
        options: ['A. is never', 'B. never is', 'C. doesn\'t never', 'D. is always'],
        correctAnswer: 'A. is never',
        explanation: 'Trạng từ chỉ tần suất đứng SAU động từ to be: "is never late".'
      },
      {
        id: 'D1_3',
        questionText: '3. _______ they live near the secondary school?',
        options: ['A. Are', 'B. Does', 'C. Do', 'D. Is'],
        correctAnswer: 'C. Do',
        explanation: 'Chủ ngữ "they" với động từ thường "live" ở thì Hiện tại đơn dùng trợ động từ "Do".'
      },
      {
        id: 'D1_4',
        questionText: '4. Lan usually _______ her homework before having dinner.',
        options: ['A. do', 'B. does', 'C. is doing', 'D. doing'],
        correctAnswer: 'B. does',
        explanation: 'Chủ ngữ "Lan" ngôi thứ ba số ít, thì Hiện tại đơn thêm -es thành "does".'
      },
      {
        id: 'D1_5',
        questionText: '5. We _______ to the school library on Saturdays because it is closed.',
        options: ['A. don\'t go', 'B. doesn\'t go', 'C. not go', 'D. aren\'t going'],
        correctAnswer: 'A. don\'t go',
        explanation: 'Chủ ngữ "We" số nhiều ở câu phủ định thì Hiện tại đơn dùng "don\'t go".'
      }
    ]
  },
  {
    id: 'D2',
    section: 'D',
    sectionTitle: 'Grammar',
    name: 'D2. Verb Conjugation in Brackets',
    instruction: 'Put the verbs in brackets into the correct form (Present simple). (Chia động từ trong ngoặc ở thì Hiện tại đơn)',
    type: 'grammar_verb',
    points: 10,
    questions: [
      {
        id: 'D2_1',
        questionText: '1. Hoa (study) _______ English for an hour every evening.',
        correctAnswer: 'studies',
        explanation: 'Hoa (ngôi 3 số ít): "study" tận cùng bằng phụ âm + y đổi thành "studies".'
      },
      {
        id: 'D2_2',
        questionText: '2. My parents (not watch) _______ television after 10 p.m.',
        correctAnswer: 'do not watch',
        explanation: 'My parents là chủ ngữ số nhiều, phủ định: "do not watch" (hoặc "don\'t watch").'
      },
      {
        id: 'D2_3',
        questionText: '3. Where (you / buy) _______ these colourful school notebooks?',
        correctAnswer: 'do you buy',
        explanation: 'Câu hỏi thì hiện tại đơn với you: "Where do you buy...".'
      },
      {
        id: 'D2_4',
        questionText: '4. Mr. Nam (teach) _______ physics at our new secondary school.',
        correctAnswer: 'teaches',
        explanation: 'Mr. Nam là ngôi 3 số ít: động từ kết thúc bằng -ch thêm -es thành "teaches".'
      },
      {
        id: 'D2_5',
        questionText: '5. What time (the lesson / start) _______ in the morning?',
        correctAnswer: 'does the lesson start',
        explanation: 'The lesson là số ít: "does the lesson start".'
      }
    ]
  },
  {
    id: 'D3',
    section: 'D',
    sectionTitle: 'Grammar',
    name: 'D3. Sentences with Adverbs of Frequency',
    instruction: 'Rewrite the sentences placing the adverb in brackets in the correct position. (Đặt trạng từ chỉ tần suất vào đúng vị trí)',
    type: 'grammar_adverbs',
    points: 10,
    questions: [
      {
        id: 'D3_1',
        questionText: '1. I ride my bicycle to school. (always)',
        options: [
          'A. I always ride my bicycle to school.',
          'B. Always I ride my bicycle to school.',
          'C. I ride always my bicycle to school.',
          'D. I ride my bicycle always to school.'
        ],
        correctAnswer: 'A. I always ride my bicycle to school.',
        explanation: 'Trạng từ chỉ tần suất "always" đứng trước động từ thường "ride".'
      },
      {
        id: 'D3_2',
        questionText: '2. Duy is cheerful and helpful to his friends. (usually)',
        options: [
          'A. Duy usually is cheerful and helpful to his friends.',
          'B. Duy is usually cheerful and helpful to his friends.',
          'C. Usually Duy is cheerful and helpful to his friends.',
          'D. Duy is cheerful usually and helpful to his friends.'
        ],
        correctAnswer: 'B. Duy is usually cheerful and helpful to his friends.',
        explanation: 'Trạng từ chỉ tần suất đứng sau động từ to be "is".'
      },
      {
        id: 'D3_3',
        questionText: '3. My classmates do judo in the school gym. (often)',
        options: [
          'A. My classmates often do judo in the school gym.',
          'B. My classmates do often judo in the school gym.',
          'C. Often my classmates do judo in the school gym.',
          'D. My classmates do judo often in the school gym.'
        ],
        correctAnswer: 'A. My classmates often do judo in the school gym.',
        explanation: '"often" đứng trước động từ thường "do".'
      },
      {
        id: 'D3_4',
        questionText: '4. They do not eat fast food for lunch. (rarely -> rewrite affirmative: They rarely eat...)',
        options: [
          'A. They rarely eat fast food for lunch.',
          'B. They eat rarely fast food for lunch.',
          'C. Rarely they eat fast food for lunch.',
          'D. They do rarely eat fast food for lunch.'
        ],
        correctAnswer: 'A. They rarely eat fast food for lunch.',
        explanation: '"rarely" mang nghĩa hiếm khi, đứng trước động từ thường "eat".'
      },
      {
        id: 'D3_5',
        questionText: '5. We are bored in English class. (never)',
        options: [
          'A. We never are bored in English class.',
          'B. We are never bored in English class.',
          'C. Never we are bored in English class.',
          'D. We are bored never in English class.'
        ],
        correctAnswer: 'B. We are never bored in English class.',
        explanation: '"never" đứng sau động từ to be "are": "We are never bored...".'
      }
    ]
  },
  {
    id: 'D4',
    section: 'D',
    sectionTitle: 'Grammar',
    name: 'D4. Find and Correct the Mistake',
    instruction: 'Find the underlined part that has an error and identify the correct word. (Tìm và sửa lỗi sai trong câu)',
    type: 'grammar_error',
    points: 10,
    questions: [
      {
        id: 'D4_1',
        questionText: '1. She play the piano very well with her music teacher on Sundays.',
        options: [
          'A. play -> plays',
          'B. very well -> good',
          'C. with -> to',
          'D. on -> at'
        ],
        correctAnswer: 'A. play -> plays',
        explanation: 'Chủ ngữ "She" ngôi thứ 3 số ít, động từ cần chia là "plays".'
      },
      {
        id: 'D4_2',
        questionText: '2. Does your new school has a large football pitch?',
        options: [
          'A. Does -> Do',
          'B. has -> have',
          'C. large -> largely',
          'D. football -> foot'
        ],
        correctAnswer: 'B. has -> have',
        explanation: 'Trong câu hỏi có trợ động từ "Does", động từ chính đưa về nguyên mẫu "have".'
      },
      {
        id: 'D4_3',
        questionText: '3. He always is eager to participate in school outdoor activities.',
        options: [
          'A. always is -> is always',
          'B. eager -> eagerly',
          'C. to participate -> participating',
          'D. in -> on'
        ],
        correctAnswer: 'A. always is -> is always',
        explanation: 'Trạng từ chỉ tần suất phải đứng SAU động từ to be: "is always".'
      },
      {
        id: 'D4_4',
        questionText: '4. We doesn\'t have lessons on Saturday mornings.',
        options: [
          'A. doesn\'t -> don\'t',
          'B. have -> has',
          'C. on -> in',
          'D. mornings -> morning'
        ],
        correctAnswer: 'A. doesn\'t -> don\'t',
        explanation: 'Chủ ngữ "We" số nhiều, câu phủ định dùng "don\'t have".'
      },
      {
        id: 'D4_5',
        questionText: '5. How often do your father drive you to your secondary school?',
        options: [
          'A. How often -> How many',
          'B. do -> does',
          'C. drive -> drives',
          'D. to -> at'
        ],
        correctAnswer: 'B. do -> does',
        explanation: '"your father" là danh từ số ít, trợ động từ câu hỏi phải là "does".'
      }
    ]
  },

  // ================= E. COMMUNICATION (E1) =================
  {
    id: 'E1',
    section: 'E',
    sectionTitle: 'Communication',
    name: 'E1. Everyday English & Social Interactions',
    instruction: 'Choose the most suitable response to complete each everyday conversation. (Chọn câu trả lời giao tiếp phù hợp nhất)',
    type: 'communication_mcq',
    points: 10,
    questions: [
      {
        id: 'E1_1',
        questionText: '1. Vy: "Hi, I\'m Vy. Nice to meet you!" - Duy: "_______"',
        options: [
          'A. Good morning, Miss Hoa.',
          'B. Nice to meet you too, Vy.',
          'C. I am eleven years old.',
          'D. Yes, I do.'
        ],
        correctAnswer: 'B. Nice to meet you too, Vy.',
        explanation: 'Đáp lại lời chào làm quen "Nice to meet you" là "Nice to meet you too".'
      },
      {
        id: 'E1_2',
        questionText: '2. Phong: "Can I borrow your pencil sharpener, please?" - Mai: "_______"',
        options: [
          'A. Sure, here you are.',
          'B. Yes, I like pencil.',
          'C. You are welcome.',
          'D. No, I am not.'
        ],
        correctAnswer: 'A. Sure, here you are.',
        explanation: 'Khi ai đó mượn đồ lịch sự, trả lời đồng ý: "Sure, here you are." (Chắc chắn rồi, của bạn đây).'
      },
      {
        id: 'E1_3',
        questionText: '3. Teacher: "Welcome back to school, everyone!" - Students: "_______"',
        options: [
          'A. See you again.',
          'B. Thank you, teacher!',
          'C. Yes, we are late.',
          'D. Bye bye.'
        ],
        correctAnswer: 'B. Thank you, teacher!',
        explanation: 'Đáp lại lời chào mừng của thầy cô giáo là "Thank you, teacher!".'
      },
      {
        id: 'E1_4',
        questionText: '4. Nam: "Would you like to have lunch with us at the canteen?" - Minh: "_______"',
        options: [
          'A. Yes, I\'d love to. Thanks!',
          'B. No, I do.',
          'C. I like lunch very much.',
          'D. It is twelve o\'clock.'
        ],
        correctAnswer: 'A. Yes, I\'d love to. Thanks!',
        explanation: 'Lời mời "Would you like to...?" đáp lại bằng "Yes, I\'d love to. Thanks!".'
      },
      {
        id: 'E1_5',
        questionText: '5. An: "What is your favourite subject at school?" - Nick: "_______"',
        options: [
          'A. I like playing football.',
          'B. English and Science.',
          'C. At seven thirty.',
          'D. By school bus.'
        ],
        correctAnswer: 'B. English and Science.',
        explanation: 'Câu hỏi môn học yêu thích "What is your favourite subject?" trả lời bằng tên môn học.'
      }
    ]
  },

  // ================= L. LISTENING (L1-L3) =================
  {
    id: 'L1',
    section: 'L',
    sectionTitle: 'Listening',
    name: 'L1. Listening Comprehension: An\'s New School',
    instruction: 'Listen to An talking about his new school and choose the best answer (A, B, or C). (Nghe đoạn băng và chọn đáp án đúng)',
    type: 'listening_mcq',
    points: 10,
    audioScript: 'Hello, my name is An. I am a student at Sunrise Lower Secondary School. My school is in the centre of Da Nang city. It is very modern and beautiful. There are 25 classrooms, a big science lab, and a spacious library with thousands of books. My favourite place is the playground because I can play badminton and basketball with my classmates after class. We usually wear our uniform on Mondays and Thursdays. I love my new school very much!',
    questions: [
      {
        id: 'L1_1',
        questionText: '1. What is the name of An\'s new secondary school?',
        options: ['A. Dream School', 'B. Sunrise Lower Secondary School', 'C. Da Nang High School'],
        correctAnswer: 'B. Sunrise Lower Secondary School',
        explanation: 'An nói: "I am a student at Sunrise Lower Secondary School."'
      },
      {
        id: 'L1_2',
        questionText: '2. Where is An\'s school located?',
        options: ['A. In the countryside', 'B. In the centre of Da Nang city', 'C. Near the beach in Hue'],
        correctAnswer: 'B. In the centre of Da Nang city',
        explanation: 'An nói: "My school is in the centre of Da Nang city."'
      },
      {
        id: 'L1_3',
        questionText: '3. How many classrooms are there in An\'s school?',
        options: ['A. 15 classrooms', 'B. 20 classrooms', 'C. 25 classrooms'],
        correctAnswer: 'C. 25 classrooms',
        explanation: 'An nói: "There are 25 classrooms..."'
      },
      {
        id: 'L1_4',
        questionText: '4. What is An\'s favourite place in the school?',
        options: ['A. The science lab', 'B. The playground', 'C. The library'],
        correctAnswer: 'B. The playground',
        explanation: 'An nói: "My favourite place is the playground because I can play badminton..."'
      },
      {
        id: 'L1_5',
        questionText: '5. When do students wear their school uniform?',
        options: ['A. Every single day', 'B. On Mondays and Thursdays', 'C. Only on Fridays'],
        correctAnswer: 'B. On Mondays and Thursdays',
        explanation: 'An nói: "We usually wear our uniform on Mondays and Thursdays."'
      }
    ]
  },
  {
    id: 'L2',
    section: 'L',
    sectionTitle: 'Listening',
    name: 'L2. Listening True or False: Vy and Duy Conversation',
    instruction: 'Listen to the conversation between Vy and Duy and decide whether each statement is True (T) or False (F). (Nghe hội thoại và xác định Đúng hoặc Sai)',
    type: 'listening_tf',
    points: 10,
    audioScript: 'Vy: Hi Duy, are you ready for our new school year? Duy: Hi Vy! Yes, I am very excited. I bought a new backpack and lots of coloured pens. Vy: Wow, that is great! Do you know our new timetable? Duy: Yes, we have English, Math, and Science on Monday morning. And in the afternoon, we do sports. Vy: Do you study judo in the gym? Duy: No, I don\'t. I play basketball with Phong and Nam. But Lan does judo on Tuesdays. Vy: That sounds fun! Let\'s ride our bicycles together tomorrow morning.',
    questions: [
      {
        id: 'L2_1',
        questionText: '1. Duy feels nervous about his new school year.',
        options: ['True (T)', 'False (F)'],
        correctAnswer: 'False (F)',
        explanation: 'False - Duy nói "Yes, I am very excited" (rất hào hứng, không phải nervous).'
      },
      {
        id: 'L2_2',
        questionText: '2. On Monday morning, they have English, Math, and Science.',
        options: ['True (T)', 'False (F)'],
        correctAnswer: 'True (T)',
        explanation: 'True - Duy nói: "we have English, Math, and Science on Monday morning."'
      },
      {
        id: 'L2_3',
        questionText: '3. Duy studies judo in the school gym.',
        options: ['True (T)', 'False (F)'],
        correctAnswer: 'False (F)',
        explanation: 'False - Duy nói "No, I don\'t. I play basketball with Phong and Nam."'
      },
      {
        id: 'L2_4',
        questionText: '4. Lan does judo on Tuesday afternoons.',
        options: ['True (T)', 'False (F)'],
        correctAnswer: 'True (T)',
        explanation: 'True - Duy nói: "But Lan does judo on Tuesdays."'
      },
      {
        id: 'L2_5',
        questionText: '5. Vy and Duy plan to ride their bicycles to school tomorrow.',
        options: ['True (T)', 'False (F)'],
        correctAnswer: 'True (T)',
        explanation: 'True - Vy nói: "Let\'s ride our bicycles together tomorrow morning."'
      }
    ]
  },
  {
    id: 'L3',
    section: 'L',
    sectionTitle: 'Listening',
    name: 'L3. Listening: Fill in Missing Words',
    instruction: 'Listen to the school club announcement and fill in each blank with ONE suitable word. (Nghe thông báo và điền một từ vào chỗ trống)',
    type: 'listening_fill',
    points: 10,
    audioScript: 'Attention all students of Grade 6! The English Speaking Club meets every Friday afternoon at 3 o\'clock in room 204. In the club, we play interesting games, sing English songs, and practice speaking with native teachers. Please bring your notebook and a pen. If you want to join, please talk to Miss Hoa in the library before Thursday. Thank you and welcome everyone!',
    questions: [
      {
        id: 'L3_1',
        questionText: '1. The English Speaking Club meets every _______ afternoon.',
        correctAnswer: 'Friday',
        explanation: 'Thông báo: "meets every Friday afternoon..."'
      },
      {
        id: 'L3_2',
        questionText: '2. The club meets at _______ o\'clock in room 204.',
        correctAnswer: '3',
        explanation: 'Thông báo: "...at 3 o\'clock in room 204."'
      },
      {
        id: 'L3_3',
        questionText: '3. Students practice speaking with _______ teachers.',
        correctAnswer: 'native',
        explanation: 'Thông báo: "...practice speaking with native teachers."'
      },
      {
        id: 'L3_4',
        questionText: '4. Students should bring a notebook and a _______.',
        correctAnswer: 'pen',
        explanation: 'Thông báo: "Please bring your notebook and a pen."'
      },
      {
        id: 'L3_5',
        questionText: '5. Interested students can meet Miss Hoa in the _______.',
        correctAnswer: 'library',
        explanation: 'Thông báo: "...talk to Miss Hoa in the library before Thursday."'
      }
    ]
  },

  // ================= F. READING (F1-F3) =================
  {
    id: 'F1',
    section: 'F',
    sectionTitle: 'Reading',
    name: 'F1. Reading Comprehension: My New School Passage',
    instruction: 'Read the text about Sunrise School and choose the correct answer A, B, or C. (Đọc đoạn văn và chọn đáp án đúng)',
    type: 'reading_mcq',
    points: 10,
    passage: `My name is Nick, and I am twelve years old. Last week, I started my new school year at Dream International Secondary School. The school is surrounded by green trees and flowers, far from the noisy city center. 

There are forty classrooms with air-conditioners and interactive smart boards. All students study English, Math, Science, Art and Music. In the afternoon, we have many exciting clubs such as the Chess Club, Drama Club, and Football Club. My favourite subject is Science because we do fascinating experiments in the modern laboratory.

Our teachers are very kind, creative, and enthusiastic. They always help us when we do not understand a difficult lesson. At lunchtime, we have delicious hot meals in the school canteen. I feel very happy and proud to be a student here.`,
    questions: [
      {
        id: 'F1_1',
        questionText: '1. Where is Nick\'s new school located?',
        options: [
          'A. In the noisy city center',
          'B. Far from the noisy city center, surrounded by green trees',
          'C. In a small fishing village'
        ],
        correctAnswer: 'B. Far from the noisy city center, surrounded by green trees',
        explanation: 'Dẫn chứng: "The school is surrounded by green trees and flowers, far from the noisy city center."'
      },
      {
        id: 'F1_2',
        questionText: '2. What are the classrooms equipped with?',
        options: [
          'A. Air-conditioners and interactive smart boards',
          'B. Only wooden tables and blackboard',
          'C. Small TVs and radios'
        ],
        correctAnswer: 'A. Air-conditioners and interactive smart boards',
        explanation: 'Dẫn chứng: "There are forty classrooms with air-conditioners and interactive smart boards."'
      },
      {
        id: 'F1_3',
        questionText: '3. Why is Science Nick\'s favourite subject?',
        options: [
          'A. Because he does not have homework',
          'B. Because the teacher is his uncle',
          'C. Because students do fascinating experiments in the lab'
        ],
        correctAnswer: 'C. Because students do fascinating experiments in the lab',
        explanation: 'Dẫn chứng: "My favourite subject is Science because we do fascinating experiments in the modern laboratory."'
      },
      {
        id: 'F1_4',
        questionText: '4. What do students do in the afternoon?',
        options: [
          'A. They sleep in the dormitory',
          'B. They participate in clubs like Chess, Drama and Football',
          'C. They go home immediately'
        ],
        correctAnswer: 'B. They participate in clubs like Chess, Drama and Football',
        explanation: 'Dẫn chứng: "...we have many exciting clubs such as the Chess Club, Drama Club, and Football Club."'
      },
      {
        id: 'F1_5',
        questionText: '5. How does Nick feel about his new school?',
        options: [
          'A. Bored and lonely',
          'B. Tired and worried',
          'C. Happy and proud'
        ],
        correctAnswer: 'C. Happy and proud',
        explanation: 'Dẫn chứng: "I feel very happy and proud to be a student here."'
      }
    ]
  },
  {
    id: 'F2',
    section: 'F',
    sectionTitle: 'Reading',
    name: 'F2. Reading: True or False Statements',
    instruction: 'Based on the passage above about Dream School, decide whether each statement is True (T) or False (F). (Dựa vào đoạn văn, xác định câu Đúng hay Sai)',
    type: 'reading_tf',
    points: 10,
    passage: `(Tham khảo đoạn văn F1 về Dream International Secondary School)`,
    questions: [
      {
        id: 'F2_1',
        questionText: '1. Nick is thirteen years old.',
        options: ['True (T)', 'False (F)'],
        correctAnswer: 'False (F)',
        explanation: 'False - Nick nói: "I am twelve years old" (12 tuổi, không phải 13).'
      },
      {
        id: 'F2_2',
        questionText: '2. There are 40 classrooms in Dream International Secondary School.',
        options: ['True (T)', 'False (F)'],
        correctAnswer: 'True (T)',
        explanation: 'True - "There are forty classrooms with air-conditioners..."'
      },
      {
        id: 'F2_3',
        questionText: '3. Students do not study English or Art at this school.',
        options: ['True (T)', 'False (F)'],
        correctAnswer: 'False (F)',
        explanation: 'False - "All students study English, Math, Science, Art and Music."'
      },
      {
        id: 'F2_4',
        questionText: '4. The teachers are kind, creative and enthusiastic.',
        options: ['True (T)', 'False (F)'],
        correctAnswer: 'True (T)',
        explanation: 'True - "Our teachers are very kind, creative, and enthusiastic."'
      },
      {
        id: 'F2_5',
        questionText: '5. Students have lunch in the school canteen.',
        options: ['True (T)', 'False (F)'],
        correctAnswer: 'True (T)',
        explanation: 'True - "At lunchtime, we have delicious hot meals in the school canteen."'
      }
    ]
  },
  {
    id: 'F3',
    section: 'F',
    sectionTitle: 'Reading',
    name: 'F3. Reading Comprehension: Short Questions',
    instruction: 'Answer the questions based on the reading passage in complete sentences. (Trả lời các câu hỏi sau dựa vào bài đọc)',
    type: 'reading_qa',
    points: 10,
    questions: [
      {
        id: 'F3_1',
        questionText: '1. What is the full name of Nick\'s school?',
        correctAnswer: 'Dream International Secondary School',
        explanation: 'Gợi ý: It is Dream International Secondary School.'
      },
      {
        id: 'F3_2',
        questionText: '2. What surrounds Nick\'s new school?',
        correctAnswer: 'Green trees and flowers',
        explanation: 'Gợi ý: Green trees and flowers surround the school.'
      },
      {
        id: 'F3_3',
        questionText: '3. Name two clubs that students can join in the afternoon.',
        correctAnswer: 'Chess Club, Football Club',
        explanation: 'Gợi ý: Chess Club, Drama Club, or Football Club.'
      },
      {
        id: 'F3_4',
        questionText: '4. What do the teachers do when students do not understand a lesson?',
        correctAnswer: 'They always help them',
        explanation: 'Gợi ý: They always help the students.'
      },
      {
        id: 'F3_5',
        questionText: '5. Where do students eat their lunch?',
        correctAnswer: 'In the school canteen',
        explanation: 'Gợi ý: In the school canteen.'
      }
    ]
  },

  // ================= G. SPEAKING (G1-G2) =================
  {
    id: 'G1',
    section: 'G',
    sectionTitle: 'Speaking',
    name: 'G1. Speaking Prompt: My Dream School Presentation',
    instruction: 'Prepare a 1-2 minute presentation about your dream school. Write down your outline/draft notes in the box below. (Soạn dàn ý và bài nói về ngôi trường mơ ước của bạn)',
    type: 'speaking_prompt',
    points: 10,
    sampleAnswer: `Hello everyone! Today I would like to talk about my dream school.
My dream school is a big green school near the beach. It has 30 modern classrooms with solar energy, a swimming pool, and an open library with a sea view.
At my dream school, students do not have homework at weekends. We study English, Robotics, and Environmental Science. In the afternoon, we can join the Surfing Club or Gardening Club.
I hope my dream school will come true in the future! Thank you for listening.`,
    rubrics: [
      'Nội dung đầy đủ: Vị trí, cơ sở vật chất, môn học, hoạt động ngoại khóa (4 điểm)',
      'Từ vựng chính xác theo Unit 1: modern, equipment, library, club, dream school (3 điểm)',
      'Ngữ pháp thì Hiện tại đơn chuẩn xác, phát âm rõ ràng (3 điểm)'
    ],
    questions: [
      {
        id: 'G1_draft',
        questionText: 'Draft your speech notes here (Outline: 1. Introduction - 2. Location & Facilities - 3. Subjects & Activities - 4. Conclusion):',
        correctAnswer: 'draft_evaluated',
        explanation: 'Xem bài mẫu và đối chiếu với dàn ý gợi ý để đạt điểm tối đa.'
      }
    ]
  },
  {
    id: 'G2',
    section: 'G',
    sectionTitle: 'Speaking',
    name: 'G2. Pair-work Dialogue Completion',
    instruction: 'Complete the dialogue between Tom and Linh about their school subjects and activities. (Hoàn thành đoạn hội thoại)',
    type: 'speaking_dialogue',
    points: 10,
    questions: [
      {
        id: 'G2_1',
        questionText: 'Tom: "What time do you usually go to school in the morning?" -> Linh: "_______"',
        options: [
          'A. I usually go to school at 6:45 a.m.',
          'B. I go by bicycle.',
          'C. My school is very big.',
          'D. I have lunch at school.'
        ],
        correctAnswer: 'A. I usually go to school at 6:45 a.m.',
        explanation: 'Câu hỏi thời gian "What time...?" trả lời mốc giờ cụ thể.'
      },
      {
        id: 'G2_2',
        questionText: 'Tom: "How many subjects do you study on Tuesday?" -> Linh: "_______"',
        options: [
          'A. I like Maths best.',
          'B. We study four subjects: Maths, English, History, and PE.',
          'C. In the science room.',
          'D. Tuesday is my favourite day.'
        ],
        correctAnswer: 'B. We study four subjects: Maths, English, History, and PE.',
        explanation: 'Câu hỏi số lượng "How many subjects...?" trả lời số lượng và kể tên các môn.'
      },
      {
        id: 'G2_3',
        questionText: 'Tom: "Do you play any sports at break time?" -> Linh: "_______"',
        options: [
          'A. Yes, my classmates and I often play table tennis.',
          'B. No, I don\'t like eating snacks.',
          'C. I do my homework yesterday.',
          'D. Break time is 15 minutes.'
        ],
        correctAnswer: 'A. Yes, my classmates and I often play table tennis.',
        explanation: 'Câu hỏi Yes/No "Do you play any sports...?" trả lời Yes kèm môn thể thao.'
      }
    ]
  },

  // ================= H. WRITING (H1-H3) =================
  {
    id: 'H1',
    section: 'H',
    sectionTitle: 'Writing',
    name: 'H1. Word Ordering: Reorder Words to Make Sentences',
    instruction: 'Rearrange the given words to make complete and meaningful sentences. (Sắp xếp từ thành câu hoàn chỉnh)',
    type: 'writing_reorder',
    points: 10,
    questions: [
      {
        id: 'H1_1',
        questionText: '1. my / wears / everyday / brother / uniform / school / his / .',
        options: [
          'A. My brother wears his school uniform everyday.',
          'B. My brother wears everyday his school uniform.',
          'C. His school uniform wears my brother everyday.',
          'D. Everyday wears my brother his school uniform.'
        ],
        correctAnswer: 'A. My brother wears his school uniform everyday.',
        explanation: 'Cấu trúc: S (My brother) + V (wears) + O (his school uniform) + time (everyday).'
      },
      {
        id: 'H1_2',
        questionText: '2. always / English / on / they / study / Thursday / mornings / .',
        options: [
          'A. They always study English on Thursday mornings.',
          'B. They study always English on Thursday mornings.',
          'C. Always they study English on Thursday mornings.',
          'D. On Thursday mornings they study always English.'
        ],
        correctAnswer: 'A. They always study English on Thursday mornings.',
        explanation: 'Trạng từ "always" đứng trước động từ "study".'
      },
      {
        id: 'H1_3',
        questionText: '3. books / can / library / students / borrow / from / the / .',
        options: [
          'A. Students can borrow books from the library.',
          'B. From the library students can books borrow.',
          'C. Students borrow can books from the library.',
          'D. Books can students borrow from the library.'
        ],
        correctAnswer: 'A. Students can borrow books from the library.',
        explanation: 'Cấu trúc: S (Students) + can + V (borrow) + O (books) + prep phrase (from the library).'
      },
      {
        id: 'H1_4',
        questionText: '4. do / homework / you / with / your / whom / usually / ?',
        options: [
          'A. Whom do you usually do your homework with?',
          'B. Whom you usually do do your homework with?',
          'C. With whom you usually do your homework do?',
          'D. Do you whom usually do your homework with?'
        ],
        correctAnswer: 'A. Whom do you usually do your homework with?',
        explanation: 'Câu hỏi: Wh-word + do + S + adv + V + O + preposition.'
      },
      {
        id: 'H1_5',
        questionText: '5. secondary / new / there / are / my / forty / teachers / in / school / .',
        options: [
          'A. There are forty teachers in my new secondary school.',
          'B. There forty teachers are in my new secondary school.',
          'C. In my new secondary school forty teachers are there.',
          'D. Forty teachers are there in my new secondary school.'
        ],
        correctAnswer: 'A. There are forty teachers in my new secondary school.',
        explanation: 'Cấu trúc: There are + number + plural noun + place phrase.'
      }
    ]
  },
  {
    id: 'H2',
    section: 'H',
    sectionTitle: 'Writing',
    name: 'H2. Sentence Transformation / Rewrite',
    instruction: 'Rewrite each sentence so that it means the same as the first one. (Viết lại câu sao cho nghĩa không đổi)',
    type: 'writing_rewrite',
    points: 10,
    questions: [
      {
        id: 'H2_1',
        questionText: '1. My secondary school has thirty modern classrooms.',
        options: [
          'A. There are thirty modern classrooms in my secondary school.',
          'B. There is thirty modern classrooms in my secondary school.',
          'C. Thirty modern classrooms has my secondary school.',
          'D. In my secondary school is thirty modern classrooms.'
        ],
        correctAnswer: 'A. There are thirty modern classrooms in my secondary school.',
        explanation: 'Chuyển đổi giữa "S + has..." sang cấu trúc "There are + danh từ số nhiều + in...".'
      },
      {
        id: 'H2_2',
        questionText: '2. Nam walks to school every morning.',
        options: [
          'A. Nam goes to school on foot every morning.',
          'B. Nam goes to school by foot every morning.',
          'C. Nam rides to school every morning.',
          'D. Nam is walking to school every morning.'
        ],
        correctAnswer: 'A. Nam goes to school on foot every morning.',
        explanation: '"walk to school" = "go to school on foot".'
      },
      {
        id: 'H2_3',
        questionText: '3. What is your favourite subject at school?',
        options: [
          'A. Which subject do you like best at school?',
          'B. Which subject you like best at school?',
          'C. What subject is you like best?',
          'D. Do you like which subject at school?'
        ],
        correctAnswer: 'A. Which subject do you like best at school?',
        explanation: '"What is your favourite subject?" = "Which subject do you like best?".'
      },
      {
        id: 'H2_4',
        questionText: '4. Phong likes playing basketball in the school playground.',
        options: [
          'A. Phong is interested in playing basketball in the school playground.',
          'B. Phong is interested on playing basketball in the school playground.',
          'C. Phong interests playing basketball in the school playground.',
          'D. Phong likes play basketball in the school playground.'
        ],
        correctAnswer: 'A. Phong is interested in playing basketball in the school playground.',
        explanation: '"like + V-ing" = "be interested in + V-ing".'
      },
      {
        id: 'H2_5',
        questionText: '5. No student in my class is smarter than Duy.',
        options: [
          'A. Duy is the smartest student in my class.',
          'B. Duy is smarter all students in my class.',
          'C. Duy is smartest student in my class.',
          'D. Duy is more smart than all students in my class.'
        ],
        correctAnswer: 'A. Duy is the smartest student in my class.',
        explanation: 'So sánh hơn "No student is smarter than Duy" chuyển thành so sánh nhất "Duy is the smartest student in my class".'
      }
    ]
  },
  {
    id: 'H3',
    section: 'H',
    sectionTitle: 'Writing',
    name: 'H3. Short Paragraph Writing: My First Week at New School',
    instruction: 'Write a short paragraph (60 - 80 words) about your first week at your new secondary school. (Viết một đoạn văn ngắn 60 - 80 từ về tuần đầu tiên tại trường mới)',
    type: 'writing_paragraph',
    points: 10,
    sampleAnswer: `My first week at Nguyen Du Secondary School was wonderful and unforgettable. On the first day, I was nervous, but my new classmates were very warm and friendly. Our homeroom teacher, Ms. Mai, showed us the library and computer room. We studied exciting subjects like English and Science, and we played badminton at break time. I really love my new uniform and my new friends. I look forward to coming to school every day!`,
    rubrics: [
      'Độ dài đạt chuẩn 60 - 80 từ (2.5 điểm)',
      'Nội dung đầy đủ: Cảm xúc ngày đầu, bạn bè, thầy cô, môn học yêu thích (3 điểm)',
      'Sử dụng đúng từ vựng Unit 1 & thì Hiện tại đơn / Quá khứ đơn thích hợp (2.5 điểm)',
      'Chính tả, dấu câu và liên kết câu mạch lạc (2 điểm)'
    ],
    questions: [
      {
        id: 'H3_paragraph',
        questionText: 'Write your 60-80 words paragraph in the text area below:',
        correctAnswer: 'paragraph_evaluated',
        explanation: 'Hệ thống sẽ đếm từ tự động và giáo viên sẽ chấm điểm dựa trên 4 tiêu chí rubrics.'
      }
    ]
  }
];

export const INITIAL_GRADES: Grade[] = [
  {
    id: 6,
    name: 'Lớp 6',
    description: 'Chương trình Tiếng Anh 6 - Global Success (Bộ Giáo Dục & Đào Tạo)',
    units: [
      {
        id: 'unit-1',
        gradeId: 6,
        code: 'Unit 1',
        title: 'My New School',
        subtitle: 'Trường học mới của em',
        semester: 'Học kỳ 1',
        bookSeries: 'Global Success',
        skills: ['Phonics', 'Stress', 'Vocabulary', 'Grammar', 'Listening', 'Reading', 'Speaking', 'Writing'],
        bannerSubtitle: 'Hệ thống ôn tập toàn diện 23 bài tập bổ trợ bám sát khung chuẩn',
        exercises: DEFAULT_UNIT_1_GRADE_6_EXERCISES
      },
      {
        id: 'unit-2',
        gradeId: 6,
        code: 'Unit 2',
        title: 'My House',
        subtitle: 'Ngôi nhà của em',
        semester: 'Học kỳ 1',
        bookSeries: 'Global Success',
        skills: ['Phonics', 'Stress', 'Vocabulary', 'Grammar', 'Listening', 'Reading', 'Writing'],
        bannerSubtitle: 'Từ vựng các phòng, đồ gia dụng, giới từ chỉ nơi chốn và cấu trúc There is/There are',
        exercises: DEFAULT_UNIT_1_GRADE_6_EXERCISES.slice(0, 10).map((ex) => ({
          ...ex,
          id: ex.id,
          name: ex.name.replace('School', 'House').replace('School', 'Home'),
          instruction: ex.instruction
        }))
      },
      {
        id: 'unit-3',
        gradeId: 6,
        code: 'Unit 3',
        title: 'My Friends',
        subtitle: 'Những người bạn của em',
        semester: 'Học kỳ 1',
        bookSeries: 'Global Success',
        skills: ['Phonics', 'Vocabulary', 'Grammar', 'Reading', 'Writing'],
        bannerSubtitle: 'Tính từ miêu tả tính cách, ngoại hình và thì Hiện tại tiếp diễn',
        exercises: DEFAULT_UNIT_1_GRADE_6_EXERCISES.slice(0, 8)
      }
    ]
  },
  {
    id: 7,
    name: 'Lớp 7',
    description: 'Chương trình Tiếng Anh 7 - Global Success (Bộ Giáo Dục & Đào Tạo)',
    units: [
      {
        id: 'unit-1-g7',
        gradeId: 7,
        code: 'Unit 1',
        title: 'Hobbies',
        subtitle: 'Sở thích cá nhân',
        semester: 'Học kỳ 1',
        bookSeries: 'Global Success',
        skills: ['Phonics', 'Stress', 'Vocabulary', 'Grammar', 'Listening', 'Reading', 'Writing'],
        bannerSubtitle: 'Từ vựng về sở thích, động từ chỉ sự yêu thích và thì Hiện tại đơn',
        exercises: DEFAULT_UNIT_1_GRADE_6_EXERCISES.slice(0, 12)
      },
      {
        id: 'unit-2-g7',
        gradeId: 7,
        code: 'Unit 2',
        title: 'Healthy Living',
        subtitle: 'Lối sống lành mạnh',
        semester: 'Học kỳ 1',
        bookSeries: 'Global Success',
        skills: ['Vocabulary', 'Grammar', 'Reading', 'Writing'],
        bannerSubtitle: 'Sức khỏe, dinh dưỡng và thói quen sinh hoạt',
        exercises: DEFAULT_UNIT_1_GRADE_6_EXERCISES.slice(0, 8)
      }
    ]
  },
  {
    id: 8,
    name: 'Lớp 8',
    description: 'Chương trình Tiếng Anh 8 - Global Success',
    units: [
      {
        id: 'unit-1-g8',
        gradeId: 8,
        code: 'Unit 1',
        title: 'Leisure Time',
        subtitle: 'Thời gian rảnh rỗi',
        semester: 'Học kỳ 1',
        bookSeries: 'Global Success',
        skills: ['Vocabulary', 'Grammar', 'Reading', 'Writing'],
        bannerSubtitle: 'Hoạt động giải trí và cấu trúc câu sở thích',
        exercises: DEFAULT_UNIT_1_GRADE_6_EXERCISES.slice(0, 10)
      }
    ]
  },
  {
    id: 9,
    name: 'Lớp 9',
    description: 'Chương trình Tiếng Anh 9 - Global Success Ôn thi vào 10',
    units: [
      {
        id: 'unit-1-g9',
        gradeId: 9,
        code: 'Unit 1',
        title: 'Local Community',
        subtitle: 'Cộng đồng địa phương & Làng nghề truyền thống',
        semester: 'Học kỳ 1',
        bookSeries: 'Global Success',
        skills: ['Vocabulary', 'Grammar', 'Reading', 'Writing'],
        bannerSubtitle: 'Cụm động từ (Phrasal Verbs) và từ vựng nghề truyền thống',
        exercises: DEFAULT_UNIT_1_GRADE_6_EXERCISES.slice(0, 10)
      }
    ]
  },
  {
    id: 'pet',
    name: 'Luyện thi PET (B1 Preliminary)',
    code: 'PET',
    category: 'cambridge',
    description: 'Chương trình luyện thi chứng chỉ quốc tế Cambridge B1 Preliminary for Schools',
    units: [
      {
        id: 'unit-1-pet',
        gradeId: 'pet' as any,
        code: 'Unit 1',
        title: 'Everyday Life & Travel',
        subtitle: 'Đời sống thường nhật & Du lịch khám phá',
        semester: 'Khóa B1',
        bookSeries: 'Cambridge PET Objective',
        skills: ['Reading', 'Grammar', 'Listening', 'Writing'],
        bannerSubtitle: 'Luyện đề định dạng chuẩn Cambridge PET B1',
        exercises: DEFAULT_UNIT_1_GRADE_6_EXERCISES.slice(0, 8)
      }
    ]
  },
  {
    id: 'ielts',
    name: 'Luyện thi IELTS Foundation',
    code: 'IELTS',
    category: 'ielts',
    description: 'Khóa học xây dựng nền tảng từ vựng học thuật & ngữ pháp chuyên sâu IELTS Band 4.5 - 6.0',
    units: [
      {
        id: 'unit-1-ielts',
        gradeId: 'ielts' as any,
        code: 'Unit 1',
        title: 'Academic Foundations',
        subtitle: 'Môi trường & Khoa học ứng dụng',
        semester: 'Foundation',
        bookSeries: 'IELTS Preparation',
        skills: ['Reading', 'Vocabulary', 'Grammar', 'Writing'],
        bannerSubtitle: 'Luyện kỹ năng phân tích văn bản học thuật và cấu trúc câu nâng cao',
        exercises: DEFAULT_UNIT_1_GRADE_6_EXERCISES.slice(0, 6)
      }
    ]
  }
];

export const SAMPLE_STUDENT_SUBMISSIONS: Record<string, any>[] = [
  {
    id: 'sub_001',
    studentInfo: {
      fullName: 'Nguyễn Hoàng Minh',
      className: '6A1',
      teacherEmail: 'cogiang.tienganh@gmail.com',
      schoolName: 'THCS Lê Quý Đôn'
    },
    gradeId: 6,
    unitId: 'unit-1',
    unitTitle: 'Unit 1: My New School',
    completedExercises: {
      A1: { exerciseId: 'A1', score: 10, totalQuestions: 5, correctAnswersCount: 5, submittedAt: '2026-11-07 10:15' },
      A2: { exerciseId: 'A2', score: 10, totalQuestions: 8, correctAnswersCount: 8, submittedAt: '2026-11-07 10:20' },
      B1: { exerciseId: 'B1', score: 8, totalQuestions: 5, correctAnswersCount: 4, submittedAt: '2026-11-07 10:25' },
      C1: { exerciseId: 'C1', score: 10, totalQuestions: 5, correctAnswersCount: 5, submittedAt: '2026-11-07 10:30' },
      C2: { exerciseId: 'C2', score: 10, totalQuestions: 5, correctAnswersCount: 5, submittedAt: '2026-11-07 10:35' },
      C3: { exerciseId: 'C3', score: 10, totalQuestions: 5, correctAnswersCount: 5, submittedAt: '2026-11-07 10:40' },
      C4: { exerciseId: 'C4', score: 10, totalQuestions: 5, correctAnswersCount: 5, submittedAt: '2026-11-07 10:45' },
      D1: { exerciseId: 'D1', score: 8, totalQuestions: 5, correctAnswersCount: 4, submittedAt: '2026-11-07 10:50' },
      D2: { exerciseId: 'D2', score: 10, totalQuestions: 5, correctAnswersCount: 5, submittedAt: '2026-11-07 10:55' },
      D3: { exerciseId: 'D3', score: 10, totalQuestions: 5, correctAnswersCount: 5, submittedAt: '2026-11-07 11:00' },
      D4: { exerciseId: 'D4', score: 8, totalQuestions: 5, correctAnswersCount: 4, submittedAt: '2026-11-07 11:05' },
      E1: { exerciseId: 'E1', score: 10, totalQuestions: 5, correctAnswersCount: 5, submittedAt: '2026-11-07 11:10' },
      L1: { exerciseId: 'L1', score: 10, totalQuestions: 5, correctAnswersCount: 5, submittedAt: '2026-11-07 11:15' },
      L2: { exerciseId: 'L2', score: 10, totalQuestions: 5, correctAnswersCount: 5, submittedAt: '2026-11-07 11:20' },
      L3: { exerciseId: 'L3', score: 8, totalQuestions: 5, correctAnswersCount: 4, submittedAt: '2026-11-07 11:25' },
      F1: { exerciseId: 'F1', score: 10, totalQuestions: 5, correctAnswersCount: 5, submittedAt: '2026-11-07 11:30' },
      F2: { exerciseId: 'F2', score: 10, totalQuestions: 5, correctAnswersCount: 5, submittedAt: '2026-11-07 11:35' },
      F3: { exerciseId: 'F3', score: 10, totalQuestions: 5, correctAnswersCount: 5, submittedAt: '2026-11-07 11:40' },
      G1: { exerciseId: 'G1', score: 9, totalQuestions: 1, correctAnswersCount: 1, submittedAt: '2026-11-07 11:45' },
      G2: { exerciseId: 'G2', score: 10, totalQuestions: 3, correctAnswersCount: 3, submittedAt: '2026-11-07 11:50' },
      H1: { exerciseId: 'H1', score: 10, totalQuestions: 5, correctAnswersCount: 5, submittedAt: '2026-11-07 11:55' },
      H2: { exerciseId: 'H2', score: 10, totalQuestions: 5, correctAnswersCount: 5, submittedAt: '2026-11-07 12:00' },
      H3: { exerciseId: 'H3', score: 9.5, totalQuestions: 1, correctAnswersCount: 1, submittedAt: '2026-11-07 12:05' }
    },
    totalSubmitted: 23,
    totalAvailable: 23,
    averageScore: 9.6,
    createdAt: '2026-11-07 10:15',
    updatedAt: '2026-11-07 12:05'
  },
  {
    id: 'sub_002',
    studentInfo: {
      fullName: 'Trần Thảo Linh',
      className: '6A1',
      teacherEmail: 'cogiang.tienganh@gmail.com',
      schoolName: 'THCS Lê Quý Đôn'
    },
    gradeId: 6,
    unitId: 'unit-1',
    unitTitle: 'Unit 1: My New School',
    completedExercises: {
      A1: { exerciseId: 'A1', score: 8, totalQuestions: 5, correctAnswersCount: 4, submittedAt: '2026-11-07 14:00' },
      A2: { exerciseId: 'A2', score: 10, totalQuestions: 8, correctAnswersCount: 8, submittedAt: '2026-11-07 14:05' },
      B1: { exerciseId: 'B1', score: 10, totalQuestions: 5, correctAnswersCount: 5, submittedAt: '2026-11-07 14:10' },
      C1: { exerciseId: 'C1', score: 10, totalQuestions: 5, correctAnswersCount: 5, submittedAt: '2026-11-07 14:15' },
      C2: { exerciseId: 'C2', score: 8, totalQuestions: 5, correctAnswersCount: 4, submittedAt: '2026-11-07 14:20' },
      D1: { exerciseId: 'D1', score: 10, totalQuestions: 5, correctAnswersCount: 5, submittedAt: '2026-11-07 14:25' },
      L1: { exerciseId: 'L1', score: 10, totalQuestions: 5, correctAnswersCount: 5, submittedAt: '2026-11-07 14:30' },
      F1: { exerciseId: 'F1', score: 10, totalQuestions: 5, correctAnswersCount: 5, submittedAt: '2026-11-07 14:35' },
      H1: { exerciseId: 'H1', score: 10, totalQuestions: 5, correctAnswersCount: 5, submittedAt: '2026-11-07 14:40' }
    },
    totalSubmitted: 9,
    totalAvailable: 23,
    averageScore: 9.5,
    createdAt: '2026-11-07 14:00',
    updatedAt: '2026-11-07 14:40'
  }
];
