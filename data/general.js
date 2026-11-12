/* ============================================================
   باب: الأسئلة العامة
   ------------------------------------------------------------
   لكل باب ٦ أسئلة: ٣ للفريق الأول (owner: 1) و٣ للفريق الثاني (owner: 2)
   بمستويات ١٠٠ / ٢٠٠ / ٣٠٠ نقطة.
   الحقول المتاحة لأي سؤال:
     id       : معرّف فريد لا يتكرر (لا تغيّره بعد بدء لعبة محفوظة)
     points   : قيمة السؤال بالنقاط
     owner    : صاحب السؤال (1 أو 2)
     question : نص السؤال
     answer   : نص الإجابة
     type     : 'text' | 'image' | 'images'
     image    : مسار صورة واحدة (اختياري)
     imageAlt : وصف الصورة (اختياري)
     images   : مصفوفة صور [{ src, alt, hint }] لباب الصور
     hint     : تلميح يظهر تحت السؤال (اختياري)
   ============================================================ */
window.JEEM_DOORS = window.JEEM_DOORS || [];

window.JEEM_DOORS.push({
  id: 'general',
  name: 'الأسئلة العامة',
  desc: 'معلومات عامة متنوعة',
  icon: 'general',
  levels: [100, 200, 300],
  questions: [
    {
      id: 'general-100-t1',
      points: 100,
      owner: 1,
      type: 'text',
      question: 'ما أكبر دولة عربية من حيث المساحة؟',
      answer: 'الجزائر'
    },
    {
      id: 'general-100-t2',
      points: 100,
      owner: 2,
      type: 'text',
      question: 'ما العملة الرسمية في اليابان؟',
      answer: 'الين الياباني'
    },
    {
      id: 'general-200-t1',
      points: 200,
      owner: 1,
      type: 'text',
      question: 'في أي قارة تقع دولة البرازيل؟',
      answer: 'أمريكا الجنوبية'
    },
    {
      id: 'general-200-t2',
      points: 200,
      owner: 2,
      type: 'text',
      question: 'ما المضيق الذي يفصل المغرب عن إسبانيا؟',
      answer: 'مضيق جبل طارق'
    },
    {
      id: 'general-300-t1',
      points: 300,
      owner: 1,
      type: 'text',
      question: 'ما أطول سلسلة جبال في العالم؟',
      answer: 'سلسلة جبال الأنديز في أمريكا الجنوبية'
    },
    {
      id: 'general-300-t2',
      points: 300,
      owner: 2,
      type: 'text',
      question: 'ما أكبر بحر داخلي (بحيرة مغلقة) في العالم؟',
      answer: 'بحر قزوين'
    }
  ]
});
