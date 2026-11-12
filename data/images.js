/* ============================================================
   باب: الصور (الأمثال والألغاز المصوّرة)
   ------------------------------------------------------------
   كل سؤال يحتوي مصفوفة images. كل عنصر:
     src  : مسار الصورة  (مثال: images/puzzles/100-t1-1.jpg)
     alt  : وصف الصورة
     hint : نص يظهر على بطاقة البديل إن لم توجد الصورة
   ضع الصور في مجلد images/puzzles/ بنفس الأسماء أدناه.
   ============================================================ */
window.JEEM_DOORS = window.JEEM_DOORS || [];

window.JEEM_DOORS.push({
  id: 'images',
  name: 'الصور',
  desc: 'مثل شعبي من الصور',
  icon: 'images',
  levels: [100, 200, 300],
  questions: [
    {
      id: 'images-100-t1',
      points: 100,
      owner: 1,
      type: 'images',
      question: 'ما المثل الشعبي الذي تدل عليه الصورتان؟',
      hint: 'فكّر في التعاون بين شخصين.',
      images: [
        { src: 'images/puzzles/100-t1-1.jpg', alt: 'يد', hint: 'يد' },
        { src: 'images/puzzles/100-t1-2.jpg', alt: 'يد أخرى', hint: 'يد أخرى' }
      ],
      answer: 'اليد الواحدة لا تصفّق'
    },
    {
      id: 'images-100-t2',
      points: 100,
      owner: 2,
      type: 'images',
      question: 'ما القول المأثور الذي تدل عليه الصورتان؟',
      images: [
        { src: 'images/puzzles/100-t2-1.jpg', alt: 'قطة', hint: 'قطة' },
        { src: 'images/puzzles/100-t2-2.jpg', alt: 'جرس', hint: 'جرس' }
      ],
      answer: 'من يعلّق الجرس في رقبة القط؟ — أي: من يجرؤ على تنفيذ الفكرة الصعبة.'
    },
    {
      id: 'images-200-t1',
      points: 200,
      owner: 1,
      type: 'images',
      question: 'ما الحكمة التي تدل عليها الصورتان؟',
      images: [
        { src: 'images/puzzles/200-t1-1.jpg', alt: 'قطرة ماء', hint: 'قطرة ماء' },
        { src: 'images/puzzles/200-t1-2.jpg', alt: 'صخرة', hint: 'صخرة' }
      ],
      answer: 'قطرة الماء تحفر الصخر — أي: المثابرة تبلغ ما لا يبلغه القوة.'
    },
    {
      id: 'images-200-t2',
      points: 200,
      owner: 2,
      type: 'images',
      question: 'ما المثل الشعبي الذي تجمعه الصور الثلاث؟',
      images: [
        { src: 'images/puzzles/200-t2-1.jpg', alt: 'عصفور', hint: 'عصفور' },
        { src: 'images/puzzles/200-t2-2.jpg', alt: 'يد', hint: 'يد' },
        { src: 'images/puzzles/200-t2-3.jpg', alt: 'شجرة', hint: 'شجرة' }
      ],
      answer: 'عصفور في اليد خير من عشرة على الشجرة'
    },
    {
      id: 'images-300-t1',
      points: 300,
      owner: 1,
      type: 'images',
      question: 'ما المثل الشعبي الذي تدل عليه الصور الثلاث؟',
      images: [
        { src: 'images/puzzles/300-t1-1.jpg', alt: 'صبر', hint: 'صبر' },
        { src: 'images/puzzles/300-t1-2.jpg', alt: 'مفتاح', hint: 'مفتاح' },
        { src: 'images/puzzles/300-t1-3.jpg', alt: 'باب', hint: 'باب' }
      ],
      answer: 'الصبر مفتاح الفرج'
    },
    {
      id: 'images-300-t2',
      points: 300,
      owner: 2,
      type: 'images',
      question: 'ما المثل الشعبي الذي تدل عليه الصور الثلاث؟',
      images: [
        { src: 'images/puzzles/300-t2-1.jpg', alt: 'جبل', hint: 'جبل' },
        { src: 'images/puzzles/300-t2-2.jpg', alt: 'جبل آخر', hint: 'جبل آخر' },
        { src: 'images/puzzles/300-t2-3.jpg', alt: 'شخصان يتصافحان', hint: 'شخصان' }
      ],
      answer: 'الجبل لا يلتقي بالجبل، والإنسان يلتقي بالإنسان'
    }
  ]
});
