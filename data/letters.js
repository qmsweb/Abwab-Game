/* ============================================================
   باب: الحروف والكلمات
   ============================================================ */
window.JEEM_DOORS = window.JEEM_DOORS || [];

window.JEEM_DOORS.push({
  id: 'letters',
  name: 'الحروف',
  desc: 'ألعاب الحروف والكلمات',
  icon: 'letters',
  levels: [100, 200, 300],
  questions: [
    {
      id: 'letters-100-t1',
      points: 100,
      owner: 1,
      type: 'text',
      question: 'ما الحرف الذي يلي حرف الطاء في ترتيب الحروف الهجائية؟',
      answer: 'الظاء'
    },
    {
      id: 'letters-100-t2',
      points: 100,
      owner: 2,
      type: 'text',
      question: 'كم عدد حروف كلمة «استعمار»؟',
      answer: 'سبعة حروف'
    },
    {
      id: 'letters-200-t1',
      points: 200,
      owner: 1,
      type: 'text',
      question: 'رتّب الحروف (ب - ن - ا - ي - ة) لتكوّن كلمة تدل على بناء مرتفع.',
      answer: 'بناية'
    },
    {
      id: 'letters-200-t2',
      points: 200,
      owner: 2,
      type: 'text',
      question: 'ما الكلمة المكوّنة من الحروف (ح - ا - س - و - ب) وتعني جهازًا إلكترونيًا؟',
      answer: 'حاسوب'
    },
    {
      id: 'letters-300-t1',
      points: 300,
      owner: 1,
      type: 'text',
      question: 'كم عدد الحروف المقطّعة في أول سورة البقرة، وما هي؟',
      answer: 'ثلاثة حروف: ألف، لام، ميم'
    },
    {
      id: 'letters-300-t2',
      points: 300,
      owner: 2,
      type: 'text',
      question: 'كم كلمة تحتوي على حرف الضاد في جملة: «ضرَبَ الضابطُ ضربًا شديدًا»؟',
      answer: 'ثلاث كلمات: ضرَبَ، الضابطُ، ضربًا'
    }
  ]
});
