// Single source of truth for every word on the site, in English, Arabic and Turkish.
// Facts come only from the architect's CV (EN/TR) and portfolio; his own wording is kept where it exists.
const L = (en, ar, tr) => ({ en, ar, tr });

export const LANGS = ['en', 'ar', 'tr'];
export const LANG_META = {
  en: { name: 'English', short: 'EN', dir: 'ltr', path: '' },
  ar: { name: 'العربية', short: 'ع', dir: 'rtl', path: 'ar/' },
  tr: { name: 'Türkçe', short: 'TR', dir: 'ltr', path: 'tr/' },
};

export const person = {
  name: L('Osman Mohamed', 'عثمان محمد', 'Osman Mohamed'),
  fullName: L('Osman Osama Abdalla Mohamed', 'عثمان أسامة عبدالله محمد', 'Osman Osama Abdalla Mohamed'),
  role: L('Architect', 'مهندس معماري', 'Mimar'),
  email: 'kas.omer2015@gmail.com',
  phone: '+90 552 605 1447',
  phoneHref: '+905526051447',
  tagline: L(
    'Architecture, from the drawing board to the building site.',
    'العمارة، من لوحة الرسم إلى موقع البناء.',
    'Mimarlık, çizim masasından şantiyeye.'
  ),
  summary: L(
    'Architect with practical experience in architectural design, 2D drawings, 3D modelling and rendering, skilled in AutoCAD, Revit and SketchUp, alongside hands-on construction site supervision, architectural inspections, defect follow-up and quality control.',
    'مهندس معماري يمتلك خبرة عملية في التصميم المعماري والرسومات ثنائية الأبعاد والنمذجة ثلاثية الأبعاد والإظهار المعماري، ويتقن AutoCAD وRevit وSketchUp، إلى جانب خبرة ميدانية في الإشراف على مواقع البناء والفحص المعماري ومتابعة العيوب وضبط الجودة.',
    'Mimari tasarım, 2D çizimler, 3D modelleme ve görselleştirme alanlarında pratik deneyime sahip mimar. AutoCAD, Revit ve SketchUp programlarına hâkim olup şantiye denetimi, mimari kontroller, kusur takibi ve kalite kontrol konularında saha deneyimine sahiptir.'
  ),
  bio: L(
    'I studied architecture at Istanbul Gelişim University (2021–2025) and have worked on both sides of a project: as an architectural designer at Muratlı Mimarlık, and as an architectural site supervisor on a TOKİ housing project with Selahattin Kaldırım İnşaat.',
    'درستُ العمارة في جامعة إسطنبول جيليشيم (2021–2025)، وعملتُ على جانبَي المشروع: مصممًا معماريًا في مكتب Muratlı Mimarlık، ومشرفًا معماريًا في موقع مشروع إسكان TOKİ مع شركة Selahattin Kaldırım İnşaat.',
    'Mimarlık eğitimimi İstanbul Gelişim Üniversitesi’nde aldım (2021–2025) ve bir projenin iki tarafında da çalıştım: Muratlı Mimarlık’ta mimari tasarımcı olarak ve Selahattin Kaldırım İnşaat ile bir TOKİ konut projesinde şantiye mimari kontrol sorumlusu olarak.'
  ),
  languages: L('Arabic, English, Turkish', 'العربية، الإنجليزية، التركية', 'Arapça, İngilizce, Türkçe'),
  strengths: [
    L('Problem solving', 'حل المشكلات', 'Problem çözme'),
    L('Creative thinking', 'التفكير الإبداعي', 'Yaratıcı düşünme'),
    L('Teamwork', 'العمل الجماعي', 'Takım çalışması'),
    L('Project management', 'إدارة المشاريع', 'Proje yönetimi'),
  ],
};

export const ui = {
  metaTitle: L('Osman Mohamed — Architect', 'عثمان محمد — مهندس معماري', 'Osman Mohamed — Mimar'),
  metaDescription: L(
    'Portfolio of architect Osman Mohamed: a mall podium with three towers, housing, villas, a community center, a senior living village, and site supervision on a TOKİ housing project.',
    'ملف أعمال المهندس المعماري عثمان محمد: مول بثلاثة أبراج، ومجمعات سكنية، وفلل، ومركز مجتمعي، وقرية لسكن كبار السن، وإشراف ميداني على مشروع إسكان TOKİ.',
    'Mimar Osman Mohamed’in portfolyosu: üç kuleli bir AVM podyumu, konut projeleri, villalar, bir toplum merkezi, bir yaşlı yaşam köyü ve bir TOKİ konut projesinde şantiye kontrolü.'
  ),
  skip: L('Skip to content', 'تخطَّ إلى المحتوى', 'İçeriğe geç'),
  nav: {
    work: L('Work', 'الأعمال', 'Projeler'),
    practice: L('Experience', 'الخبرة', 'Deneyim'),
    about: L('About', 'نبذة', 'Hakkında'),
    contact: L('Contact', 'تواصل', 'İletişim'),
  },
  menu: L('Menu', 'القائمة', 'Menü'),
  close: L('Close', 'إغلاق', 'Kapat'),
  language: L('Language', 'اللغة', 'Dil'),
  index: L('Selected work', 'أعمال مختارة', 'Seçili işler'),
  scrollCue: L('Scroll to build', 'مرّر لتشييد المبنى', 'İnşa etmek için kaydırın'),
  heroSteps: [L('Site plan', 'المخطط العام', 'Vaziyet planı'), L('Massing', 'الكتلة', 'Kütle'), L('Night view', 'المشهد الليلي', 'Gece görünümü')],
  heroCaptions: [
    L('It starts as a line: the site plan of a residential and commercial complex.', 'يبدأ كل شيء بخط: المخطط العام لمجمّع سكني وتجاري.', 'Her şey bir çizgiyle başlar: bir konut ve ticaret kompleksinin vaziyet planı.'),
    L('Three towers rise from a shared shopping-mall podium.', 'ثلاثة أبراج ترتفع فوق قاعدة تجارية مشتركة.', 'Üç kule, ortak bir AVM podyumundan yükselir.'),
    L('By night, the glazed façades and the podium light up.', 'ليلًا، تضيء الواجهات الزجاجية والقاعدة التجارية.', 'Gece olunca cam cepheler ve podyum ışıklanır.'),
  ],
  heroNote: L('Massing study traced from the project’s site plan', 'دراسة كتلية مرسومة عن المخطط العام للمشروع', 'Projenin vaziyet planından çizilmiş kütle çalışması'),
  planLabels: {
    apartments: L('Apartments', 'شقق سكنية', 'Konut'),
    offices: L('Offices', 'مكاتب', 'Ofis'),
    mall: L('Mall, open to below', 'المول، فراغ مفتوح', 'AVM, galeri boşluğu'),
    entry: L('Mall entry', 'مدخل المول', 'AVM girişi'),
  },
  facts: {
    programme: L('Programme', 'البرنامج', 'Program'),
    levels: L('Levels', 'الطوابق', 'Katlar'),
    units: L('Apartments', 'الشقق', 'Daireler'),
    role: L('My part', 'دوري', 'Rolüm'),
    type: L('Type', 'النوع', 'Tür'),
    tools: L('Tools', 'الأدوات', 'Araçlar'),
    location: L('Location', 'الموقع', 'Konum'),
    company: L('Company', 'الشركة', 'Firma'),
    blocks: L('Blocks', 'الكتل', 'Bloklar'),
    towers: L('Towers', 'الأبراج', 'Kuleler'),
    retail: L('Retail', 'التجاري', 'Ticaret'),
    scale: L('Drawings', 'الرسومات', 'Çizimler'),
    villas: L('Villas', 'الفلل', 'Villalar'),
  },
  viewer: {
    open: L('Open drawing', 'افتح الرسم', 'Çizimi aç'),
    openImage: L('Open image', 'افتح الصورة', 'Görseli aç'),
    close: L('Close', 'إغلاق', 'Kapat'),
    prev: L('Previous', 'السابق', 'Önceki'),
    next: L('Next', 'التالي', 'Sonraki'),
    zoomIn: L('Zoom in', 'تكبير', 'Yakınlaştır'),
    zoomOut: L('Zoom out', 'تصغير', 'Uzaklaştır'),
    fit: L('Fit to screen', 'ملاءمة الشاشة', 'Ekrana sığdır'),
    hint: L('Scroll or pinch to zoom, drag to move', 'مرّر أو استخدم إصبعين للتكبير، واسحب للتحريك', 'Yakınlaştırmak için kaydırın ya da iki parmak kullanın, taşımak için sürükleyin'),
  },
  floor: L('Floor', 'الطابق', 'Kat'),
  floors: L('Floors', 'الطوابق', 'Katlar'),
  ground: L('Ground floor', 'الطابق الأرضي', 'Zemin kat'),
  before: L('Before repair', 'قبل الإصلاح', 'Onarım öncesi'),
  after: L('After repair', 'بعد الإصلاح', 'Onarım sonrası'),
  showAfter: L('Show after repair', 'اعرض بعد الإصلاح', 'Onarım sonrasını göster'),
  showBefore: L('Show before repair', 'اعرض قبل الإصلاح', 'Onarım öncesini göster'),
  comparePlan: L('Drag to compare the site plan with the aerial view', 'اسحب للمقارنة بين المخطط العام والمنظر الجوي', 'Vaziyet planı ile kuş bakışı görünümü karşılaştırmak için sürükleyin'),
  email: L('Email', 'البريد الإلكتروني', 'E-posta'),
  phone: L('Phone', 'الهاتف', 'Telefon'),
  copyEmail: L('Copy email address', 'انسخ البريد الإلكتروني', 'E-posta adresini kopyala'),
  copied: L('Email address copied', 'تم نسخ البريد الإلكتروني', 'E-posta adresi kopyalandı'),
  cvEn: L('CV in English (PDF)', 'السيرة الذاتية بالإنجليزية (PDF)', 'İngilizce özgeçmiş (PDF)'),
  cvTr: L('CV in Turkish (PDF)', 'السيرة الذاتية بالتركية (PDF)', 'Türkçe özgeçmiş (PDF)'),
  cvAr: L('CV in Arabic (PDF)', 'السيرة الذاتية بالعربية (PDF)', 'Arapça özgeçmiş (PDF)'),
  portfolio: L('Full portfolio (PDF, 5.4 MB)', 'ملف الأعمال كاملًا (PDF، ‏5.4 ميغابايت)', 'Portfolyonun tamamı (PDF, 5,4 MB)'),
  backToTop: L('Back to the top', 'العودة إلى الأعلى', 'Başa dön'),
  rights: L('Drawings and images from Osman Mohamed’s portfolio.', 'الرسومات والصور من ملف أعمال عثمان محمد.', 'Çizimler ve görseller Osman Mohamed’in portfolyosundandır.'),
  contactLine: L('Write or call — in Arabic, English or Turkish.', 'راسلني أو اتصل بي — بالعربية أو الإنجليزية أو التركية.', 'Arapça, İngilizce ya da Türkçe; yazın veya arayın.'),
  langSuggest: L('This site is also available in English.', 'هذا الموقع متاح بالعربية أيضًا.', 'Bu site Türkçe olarak da mevcut.'),
  drawings: L('Drawings', 'الرسومات', 'Çizimler'),
  views: L('Views', 'المشاهد', 'Görünümler'),
  openProject: L('Open the project', 'افتح المشروع', 'Projeyi aç'),
  nextProject: L('Next project', 'المشروع التالي', 'Sonraki proje'),
  allProjects: L('All projects', 'كل المشاريع', 'Tüm projeler'),
  chooseLevel: L('Choose a level', 'اختر طابقًا', 'Bir kat seçin'),
  openPlan: L('Open this plan full size', 'افتح هذا المسقط بالحجم الكامل', 'Bu planı tam boyutta aç'),
  workIntro: L(
    'Eight projects, from a mall with three towers to the inspection of a housing site. Each opens on its own page.',
    'ثمانية مشاريع، من مول بثلاثة أبراج إلى فحص موقع إسكان. لكل مشروع صفحته الخاصة.',
    'Üç kuleli bir AVM’den bir konut şantiyesinin kontrolüne sekiz proje. Her biri kendi sayfasında açılır.'
  ),
};

