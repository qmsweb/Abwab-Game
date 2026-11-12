/* ============================================================
   باب: الصور (الأمثال والألغاز المصوّرة)
   ------------------------------------------------------------
   كل سؤال يحتوي مصفوفة images. كل عنصر:
     src  : مسار الصورة  (مثال: images/puzzles/e1-1.jpg)
     alt  : وصف الصورة
     hint : نص يظهر على بطاقة البديل إن لم توجد الصورة
   ضع الصور في مجلد images/puzzles/ بنفس الأسماء أدناه.
   difficulty: 1/2/3 يقابل 100/200/300 نقطة.
   ============================================================ */
window.JEEM_DOORS = window.JEEM_DOORS || [];

window.JEEM_DOORS.push({
  id: 'images',
  name: 'الصور',
  desc: 'مثل شعبي من الصور',
  icon: 'images',
  levels: [100, 200, 300],
  bank: [
    /* ===== المستوى الأول: سهل (100) ===== */
    {
      id: 'images-e1',
      difficulty: 1,
      type: 'images',
      question: 'ما المثل الشعبي الذي تدل عليه الصورتان؟',
      hint: 'فكّر في التعاون بين شخصين.',
      images: [
        { src: 'images/puzzles/e1-1.jpg', alt: 'يد مفتوحة', hint: 'يد' },
        { src: 'images/puzzles/e1-2.jpg', alt: 'يد أخرى', hint: 'يد أخرى' }
      ],
      answer: 'اليد الواحدة لا تصفق'
    },
    {
      id: 'images-e2',
      difficulty: 1,
      type: 'images',
      question: 'ما المثل الذي تجمعه الصورتان؟',
      images: [
        { src: 'images/puzzles/e2-1.jpg', alt: 'عصفور', hint: 'عصفور' },
        { src: 'images/puzzles/e2-2.jpg', alt: 'عصافير متشابهة', hint: 'عصافير متشابهة' }
      ],
      answer: 'الطيور على أشكالها تقع'
    },
    {
      id: 'images-e3',
      difficulty: 1,
      type: 'images',
      question: 'ما القول المأثور الذي تدل عليه الصورتان؟',
      images: [
        { src: 'images/puzzles/e3-1.jpg', alt: 'بيت', hint: 'بيت' },
        { src: 'images/puzzles/e3-2.jpg', alt: 'جار بجانب البيت', hint: 'جار' }
      ],
      answer: 'الجار قبل الدار'
    },
    {
      id: 'images-e4',
      difficulty: 1,
      type: 'images',
      question: 'ما الحكمة التي تدل عليها الصورتان؟',
      images: [
        { src: 'images/puzzles/e4-1.jpg', alt: 'قطرة ماء', hint: 'قطرة ماء' },
        { src: 'images/puzzles/e4-2.jpg', alt: 'صخرة', hint: 'صخرة' }
      ],
      answer: 'قطرة الماء تحفر الصخر'
    },
    {
      id: 'images-e5',
      difficulty: 1,
      type: 'images',
      question: 'ما المثل الشعبي الذي تجمعه الصورتان؟',
      images: [
        { src: 'images/puzzles/e5-1.jpg', alt: 'عصفور في اليد', hint: 'عصفور في اليد' },
        { src: 'images/puzzles/e5-2.jpg', alt: 'شجرة عليها عصافير', hint: 'شجرة وعصافير' }
      ],
      answer: 'عصفور في اليد خير من عشرة على الشجرة'
    },
    {
      id: 'images-e6',
      difficulty: 1,
      type: 'images',
      question: 'ما المثل الذي تدل عليه الصورتان؟',
      images: [
        { src: 'images/puzzles/e6-1.jpg', alt: 'شخص يعمل بجد', hint: 'شخص يعمل' },
        { src: 'images/puzzles/e6-2.jpg', alt: 'كنز', hint: 'كنز' }
      ],
      answer: 'من جدّ وجد'
    },
    {
      id: 'images-e7',
      difficulty: 1,
      type: 'images',
      question: 'ما القول المأثور الذي تدل عليه الصورتان؟',
      images: [
        { src: 'images/puzzles/e7-1.jpg', alt: 'ساعة', hint: 'ساعة' },
        { src: 'images/puzzles/e7-2.jpg', alt: 'سبيكة ذهب', hint: 'ذهب' }
      ],
      answer: 'الوقت من ذهب'
    },
    {
      id: 'images-e8',
      difficulty: 1,
      type: 'images',
      question: 'ما الحكمة التي تجمعها الصورتان؟',
      images: [
        { src: 'images/puzzles/e8-1.jpg', alt: 'كتاب مفتوح', hint: 'كتاب' },
        { src: 'images/puzzles/e8-2.jpg', alt: 'مصباح مضيء', hint: 'مصباح' }
      ],
      answer: 'العلم نور'
    },

    /* ===== المستوى الثاني: متوسط (200) ===== */
    {
      id: 'images-m1',
      difficulty: 2,
      type: 'images',
      question: 'ما القول المأثور الذي تدل عليه الصورتان؟',
      images: [
        { src: 'images/puzzles/m1-1.jpg', alt: 'قطة', hint: 'قطة' },
        { src: 'images/puzzles/m1-2.jpg', alt: 'جرس', hint: 'جرس' }
      ],
      answer: 'من يعلّق الجرس في رقبة القط؟'
    },
    {
      id: 'images-m2',
      difficulty: 2,
      type: 'images',
      question: 'ما المثل الشعبي الذي تدل عليه الصورتان؟',
      images: [
        { src: 'images/puzzles/m2-1.jpg', alt: 'مفتاح', hint: 'مفتاح' },
        { src: 'images/puzzles/m2-2.jpg', alt: 'باب ينفتح', hint: 'باب' }
      ],
      answer: 'الصبر مفتاح الفرج'
    },
    {
      id: 'images-m3',
      difficulty: 2,
      type: 'images',
      question: 'ما المثل الذي تجمعه الصور الثلاث؟',
      images: [
        { src: 'images/puzzles/m3-1.jpg', alt: 'جبل', hint: 'جبل' },
        { src: 'images/puzzles/m3-2.jpg', alt: 'جبل آخر', hint: 'جبل آخر' },
        { src: 'images/puzzles/m3-3.jpg', alt: 'شخصان يتصافحان', hint: 'مصافحة' }
      ],
      answer: 'الجبل لا يلتقي بالجبل والإنسان يلتقي بالإنسان'
    },
    {
      id: 'images-m4',
      difficulty: 2,
      type: 'images',
      question: 'ما الحكمة التي تدل عليها الصورتان؟',
      images: [
        { src: 'images/puzzles/m4-1.jpg', alt: 'رأس يفكر', hint: 'عقل' },
        { src: 'images/puzzles/m4-2.jpg', alt: 'جسم رياضي', hint: 'جسم سليم' }
      ],
      answer: 'العقل السليم في الجسم السليم'
    },
    {
      id: 'images-m5',
      difficulty: 2,
      type: 'images',
      question: 'ما النصيحة التي تجمعها الصورتان؟',
      images: [
        { src: 'images/puzzles/m5-1.jpg', alt: 'بيض', hint: 'بيض' },
        { src: 'images/puzzles/m5-2.jpg', alt: 'سلة واحدة', hint: 'سلة واحدة' }
      ],
      answer: 'لا تضع كل بيضك في سلة واحدة'
    },
    {
      id: 'images-m6',
      difficulty: 2,
      type: 'images',
      question: 'ما القول المأثور الذي تدل عليه الصورتان؟',
      images: [
        { src: 'images/puzzles/m6-1.jpg', alt: 'طريق طويل', hint: 'طريق' },
        { src: 'images/puzzles/m6-2.jpg', alt: 'أثر قدم', hint: 'خطوة' }
      ],
      answer: 'من سار على الدرب وصل'
    },
    {
      id: 'images-m7',
      difficulty: 2,
      type: 'images',
      question: 'ما الحكمة التي يرمز إليها الميزان والسهم المتجاوز؟',
      images: [
        { src: 'images/puzzles/m7-1.jpg', alt: 'ميزان', hint: 'ميزان' },
        { src: 'images/puzzles/m7-2.jpg', alt: 'سهم يتجاوز الحد', hint: 'تجاوز الحد' }
      ],
      answer: 'كل شيء إذا زاد عن حده انقلب إلى ضده'
    },
    {
      id: 'images-m8',
      difficulty: 2,
      type: 'images',
      question: 'ما القول المأثور الذي تدل عليه الصورتان؟',
      images: [
        { src: 'images/puzzles/m8-1.jpg', alt: 'وجه بلا حياء', hint: 'وجه بلا حياء' },
        { src: 'images/puzzles/m8-2.jpg', alt: 'شخص يفعل ما يريد', hint: 'فعل ما يريد' }
      ],
      answer: 'إذا لم تستحِ فاصنع ما شئت'
    },

    /* ===== المستوى الثالث: صعب (300) ===== */
    {
      id: 'images-h1',
      difficulty: 3,
      type: 'images',
      question: 'ما القول الذي يربط بين بداية الطريق ونهايته؟',
      images: [
        { src: 'images/puzzles/h1-1.jpg', alt: 'بداية طريق', hint: 'بداية' },
        { src: 'images/puzzles/h1-2.jpg', alt: 'خاتمة ملف', hint: 'خاتمة' }
      ],
      answer: 'الأعمال بخواتيمها'
    },
    {
      id: 'images-h2',
      difficulty: 3,
      type: 'images',
      question: 'ما القول المأثور الذي تدل عليه الصورتان؟',
      images: [
        { src: 'images/puzzles/h2-1.jpg', alt: 'نجوم الليل', hint: 'نجوم الليل' },
        { src: 'images/puzzles/h2-2.jpg', alt: 'سراج مضيء', hint: 'سراج' }
      ],
      answer: 'من طلب العلا سهر الليالي'
    },
    {
      id: 'images-h3',
      difficulty: 3,
      type: 'images',
      question: 'ما الحكمة التي تجمعها الريح والشراع؟',
      images: [
        { src: 'images/puzzles/h3-1.jpg', alt: 'ريح تهب', hint: 'ريح' },
        { src: 'images/puzzles/h3-2.jpg', alt: 'شراع سفينة', hint: 'شراع' }
      ],
      answer: 'إذا هبت رياحك فاغتنمها'
    },
    {
      id: 'images-h4',
      difficulty: 3,
      type: 'images',
      question: 'ما المثل الشعبي الذي تدل عليه الصورتان؟',
      images: [
        { src: 'images/puzzles/h4-1.jpg', alt: 'قشة', hint: 'قشة' },
        { src: 'images/puzzles/h4-2.jpg', alt: 'جمل', hint: 'جمل' }
      ],
      answer: 'القشة التي قصمت ظهر البعير'
    },
    {
      id: 'images-h5',
      difficulty: 3,
      type: 'images',
      question: 'ما الحكمة التي تدل عليها الصورتان؟',
      images: [
        { src: 'images/puzzles/h5-1.jpg', alt: 'عاصفة ومطر', hint: 'عاصفة' },
        { src: 'images/puzzles/h5-2.jpg', alt: 'نبات ينمو بعد المطر', hint: 'نبات ينمو' }
      ],
      answer: 'رب ضارة نافعة'
    },
    {
      id: 'images-h6',
      difficulty: 3,
      type: 'images',
      question: 'ما القول المأثور الذي تدل عليه الصورتان؟',
      images: [
        { src: 'images/puzzles/h6-1.jpg', alt: 'يد تمسك بالمال', hint: 'يد تمسك' },
        { src: 'images/puzzles/h6-2.jpg', alt: 'كيس فارغ', hint: 'كيس فارغ' }
      ],
      answer: 'الطمع يقلّ ما جمع'
    },
    {
      id: 'images-h7',
      difficulty: 3,
      type: 'images',
      question: 'ما الحكمة التي يرمز إليها المنبر والورقة؟',
      images: [
        { src: 'images/puzzles/h7-1.jpg', alt: 'منبر', hint: 'منبر' },
        { src: 'images/puzzles/h7-2.jpg', alt: 'ورقة مكتوبة', hint: 'كلمة مكتوبة' }
      ],
      answer: 'لكل مقام مقال'
    },
    {
      id: 'images-h8',
      difficulty: 3,
      type: 'images',
      question: 'ما المثل الشعبي الذي تدل عليه الصورتان؟',
      images: [
        { src: 'images/puzzles/h8-1.jpg', alt: 'ساعة تدور بسرعة', hint: 'سرعة' },
        { src: 'images/puzzles/h8-2.jpg', alt: 'شخص نادم', hint: 'ندم' }
      ],
      answer: 'في العجلة الندامة'
    }
  ]
});
