
import { Term, TermCategory } from './types';

export const INITIAL_TERMS: Term[] = [
  // --- General IT & Internet ---
  {
    id: 'gen-it',
    term: 'Information Technology (IT)',
    arabicTerm: 'تقنية المعلومات',
    definition: 'استخدام الأنظمة الحاسوبية والشبكات لمعالجة وتخزين وتبادل البيانات الإلكترونية.',
    example: 'يعمل مهندسو IT على ضمان استمرارية الأنظمة التقنية في المؤسسات.',
    category: TermCategory.GENERAL
  },
  {
    id: 'gen-ip',
    term: 'IP Address',
    arabicTerm: 'عنوان البروتوكول',
    definition: 'رقم فريد يميز كل جهاز متصل بشبكة الحاسوب، يشبه عنوان المنزل في عالم الإنترنت.',
    example: 'يحتاج كل جهاز متصل بالواي فاي إلى IP Address للتواصل مع الراوتر.',
    category: TermCategory.GENERAL
  },
  {
    id: 'gen-os',
    term: 'Operating System (OS)',
    arabicTerm: 'نظام التشغيل',
    definition: 'البرنامج الأساسي الذي يدير موارد الجهاز ويوفر بيئة لتشغيل البرامج الأخرى.',
    example: 'تعد أنظمة Windows و macOS و Linux أشهر أنظمة تشغيل الحواسيب.',
    category: TermCategory.GENERAL
  },

  // --- AI & Data Science ---
  {
    id: 'ai-1',
    term: 'Generative AI (GenAI)',
    arabicTerm: 'الذكاء الاصطناعي التوليدي',
    definition: 'نماذج ذكاء اصطناعي قادرة على إنشاء محتوى جديد كلياً مثل النصوص والصور والأكواد.',
    example: 'استخدام GenAI في كتابة رسائل البريد الإلكتروني بشكل تلقائي.',
    category: TermCategory.AI
  },
  {
    id: 'ai-2',
    term: 'Machine Learning (ML)',
    arabicTerm: 'تعلم الآلة',
    definition: 'فرع من الذكاء الاصطناعي يركز على تطوير خوارزميات تسمح للحاسوب بالتعلم من البيانات دون برمجة صريحة.',
    example: 'تستخدم نتفليكس ML لاقتراح أفلام تناسب ذوقك الشخصي.',
    category: TermCategory.AI
  },
  {
    id: 'ai-3',
    term: 'Neural Networks',
    arabicTerm: 'الشبكات العصبية',
    definition: 'أنظمة حوسبة مستوحاة من الدماغ البشري تُستخدم للتعرف على الأنماط المعقدة.',
    example: 'تعتمد تقنية التعرف على الوجوه في الهواتف على الشبكات العصبية.',
    category: TermCategory.AI
  },
  {
    id: 'ai-4',
    term: 'Computer Vision',
    arabicTerm: 'الرؤية الحاسوبية',
    definition: 'مجال يهدف لتمكين الحواسيب من فهم وتفسير الصور والفيديوهات الرقمية.',
    example: 'تستخدم السيارات ذاتية القيادة Computer Vision لتفادي العوائق.',
    category: TermCategory.AI
  },

  // --- Programming & Dev ---
  {
    id: 'prog-1',
    term: 'API',
    arabicTerm: 'واجهة برمجة التطبيقات',
    definition: 'بروتوكول يسمح لتطبيقات مختلفة بالتواصل وتبادل البيانات مع بعضها البعض.',
    example: 'يستخدم تطبيق الطقس API للحصول على البيانات من الأرصاد الجوية.',
    category: TermCategory.PROGRAMMING
  },
  {
    id: 'prog-2',
    term: 'Framework',
    arabicTerm: 'إطار عمل',
    definition: 'مجموعة من الأدوات والمكتبات البرمجية الجاهزة التي تسهل عملية بناء التطبيقات.',
    example: 'يعتبر React إطار عمل شهير لبناء واجهات المستخدم.',
    category: TermCategory.PROGRAMMING
  },
  {
    id: 'prog-3',
    term: 'Open Source',
    arabicTerm: 'مفتوح المصدر',
    definition: 'برمجيات يكون الكود المصدري لها متاحاً للجميع للاطلاع عليه وتعديله وتوزيعه.',
    example: 'نظام تشغيل Android هو مشروع مفتوح المصدر.',
    category: TermCategory.PROGRAMMING
  },
  {
    id: 'prog-4',
    term: 'Backend',
    arabicTerm: 'خلفية النظام',
    definition: 'الجزء البرمجي الذي يعمل على الخادم ولا يراه المستخدم، ويهتم بالبيانات والمنطق.',
    example: 'تطوير قاعدة البيانات وعمليات تسجيل الدخول يتم في Backend.',
    category: TermCategory.PROGRAMMING
  },
  {
    id: 'prog-5',
    term: 'Frontend',
    arabicTerm: 'واجهة النظام',
    definition: 'كل ما يراه المستخدم ويتفاعل معه في الموقع أو التطبيق.',
    example: 'تصميم الأزرار والقوائم والألوان يقع ضمن مهام مطور Frontend.',
    category: TermCategory.PROGRAMMING
  },

  // --- Cybersecurity ---
  {
    id: 'sec-1',
    term: 'Encryption',
    arabicTerm: 'التشفير',
    definition: 'عملية تحويل البيانات إلى كود غير مفهوم لمنع الوصول غير المصرح به.',
    example: 'تستخدم تطبيقات المراسلة التشفير لحماية خصوصية المحادثات.',
    category: TermCategory.GENERAL
  },
  {
    id: 'sec-2',
    term: 'Firewall',
    arabicTerm: 'جدار الحماية',
    definition: 'نظام أمان يراقب ويتحكم في حركة مرور الشبكة بناءً على قواعد أمان محددة.',
    example: 'يعمل جدار الحماية على منع الهاكرز من اختراق جهازك.',
    category: TermCategory.GENERAL
  },
  {
    id: 'sec-3',
    term: 'Phishing',
    arabicTerm: 'التصيد الاحتيالي',
    definition: 'محاولة خداع المستخدمين للحصول على معلوماتهم الحساسة عبر رسائل مزيفة.',
    example: 'احذر من روابط البريد الإلكتروني التي تطلب كلمة مرور البنك الخاص بك.',
    category: TermCategory.GENERAL
  },

  // --- Networking & Cloud ---
  {
    id: 'cloud-1',
    term: 'Cloud Computing',
    arabicTerm: 'الحوسبة السحابية',
    definition: 'توفير موارد تقنية مثل التخزين والقوة الحسابية عبر الإنترنت بدلاً من امتلاكها محلياً.',
    example: 'تعد AWS و Google Cloud أشهر مزودي خدمات الحوسبة السحابية.',
    category: TermCategory.CLOUD
  },
  {
    id: 'net-1',
    term: 'Bandwidth',
    arabicTerm: 'عرض النطاق الترددي',
    definition: 'الكمية القصوى من البيانات التي يمكن نقلها عبر اتصال إنترنت في وقت محدد.',
    example: 'كلما زاد الـ Bandwidth، زادت سرعة تحميل الملفات الكبيرة.',
    category: TermCategory.NETWORKING
  },
  {
    id: 'net-2',
    term: 'Protocol',
    arabicTerm: 'بروتوكول',
    definition: 'مجموعة من القواعد التي تحدد كيفية تبادل البيانات بين الأجهزة في الشبكة.',
    example: 'HTTP هو البروتوكول المستخدم لتصفح مواقع الويب.',
    category: TermCategory.NETWORKING
  },

  // --- Hardware ---
  {
    id: 'hard-1',
    term: 'SSD (Solid State Drive)',
    arabicTerm: 'قرص الحالة الصلبة',
    definition: 'نوع حديث وسريع جداً من أقراص تخزين البيانات مقارنة بالأقراص التقليدية HDD.',
    example: 'ترقية حاسوبك بقرص SSD يجعل تشغيل النظام أسرع بكثير.',
    category: TermCategory.HARDWARE
  },
  {
    id: 'hard-2',
    term: 'GPU (Graphics Processing Unit)',
    arabicTerm: 'وحدة معالجة الرسوميات',
    definition: 'معالج متخصص في معالجة الصور والرسوميات، ويستخدم بكثرة في الألعاب والذكاء الاصطناعي.',
    example: 'تحتاج معالجة نماذج الذكاء الاصطناعي إلى GPU قوية.',
    category: TermCategory.HARDWARE
  },
  {
    id: 'hard-3',
    term: 'RAM (Random Access Memory)',
    arabicTerm: 'ذاكرة الوصول العشوائي',
    definition: 'الذاكرة المؤقتة التي يستخدمها الحاسوب لتخزين البيانات الحالية التي يعمل عليها.',
    example: 'زيادة RAM تسمح لك بفتح برامج كثيرة في وقت واحد دون بطء.',
    category: TermCategory.HARDWARE
  }
];
