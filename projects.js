/* ============ EDIT YOUR INFO HERE ============
   Texts that differ by language live in SITE.text.en / SITE.text.ru. */
window.SITE = {
  name: "evervie",
  photo: "",                             // e.g. "assets/me.jpg" — leave empty for a placeholder
  tools: ["Figma", "Ps", "Ai", "Tilda"],
  resume: "",                            // later: "assets/resume/resume.pdf" or { en: "...", ru: "..." } — until then the button is shown disabled
  email: "design.eivie@gmail.com",
  social: {
    telegram:  "https://t.me/hello_evervie",
    instagram: "https://www.instagram.com/hello_evervie/",
    pinterest: "",   // paste your Pinterest link here (e.g. https://www.pinterest.com/yourname/) — the icon appears only when it is filled
    github:    "https://github.com/evervie",
    x:         "https://x.com/hello_evervie",
  },
  text: {
    en: {
      role: "graphic & digital designer",
      intro: "I'm a graphic and digital designer who turns ideas into visual solutions.",
      process: [
        { t: "Briefing", d: "I learn the task, the goals and the expectations." },
        { t: "Research & analysis", d: "I study the audience, the market and competitors." },
        { t: "Visual concept", d: "I collect references, sketch ideas and choose a direction." },
        { t: "Design development", d: "I turn the concept into layouts and precise details." },
        { t: "Refinement & delivery", d: "I polish the result and prepare the final files." },
      ],
      story: [
        { y: "2011", t: "First conscious passion for creativity." },
        { y: "2020", t: "Graduated from art school with honours (red diploma)." },
        { y: "2025", t: "First professional design projects." },
      ],
      skills: ["Branding", "Graphic Design", "Web Design", "Packaging"],
      cta: "let's create something together.",
    },
    ru: {
      role: "графический и digital-дизайнер",
      intro: "Я графический и digital-дизайнер: превращаю идеи в визуальные решения.",
      process: [
        { t: "Брифинг", d: "Знакомлюсь с задачей, целями и ожиданиями." },
        { t: "Исследование и анализ", d: "Изучаю аудиторию, рынок и конкурентов." },
        { t: "Поиск визуальной концепции", d: "Собираю референсы, набрасываю идеи и выбираю направление." },
        { t: "Разработка дизайна", d: "Превращаю концепцию в макеты и точные детали." },
        { t: "Доработка и подготовка результата", d: "Довожу до идеала и готовлю финальные файлы." },
      ],
      story: [
        { y: "2011", t: "Впервые начала осознанно увлекаться творчеством." },
        { y: "2020", t: "Закончила школу искусств с красным дипломом." },
        { y: "2023", t: "Первые профессиональные разработки в дизайне." },
      ],
      skills: ["Брендинг", "Графический дизайн", "Веб-дизайн", "Дизайн упаковки"],
      cta: "давайте создадим что-нибудь вместе.",
    },
  },
};

/* ============ PROJECTS ============
   Each card shows up to 3 tags (they also become the filter buttons).
   Text fields can be a plain string or { en: "...", ru: "..." }.
   cover: card picture.  images: gallery inside the project.  mock: a drawn browser window (used while there are no screenshots).
   badge: small label on the card.  year: optional — add it when you want it shown.
   Real screenshots of the website: put them in assets/utilization/ and list them in "cover" + "images" of the first project. */
