/* ============================================================
   باب: السيرة الذاتية (الشخصيات)
   ------------------------------------------------------------
   ضع صور الشخصيات في: images/biographies/
   وحدّث الحقل image في كل سؤال. إن لم توجد الصورة يظهر
   مكان بديل أنيق يعرض نص التلميح (hint) تلقائيًا.
   difficulty: 1/2/3 يقابل مستويات 100/200/300 نقطة.
   ============================================================ */
window.JEEM_DOORS = window.JEEM_DOORS || [];

window.JEEM_DOORS.push({
  id: 'biographies',
  name: 'السيرة الذاتية',
  desc: 'من هي هذه الشخصية؟',
  icon: 'bio',
  levels: [100, 200, 300],
  bank: [
    /* ===== المستوى الأول: سهل (100) ===== */
    {
      id: 'bio-e1',
      difficulty: 1,
      type: 'image',
      image: 'images/biographies/ibn-khaldun.jpg',
      imageAlt: 'صورة الشخصية المطلوبة',
      hint: 'مؤرخ وفيلسوف وُلد في تونس، يُعدّ مؤسس علم الاجتماع، وأشهر كتبه «المقدمة».',
      question: 'من هي هذه الشخصية؟',
      answer: 'ابن خلدون'
    },
    {
      id: 'bio-e2',
      difficulty: 1,
      type: 'image',
      image: 'images/biographies/ibn-sina.jpg',
      imageAlt: 'صورة الشخصية المطلوبة',
      hint: 'طبيب وفيلسوف مسلم لُقّب بأمير الأطباء، وكتابه «القانون في الطب» دُرّس في أوروبا قرونًا.',
      question: 'من هي هذه الشخصية؟',
      answer: 'ابن سينا'
    },
    {
      id: 'bio-e3',
      difficulty: 1,
      type: 'image',
      image: 'images/biographies/mandela.jpg',
      imageAlt: 'صورة الشخصية المطلوبة',
      hint: 'رئيس جنوب أفريقيا الأسبق، أمضى 27 عامًا في السجن، وحصل على نوبل للسلام عام 1993.',
      question: 'من هي هذه الشخصية؟',
      answer: 'نيلسون مانديلا'
    },
    {
      id: 'bio-e4',
      difficulty: 1,
      type: 'image',
      image: 'images/biographies/mohamed-salah.jpg',
      imageAlt: 'صورة الشخصية المطلوبة',
      hint: 'لاعب كرة قدم مصري لُقّب بـ«الملك المصري»، برز مع نادي ليفربول ومنتخب مصر.',
      question: 'من هي هذه الشخصية؟',
      answer: 'محمد صلاح'
    },
    {
      id: 'bio-e5',
      difficulty: 1,
      type: 'image',
      image: 'images/biographies/naguib-mahfouz.jpg',
      imageAlt: 'صورة الشخصية المطلوبة',
      hint: 'أديب مصري، أول عربي يفوز بجائزة نوبل في الأدب عام 1988، وصاحب «الثلاثية».',
      question: 'من هي هذه الشخصية؟',
      answer: 'نجيب محفوظ'
    },
    {
      id: 'bio-e6',
      difficulty: 1,
      type: 'image',
      image: 'images/biographies/umm-kulthum.jpg',
      imageAlt: 'صورة الشخصية المطلوبة',
      hint: 'مطربة مصرية لُقّبت بـ«كوكب الشرق»، ومن أشهر أغانيها «الأطلال».',
      question: 'من هي هذه الشخصية؟',
      answer: 'أم كلثوم'
    },
    {
      id: 'bio-e7',
      difficulty: 1,
      type: 'image',
      image: 'images/biographies/yasser-arafat.jpg',
      imageAlt: 'صورة الشخصية المطلوبة',
      hint: 'زعيم فلسطيني لُقّب بـ«أبو عمار»، وأول رئيس للسلطة الوطنية الفلسطينية.',
      question: 'من هي هذه الشخصية؟',
      answer: 'ياسر عرفات'
    },
    {
      id: 'bio-e8',
      difficulty: 1,
      type: 'image',
      image: 'images/biographies/gamal-abdel-nasser.jpg',
      imageAlt: 'صورة الشخصية المطلوبة',
      hint: 'رئيس مصري أعلن تأميم قناة السويس عام 1956، ومن أبرز قادة حركة عدم الانحياز.',
      question: 'من هي هذه الشخصية؟',
      answer: 'جمال عبد الناصر'
    },

    /* ===== المستوى الثاني: متوسط (200) ===== */
    {
      id: 'bio-m1',
      difficulty: 2,
      type: 'image',
      image: 'images/biographies/einstein.jpg',
      imageAlt: 'صورة الشخصية المطلوبة',
      hint: 'عالم فيزياء ألماني، صاحب النظرية النسبية، وحاصل على جائزة نوبل في الفيزياء عام 1921.',
      question: 'من هي هذه الشخصية؟',
      answer: 'ألبرت أينشتاين'
    },
    {
      id: 'bio-m2',
      difficulty: 2,
      type: 'image',
      image: 'images/biographies/nazik-malaika.jpg',
      imageAlt: 'صورة الشخصية المطلوبة',
      hint: 'شاعرة عراقية رائدة في الشعر الحر، من دواوينها «شظايا ورماد» و«قرار الموجة».',
      question: 'من هي هذه الشخصية؟',
      answer: 'نازك الملائكة'
    },
    {
      id: 'bio-m3',
      difficulty: 2,
      type: 'image',
      image: 'images/biographies/tariq-ibn-ziyad.jpg',
      imageAlt: 'صورة الشخصية المطلوبة',
      hint: 'قائد مسلم قاد فتح الأندلس سنة 711م، ولا يزال اسمه مرتبطًا بالجبل الذي عبر منه.',
      question: 'من هي هذه الشخصية؟',
      answer: 'طارق بن زياد'
    },
    {
      id: 'bio-m4',
      difficulty: 2,
      type: 'image',
      image: 'images/biographies/marie-curie.jpg',
      imageAlt: 'صورة الشخصية المطلوبة',
      hint: 'عالمة بولندية-فرنسية، أول امرأة تحصل على نوبل، ونالت الجائزة مرتين في الفيزياء والكيمياء.',
      question: 'من هي هذه الشخصية؟',
      answer: 'ماري كوري'
    },
    {
      id: 'bio-m5',
      difficulty: 2,
      type: 'image',
      image: 'images/biographies/al-khwarizmi.jpg',
      imageAlt: 'صورة الشخصية المطلوبة',
      hint: 'عالم رياضيات مسلم عاش في بغداد، يُنسب إليه علم الجبر واسم «الخوارزمية».',
      question: 'من هي هذه الشخصية؟',
      answer: 'محمد بن موسى الخوارزمي'
    },
    {
      id: 'bio-m6',
      difficulty: 2,
      type: 'image',
      image: 'images/biographies/ibn-battuta.jpg',
      imageAlt: 'صورة الشخصية المطلوبة',
      hint: 'رحّالة مغربي من طنجة، دوّن رحلاته في كتاب «تحفة النظار في غرائب الأمصار».',
      question: 'من هي هذه الشخصية؟',
      answer: 'ابن بطوطة'
    },
    {
      id: 'bio-m7',
      difficulty: 2,
      type: 'image',
      image: 'images/biographies/neil-armstrong.jpg',
      imageAlt: 'صورة الشخصية المطلوبة',
      hint: 'رائد فضاء أمريكي، أول إنسان يخطو على سطح القمر عام 1969.',
      question: 'من هي هذه الشخصية؟',
      answer: 'نيل أرمسترونغ'
    },
    {
      id: 'bio-m8',
      difficulty: 2,
      type: 'image',
      image: 'images/biographies/king-faisal.jpg',
      imageAlt: 'صورة الشخصية المطلوبة',
      hint: 'ملك السعودية الذي أعلن حظر النفط عام 1973، واغتيل عام 1975.',
      question: 'من هي هذه الشخصية؟',
      answer: 'الملك فيصل بن عبد العزيز'
    },

    /* ===== المستوى الثالث: صعب (300) ===== */
    {
      id: 'bio-h1',
      difficulty: 3,
      type: 'image',
      image: 'images/biographies/saladin.jpg',
      imageAlt: 'صورة الشخصية المطلوبة',
      hint: 'قائد مسلم مؤسس الدولة الأيوبية، استعاد القدس عام 1187.',
      question: 'من هي هذه الشخصية؟',
      answer: 'صلاح الدين الأيوبي'
    },
    {
      id: 'bio-h2',
      difficulty: 3,
      type: 'image',
      image: 'images/biographies/harun-al-rashid.jpg',
      imageAlt: 'صورة الشخصية المطلوبة',
      hint: 'خليفة عباسي ازدهرت بغداد في عهده، وارتبط اسمه بحكايات «ألف ليلة وليلة».',
      question: 'من هي هذه الشخصية؟',
      answer: 'هارون الرشيد'
    },
    {
      id: 'bio-h3',
      difficulty: 3,
      type: 'image',
      image: 'images/biographies/marie-antoinette.jpg',
      imageAlt: 'صورة الشخصية المطلوبة',
      hint: 'ملكة فرنسا وزوجة لويس السادس عشر، أُعدمت بالمقصلة عام 1793.',
      question: 'من هي هذه الشخصية؟',
      answer: 'ماري أنطوانيت'
    },
    {
      id: 'bio-h4',
      difficulty: 3,
      type: 'image',
      image: 'images/biographies/archimedes.jpg',
      imageAlt: 'صورة الشخصية المطلوبة',
      hint: 'عالم يوناني شهير بقانون الطفو، وترتبط به صيحة «يوريكا».',
      question: 'من هي هذه الشخصية؟',
      answer: 'أرخميدس'
    },
    {
      id: 'bio-h5',
      difficulty: 3,
      type: 'image',
      image: 'images/biographies/ibn-al-haytham.jpg',
      imageAlt: 'صورة الشخصية المطلوبة',
      hint: 'عالم مسلم يُعدّ مؤسس علم البصريات الحديث، وصاحب «كتاب المناظر».',
      question: 'من هي هذه الشخصية؟',
      answer: 'ابن الهيثم'
    },
    {
      id: 'bio-h6',
      difficulty: 3,
      type: 'image',
      image: 'images/biographies/galileo.jpg',
      imageAlt: 'صورة الشخصية المطلوبة',
      hint: 'فلكي إيطالي أكد دوران الأرض حول الشمس، وتعرّض للمحاكمة من الكنيسة.',
      question: 'من هي هذه الشخصية؟',
      answer: 'جاليليو جاليلي'
    },
    {
      id: 'bio-h7',
      difficulty: 3,
      type: 'image',
      image: 'images/biographies/fatima-al-fihri.jpg',
      imageAlt: 'صورة الشخصية المطلوبة',
      hint: 'امرأة قيروانية أسست جامع القرويين بفاس، الذي يُعد من أقدم الجامعات العاملة.',
      question: 'من هي هذه الشخصية؟',
      answer: 'فاطمة الفهرية'
    },
    {
      id: 'bio-h8',
      difficulty: 3,
      type: 'image',
      image: 'images/biographies/michelangelo.jpg',
      imageAlt: 'صورة الشخصية المطلوبة',
      hint: 'فنان إيطالي من عصر النهضة، نحت تمثال «داود» ورسم سقف كنيسة سيستين.',
      question: 'من هي هذه الشخصية؟',
      answer: 'مايكل أنجلو'
    }
  ]
});