// Every image: caption (shown and used as alt text) in three languages.
export const captions = {
  'rcc-night': L('Night elevation', 'الواجهة الليلية', 'Gece cephesi'),
  'rcc-day': L('Day view from the street', 'منظر نهاري من الشارع', 'Sokaktan gündüz görünümü'),
  'rcc-night-2': L('Night view of the three towers', 'منظر ليلي للأبراج الثلاثة', 'Üç kulenin gece görünümü'),
  'rcc-aerial': L('Aerial view of the open-air court', 'منظر جوي للفناء المفتوح', 'Açık avlunun kuş bakışı görünümü'),
  'rcc-off-render': L('Night view of the complex', 'منظر ليلي للمجمّع', 'Kompleksin gece görünümü'),
  'rcc-mall-site': L('Site plan', 'المخطط العام', 'Vaziyet planı'),
  'rcc-mall-g': L('Mall, ground floor plan', 'المول، مسقط الطابق الأرضي', 'AVM, zemin kat planı'),
  'rcc-mall-1': L('Mall, first floor plan', 'المول، مسقط الطابق الأول', 'AVM, 1. kat planı'),
  'rcc-mall-2': L('Mall, second floor plan', 'المول، مسقط الطابق الثاني', 'AVM, 2. kat planı'),
  'rcc-mall-3': L('Mall, third floor plan', 'المول، مسقط الطابق الثالث', 'AVM, 3. kat planı'),
  'rcc-base-1': L('Basement −1, car park', 'القبو −1، مواقف سيارات', 'Bodrum −1, otopark'),
  'rcc-base-2': L('Basement −2, car park', 'القبو −2، مواقف سيارات', 'Bodrum −2, otopark'),
  'rcc-base-3': L('Basement −3, car park and shelter', 'القبو −3، مواقف سيارات وملجأ', 'Bodrum −3, otopark ve sığınak'),
  'rcc-apt-low-mix': L('Apartment tower, floors 0–11: unit mix', 'البرج السكني، الطوابق 0–11: توزيع الشقق', 'Konut kulesi, 0–11. katlar: daire dağılımı'),
  'rcc-apt-low': L('Apartment tower, floors 0–11: plan', 'البرج السكني، الطوابق 0–11: المسقط', 'Konut kulesi, 0–11. katlar: plan'),
  'rcc-apt-high-mix': L('Apartment tower, floors 12–22: unit mix', 'البرج السكني، الطوابق 12–22: توزيع الشقق', 'Konut kulesi, 12–22. katlar: daire dağılımı'),
  'rcc-apt-high': L('Apartment tower, floors 12–22: plan', 'البرج السكني، الطوابق 12–22: المسقط', 'Konut kulesi, 12–22. katlar: plan'),
  'rcc-off-g': L('Office tower, ground floor', 'برج المكاتب، الطابق الأرضي', 'Ofis kulesi, zemin kat'),
  'rcc-off-1-4': L('Office tower, floors 1–4', 'برج المكاتب، الطوابق 1–4', 'Ofis kulesi, 1–4. katlar'),
  'rcc-off-5-9': L('Office tower, floors 5–9', 'برج المكاتب، الطوابق 5–9', 'Ofis kulesi, 5–9. katlar'),
  'rcc-off-10-12': L('Office tower, floors 10–12', 'برج المكاتب، الطوابق 10–12', 'Ofis kulesi, 10–12. katlar'),
  'rcc-off-13': L('Office tower, floor 13', 'برج المكاتب، الطابق 13', 'Ofis kulesi, 13. kat'),
  'rcc-off-14': L('Office tower, floor 14', 'برج المكاتب، الطابق 14', 'Ofis kulesi, 14. kat'),
  'rcc-off-15': L('Office tower, floor 15', 'برج المكاتب، الطابق 15', 'Ofis kulesi, 15. kat'),
  'rcc-off-16-21': L('Office tower, floors 16–21', 'برج المكاتب، الطوابق 16–21', 'Ofis kulesi, 16–21. katlar'),
  'rcc-off-22': L('Office tower, floor 22', 'برج المكاتب، الطابق 22', 'Ofis kulesi, 22. kat'),
  'rcc-section': L('Section through the towers and podium', 'قطاع عبر الأبراج والقاعدة', 'Kuleler ve podyumdan geçen kesit'),

  'mrc-aerial': L('Aerial view at night', 'منظر جوي ليلًا', 'Gece kuş bakışı görünüm'),
  'mrc-site-plan': L('Site plan', 'المخطط العام', 'Vaziyet planı'),
  'mrc-night-a': L('Evening view along the avenue', 'منظر مسائي على امتداد الشارع', 'Cadde boyunca akşam görünümü'),
  'mrc-night-b': L('Corner view with the ground-floor shops', 'منظر الزاوية مع المحلات في الطابق الأرضي', 'Zemin kat dükkânlarıyla köşe görünümü'),
  'mrc-street': L('Street view at night', 'منظر الشارع ليلًا', 'Gece sokak görünümü'),
  'mrc-shop-plan': L('Shop plan', 'مسقط المحلات', 'Dükkân planı'),
  'mrc-floor-plan': L('Residential floor plan', 'مسقط الطابق السكني', 'Konut kat planı'),
  'mrc-section-n': L('North section', 'القطاع الشمالي', 'Kuzey kesiti'),
  'mrc-section-e': L('East section with the underground car park', 'القطاع الشرقي مع مواقف السيارات تحت الأرض', 'Yer altı otoparkıyla doğu kesiti'),

  'fac-elevation': L('Elevation', 'الواجهة', 'Görünüş'),
  'fac-street': L('Street view', 'منظر من الشارع', 'Sokak görünümü'),
  'fac-aerial': L('Aerial view of the four blocks', 'منظر جوي للكتل الأربع', 'Dört bloğun kuş bakışı görünümü'),
  'fac-site': L('Site plan', 'المخطط العام', 'Vaziyet planı'),
  'fac-plans': L('Typical floor plans of blocks A to D', 'المساقط المتكررة للكتل من A إلى D', 'A–D blokların normal kat planları'),
  'fac-sec-n': L('North section', 'القطاع الشمالي', 'Kuzey kesiti'),
  'fac-sec-e': L('East section', 'القطاع الشرقي', 'Doğu kesiti'),

  'mvr-r1': L('Villa with timber slats and lit gables', 'فيلا بشرائح خشبية وجملونات مضاءة', 'Ahşap çıtalı ve ışıklı üçgen cepheli villa'),
  'mvr-r2': L('The three villas in their landscape', 'الفلل الثلاث في محيطها الطبيعي', 'Peyzajı içinde üç villa'),
  'mvr-plan-b': L('Basement floor plan', 'مسقط القبو', 'Bodrum kat planı'),
  'mvr-plan-g': L('Ground floor plan', 'مسقط الطابق الأرضي', 'Zemin kat planı'),
  'mvr-plan-1': L('First floor plan', 'مسقط الطابق الأول', 'Birinci kat planı'),
  'mvr-plan-r': L('Roof plan', 'مسقط السطح', 'Çatı planı'),
  'mvr-site-sec': L('Site sections through the three villas', 'قطاعات الموقع عبر الفلل الثلاث', 'Üç villadan geçen vaziyet kesitleri'),
  'mvr-elev': L('Elevations', 'الواجهات', 'Görünüşler'),
  'mvr-side-sec': L('Side sections', 'القطاعات الجانبية', 'Yan kesitler'),
  'mvr-site-plan': L('Site plan, 1:100', 'المخطط العام، 1:100', 'Vaziyet planı, 1:100'),

  'v1-render': L('Villa One, garden and pool', 'الفيلا الأولى، الحديقة والمسبح', 'Birinci Villa, bahçe ve havuz'),
  'v1-section-a': L('Villa One, section', 'الفيلا الأولى، قطاع', 'Birinci Villa, kesit'),
  'v1-section-b': L('Villa One, section', 'الفيلا الأولى، قطاع', 'Birinci Villa, kesit'),
  'v1-plans': L('Villa One, ground and first floor plans', 'الفيلا الأولى، مسقطا الطابقين الأرضي والأول', 'Birinci Villa, zemin ve birinci kat planları'),
  'v1-site': L('Villa One, site plan', 'الفيلا الأولى، المخطط العام', 'Birinci Villa, vaziyet planı'),
  'v1-massing': L('Villa One, massing', 'الفيلا الأولى، الكتلة', 'Birinci Villa, kütle'),
  'v1-plan-render': L('Villa One, rendered site plan', 'الفيلا الأولى، مخطط الموقع الملوّن', 'Birinci Villa, renkli vaziyet planı'),
  'v2-r1': L('Villa Two, view with the pool', 'الفيلا الثانية، منظر مع المسبح', 'İkinci Villa, havuzlu görünüm'),
  'v2-r2': L('Villa Two, entrance side', 'الفيلا الثانية، جهة المدخل', 'İkinci Villa, giriş cephesi'),
  'v2-section-a': L('Villa Two, section', 'الفيلا الثانية، قطاع', 'İkinci Villa, kesit'),
  'v2-section-b': L('Villa Two, section', 'الفيلا الثانية، قطاع', 'İkinci Villa, kesit'),
  'v2-plans': L('Villa Two, ground and first floor plans', 'الفيلا الثانية، مسقطا الطابقين الأرضي والأول', 'İkinci Villa, zemin ve birinci kat planları'),

  'cc-model-1': L('Paper model, layered sheets', 'نموذج ورقي، طبقات متراكبة', 'Kâğıt maket, üst üste katmanlar'),
  'cc-model-2': L('Paper model with timber and blue film', 'نموذج ورقي مع خشب وغشاء أزرق', 'Ahşap ve mavi folyolu kâğıt maket'),
  'cc-sketch-1': L('SketchUp study', 'دراسة في SketchUp', 'SketchUp çalışması'),
  'cc-sketch-2': L('SketchUp study, second view', 'دراسة في SketchUp، منظر ثانٍ', 'SketchUp çalışması, ikinci görünüm'),
  'cc-site-plan': L('Site plan, 1:500', 'المخطط العام، 1:500', 'Vaziyet planı, 1:500'),
  'cc-plan-g': L('Ground floor plan', 'مسقط الطابق الأرضي', 'Zemin kat planı'),
  'cc-plan-1': L('First floor plan', 'مسقط الطابق الأول', 'Birinci kat planı'),
  'cc-elev-a': L('Sections and elevations', 'قطاعات وواجهات', 'Kesitler ve görünüşler'),
  'cc-elev-b': L('Sections and elevations', 'قطاعات وواجهات', 'Kesitler ve görünüşler'),
  'cc-aerial': L('Aerial view', 'منظر جوي', 'Kuş bakışı görünüm'),
  'cc-r1': L('Café terrace under the folded planes', 'تراس المقهى تحت المستويات المطوية', 'Katlanan düzlemlerin altında kafe terası'),
  'cc-r2': L('Stepped seating and the glazed hall', 'المدرّج والقاعة الزجاجية', 'Basamaklı oturma alanı ve cam salon'),
  'cc-r3': L('Folded roof plane over the entrance', 'مستوى السقف المطوي فوق المدخل', 'Girişin üzerindeki katlanan çatı düzlemi'),
  'cc-r4': L('The leaning wall and the amphitheatre', 'الجدار المائل والمدرّج', 'Eğik duvar ve amfi'),

  'slv-site-plan': L('Site plan', 'المخطط العام', 'Vaziyet planı'),
  'slv-aerial': L('Aerial view of the village', 'منظر جوي للقرية', 'Köyün kuş bakışı görünümü'),
  'slv-r1': L('Along the access road', 'على امتداد طريق الوصول', 'Erişim yolu boyunca'),
  'slv-r2': L('The pond and its bridge', 'البحيرة وجسرها', 'Gölet ve köprüsü'),
  'slv-r3': L('Between the senior dorms', 'بين مساكن كبار السن', 'Yaşlı yurtlarının arasında'),
  'slv-r4': L('A cluster around its courtyard', 'تجمّع حول فنائه', 'Avlusu çevresinde bir küme'),
  'slv-sheet-a': L('Community center, student dorm and staff dorm, with concept and site plan', 'المركز المجتمعي وسكن الطلاب وسكن الموظفين، مع الفكرة والمخطط العام', 'Toplum merkezi, öğrenci ve personel yurtları; konsept ve vaziyet planı'),
  'slv-dorm-1': L('Senior dorm, type 1: plan, elevations, sections', 'سكن كبار السن، النموذج 1: مسقط وواجهات وقطاعات', 'Yaşlı yurdu, tip 1: plan, görünüşler, kesitler'),
  'slv-dorm-2': L('Senior dorm, type 2: plan, elevations, sections', 'سكن كبار السن، النموذج 2: مسقط وواجهات وقطاعات', 'Yaşlı yurdu, tip 2: plan, görünüşler, kesitler'),
  'slv-dorm-3': L('Senior dorm, type 3: plan, elevations, sections', 'سكن كبار السن، النموذج 3: مسقط وواجهات وقطاعات', 'Yaşlı yurdu, tip 3: plan, görünüşler, kesitler'),
  'slv-health': L('Health care center, with roof truss detail', 'مركز الرعاية الصحية، مع تفصيلة الجملون', 'Sağlık merkezi ve çatı makası detayı'),
  'slv-admin': L('Administration', 'الإدارة', 'İdare binası'),
  'slv-services': L('Services building', 'مبنى الخدمات', 'Hizmet binası'),

  'toki-aerial': L('Aerial view of the TOKİ project', 'منظر جوي لمشروع TOKİ', 'TOKİ projesinin kuş bakışı görünümü'),
  'toki-court': L('Courtyard view of the project', 'منظر الفناء في المشروع', 'Projenin avlu görünümü'),
  'toki-osman': L('Osman on site', 'عثمان في الموقع', 'Osman şantiyede'),
  'toki-roof': L('The site from a roof', 'الموقع من أحد الأسطح', 'Bir çatıdan şantiye'),
  'toki-mosque': L('Blocks under construction, with the mosque', 'كتل قيد الإنشاء، مع المسجد', 'Yapım aşamasındaki bloklar ve cami'),
  'cer-d10-before': L('D10, before repair: hollow and broken tiles marked on site', 'D10 قبل الإصلاح: بلاط مجوَّف ومكسور مُعلَّم في الموقع', 'D10, onarım öncesi: sahada işaretlenmiş boş ve kırık karolar'),
  'cer-d10-after': L('D10, after repair', 'D10 بعد الإصلاح', 'D10, onarım sonrası'),
  'cer-d12-before': L('D12, before repair', 'D12 قبل الإصلاح', 'D12, onarım öncesi'),
  'cer-d12-after': L('D12, after repair', 'D12 بعد الإصلاح', 'D12, onarım sonrası'),
  'cer-d7-before': L('D7, before repair: cracked tile around a pipe', 'D7 قبل الإصلاح: بلاط مكسور حول ماسورة', 'D7, onarım öncesi: boru çevresinde kırık karo'),
  'cer-d7-after': L('D7, after repair', 'D7 بعد الإصلاح', 'D7, onarım sonrası'),
  'leak-d20': L('D20, leakage on a wall by the balcony door', 'D20، تسرّب على جدار بجانب باب الشرفة', 'D20, balkon kapısı yanındaki duvarda sızıntı'),
  'leak-b02': L('B-02 D1, leakage on walls and ceiling', 'B-02 D1، تسرّب على الجدران والسقف', 'B-02 D1, duvar ve tavanda sızıntı'),
  'leak-d21': L('D21, leakage at a window corner', 'D21، تسرّب عند زاوية نافذة', 'D21, pencere köşesinde sızıntı'),
  'fix-collar': L('Concrete collar around a drainage pipe', 'طوق خرساني حول ماسورة تصريف', 'Gider borusu çevresine beton yaka'),
  'fix-membrane': L('Liquid-applied roof waterproofing', 'عزل مائي سائل للسطح', 'Likit uygulamalı çatı su yalıtımı'),
  'fix-silicone': L('External silicone sealing of a window frame', 'إحكام خارجي لإطار نافذة بالسيليكون', 'Pencere kasasının dıştan silikonla yalıtımı'),
  'doc-overview-a': L('Project and site overview', 'نظرة عامة على المشروع والموقع', 'Proje ve şantiye genel görünümü'),
  'doc-overview-b': L('Site overview', 'نظرة عامة على الموقع', 'Şantiye genel görünümü'),
  'doc-defect': L('Architectural finishing defect', 'عيب في التشطيبات المعمارية', 'Mimari ince iş kusuru'),
  'doc-glass-table': L('Excel report: missing glass by building', 'تقرير Excel: الزجاج الناقص حسب المبنى', 'Excel raporu: bina bazında eksik cam'),
  'doc-ceramic-table': L('Excel report: Block A-03 ceramic repair status', 'تقرير Excel: حالة إصلاح السيراميك في الكتلة A-03', 'Excel raporu: A-03 Blok seramik onarım durumu'),

  'cover-wire': L('Wireframe drawing from the portfolio cover', 'رسم خطي من غلاف ملف الأعمال', 'Portfolyo kapağından tel kafes çizim'),
  portrait: L('Portrait of Osman Mohamed', 'صورة عثمان محمد', 'Osman Mohamed portresi'),
};

