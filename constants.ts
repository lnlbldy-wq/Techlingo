import { Term, TermCategory } from './types';

export const INITIAL_TERMS: Term[] = [
  {
    id: '1',
    term: 'AI',
    arabicTerm: 'الذكاء الاصطناعي',
    definition: 'برامج وأنظمة حاسوبية تحاكي قدرات العقل البشري مثل التعلم، الاستنتاج، وردود الفعل.',
    example: 'تطبيقات المساعد الصوتي مثل سيري وأليكسا، ونظام التعرف على الوجه في الجوال.',
    category: TermCategory.AI
  },
  {
    id: '2',
    term: 'Cloud',
    arabicTerm: 'السحابة الإلكترونية',
    definition: 'تقنية تسمح لك بتخزين ملفاتك وتشغيل البرامج عبر الإنترنت بدلاً من تخزينها على القرص الصلب في جهازك.',
    example: 'جوجل درايف (Google Drive) وآي كلاود (iCloud) حيث يمكنك الوصول لصورك من أي مكان.',
    category: TermCategory.CLOUD
  },
  {
    id: '3',
    term: 'Algorithm',
    arabicTerm: 'الخوارزمية',
    definition: 'مجموعة من الخطوات المرتبة والمنطقية لحل مشكلة معينة أو إنجاز مهمة محددة.',
    example: 'وصفة الطبخ تعتبر خوارزمية؛ لأنك تتبع خطوات محددة للوصول للنتيجة النهائية.',
    category: TermCategory.PROGRAMMING
  },
  {
    id: '4',
    term: 'Bug',
    arabicTerm: 'ثغرة / خطأ برمجي',
    definition: 'خطأ في كود البرنامج يجعله يعمل بشكل غير صحيح أو يتوقف عن العمل تماماً.',
    example: 'عندما تحاول فتح تطبيق ويغلق فجأة بدون سبب، هذا غالباً بسبب Bug.',
    category: TermCategory.PROGRAMMING
  },
  {
    id: '5',
    term: 'Frontend',
    arabicTerm: 'الواجهة الأمامية',
    definition: 'الجزء الذي يراه المستخدم ويتفاعل معه في الموقع أو التطبيق (الأزرار، النصوص، الألوان).',
    example: 'شاشة تسجيل الدخول في فيسبوك تعتبر Frontend.',
    category: TermCategory.PROGRAMMING
  },
  {
    id: '6',
    term: 'Backend',
    arabicTerm: 'الواجهة الخلفية',
    definition: 'الجزء الخفي من الموقع الذي يتعامل مع البيانات والخوادم وقواعد البيانات.',
    example: 'عندما تضغط زر "تسجيل الدخول"، الـ Backend هو من يتحقق من صحة كلمة المرور.',
    category: TermCategory.PROGRAMMING
  },
  {
    id: '7',
    term: 'IP Address',
    arabicTerm: 'عنوان البروتوكول',
    definition: 'رقم فريد يعطى لكل جهاز يتصل بالإنترنت، مثل رقم الهوية للجهاز.',
    example: 'مثل عنوان منزلك، الساعي يحتاج العنوان ليوصل لك الطرد، والإنترنت يحتاج الـ IP ليوصل لك البيانات.',
    category: TermCategory.NETWORKING
  },
  {
    id: '8',
    term: 'RAM',
    arabicTerm: 'ذاكرة الوصول العشوائي',
    definition: 'ذاكرة مؤقتة يستخدمها الحاسب لتخزين البيانات التي يعمل عليها حالياً وبسرعة عالية.',
    example: 'مثل الطاولة التي تضع عليها أوراقك وأنت تذاكر. إذا أطفأت الجهاز، تمسح هذه الذاكرة.',
    category: TermCategory.HARDWARE
  }
];
