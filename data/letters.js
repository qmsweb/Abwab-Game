/* ============================================================
   باب: الحروف والكلمات
   ------------------------------------------------------------
   difficulty: 1/2/3 يقابل مستويات 100/200/300 نقطة.
   المحرك يختار سؤالين لكل مستوى تلقائيًا دون تكرار.
   ============================================================ */
window.JEEM_DOORS = window.JEEM_DOORS || [];

window.JEEM_DOORS.push({
  id: 'letters',
  name: 'الحروف',
  desc: 'ألعاب الحروف والكلمات',
  icon: 'letters',
  levels: [100, 200, 300],
  bank: [
    /* ===== المستوى الأول: سهل (100) ===== */
    {
      id: 'letters-e1',
      difficulty: 1,
      type: 'text',
      question: 'ما الحرف الذي يلي حرف الطاء في ترتيب الحروف الهجائية؟',
      answer: 'الظاء'
    },
    {
      id: 'letters-e2',
      difficulty: 1,
      type: 'text',
      question: 'كم عدد حروف كلمة «استعمار»؟',
      answer: 'سبعة حروف'
    },
    {
      id: 'letters-e3',
      difficulty: 1,
      type: 'text',
      question: 'ما أول حرف في الأبجدية العربية؟',
      answer: 'الألف'
    },
    {
      id: 'letters-e4',
      difficulty: 1,
      type: 'text',
      question: 'ما آخر حرف في الأبجدية العربية؟',
      answer: 'الياء'
    },
    {
      id: 'letters-e5',
      difficulty: 1,
      type: 'text',
      question: 'كم عدد الحروف الهجائية العربية؟',
      answer: '28 حرفًا'
    },
    {
      id: 'letters-e6',
      difficulty: 1,
      type: 'text',
      question: 'رتّب الحروف (ك - ت - ا - ب) لتكوّن اسمًا لما نقرأه.',
      answer: 'كتاب'
    },
    {
      id: 'letters-e7',
      difficulty: 1,
      type: 'text',
      question: 'ما الحرفان اللذان يتكرران في كلمة «سلسلة»؟',
      answer: 'السين واللام'
    },
    {
      id: 'letters-e8',
      difficulty: 1,
      type: 'text',
      question: 'ما مفرد كلمة «حروف»؟',
      answer: 'حرف'
    },

    /* ===== المستوى الثاني: متوسط (200) ===== */
    {
      id: 'letters-m1',
      difficulty: 2,
      type: 'text',
      question: 'رتّب الحروف (ب - ن - ا - ي - ة) لتكوّن كلمة تدل على بناء مرتفع.',
      answer: 'بناية'
    },
    {
      id: 'letters-m2',
      difficulty: 2,
      type: 'text',
      question: 'ما الكلمة المكوّنة من الحروف (ح - ا - س - و - ب) وتعني جهازًا إلكترونيًا؟',
      answer: 'حاسوب'
    },
    {
      id: 'letters-m3',
      difficulty: 2,
      type: 'text',
      question: 'ما الحرف الذي يتوسط حروف كلمة «نهر»؟',
      answer: 'الهاء'
    },
    {
      id: 'letters-m4',
      difficulty: 2,
      type: 'text',
      question: 'رتّب الحروف (ص - د - ي - ق) لتكوّن كلمة تعني الصاحب.',
      answer: 'صديق'
    },
    {
      id: 'letters-m5',
      difficulty: 2,
      type: 'text',
      question: 'كم عدد حروف كلمة «مستشفى»؟',
      answer: 'ستة حروف'
    },
    {
      id: 'letters-m6',
      difficulty: 2,
      type: 'text',
      question: 'اذكر كلمة من أربعة حروف تبدأ بحرف الحاء وتنتهي بحرف الراء وتعني المحادثة.',
      answer: 'حوار'
    },
    {
      id: 'letters-m7',
      difficulty: 2,
      type: 'text',
      question: 'ما جمع كلمة «باب»؟',
      answer: 'أبواب'
    },
    {
      id: 'letters-m8',
      difficulty: 2,
      type: 'text',
      question: 'ما الحرف الذي يلي حرف الميم في ترتيب «أبجد هوز»؟',
      answer: 'النون'
    },

    /* ===== المستوى الثالث: صعب (300) ===== */
    {
      id: 'letters-h1',
      difficulty: 3,
      type: 'text',
      question: 'كم عدد الحروف المقطّعة في أول سورة البقرة، وما هي؟',
      answer: 'ثلاثة حروف: ألف، لام، ميم'
    },
    {
      id: 'letters-h2',
      difficulty: 3,
      type: 'text',
      question: 'كم كلمة تحتوي على حرف الضاد في جملة: «ضرَبَ الضابطُ ضربًا شديدًا»؟',
      answer: 'ثلاث كلمات: ضرَبَ، الضابطُ، ضربًا'
    },
    {
      id: 'letters-h3',
      difficulty: 3,
      type: 'text',
      question: 'كم عدد الحروف المقطّعة التي افتُتحت بها سور القرآن الكريم؟',
      answer: 'أربعة عشر حرفًا'
    },
    {
      id: 'letters-h4',
      difficulty: 3,
      type: 'text',
      question: 'كم مرة يتكرر حرف اللام في جملة «لا إله إلا الله»؟',
      answer: 'خمس مرات'
    },
    {
      id: 'letters-h5',
      difficulty: 3,
      type: 'text',
      question: 'ما الكلمة المكوّنة من الحروف (م - س - ت - ق - ب - ل) وتعني الزمن القادم؟',
      answer: 'مستقبل'
    },
    {
      id: 'letters-h6',
      difficulty: 3,
      type: 'text',
      question: 'كم مرة يتكرر حرف الميم في «محمدٌ محمدٌ»؟',
      answer: 'أربع مرات'
    },
    {
      id: 'letters-h7',
      difficulty: 3,
      type: 'text',
      question: 'رتّب الحروف (ع - ا - ل - م - ي - ة) لتكوّن كلمة تعني ما يتصل بالمعرفة والعلم.',
      answer: 'عالمية'
    },
    {
      id: 'letters-h8',
      difficulty: 3,
      type: 'text',
      question: 'كم عدد الحروف المنقوطة في كلمة «مستشفى»؟',
      answer: 'حرفان: التاء والشين'
    }
  ]
});