export const projects = {
  rcc: {
    title: L('Residential & Commercial Complex', 'مجمّع سكني وتجاري', 'Konut ve Ticaret Kompleksi'),
    summary: L(
      'Three towers above a shared shopping-mall podium: two residential towers and one office tower. The towers have glazed façades, and the mall and towers share a contemporary, refined architectural style.',
      'ثلاثة أبراج ترتكز على قاعدة واحدة هي المول التجاري: برجان سكنيان وبرج مكاتب. تتميّز الأبراج بواجهات زجاجية، بينما صُمّم المول والأبراج بأسلوب معماري عصري وأنيق.',
      'Ortak bir AVM podyumunun üzerinde üç kule: iki konut kulesi ve bir ofis kulesi. Kuleler cam cephelidir; AVM ve kuleler çağdaş ve zarif bir mimari dili paylaşır.'
    ),
    role: L(
      'My contribution covered approximately 80% of the mall design: the architectural concept, the retail layout, the central open-air space with cafés and restaurants, and the mall façades. I also contributed to furnishing the apartments and to the concept of the restaurant floor in the office tower.',
      'شملت مساهمتي تصميم ما يقارب 80% من المول، بدءًا من الفكرة التصميمية وتنظيم المتاجر، وصولًا إلى تصميم الفراغ الأوسط المفتوح الذي يضم مقاهي ومطاعم، إضافة إلى تصميم واجهات المول. كما ساهمت في تأثيث الشقق السكنية وتصميم فكرة طابق المطعم في البرج التجاري.',
      'Katkım, AVM tasarımının yaklaşık %80’ini kapsadı: mimari konsept, mağaza yerleşimi, kafe ve restoranları barındıran merkezi açık alan ve AVM cepheleri. Ayrıca dairelerin mobilyalandırılmasına ve ofis kulesindeki restoran katının konseptine katkıda bulundum.'
    ),
    facts: [
      ['programme', L('Mall podium, 2 residential towers, 1 office tower', 'قاعدة تجارية (مول)، برجان سكنيان، برج مكاتب', 'AVM podyumu, 2 konut kulesi, 1 ofis kulesi')],
      ['levels', L('Towers of 23 levels (0–22); mall on 4 levels; 3 basements', 'أبراج من 23 مستوى (0–22)؛ مول من 4 طوابق؛ 3 طوابق قبو', '23 katlı kuleler (0–22); 4 katlı AVM; 3 bodrum kat')],
      ['units', L('2+1, 3+1 and 4+1 (bedrooms + living room)', '2+1 و3+1 و4+1 (غرف نوم + صالة)', '2+1, 3+1 ve 4+1')],
      ['role', L('About 80% of the mall design; apartment furnishing; restaurant-floor concept', 'نحو 80% من تصميم المول؛ تأثيث الشقق؛ فكرة طابق المطعم', 'AVM tasarımının yaklaşık %80’i; daire mobilyalandırma; restoran katı konsepti')],
    ],
    mallTitle: L('The mall, level by level', 'المول، طابقًا طابقًا', 'Kat kat AVM'),
    mallIntro: L(
      'Seven plans, from the third basement to the restaurant terraces. The shops wrap a central void that is open to the sky at ground level.',
      'سبعة مساقط، من القبو الثالث حتى تراسات المطاعم. تلتف المتاجر حول فراغ أوسط مفتوح على السماء في الطابق الأرضي.',
      'Üçüncü bodrumdan restoran teraslarına yedi plan. Mağazalar, zemin katta gökyüzüne açılan merkezi bir boşluğun çevresine sarılır.'
    ),
    mallLevels: [
      { img: 'rcc-base-3', tag: '−3', name: L('Basement −3', 'القبو −3', 'Bodrum −3'), text: L('Car park and shelter', 'مواقف سيارات وملجأ', 'Otopark ve sığınak') },
      { img: 'rcc-base-2', tag: '−2', name: L('Basement −2', 'القبو −2', 'Bodrum −2'), text: L('Car park', 'مواقف سيارات', 'Otopark') },
      { img: 'rcc-base-1', tag: '−1', name: L('Basement −1', 'القبو −1', 'Bodrum −1'), text: L('Car park, ramps from the mall and apartment entries', 'مواقف سيارات، ومنحدرات من مداخل المول والشقق', 'Otopark; AVM ve konut girişlerinden rampalar') },
      { img: 'rcc-mall-g', tag: '0', name: L('Ground floor', 'الطابق الأرضي', 'Zemin kat'), text: L('Mall entry, open courtyard, shops, office and apartment lobbies', 'مدخل المول، الفناء المفتوح، المتاجر، ومداخل المكاتب والشقق', 'AVM girişi, açık avlu, mağazalar, ofis ve konut girişleri') },
      { img: 'rcc-mall-1', tag: '1', name: L('First floor', 'الطابق الأول', '1. kat'), text: L('Shops around the void, exhibition area', 'متاجر حول الفراغ، ومنطقة عرض', 'Boşluğun çevresinde mağazalar, sergi alanı') },
      { img: 'rcc-mall-2', tag: '2', name: L('Second floor', 'الطابق الثاني', '2. kat'), text: L('Shops and large stores, exhibition area', 'متاجر ومتاجر كبيرة، ومنطقة عرض', 'Mağazalar ve büyük mağazalar, sergi alanı') },
      { img: 'rcc-mall-3', tag: '3', name: L('Third floor', 'الطابق الثالث', '3. kat'), text: L('Restaurants, fast food and terraces', 'مطاعم ووجبات سريعة وتراسات', 'Restoranlar, fast food ve teraslar') },
    ],
    legend: [
      ['#9DA6C3', L('Apartments', 'شقق', 'Konut')],
      ['#A9C49E', L('Offices', 'مكاتب', 'Ofis')],
      ['#D9B4BA', L('Shops', 'متاجر', 'Mağazalar')],
      ['#B79CC2', L('Large stores', 'متاجر كبيرة', 'Büyük mağazalar')],
      ['#5E7A63', L('Restaurants', 'مطاعم', 'Restoranlar')],
      ['#A6CADF', L('Terraces', 'تراسات', 'Teraslar')],
      ['#BDB894', L('Open courtyard', 'فناء مفتوح', 'Açık avlu')],
    ],
    officeTitle: L('The office tower, floor by floor', 'برج المكاتب، طابقًا طابقًا', 'Kat kat ofis kulesi'),
    officeIntro: L(
      'Twenty-three levels around one core. Every floor also has a staff room, washrooms and small prayer rooms.',
      'ثلاثة وعشرون مستوى حول نواة واحدة. ويضم كل طابق أيضًا غرفة للموظفين ودورات مياه ومصليات صغيرة.',
      'Tek bir çekirdek çevresinde yirmi üç kat. Her katta ayrıca personel odası, ıslak hacimler ve küçük mescitler bulunur.'
    ),
    officeFloors: [
      { img: 'rcc-off-g', from: 0, to: 0, text: L('Entrance, pharmacy, café, banks, currency exchange', 'المدخل، صيدلية، مقهى، بنوك، صرافة', 'Giriş, eczane, kafe, bankalar, döviz bürosu') },
      { img: 'rcc-off-1-4', from: 1, to: 4, text: L('Laboratories, doctors’ rooms and dental clinics', 'مختبرات وعيادات أطباء وعيادات أسنان', 'Laboratuvarlar, doktor odaları ve diş klinikleri') },
      { img: 'rcc-off-5-9', from: 5, to: 9, text: L('Offices of 40 to 100 m², with terraces', 'مكاتب من 40 إلى 100 م²، مع تراسات', 'Teraslı, 40–100 m² ofisler') },
      { img: 'rcc-off-10-12', from: 10, to: 12, text: L('Large offices of 120 to 300 m²', 'مكاتب كبيرة من 120 إلى 300 م²', '120–300 m² büyük ofisler') },
      { img: 'rcc-off-13', from: 13, to: 13, text: L('Offices of 40 to 100 m², with terraces', 'مكاتب من 40 إلى 100 م²، مع تراسات', 'Teraslı, 40–100 m² ofisler') },
      { img: 'rcc-off-14', from: 14, to: 14, text: L('Open-plan offices with meeting rooms', 'مكاتب مفتوحة مع قاعات اجتماعات', 'Toplantı odalı açık ofisler') },
      { img: 'rcc-off-15', from: 15, to: 15, text: L('Open-plan offices of 215 to 260 m²', 'مكاتب مفتوحة من 215 إلى 260 م²', '215–260 m² açık ofisler') },
      { img: 'rcc-off-16-21', from: 16, to: 21, text: L('Meeting rooms', 'قاعات اجتماعات', 'Toplantı odaları') },
      { img: 'rcc-off-22', from: 22, to: 22, text: L('Restaurant floor: restaurants, cafés, kitchens and terraces', 'طابق المطاعم: مطاعم ومقاهٍ ومطابخ وتراسات', 'Restoran katı: restoranlar, kafeler, mutfaklar ve teraslar') },
    ],
    aptTitle: L('The apartment towers', 'الأبراج السكنية', 'Konut kuleleri'),
    aptIntro: L(
      'Two typical plans, for floors 0–11 and 12–22, arranging 2+1, 3+1 and 4+1 apartments around the core.',
      'مسقطان متكرران للطوابق 0–11 و12–22، تتوزّع فيهما شقق 2+1 و3+1 و4+1 حول النواة.',
      '0–11 ve 12–22. katlar için iki normal kat planı; 2+1, 3+1 ve 4+1 daireler çekirdeğin çevresinde.'
    ),
    aptSets: [
      { label: L('Floors 0–11', 'الطوابق 0–11', '0–11. katlar'), mix: 'rcc-apt-low-mix', plan: 'rcc-apt-low' },
      { label: L('Floors 12–22', 'الطوابق 12–22', '12–22. katlar'), mix: 'rcc-apt-high-mix', plan: 'rcc-apt-high' },
    ],
    unitKey: [['#9FB1C4', '2+1'], ['#A8C3A0', '3+1'], ['#B9B892', '4+1']],
    elevTitle: L('Building elevations', 'واجهات المبنى', 'Bina cepheleri'),
  },

  mrc: {
    title: L('Mixed-Use Residential Complex', 'مجمّع سكني متعدد الاستخدامات', 'Karma Kullanımlı Konut Kompleksi'),
    summary: L(
      'A residential development of six towers integrated with ground-level retail spaces that activate the street and serve both residents and the surrounding neighbourhood.',
      'مشروع سكني من ستة أبراج تتكامل مع محلات تجارية في الطابق الأرضي، تُنشّط الشارع وتخدم السكان والحي المحيط على حدٍّ سواء.',
      'Sokağı canlandıran ve hem sakinlere hem de çevredeki mahalleye hizmet veren zemin kat ticari alanlarıyla bütünleşmiş, altı kuleli bir konut projesi.'
    ),
    facts: [
      ['towers', L('Six, around a landscaped courtyard', 'ستة، حول فناء مُنسّق', 'Altı kule, peyzajlı bir avlu çevresinde')],
      ['levels', L('Ground + 7 floors, underground car park', 'أرضي + 7 طوابق، ومواقف سيارات تحت الأرض', 'Zemin + 7 kat, yer altı otoparkı')],
      ['retail', L('Three large markets and a row of shops on a corridor', 'ثلاثة أسواق كبيرة وصف من المحلات على ممر', 'Üç büyük market ve bir koridor boyunca dükkânlar')],
    ],
    compareTitle: L('Plan and aerial view', 'المخطط والمنظر الجوي', 'Plan ve kuş bakışı'),
    compareText: L(
      'The same six towers, drawn and rendered: two rows of three around a courtyard, with the shops along the street edge.',
      'الأبراج الستة نفسها، مرسومةً ومُظهَرة: صفّان من ثلاثة أبراج حول فناء، والمحلات على امتداد الشارع.',
      'Aynı altı kule, çizimde ve görselde: bir avlunun çevresinde üçerli iki sıra, sokak boyunca dükkânlar.'
    ),
    drawingsTitle: L('Sections and plans', 'القطاعات والمساقط', 'Kesitler ve planlar'),
  },

  fac: {
    title: L('Façade Design for a Residential Complex', 'تصميم واجهات مجمّع سكني', 'Konut Kompleksi Cephe Tasarımı'),
    summary: L(
      'Elevation design for a residential complex of four blocks, A to D. The drawing set includes the typical floor plans of each block, the site plan and two sections.',
      'تصميم واجهات لمجمّع سكني من أربع كتل، من A إلى D. تضم مجموعة الرسومات المساقط المتكررة لكل كتلة والمخطط العام وقطاعين.',
      'A’dan D’ye dört bloktan oluşan bir konut kompleksi için cephe tasarımı. Çizim seti, her bloğun normal kat planlarını, vaziyet planını ve iki kesiti içerir.'
    ),
    facts: [
      ['blocks', L('A, B, C, D', 'A وB وC وD', 'A, B, C, D')],
      ['levels', L('Typical floors 1–11 (D), 1–10 (C), 3–10 (A, B)', 'الطوابق المتكررة 1–11 (D)، و1–10 (C)، و3–10 (A وB)', 'Normal katlar 1–11 (D), 1–10 (C), 3–10 (A, B)')],
    ],
    wipeTitle: L('From elevation to image', 'من الواجهة المرسومة إلى المشهد', 'Görünüşten görsele'),
  },

  mvr: {
    title: L('Modern Villa Residences', 'فلل سكنية حديثة', 'Modern Villa Konutları'),
    summary: L(
      'Three contemporary villas designed with elegant architectural forms and distinctive modern façades.',
      'ثلاث فلل معاصرة صُمّمت بتشكيلات معمارية أنيقة وواجهات حديثة مميّزة.',
      'Zarif mimari formlar ve kendine özgü modern cephelerle tasarlanmış üç çağdaş villa.'
    ),
    facts: [
      ['villas', L('Three', 'ثلاث', 'Üç')],
      ['levels', L('Basement, ground floor, first floor under the roof', 'قبو، طابق أرضي، طابق أول تحت السقف', 'Bodrum, zemin kat, çatı arası katı')],
      ['scale', L('Plans, sections, elevations, site plan at 1:100', 'مساقط وقطاعات وواجهات، ومخطط عام بمقياس 1:100', 'Planlar, kesitler, görünüşler, 1:100 vaziyet planı')],
    ],
    levelsTitle: L('From basement to roof', 'من القبو إلى السطح', 'Bodrumdan çatıya'),
    levels: [
      { img: 'mvr-plan-b', name: L('Basement', 'القبو', 'Bodrum kat') },
      { img: 'mvr-plan-g', name: L('Ground floor', 'الطابق الأرضي', 'Zemin kat') },
      { img: 'mvr-plan-1', name: L('First floor', 'الطابق الأول', 'Birinci kat') },
      { img: 'mvr-plan-r', name: L('Roof', 'السطح', 'Çatı') },
    ],
  },

  villas: {
    title: L('Two villas', 'فيلتان', 'İki villa'),
    summary: L(
      'Two studies of a contemporary architectural form with clean, attractive aesthetics, each presented through 3D views, sections and plans of a modern residential villa.',
      'دراستان لتشكيل معماري معاصر بجمالية نظيفة وجذابة، تُقدَّم كلٌّ منهما من خلال مشاهد ثلاثية الأبعاد وقطاعات ومساقط لفيلا سكنية حديثة.',
      'Temiz ve çekici bir estetiğe sahip çağdaş bir mimari form üzerine iki çalışma; her biri modern bir konut villasının 3D görünüşleri, kesitleri ve planlarıyla sunuluyor.'
    ),
    one: {
      title: L('Villa One', 'الفيلا الأولى', 'Birinci Villa'),
      levels: [['L1', '±0.00', 0.80], ['L2', '+3.50', 0.50], ['L3', '+7.00', 0.20]],
    },
    two: {
      title: L('Villa Two', 'الفيلا الثانية', 'İkinci Villa'),
      levels: [['L1', '±0.00', 0.86], ['L2', '+3.00', 0.575], ['L3', '+6.00', 0.29], ['L4', '+7.00', 0.20]],
    },
  },

  cc: {
    title: L('Community Center', 'مركز مجتمعي', 'Toplum Merkezi'),
    summary: L(
      'The form of this community center was found by hand, in paper, before it was drawn and modelled.',
      'وُلد شكل هذا المركز المجتمعي باليد، من الورق، قبل أن يُرسم ويُنمذج.',
      'Bu toplum merkezinin formu, çizilip modellenmeden önce elde, kâğıtla bulundu.'
    ),
    facts: [
      ['scale', L('Site plan 1:500; floor plans, sections and elevations', 'مخطط عام 1:500؛ مساقط وقطاعات وواجهات', '1:500 vaziyet planı; kat planları, kesitler ve görünüşler')],
    ],
    steps: [
      L('I started with visual research, studying many buildings with complex shapes.', 'بدأتُ ببحث بصري، فدرستُ أمثلة كثيرة لمبانٍ ذات أشكال مركّبة.', 'Karmaşık formlu pek çok binayı inceleyerek görsel bir araştırmayla başladım.'),
      L('Then I cut paper and layered the sheets to build a complex shape with an artistic character.', 'ثم قصصتُ الورق ووضعتُ الطبقات فوق بعضها لأكوّن شكلًا مركّبًا ذا طابع فني.', 'Ardından kâğıtları kesip üst üste koyarak sanatsal karakterli karmaşık bir form kurdum.'),
      L('I glued the papers and shaped the corners and edges of the building.', 'لصقتُ الأوراق وشكّلتُ زوايا المبنى وحوافه.', 'Kâğıtları yapıştırıp binanın köşelerini ve kenarlarını biçimlendirdim.'),
      L('I added the external parts while choosing the materials.', 'أضفتُ الأجزاء الخارجية مع مراعاة اختيار المواد.', 'Malzemeleri seçerek dış parçaları ekledim.'),
      L('In the end, the final shape of the building.', 'وفي النهاية، الشكل النهائي للمبنى.', 'Sonunda, binanın nihai formu.'),
    ],
  },

  slv: {
    title: L('Senior Living Village', 'قرية سكن كبار السن', 'Yaşlı Yaşam Köyü'),
    kind: L('Diploma project', 'مشروع التخرج', 'Diploma projesi'),
    summary: L(
      'An integrated village for senior living and community life: senior dorms in three types, a community center, a health care center, administration and services, with dorms for students and staff.',
      'قرية متكاملة لسكن كبار السن والحياة المجتمعية: مساكن لكبار السن بثلاثة نماذج، ومركز مجتمعي، ومركز رعاية صحية، وإدارة ومبنى خدمات، إلى جانب سكن للطلاب وآخر للموظفين.',
      'Yaşlı yaşamı ve topluluk hayatı için entegre bir köy: üç tipte yaşlı yurdu, toplum merkezi, sağlık merkezi, idare ve hizmet binaları ile öğrenci ve personel yurtları.'
    ),
    facts: [
      ['type', L('Diploma project', 'مشروع التخرج', 'Diploma projesi')],
      ['tools', L('AutoCAD, Revit, SketchUp, D5 Render', 'AutoCAD وRevit وSketchUp وD5 Render', 'AutoCAD, Revit, SketchUp, D5 Render')],
    ],
    conceptTitle: L('Concept', 'الفكرة', 'Konsept'),
    concept: [
      L('People', 'الناس', 'İnsanlar'),
      L('Small groups, each with a home', 'مجموعات صغيرة، لكلٍّ منها مسكن', 'Her birinin bir evi olan küçük gruplar'),
      L('Clusters around a shared heart', 'تجمّعات حول قلبٍ مشترك', 'Ortak bir kalbin çevresinde kümeler'),
    ],
    buildingsTitle: L('Buildings of the village', 'مباني القرية', 'Köyün yapıları'),
    buildings: [
      { img: 'slv-dorm-1', name: L('Senior dorm, type 1', 'سكن كبار السن، النموذج 1', 'Yaşlı yurdu, tip 1') },
      { img: 'slv-dorm-2', name: L('Senior dorm, type 2', 'سكن كبار السن، النموذج 2', 'Yaşlı yurdu, tip 2') },
      { img: 'slv-dorm-3', name: L('Senior dorm, type 3', 'سكن كبار السن، النموذج 3', 'Yaşlı yurdu, tip 3') },
      { img: 'slv-health', name: L('Health care center', 'مركز الرعاية الصحية', 'Sağlık merkezi') },
      { img: 'slv-admin', name: L('Administration', 'الإدارة', 'İdare binası') },
      { img: 'slv-services', name: L('Services building', 'مبنى الخدمات', 'Hizmet binası') },
      { img: 'slv-sheet-a', name: L('Community center, student and staff dorms', 'المركز المجتمعي وسكن الطلاب والموظفين', 'Toplum merkezi, öğrenci ve personel yurtları') },
    ],
  },

  site: {
    title: L('On site: a TOKİ housing project', 'في الموقع: مشروع إسكان TOKİ', 'Şantiyede: bir TOKİ konut projesi'),
    summary: L(
      'A large-scale TOKİ residential project comprising residential buildings, a mosque, a school and shared outdoor spaces. As architectural site supervisor I carried out inspections, followed up defects, supervised the finishing teams and controlled quality.',
      'مشروع سكني واسع النطاق تابع لـ TOKİ يضم مباني سكنية ومسجدًا ومدرسة ومساحات خارجية مشتركة. بصفتي مشرفًا معماريًا في الموقع، أجريتُ الفحوص المعمارية وتابعتُ العيوب وأشرفتُ على فرق التشطيبات وعلى ضبط الجودة.',
      'Konut binaları, cami, okul ve ortak dış mekânlardan oluşan büyük ölçekli bir TOKİ konut projesi. Şantiye mimari kontrol sorumlusu olarak mimari kontrolleri yürüttüm, kusurları takip ettim, ince işler ekiplerini denetledim ve kalite kontrolü yaptım.'
    ),
    tokiNote: L('TOKİ is the Housing Development Administration of Türkiye.', 'TOKİ هي إدارة تطوير الإسكان في تركيا.', 'TOKİ: Toplu Konut İdaresi Başkanlığı.'),
    facts: [
      ['role', L('Architectural site supervisor', 'مشرف معماري في الموقع', 'Şantiye mimari kontrol sorumlusu')],
      ['company', L('Selahattin Kaldırım İnşaat, Bayburt', 'Selahattin Kaldırım İnşaat، بايبورت', 'Selahattin Kaldırım İnşaat, Bayburt')],
      ['location', L('Sazlıbosna, Arnavutköy, Istanbul', 'سازلي بوسنا، أرناؤوط كوي، إسطنبول', 'Sazlıbosna, Arnavutköy, İstanbul')],
    ],
    ceramicTitle: L('Ceramic works: inspection and repair', 'أعمال السيراميك: الفحص والإصلاح', 'Seramik işleri: kontrol ve onarım'),
    ceramicText: L(
      'Inspecting ceramic defects, identifying damaged and uneven tiles, and following up the repair works to ensure a proper finishing quality. Each defect is coded on site and tracked until it is closed.',
      'فحص عيوب السيراميك وتحديد البلاطات التالفة وغير المستوية، ومتابعة أعمال الإصلاح لضمان جودة التشطيب. يُرمَّز كل عيب في الموقع ويُتابَع حتى إغلاقه.',
      'Seramik kusurlarının kontrolü, hasarlı ve düzgün olmayan karoların tespiti ve doğru bir bitiş kalitesi için onarım işlerinin takibi. Her kusur sahada kodlanır ve kapanana kadar izlenir.'
    ),
    ceramics: [
      { code: 'D10', before: 'cer-d10-before', after: 'cer-d10-after' },
      { code: 'D12', before: 'cer-d12-before', after: 'cer-d12-after' },
      { code: 'D7', before: 'cer-d7-before', after: 'cer-d7-after' },
    ],
    leakTitle: L('Rainwater leakage: remedial works', 'تسرّب مياه الأمطار: أعمال المعالجة', 'Yağmur suyu sızıntısı: iyileştirme işleri'),
    leakText: L(
      'Identifying rainwater leaks affecting ceilings, walls and window corners, followed by suitable waterproofing and sealing to prevent them from recurring.',
      'تحديد تسرّبات مياه الأمطار التي تؤثر على الأسقف والجدران وزوايا النوافذ، ثم تطبيق حلول العزل المائي والإحكام المناسبة لمنع تكرارها.',
      'Tavanları, duvarları ve pencere köşelerini etkileyen yağmur suyu sızıntılarının tespiti; ardından tekrarlamaması için uygun su yalıtımı ve sızdırmazlık uygulamaları.'
    ),
    leaks: [
      { code: 'D20', problem: 'leak-d20', fix: 'fix-collar', fixName: L('Concrete collar around drainage pipes', 'طوق خرساني حول مواسير التصريف', 'Gider borularının çevresine beton yaka') },
      { code: 'B-02 D1', problem: 'leak-b02', fix: 'fix-membrane', fixName: L('Liquid-applied roof waterproofing', 'عزل مائي سائل للسطح', 'Likit uygulamalı çatı su yalıtımı') },
      { code: 'D21', problem: 'leak-d21', fix: 'fix-silicone', fixName: L('External silicone sealing of window frames', 'إحكام خارجي لإطارات النوافذ بالسيليكون', 'Pencere kasalarının dıştan silikonla yalıtımı') },
    ],
    docsTitle: L('Site inspection and technical documentation', 'الفحص الميداني والتوثيق الفني', 'Saha kontrolü ve teknik dokümantasyon'),
    docsText: L(
      'Findings are recorded and counted. Technical reports and quantity records were kept in Excel; two of them are reproduced here.',
      'تُسجَّل الملاحظات وتُحصى. أُعدّت التقارير الفنية وسجلات الكميات باستخدام Excel، وهذان اثنان منها.',
      'Bulgular kaydedilir ve sayılır. Teknik raporlar ve metraj kayıtları Excel ile tutuldu; ikisi burada yer alıyor.'
    ),
    glass: {
      title: L('Missing glass by building', 'الزجاج الناقص حسب المبنى', 'Bina bazında eksik cam dağılımı'),
      cols: [L('Building', 'المبنى', 'Bina'), L('Single glazing', 'زجاج مفرد', 'Tek cam'), L('Double glazing', 'زجاج مزدوج', 'Çift cam'), L('Total', 'المجموع', 'Toplam')],
      rows: [
        [L('School', 'المدرسة', 'Okul'), 11, 205, 216],
        [L('Mosque', 'المسجد', 'Cami'), 0, 176, 176],
        [L('Ada 1 (block)', 'Ada 1 (قطعة)', 'Ada 1'), 130, 213, 343],
        [L('Ada 2 (block)', 'Ada 2 (قطعة)', 'Ada 2'), 184, 200, 384],
      ],
      total: [L('Total', 'المجموع', 'Genel toplam'), 325, 794, 1119],
    },
    ceramicLog: {
      title: L('Block A-03: ceramic repair status', 'الكتلة A-03: حالة إصلاح السيراميك', 'A-03 Blok: seramik onarım durumu'),
      cols: [L('Flat', 'الشقة', 'Daire'), L('Location', 'المكان', 'İşlem yeri'), L('Work done', 'العمل المنجز', 'Yapılan işlem / son durum')],
      rows: [
        ['2', L('Kitchen, next to the radiator', 'المطبخ، بجانب المدفأة', 'Mutfak (kalorifer yanı)'), L('Defective floor tile replaced.', 'استُبدل بلاط الأرضية المعيب.', 'Sorunlu zemin seramiği değiştirildi.')],
        ['3', L('Balcony', 'الشرفة', 'Balkon'), L('New tiles laid around the drain and in the middle of the balcony.', 'رُكّب بلاط جديد حول المصرف وفي وسط الشرفة.', 'Gider çevresine ve balkonun orta bölümüne yeni seramik döşendi.')],
        ['7', L('Balcony', 'الشرفة', 'Balkon'), L('New tiles laid around the drain.', 'رُكّب بلاط جديد حول المصرف.', 'Gider çevresine yeni seramik döşendi.')],
        ['11', L('Balcony', 'الشرفة', 'Balkon'), L('New tiles laid around the drain.', 'رُكّب بلاط جديد حول المصرف.', 'Gider çevresine yeni seramik döşendi.')],
        ['14', L('Balcony', 'الشرفة', 'Balkon'), L('New tiles laid around the drain and by the kitchen balcony door.', 'رُكّب بلاط جديد حول المصرف وعند باب شرفة المطبخ.', 'Gider çevresine ve mutfak balkon kapısı tarafına yeni seramik döşendi.')],
        ['15', L('Main bathroom, wall', 'الحمّام الكبير، الجدار', 'Büyük banyo (duvar)'), L('New wall tiles laid.', 'رُكّب بلاط جدران جديد.', 'Yeni duvar seramiği döşendi.')],
        ['17', L('Balcony', 'الشرفة', 'Balkon'), L('New tiles laid around the drain.', 'رُكّب بلاط جديد حول المصرف.', 'Gider çevresine yeni seramik döşendi.')],
        ['18', L('Balcony', 'الشرفة', 'Balkon'), L('New tiles laid around the drain.', 'رُكّب بلاط جديد حول المصرف.', 'Gider çevresine yeni seramik döşendi.')],
        ['22', L('Balcony', 'الشرفة', 'Balkon'), L('New tiles laid by the kitchen balcony door.', 'رُكّب بلاط جديد عند باب شرفة المطبخ.', 'Mutfak balkon kapısı tarafına yeni seramik döşendi.')],
      ],
    },
  },
};