/* Filter menu (burger in the projects block). Each project lists the categories it belongs to in "cats". */
window.FILTERS = [
  { k: "ux",     l: { en: "UX/UI design", ru: "UX/UI дизайн" } },
  { k: "design", l: { en: "Design",       ru: "Дизайн" } },
];
window.PROJECTS = [
  {
    title: { en: "EcoUtil", ru: "ЭкоУтиль" },
    type:  { en: "Website for a company", ru: "Сайт компании" },
    badge: { en: "My first project · diploma", ru: "Мой первый проект · диплом" },
    cats:  ["ux", "design"],
    tags:  ["Tilda", { en: "UX/UI design", ru: "UX/UI дизайн" }, { en: "Web design", ru: "Веб-дизайн" }],
    description: {
      en: "A corporate website for a waste-recycling company. This is the very first website I made — and the work I defended my diploma with at my educational institution.",
      ru: "Корпоративный сайт компании по переработке и утилизации отходов. Это самый первый мой сайт — именно с ним я защищала диплом в учебном заведении."
    },
    task: {
      en: "Present the company as reliable and make it easy for business clients to find licenses and prices and to leave a request.",
      ru: "Показать компанию надёжной и сделать так, чтобы корпоративному клиенту было легко найти лицензии и цены и оставить заявку."
    },
    solution: {
      en: "A clear structure: a first screen with key figures (10 years of experience, 2000+ tonnes a year, 20+ corporate clients), advantages, a licenses and certificates block, separate pages for the price list and the online request, and contacts.",
      ru: "Понятная структура: первый экран с ключевыми цифрами (10 лет опыта, 2000+ тонн в год, 20+ корпоративных клиентов), преимущества, блок лицензий и сертификатов, отдельные страницы с прайс-листом и онлайн-заявкой, контакты."
    },
    results: {
      en: "A live, working website on Tilda — my first complete project and my diploma work.",
      ru: "Рабочий сайт на Tilda — мой первый законченный проект и дипломная работа."
    },
    cover: "assets/util/1.png",
    mock: { url: "utilizatsiyaothodov.tilda.ws" },
    link: "https://utilizatsiyaothodov.tilda.ws"
  },
  {
    title: "homakoll elastic",
    type:  { en: "Label design", ru: "Дизайн этикетки" },
    badge: { en: "Test assignment", ru: "Тестовое задание" },
    cats:  ["design"],
    tags:  ["Figma", "Illustrator", { en: "Packaging design", ru: "Дизайн упаковки" }],
    description: {
      en: "A label for HOMA's ready-to-use acrylic tile adhesive (3.5 kg bucket) — a test assignment from an employer. I carried it further: a bucket mockup, a promo banner and an infographic card in one style.",
      ru: "Этикетка для готового акрилового клея для плитки HOMA (ведро 3,5 кг) — тестовое задание от работодателя. Я довела его до целого комплекта: мокап ведра, промо-баннер и инфографика в одном стиле."
    },
    task: {
      en: "Design a label that reads in a second: odour-free, eco-friendly, waterproof, frost-resistant, class D2TE, for tiles up to 45 × 45 cm.",
      ru: "Сделать этикетку, которая считывается за секунду: без запаха, экологичный, водостойкий, морозостойкий, класс D2TE, для плитки до 45 × 45 см."
    },
    solution: {
      en: "Strict black-and-red palette of the brand; clear hierarchy — logo, product name, what it is, icons, and a black strip with class and benefits. A red ribbon wraps around the bucket and links the label with the tile texture.",
      ru: "Строгая чёрно-красная палитра бренда; чёткая иерархия — логотип, название, что это, иконки и чёрная полоса с классом и преимуществами. Красная лента огибает ведро и связывает этикетку с фактурой плитки."
    },
    results: {
      en: "Label, 3D bucket mockup, promo banner and infographic card.",
      ru: "Этикетка, 3D-мокап ведра, промо-баннер и инфографика."
    },
    cover: "assets/homakoll/1-1.jpg",
    images: [
      { src: "assets/homakoll/1-label.jpg",       caption: { en: "Label", ru: "Этикетка" } },
      { src: "assets/homakoll/1-1.jpg",           caption: { en: "Bucket mockup", ru: "Мокап ведра" } },   /* 1-1.jpg is the high-res version of the mockup */
      { src: "assets/homakoll/3-banner.jpg",      caption: { en: "Promo banner", ru: "Промо-баннер" } },
      { src: "assets/homakoll/4-infographic.jpg", caption: { en: "Infographic card", ru: "Инфографика" } },
    ],
  },
{
  title: {
    en: "Maison Belladore",
    ru: "Maison Belladore"
  },

  type: {
    en: "Website design & development",
    ru: "Дизайн и разработка сайта"
  },

  badge: {
    en: "Web design project",
    ru: "Веб-дизайн"
  },

  year: "2026",

  cats: ["ux", "design"],

  tags: [
    "Web Design",
    "UX/UI",
    "Website"
  ],

  description: {
    en: "A website for Maison Belladore.",
    ru: "Создание сайта для Maison Belladore."
  },

  task: {
    en: "To create an elegant digital experience.",
    ru: "Создать элегантный цифровой опыт."
  },

  solution: {
    en: "Developed the visual concept, website structure and interface.",
    ru: "Разработала визуальную концепцию, структуру сайта и интерфейс."
  },

  results: {
    en: "A fully developed and published website.",
    ru: "Полностью разработанный и опубликованный сайт."
  },

  cover: "assets/maison/cover.png",

  images: [
    {
      src: "assets/maison/homepage.png",
      caption: {
        en: "Homepage",
        ru: "Главная страница"
      }
    },
    {
      src: "assets/maison/details.png",
      caption: {
        en: "Website details",
        ru: "Детали сайта"
      }
    }
  ],

  link: "https://maisonbelladore.netlify.app"
},
  { soon: true, title: { en: "Next case", ru: "Следующий кейс" }, type: { en: "In progress", ru: "В работе" } },
];
