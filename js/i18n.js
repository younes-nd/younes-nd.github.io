/* New Day — all UI strings. Add a language by adding a block with the same keys. */
const I18N = {
  ar: {
    dir: 'rtl', langName: 'العربية',
    appName: 'يوم جديد', tagline: 'كل يوم فرصة جديدة لبناء نظامك',
    // onboarding
    obWelcome: 'أهلاً بك في يوم جديد', obWelcomeSub: 'اكتب نظامك، أنجز مهامك، وشاهد نقاطك ترتفع كل يوم.',
    obLang: 'اختر اللغة', obDuration: 'كم مدة خطتك؟', obDurationSub: 'يمكنك تغييرها لاحقاً من الإعدادات.',
    obRest: 'اختر أيام الراحة', obRestSub: 'أيام الراحة لا تكسر سلسلتك 🔥',
    obStart: 'ابدأ خطتي', next: 'التالي', back: 'رجوع', skip: 'تخطي',
    d1m: 'شهر', d3m: '3 أشهر', d6m: '6 أشهر', d1y: 'سنة', dCustom: 'مخصص', customDays: 'عدد الأيام',
    // nav
    navToday: 'اليوم', navWeek: 'الأسبوع', navStats: 'الإحصائيات', navSettings: 'الإعدادات',
    // today
    hello: 'مرحباً 👋', todayTasks: 'مهام اليوم', restDay: 'يوم راحة 🌿', restDaySub: 'استرح جيداً — سلسلتك محفوظة. يمكنك إنجاز مهام إضافية إن أردت.',
    noTasks: 'لا توجد مهام لهذا اليوم', noTasksSub: 'أضف أول عادة لتبدأ بجمع النقاط.', addFirst: 'أضف عادة',
    done: 'تم', ofTasks: '{a} من {b}', allDone: 'أنجزت كل مهام اليوم! 🎉', streak: 'السلسلة', days: 'يوم', daysN: '{n} يوم',
    level: 'المستوى', xp: 'نقطة', xpShort: 'XP', toNext: '{n} نقطة للمستوى التالي',
    planDay: 'اليوم {a} من {b}', planLeft: 'بقي {n} يوم', planDone: 'أكملت خطتك! 🏆',
    goodHabit: 'عادة أفعلها', badHabit: 'عادة أتركها', resisted: 'قاومت', resistedQ: 'تجنّبتها اليوم؟',
    // habit form
    addHabit: 'عادة جديدة', editHabit: 'تعديل العادة', habitName: 'الاسم', habitNamePh: 'مثال: تمرين 30 دقيقة',
    type: 'النوع', repeat: 'التكرار', everyDay: 'كل يوم', weekdays: 'أيام محددة', onceDate: 'مرة واحدة (تاريخ)',
    time: 'الوقت (اختياري)', icon: 'الأيقونة', color: 'اللون', points: 'النقاط', save: 'حفظ', cancel: 'إلغاء', delete: 'حذف',
    confirmDelete: 'حذف هذه العادة؟ سيبقى سجلّها في إحصائياتك.', nameRequired: 'اكتب اسماً للعادة', pickDay: 'اختر يوماً واحداً على الأقل',
    // week
    thisWeek: 'هذا الأسبوع', prevWeek: 'السابق', nextWeek: 'التالي', weekDone: '{a}/{b} مهام', rest: 'راحة', today: 'اليوم',
    future: 'لم يأت بعد', tapToOpen: 'اضغط على يوم لعرضه',
    // stats
    completion: 'نسبة الإنجاز', currentStreak: 'السلسلة الحالية', bestStreak: 'أفضل سلسلة', totalXp: 'مجموع النقاط',
    xpChart: 'النقاط — آخر 14 يوماً', perHabit: 'حسب العادة', planProgress: 'تقدّم الخطة', tasksDone: 'مهام منجزة',
    perfectDays: 'أيام كاملة', levelTitle: 'اللقب',
    howScore: 'كيف تُحسب النقاط؟', howScoreBody: 'كل مهمة منجزة = نقاطها. كل يوم تنجز فيه نصف مهامك على الأقل يزيد سلسلتك ويمنحك مكافأة (+5 لكل يوم في السلسلة، حتى +50). اليوم الكامل 100% = +20. أيام الراحة لا تكسر السلسلة.',
    // settings
    language: 'اللغة', theme: 'المظهر', light: 'فاتح', dark: 'داكن', auto: 'تلقائي', plan: 'الخطة',
    startDate: 'تاريخ البداية', duration: 'المدة', restDays: 'أيام الراحة', weekStart: 'أول يوم في الأسبوع',
    backup: 'النسخ الاحتياطي', exportData: 'تصدير البيانات', importData: 'استيراد نسخة', importOk: 'تم استيراد النسخة ✅',
    importBad: 'الملف غير صالح', resetAll: 'مسح كل البيانات', confirmReset: 'سيتم حذف كل شيء نهائياً. متأكد؟',
    installApp: 'ثبّت التطبيق', installSub: 'أضفه للشاشة الرئيسية ليعمل بدون إنترنت.', install: 'تثبيت',
    installHint: 'من قائمة المتصفح ⋮ اختر «إضافة إلى الشاشة الرئيسية».', offlineReady: 'يعمل بدون إنترنت ✓', about: 'حول',
    version: 'الإصدار', saved: 'تم الحفظ',
    // toasts
    levelUp: 'مستوى جديد!', levelUpSub: 'أصبحت الآن «{t}»', keepGoing: 'واصل!', gotXp: '+{n} نقطة', streakBonus: 'مكافأة السلسلة +{n}',
    perfectBonus: 'يوم كامل! +{n}', undo: 'تراجع',
    titles: ['مبتدئ','منطلق','منتظم','ملتزم','مركّز','منضبط','صامد','متفوّق','خبير','متمكّن','أسطورة'],
    dayShort: ['أحد','إثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت'],
    dayLong: ['الأحد','الإثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'],
    locale: 'ar-DZ-u-nu-latn'
  },
  en: {
    dir: 'ltr', langName: 'English',
    appName: 'New Day', tagline: 'Every day is a new chance to build your system',
    obWelcome: 'Welcome to New Day', obWelcomeSub: 'Write your system, check off your tasks, and watch your score climb every day.',
    obLang: 'Choose your language', obDuration: 'How long is your plan?', obDurationSub: 'You can change it later in Settings.',
    obRest: 'Pick your rest days', obRestSub: 'Rest days never break your streak 🔥',
    obStart: 'Start my plan', next: 'Next', back: 'Back', skip: 'Skip',
    d1m: '1 month', d3m: '3 months', d6m: '6 months', d1y: '1 year', dCustom: 'Custom', customDays: 'Number of days',
    navToday: 'Today', navWeek: 'Week', navStats: 'Stats', navSettings: 'Settings',
    hello: 'Hello 👋', todayTasks: "Today's tasks", restDay: 'Rest day 🌿', restDaySub: 'Recharge — your streak is safe. Bonus tasks still earn XP.',
    noTasks: 'No tasks for this day', noTasksSub: 'Add your first habit to start earning XP.', addFirst: 'Add a habit',
    done: 'Done', ofTasks: '{a} of {b}', allDone: 'All tasks done today! 🎉', streak: 'Streak', days: 'days', daysN: '{n} days',
    level: 'Level', xp: 'XP', xpShort: 'XP', toNext: '{n} XP to next level',
    planDay: 'Day {a} of {b}', planLeft: '{n} days left', planDone: 'Plan complete! 🏆',
    goodHabit: 'Build a habit', badHabit: 'Quit a habit', resisted: 'Resisted', resistedQ: 'Avoided it today?',
    addHabit: 'New habit', editHabit: 'Edit habit', habitName: 'Name', habitNamePh: 'e.g. Workout 30 min',
    type: 'Type', repeat: 'Repeat', everyDay: 'Every day', weekdays: 'Specific days', onceDate: 'Once (date)',
    time: 'Time (optional)', icon: 'Icon', color: 'Color', points: 'Points', save: 'Save', cancel: 'Cancel', delete: 'Delete',
    confirmDelete: 'Delete this habit? Its history stays in your stats.', nameRequired: 'Give the habit a name', pickDay: 'Pick at least one day',
    thisWeek: 'This week', prevWeek: 'Previous', nextWeek: 'Next', weekDone: '{a}/{b} tasks', rest: 'Rest', today: 'Today',
    future: 'Upcoming', tapToOpen: 'Tap a day to open it',
    completion: 'Completion', currentStreak: 'Current streak', bestStreak: 'Best streak', totalXp: 'Total XP',
    xpChart: 'XP — last 14 days', perHabit: 'By habit', planProgress: 'Plan progress', tasksDone: 'Tasks done',
    perfectDays: 'Perfect days', levelTitle: 'Title',
    howScore: 'How scoring works', howScoreBody: 'Each completed task earns its points. Every day you finish at least half your tasks grows your streak and adds a bonus (+5 per streak day, up to +50). A 100% day adds +20. Rest days never break the streak.',
    language: 'Language', theme: 'Theme', light: 'Light', dark: 'Dark', auto: 'Auto', plan: 'Plan',
    startDate: 'Start date', duration: 'Duration', restDays: 'Rest days', weekStart: 'Week starts on',
    backup: 'Backup', exportData: 'Export data', importData: 'Import backup', importOk: 'Backup imported ✅',
    importBad: 'That file is not a valid backup', resetAll: 'Erase all data', confirmReset: 'This deletes everything for good. Sure?',
    installApp: 'Install the app', installSub: 'Add it to your home screen — it works offline.', install: 'Install',
    installHint: 'Open the browser menu ⋮ and choose “Add to Home screen”.', offlineReady: 'Works offline ✓', about: 'About',
    version: 'Version', saved: 'Saved',
    levelUp: 'Level up!', levelUpSub: 'You are now “{t}”', keepGoing: 'Keep going!', gotXp: '+{n} XP', streakBonus: 'Streak bonus +{n}',
    perfectBonus: 'Perfect day! +{n}', undo: 'Undo',
    titles: ['Beginner','Starter','Consistent','Committed','Focused','Disciplined','Resilient','Achiever','Expert','Master','Legend'],
    dayShort: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
    dayLong: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    locale: 'en-GB'
  },
  fr: {
    dir: 'ltr', langName: 'Français',
    appName: 'New Day', tagline: 'Chaque jour, une nouvelle chance de construire ton système',
    obWelcome: 'Bienvenue sur New Day', obWelcomeSub: 'Écris ton système, coche tes tâches et regarde ton score grimper chaque jour.',
    obLang: 'Choisis ta langue', obDuration: 'Quelle durée pour ton plan ?', obDurationSub: 'Modifiable plus tard dans les réglages.',
    obRest: 'Choisis tes jours de repos', obRestSub: 'Les jours de repos ne cassent jamais ta série 🔥',
    obStart: 'Lancer mon plan', next: 'Suivant', back: 'Retour', skip: 'Passer',
    d1m: '1 mois', d3m: '3 mois', d6m: '6 mois', d1y: '1 an', dCustom: 'Personnalisé', customDays: 'Nombre de jours',
    navToday: "Aujourd'hui", navWeek: 'Semaine', navStats: 'Stats', navSettings: 'Réglages',
    hello: 'Salut 👋', todayTasks: 'Tâches du jour', restDay: 'Jour de repos 🌿', restDaySub: 'Recharge-toi — ta série est protégée. Les tâches bonus rapportent quand même des XP.',
    noTasks: 'Aucune tâche ce jour-là', noTasksSub: 'Ajoute ta première habitude pour gagner des XP.', addFirst: 'Ajouter une habitude',
    done: 'Fait', ofTasks: '{a} sur {b}', allDone: 'Toutes les tâches du jour sont faites ! 🎉', streak: 'Série', days: 'jours', daysN: '{n} jours',
    level: 'Niveau', xp: 'XP', xpShort: 'XP', toNext: '{n} XP avant le niveau suivant',
    planDay: 'Jour {a} sur {b}', planLeft: 'Encore {n} jours', planDone: 'Plan terminé ! 🏆',
    goodHabit: 'Habitude à prendre', badHabit: 'Habitude à arrêter', resisted: 'Résisté', resistedQ: 'Évitée aujourd’hui ?',
    addHabit: 'Nouvelle habitude', editHabit: "Modifier l'habitude", habitName: 'Nom', habitNamePh: 'ex. Sport 30 min',
    type: 'Type', repeat: 'Répétition', everyDay: 'Tous les jours', weekdays: 'Jours précis', onceDate: 'Une fois (date)',
    time: 'Heure (optionnel)', icon: 'Icône', color: 'Couleur', points: 'Points', save: 'Enregistrer', cancel: 'Annuler', delete: 'Supprimer',
    confirmDelete: 'Supprimer cette habitude ? Son historique reste dans tes stats.', nameRequired: "Donne un nom à l'habitude", pickDay: 'Choisis au moins un jour',
    thisWeek: 'Cette semaine', prevWeek: 'Précédente', nextWeek: 'Suivante', weekDone: '{a}/{b} tâches', rest: 'Repos', today: "Aujourd'hui",
    future: 'À venir', tapToOpen: 'Touche un jour pour l’ouvrir',
    completion: 'Réussite', currentStreak: 'Série actuelle', bestStreak: 'Meilleure série', totalXp: 'XP total',
    xpChart: 'XP — 14 derniers jours', perHabit: 'Par habitude', planProgress: 'Avancement du plan', tasksDone: 'Tâches faites',
    perfectDays: 'Jours parfaits', levelTitle: 'Titre',
    howScore: 'Comment marche le score ?', howScoreBody: 'Chaque tâche faite rapporte ses points. Chaque jour où tu fais au moins la moitié de tes tâches allonge ta série et ajoute un bonus (+5 par jour de série, jusqu’à +50). Une journée à 100 % ajoute +20. Les jours de repos ne cassent pas la série.',
    language: 'Langue', theme: 'Thème', light: 'Clair', dark: 'Sombre', auto: 'Auto', plan: 'Plan',
    startDate: 'Date de début', duration: 'Durée', restDays: 'Jours de repos', weekStart: 'La semaine commence le',
    backup: 'Sauvegarde', exportData: 'Exporter les données', importData: 'Importer une sauvegarde', importOk: 'Sauvegarde importée ✅',
    importBad: 'Fichier de sauvegarde invalide', resetAll: 'Effacer toutes les données', confirmReset: 'Tout sera supprimé définitivement. Sûr ?',
    installApp: "Installer l'appli", installSub: "Ajoute-la à l'écran d'accueil — elle marche hors ligne.", install: 'Installer',
    installHint: "Menu du navigateur ⋮ puis « Ajouter à l'écran d'accueil ».", offlineReady: 'Fonctionne hors ligne ✓', about: 'À propos',
    version: 'Version', saved: 'Enregistré',
    levelUp: 'Niveau supérieur !', levelUpSub: 'Tu es maintenant « {t} »', keepGoing: 'Continue !', gotXp: '+{n} XP', streakBonus: 'Bonus de série +{n}',
    perfectBonus: 'Journée parfaite ! +{n}', undo: 'Annuler',
    titles: ['Débutant','Lancé','Régulier','Engagé','Concentré','Discipliné','Résilient','Accompli','Expert','Maître','Légende'],
    dayShort: ['dim','lun','mar','mer','jeu','ven','sam'],
    dayLong: ['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'],
    locale: 'fr-FR'
  }
};

let LANG = 'ar';
function setLang(l) { LANG = I18N[l] ? l : 'ar'; const d = I18N[LANG]; document.documentElement.lang = LANG; document.documentElement.dir = d.dir; }
function t(key, vars) {
  let s = (I18N[LANG] && I18N[LANG][key]); if (s === undefined) s = I18N.en[key]; if (s === undefined) return key;
  if (vars && typeof s === 'string') s = s.replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? vars[k] : m));
  return s;
}
function fmtNum(n) { return new Intl.NumberFormat(t('locale')).format(n); }
function fmtDate(iso, opts) { const [y, m, d] = iso.split('-').map(Number); return new Intl.DateTimeFormat(t('locale'), opts || { day: 'numeric', month: 'short' }).format(new Date(y, m - 1, d)); }