// Order of the projects in the narrative and in the index
export const workOrder = ['rcc', 'mrc', 'fac', 'mvr', 'villas', 'cc', 'slv', 'site'];
export const indexMeta = {
  rcc: L('Mall podium and three towers', 'مول وثلاثة أبراج', 'AVM podyumu ve üç kule'),
  mrc: L('Six towers with street retail', 'ستة أبراج مع محلات تجارية', 'Sokak ticaretli altı kule'),
  fac: L('Elevations for four blocks', 'واجهات لأربع كتل', 'Dört blok için cepheler'),
  mvr: L('Three villas', 'ثلاث فلل', 'Üç villa'),
  villas: L('Villa One and Villa Two', 'الفيلا الأولى والفيلا الثانية', 'Birinci ve İkinci Villa'),
  cc: L('Form found in paper', 'شكلٌ وُلد من الورق', 'Kâğıtta bulunan form'),
  slv: L('Diploma project', 'مشروع التخرج', 'Diploma projesi'),
  site: L('Site supervision and quality control', 'إشراف ميداني وضبط جودة', 'Şantiye kontrolü ve kalite kontrol'),
};
// Cover image of each project: used in the index, as the project page's full-bleed hero, and in "next project"
export const indexThumb = { rcc: 'rcc-night', mrc: 'mrc-night-a', fac: 'fac-street', mvr: 'mvr-r1', villas: 'v1-render', cc: 'cc-aerial', slv: 'slv-aerial', site: 'toki-aerial' };
// URL of each project page (same slug in every language)
export const slugs = {
  rcc: 'residential-commercial-complex', mrc: 'mixed-use-residential-complex', fac: 'facade-design', mvr: 'modern-villa-residences',
  villas: 'villa-one-and-two', cc: 'community-center', slv: 'senior-living-village', site: 'toki-site-supervision',
};
// The light each project page is set in (see tone.js)
export const projectTone = { rcc: 'dawn', mrc: 'night', fac: 'morning', mvr: 'day', villas: 'bright', cc: 'concrete', slv: 'landscape', site: 'overcast' };

