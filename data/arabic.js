/* ============================================================
   باب: أسئلة اللغة العربية
   ------------------------------------------------------------
   difficulty: 1/2/3 يقابل مستويات 100/200/300 نقطة.
   المحرك يوزّع سؤالين لكل مستوى تلقائيًا دون تكرار.
   ============================================================ */
window.JEEM_DOORS = window.JEEM_DOORS || [];

window.JEEM_DOORS.push({
  id: 'arabic',
  name: 'أسئلة اللغة العربية',
  desc: 'نحو وصرف وبلاغة',
  icon: 'arabic',
  levels: [100, 200, 300],
  bank: [
    /* ===== المستوى الأول: سهل (100) ===== */
    {
      id: 'arabic-e1',
      difficulty: 1,
      type: 'text',
      question: 'ما اسم الفاعل من الفعل «كتب»؟',
      answer: 'كاتب'
    },
    {
      id: 'arabic-e2',
      difficulty: 1,
      type: 'text',
      question: 'ما علامة إعراب جمع المذكر السالم في حالة الرفع؟',
      answer: 'الواو'
    },
    {
      id: 'arabic-e3',
      difficulty: 1,
      type: 'text',
      question: 'ما ضد كلمة «كبير»؟',
      answer: 'صغير'
    },
    {
      id: 'arabic-e4',
      difficulty: 1,
      type: 'text',
      question: 'ما جمع كلمة «قلم»؟',
      answer: 'أقلام'
    },
    {
      id: 'arabic-e5',
      difficulty: 1,
      type: 'text',
      question: 'ما مفرد كلمة «تلاميذ»؟',
      answer: 'تلميذ'
    },
    {
      id: 'arabic-e6',
      difficulty: 1,
      type: 'text',
      question: 'ما الفعل الماضي من الفعل «يذهب»؟',
      answer: 'ذهب'
    },
    {
      id: 'arabic-e7',
      difficulty: 1,
      type: 'text',
      question: 'ما نوع الجملة «الشمس ساطعة»؟',
      answer: 'جملة اسمية'
    },
    {
      id: 'arabic-e8',
      difficulty: 1,
      type: 'text',
      question: 'ما نوع كلمة «الكتاب» من حيث التنكير والتعريف؟',
      answer: 'اسم معرفة'
    },

    /* ===== المستوى الثاني: متوسط (200) ===== */
    {
      id: 'arabic-m1',
      difficulty: 2,
      type: 'text',
      question: 'ما الميزان الصرفي للفعل «استخرج»؟',
      answer: 'استفعل'
    },
    {
      id: 'arabic-m2',
      difficulty: 2,
      type: 'text',
      question: 'هاتِ جمع كلمة «مستشفى» جمعَ مؤنث سالمًا.',
      answer: 'مستشفيات'
    },
    {
      id: 'arabic-m3',
      difficulty: 2,
      type: 'text',
      question: 'ما نوع الأسلوب في جملة: «ما أجملَ السماءَ!»؟',
      answer: 'أسلوب تعجّب'
    },
    {
      id: 'arabic-m4',
      difficulty: 2,
      type: 'text',
      question: 'أعرب كلمة «العلمُ» في جملة: «العلمُ نورٌ».',
      answer: 'مبتدأ مرفوع وعلامة رفعه الضمة الظاهرة على آخره'
    },
    {
      id: 'arabic-m5',
      difficulty: 2,
      type: 'text',
      question: 'ما علامة إعراب المثنى في حالة النصب؟',
      answer: 'الياء'
    },
    {
      id: 'arabic-m6',
      difficulty: 2,
      type: 'text',
      question: 'ما اسم المفعول من الفعل «فهم»؟',
      answer: 'مفهوم'
    },
    {
      id: 'arabic-m7',
      difficulty: 2,
      type: 'text',
      question: 'ما وزن كلمة «مكتبة»؟',
      answer: 'مَفْعَلَة'
    },
    {
      id: 'arabic-m8',
      difficulty: 2,
      type: 'text',
      question: 'ما نوع «لا» في جملة: «لا تكذب»؟',
      answer: 'لا الناهية'
    },

    /* ===== المستوى الثالث: صعب (300) ===== */
    {
      id: 'arabic-h1',
      difficulty: 3,
      type: 'text',
      question: 'ما وزن كلمة «استعلام»؟',
      answer: 'استفعال'
    },
    {
      id: 'arabic-h2',
      difficulty: 3,
      type: 'text',
      question: 'ما الصورة البلاغية في عبارة: «رأيت أسدًا يخطب»؟',
      answer: 'استعارة تصريحية'
    },
    {
      id: 'arabic-h3',
      difficulty: 3,
      type: 'text',
      question: 'ما إعراب «يا» في النداء؟',
      answer: 'حرف نداء مبني على السكون لا محل له من الإعراب'
    },
    {
      id: 'arabic-h4',
      difficulty: 3,
      type: 'text',
      question: 'ما مقدار المد الطبيعي؟',
      answer: 'حركتان'
    },
    {
      id: 'arabic-h5',
      difficulty: 3,
      type: 'text',
      question: 'ما علامة نصب جمع المؤنث السالم؟',
      answer: 'الكسرة نيابةً عن الفتحة'
    },
    {
      id: 'arabic-h6',
      difficulty: 3,
      type: 'text',
      question: 'ما إعراب الفعل المضارع بعد «لم»؟',
      answer: 'مجزوم'
    },
    {
      id: 'arabic-h7',
      difficulty: 3,
      type: 'text',
      question: 'ما نوع الهمزة في كلمة «سؤال»؟',
      answer: 'همزة متوسطة على الواو'
    },
    {
      id: 'arabic-h8',
      difficulty: 3,
      type: 'text',
      question: 'ما جمع كلمة «مصطفى»؟',
      answer: 'مصطفون'
    }
  ]
});
