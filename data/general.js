/* ============================================================
   باب: الأسئلة العامة
   ------------------------------------------------------------
   «bank» هو بنك أسئلة الباب، ويحتوي أسئلة أكثر من أزرار اللوحة.
   المحرك يوزّع تلقائيًا سؤالين لكل مستوى (واحد لكل فريق):
     difficulty: 1  → المستوى 100 نقطة (سهل)
     difficulty: 2  → المستوى 200 نقطة (متوسط)
     difficulty: 3  → المستوى 300 نقطة (صعب)
   ويمكن استخدام level: 1/2/3 أو points: 100/200/300 بدلًا منها.
   كل سؤال يحتاج: id فريد، question، answer، ودائمتًّا difficulty.
   لا تكرر السؤال نفسه في الباب نفسه أو في الأبواب الأخرى.
   ============================================================ */
window.JEEM_DOORS = window.JEEM_DOORS || [];

window.JEEM_DOORS.push({
  id: 'general',
  name: 'الأسئلة العامة',
  desc: 'معلومات عامة متنوعة',
  icon: 'general',
  levels: [100, 200, 300],
  bank: [
    /* ===== المستوى الأول: سهل (100) ===== */
    {
      id: 'general-e1',
      difficulty: 1,
      type: 'text',
      question: 'ما أكبر دولة عربية من حيث المساحة؟',
      answer: 'الجزائر'
    },
    {
      id: 'general-e2',
      difficulty: 1,
      type: 'text',
      question: 'ما العملة الرسمية في اليابان؟',
      answer: 'الين الياباني'
    },
    {
      id: 'general-e3',
      difficulty: 1,
      type: 'text',
      question: 'ما عاصمة المملكة العربية السعودية؟',
      answer: 'الرياض'
    },
    {
      id: 'general-e4',
      difficulty: 1,
      type: 'text',
      question: 'ما الكوكب المعروف بالكوكب الأحمر؟',
      answer: 'المريخ'
    },
    {
      id: 'general-e5',
      difficulty: 1,
      type: 'text',
      question: 'ما أكبر محيط في العالم؟',
      answer: 'المحيط الهادئ'
    },
    {
      id: 'general-e6',
      difficulty: 1,
      type: 'text',
      question: 'كم عدد أيام السنة الميلادية غير الكبيسة؟',
      answer: '365 يومًا'
    },
    {
      id: 'general-e7',
      difficulty: 1,
      type: 'text',
      question: 'ما العضو الذي يضخ الدم في جسم الإنسان؟',
      answer: 'القلب'
    },
    {
      id: 'general-e8',
      difficulty: 1,
      type: 'text',
      question: 'في أي قارة تقع دولة مصر؟',
      answer: 'قارة أفريقيا'
    },

    /* ===== المستوى الثاني: متوسط (200) ===== */
    {
      id: 'general-m1',
      difficulty: 2,
      type: 'text',
      question: 'في أي قارة تقع دولة البرازيل؟',
      answer: 'أمريكا الجنوبية'
    },
    {
      id: 'general-m2',
      difficulty: 2,
      type: 'text',
      question: 'ما المضيق الذي يفصل المغرب عن إسبانيا؟',
      answer: 'مضيق جبل طارق'
    },
    {
      id: 'general-m3',
      difficulty: 2,
      type: 'text',
      question: 'ما العنصر الكيميائي الذي رمزه Fe؟',
      answer: 'الحديد'
    },
    {
      id: 'general-m4',
      difficulty: 2,
      type: 'text',
      question: 'ما أعلى قمة جبلية في العالم؟',
      answer: 'قمة إيفرست'
    },
    {
      id: 'general-m5',
      difficulty: 2,
      type: 'text',
      question: 'في أي سنة هبط الإنسان على سطح القمر لأول مرة؟',
      answer: 'عام 1969'
    },
    {
      id: 'general-m6',
      difficulty: 2,
      type: 'text',
      question: 'كم عدد الدول الأعضاء في جامعة الدول العربية؟',
      answer: '22 دولة'
    },
    {
      id: 'general-m7',
      difficulty: 2,
      type: 'text',
      question: 'من أول رئيس للولايات المتحدة الأمريكية؟',
      answer: 'جورج واشنطن'
    },
    {
      id: 'general-m8',
      difficulty: 2,
      type: 'text',
      question: 'ما الدولة المعروفة ببلاد الشمس المشرقة؟',
      answer: 'اليابان'
    },

    /* ===== المستوى الثالث: صعب (300) ===== */
    {
      id: 'general-h1',
      difficulty: 3,
      type: 'text',
      question: 'ما أطول سلسلة جبال في العالم؟',
      answer: 'سلسلة جبال الأنديز'
    },
    {
      id: 'general-h2',
      difficulty: 3,
      type: 'text',
      question: 'ما أكبر بحر داخلي مغلق في العالم؟',
      answer: 'بحر قزوين'
    },
    {
      id: 'general-h3',
      difficulty: 3,
      type: 'text',
      question: 'ما أعلى شلال في العالم؟',
      answer: 'شلالات آنجل في فنزويلا'
    },
    {
      id: 'general-h4',
      difficulty: 3,
      type: 'text',
      question: 'في أي سنة تأسست منظمة الأمم المتحدة؟',
      answer: 'عام 1945'
    },
    {
      id: 'general-h5',
      difficulty: 3,
      type: 'text',
      question: 'ما أصغر دولة في العالم من حيث المساحة؟',
      answer: 'الفاتيكان'
    },
    {
      id: 'general-h6',
      difficulty: 3,
      type: 'text',
      question: 'ما الغاز الأكثر وفرة في الغلاف الجوي للأرض؟',
      answer: 'النيتروجين'
    },
    {
      id: 'general-h7',
      difficulty: 3,
      type: 'text',
      question: 'ما اسم أعمق نقطة معروفة في المحيطات؟',
      answer: 'خندق ماريانا'
    },
    {
      id: 'general-h8',
      difficulty: 3,
      type: 'text',
      question: 'ما الدولة الوحيدة التي تشغل قارة كاملة؟',
      answer: 'أستراليا'
    }
  ]
});