export const practice = {
  title: L('Experience', 'الخبرة', 'Deneyim'),
  intro: L(
    'Design office and construction site, with the training in between.',
    'مكتب التصميم وموقع البناء، وما بينهما من تدريب.',
    'Tasarım ofisi ve şantiye; arada da eğitimler.'
  ),
  groups: [
    {
      name: L('Professional', 'العمل المهني', 'Profesyonel'),
      items: [
        {
          title: L('Architectural Designer', 'مصمم معماري', 'Mimari Tasarımcı'),
          org: 'Muratlı Mimarlık, Türkiye',
          text: L(
            'Worked as an architectural designer on real projects: 2D drawings, design development, drawing review, façade design, 3D modelling and architectural visualisation, using AutoCAD, SketchUp and Lumion to develop and present the designs.',
            'عملتُ مصممًا معماريًا على مشاريع حقيقية: رسومات ثنائية الأبعاد، وتطوير التصميم، ومراجعة الرسومات، وتصميم الواجهات، والنمذجة ثلاثية الأبعاد، والإظهار المعماري، مستخدمًا AutoCAD وSketchUp وLumion لتطوير التصاميم وعرضها.',
            'Gerçek mimari projelerde mimari tasarımcı olarak görev aldım; 2D çizimler, tasarım geliştirme, çizim kontrolü, cephe tasarımı, 3D modelleme ve mimari görselleştirme çalışmalarına katkı sağladım. Proje tasarımlarını geliştirmek ve sunmak için AutoCAD, SketchUp ve Lumion kullandım.'
          ),
        },
        {
          title: L('Architectural Site Supervisor', 'مشرف معماري في الموقع', 'Şantiye Mimari Kontrol Sorumlusu'),
          org: 'Selahattin Kaldırım İnşaat, Bayburt, Türkiye',
          text: L(
            'TOKİ residential projects: architectural inspections, defect follow-up, supervision of finishing teams and quality control. Prepared technical reports and quantity records in Excel, and designed standardised elevator entrances in SketchUp.',
            'مشاريع إسكان TOKİ: الفحوص المعمارية، ومتابعة العيوب، والإشراف على فرق التشطيبات، وضبط الجودة. أعددتُ تقارير فنية وسجلات كميات باستخدام Excel، وصمّمتُ مداخل مصاعد موحّدة باستخدام SketchUp.',
            'TOKİ konut projelerinde mimari kontroller, imalat kusurlarının tespiti ve takibi, ince işler ekiplerinin denetimi ve kalite kontrol süreçlerinde görev aldım. Excel kullanarak teknik raporlar ve metraj kayıtları hazırladım; SketchUp ile standart asansör girişleri tasarladım.'
          ),
        },
      ],
    },
    {
      name: L('Training and internships', 'التدريب', 'Eğitimler ve stajlar'),
      items: [
        {
          title: L('Office internship: architectural modelling and design support', 'تدريب مكتبي: النمذجة المعمارية ودعم التصميم', 'Ofis stajı: mimari modelleme ve tasarım desteği'),
          org: L('SAK Company', 'شركة SAK', 'SAK Şirketi'),
          text: L(
            'Developed 3D architectural models in Revit from 2D drawings for residential villa projects, and revised them based on a senior architect’s feedback, focusing on accuracy and design requirements.',
            'أنشأتُ نماذج معمارية ثلاثية الأبعاد في Revit انطلاقًا من رسومات ثنائية الأبعاد لمشاريع فلل سكنية، وعدّلتُها وفق ملاحظات المعماري الأول مع التركيز على الدقة ومتطلبات التصميم.',
            'Konut villa projelerinde, 2D çizimlerden yararlanarak Revit ile 3D mimari modeller oluşturdum. Modelleri, doğruluk ve tasarım gerekliliklerine odaklanarak kıdemli mimarın geri bildirimleri doğrultusunda revize ettim.'
          ),
        },
        {
          title: L('Site internship: construction supervision', 'تدريب ميداني: الإشراف على التنفيذ', 'Şantiye stajı: inşaat denetimi'),
          org: L('SAK Company', 'شركة SAK', 'SAK Şirketi'),
          text: L(
            'Practical experience in residential villa construction: plastering, insulation, marble works and aluminium windows. Assisted with quantity tracking and with checking drawings, dimensions and site execution.',
            'خبرة عملية في تنفيذ الفلل السكنية: اللياسة والعزل وأعمال الرخام والنوافذ الألمنيوم. ساعدتُ في متابعة الكميات ومراجعة الرسومات والأبعاد والتنفيذ في الموقع.',
            'Konut villa inşaatlarında sıva, yalıtım, mermer işleri ve alüminyum doğrama uygulamalarında pratik deneyim kazandım. Metraj takibine, çizimlerin ve ölçülerin kontrolüne ve saha uygulamalarının denetlenmesine destek verdim.'
          ),
        },
        {
          title: L('Revit training: 3D architectural modelling', 'تدريب Revit: النمذجة المعمارية ثلاثية الأبعاد', 'Revit eğitimi: 3D mimari modelleme'),
          org: null,
          text: L(
            'Practical training focused on 3D modelling of residential villas and converting 2D drawings into 3D architectural models.',
            'تدريب عملي يركّز على النمذجة ثلاثية الأبعاد للفلل السكنية وتحويل الرسومات ثنائية الأبعاد إلى نماذج معمارية ثلاثية الأبعاد.',
            'Konut villalarının 3D modellenmesi ve 2D çizimlerin 3D mimari modellere dönüştürülmesine odaklanan uygulamalı eğitim.'
          ),
        },
        {
          title: L('AutoCAD training: architectural drafting', 'تدريب AutoCAD: الرسم المعماري', 'AutoCAD eğitimi: mimari çizim'),
          org: null,
          cert: L('Certificate of Proficiency', 'شهادة كفاءة', 'Yeterlilik Sertifikası'),
          text: L(
            'Specialised training in 2D architectural drafting and technical drawings.',
            'تدريب متخصص في الرسم المعماري ثنائي الأبعاد والرسومات الفنية.',
            '2D mimari çizim ve teknik çizimler üzerine uzmanlık eğitimi.'
          ),
        },
        {
          title: L('Photoshop training: architectural visualisation and graphic design', 'تدريب Photoshop: الإظهار المعماري والتصميم الجرافيكي', 'Photoshop eğitimi: mimari görselleştirme ve grafik tasarım'),
          org: null,
          cert: L('Certificate of Completion', 'شهادة إتمام', 'Katılım Sertifikası'),
          text: L(
            'Training in architectural visualisation, graphic design and project presentation.',
            'تدريب في الإظهار المعماري والتصميم الجرافيكي وعرض المشاريع.',
            'Mimari görselleştirme, grafik tasarım ve proje sunumu alanlarında eğitim.'
          ),
        },
      ],
    },
    {
      name: L('Education', 'التعليم', 'Eğitim'),
      items: [
        {
          title: L('Bachelor of Architecture', 'بكالوريوس العمارة', 'Mimarlık Lisans Derecesi'),
          org: L('Istanbul Gelişim University, Istanbul, Türkiye', 'جامعة إسطنبول جيليشيم، إسطنبول، تركيا', 'İstanbul Gelişim Üniversitesi, İstanbul, Türkiye'),
          years: '2021–2025',
          text: null,
        },
      ],
    },
  ],
  toolsTitle: L('From 2D to presentation', 'من الرسم ثنائي الأبعاد إلى العرض', '2D’den sunuma'),
  toolsIntro: L(
    'The tools follow the way a project is made: drawn, modelled, visualised, then presented and documented.',
    'تتبع الأدوات مراحل صنع المشروع: الرسم، ثم النمذجة، ثم الإظهار، ثم العرض والتوثيق.',
    'Araçlar bir projenin yapılış sırasını izler: çizim, modelleme, görselleştirme, ardından sunum ve dokümantasyon.'
  ),
  tools: [
    { stage: L('Drafting', 'الرسم', 'Çizim'), items: ['AutoCAD'] },
    { stage: L('Modelling', 'النمذجة', 'Modelleme'), items: ['Revit', 'SketchUp', '3ds Max'] },
    { stage: L('Visualisation', 'الإظهار', 'Görselleştirme'), items: ['Lumion', 'D5 Render', 'Photoshop'] },
    { stage: L('Presentation', 'العرض', 'Sunum'), items: ['Canva'] },
    { stage: L('Documentation', 'التوثيق', 'Dokümantasyon'), items: ['Excel'] },
  ],
  languagesTitle: L('Languages', 'اللغات', 'Diller'),
  strengthsTitle: L('Ways of working', 'أسلوب العمل', 'Çalışma biçimi'),
};
