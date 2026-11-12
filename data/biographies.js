/* ============================================================
   باب: السيرة الذاتية (الشخصيات)
   ------------------------------------------------------------
   ضع صور الشخصيات في: images/biographies/
   وحدّث الحقل image في كل سؤال. إن لم توجد الصورة يظهر
   مكان بديل أنيق يعرض نص التلميح (hint) تلقائيًا.
   ============================================================ */
window.JEEM_DOORS = window.JEEM_DOORS || [];

window.JEEM_DOORS.push({
  id: 'biographies',
  name: 'السيرة الذاتية',
  desc: 'من هي هذه الشخصية؟',
  icon: 'bio',
  levels: [100, 200, 300],
  questions: [
    {
      id: 'biographies-100-t1',
      points: 100,
      owner: 1,
      type: 'image',
      image: 'images/biographies/ibn-khaldun.jpg',
      imageAlt: 'صورة الشخصية المطلوبة',
      hint: 'مؤرخ وفيلسوف وُلد في تونس، يُعدّ مؤسس علم الاجتماع، وأشهر كتبه «المقدمة».',
      question: 'من هي هذه الشخصية؟',
      answer: 'ابن خلدون'
    },
    {
      id: 'biographies-100-t2',
      points: 100,
      owner: 2,
      type: 'image',
      image: 'images/biographies/ibn-sina.jpg',
      imageAlt: 'صورة الشخصية المطلوبة',
      hint: 'طبيب وفيلسوف مسلم لُقّب بأمير الأطباء، وكتابه «القانون في الطب» دُرّس في أوروبا قرونًا.',
      question: 'من هي هذه الشخصية؟',
      answer: 'ابن سينا'
    },
    {
      id: 'biographies-200-t1',
      points: 200,
      owner: 1,
      type: 'image',
      image: 'images/biographies/einstein.jpg',
      imageAlt: 'صورة الشخصية المطلوبة',
      hint: 'عالم فيزياء ألماني، صاحب النظرية النسبية، وحاصل على جائزة نوبل في الفيزياء عام ١٩٢١.',
      question: 'من هي هذه الشخصية؟',
      answer: 'ألبرت أينشتاين'
    },
    {
      id: 'biographies-200-t2',
      points: 200,
      owner: 2,
      type: 'image',
      image: 'images/biographies/nazik-malaika.jpg',
      imageAlt: 'صورة الشخصية المطلوبة',
      hint: 'شاعرة عراقية رائدة في الشعر الحر، من دواوينها «شظايا ورماد» و«قرار الموجة».',
      question: 'من هي هذه الشخصية؟',
      answer: 'نازك الملائكة'
    },
    {
      id: 'biographies-300-t1',
      points: 300,
      owner: 1,
      type: 'image',
      image: 'images/biographies/tariq-ibn-ziyad.jpg',
      imageAlt: 'صورة الشخصية المطلوبة',
      hint: 'قائد مسلم قاد فتح الأندلس سنة ٧١١م، ولا يزال اسمه مرتبطًا بالجبل الذي عبر منه.',
      question: 'من هي هذه الشخصية؟',
      answer: 'طارق بن زياد'
    },
    {
      id: 'biographies-300-t2',
      points: 300,
      owner: 2,
      type: 'image',
      image: 'images/biographies/mandela.jpg',
      imageAlt: 'صورة الشخصية المطلوبة',
      hint: 'رئيس جنوب أفريقيا الأسبق، أمضى ٢٧ عامًا في السجن، وحصل على نوبل للسلام عام ١٩٩٣.',
      question: 'من هي هذه الشخصية؟',
      answer: 'نيلسون مانديلا'
    }
  ]
});
