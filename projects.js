/* ============ EDIT YOUR INFO HERE ============
   Texts that differ by language live in SITE.text.en / SITE.text.ru. */
window.SITE = {
  name: "evervie",                       // logo text (a dot is added automatically)
  photo: "",                             // e.g. "assets/me.jpg" — leave empty for a placeholder
  tools: ["Figma", "Ps", "Ai"],          // edit to your real tools
  resume: "",                            // "assets/resume.pdf" or { en: "...", ru: "..." } — button hides if empty
  email: "design.eivie@gmail.com",
  social: {
    telegram:  "https://t.me/hello_evervie",
    instagram: "https://www.instagram.com/hello_evervie/",
    github:    "https://github.com/evervie",
    x:         "https://x.com/hello_evervie",
  },
  text: {
    en: {
      role: "graphic & digital designer",
      intro: "I'm a graphic and digital designer who turns ideas into visual solutions.",
      about: "Write a few sentences about yourself here.",
      skills: ["Branding", "Graphic Design", "Web Design"],
      cta: "let's create something together.",
    },
    ru: {
      role: "графический и digital-дизайнер",
      intro: "Я графический и digital-дизайнер: превращаю идеи в визуальные решения.",
      about: "Напишите здесь несколько предложений о себе.",
      skills: ["Брендинг", "Графический дизайн", "Веб-дизайн"],
      cta: "давайте создадим что-нибудь вместе.",
    },
  },
};

/* ============ PROJECTS + SPECIAL CASES (one list) ============
   Start with 3-5 real cases. Each card = one main image (same crop for all), short meta (title, direction, year, role).
   Inside a case: task -> insight -> solution -> results, then a gallery with captions.
   Filters appear only when real projects fall into 2+ categories. One "soon" card is enough to hint the format.
   Text fields can be a plain string or { en: "...", ru: "..." }.
  {
    title: { en: "Project name", ru: "Название" },
    type:  { en: "Branding", ru: "Брендинг" },          // direction (also shown on the card)
    cat:   { en: "Branding", ru: "Брендинг" },          // filter category
    special: true,                                      // optional: also listed under "Special cases"
    year: 2026,
    role: { en: "Art direction, identity", ru: "Арт-дирекция, айдентика" },
    description: { en: "One or two sentences.", ru: "Одно-два предложения." },
    task:     { en: "What the client needed.", ru: "Что нужно было клиенту." },
    insight:  { en: "The constraint or the key idea.", ru: "Ограничение или ключевая мысль." },
    solution: { en: "What you made.", ru: "Что вы сделали." },
    results:  { en: "Final deliverables / outcome.", ru: "Итоговые носители / результат." },
    cover: "assets/project-1/cover.jpg",
    images: [ { src: "assets/project-1/1.jpg", caption: { en: "Caption", ru: "Подпись" } }, "assets/project-1/2.jpg" ],
    link: "https://...",                                // optional
    soon: true                                          // optional: shown but not clickable
  }
*/
window.PROJECTS = [
  { soon: true, title: { en: "Next case", ru: "Следующий кейс" }, type: { en: "In progress", ru: "В работе" }, year: 2026 },
];
