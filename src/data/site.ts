// Homepage content. Source: veon/client.json (C-002…C-011, products_services) and the client's own site texts
// (reviews from vidguky.php = C-010, FAQ from the homepage and zapytannya-vidpovidi.php = C-005, C-008, C-009).
// Nothing here is invented: no prices, ratings, counters, warranty terms or before/after pairs.

export const FUTURE = "Розділ у розробці";

export const contacts = {
  phoneMain: { href: "tel:+380639778741", display: "(063) 977-87-41" },
  phoneSecond: { href: "tel:+380687782393", display: "(068) 778-23-93" },
  viber: "viber://chat?number=%2B380639778741",
  whatsapp: "whatsapp://send?phone=+380639778741",
  email: { href: "mailto:myremontmebliv@gmail.com", display: "MyRemontMebliv@gmail.com" },
  hours: "Прийом замовлень 8:00–21:00, без вихідних",
  hoursShort: "8:00–21:00, без вихідних",
} as const;

export const nav = [
  { href: "#posluhy", label: "Послуги" },
  { href: "#roboty", label: "Роботи" },
  { href: "#yak-diznatysya-tsinu", label: "Як дізнатися ціну" },
  { href: "#vidguky", label: "Відгуки" },
  { href: "#pytannya", label: "Питання" },
  { href: "#kontakty", label: "Контакти" },
] as const;

/** Signature sentence: every noun leads to its group in #posluhy. */
export const inventory: { text: string; href: string }[] = [
  { text: "дивани", href: "#posluhy-peretyazhka" },
  { text: "ліжка й узголів'я", href: "#posluhy-peretyazhka" },
  { text: "м'які та офісні крісла", href: "#posluhy-krisla" },
  { text: "кухонні куточки", href: "#posluhy-peretyazhka" },
  { text: "стільці", href: "#posluhy-peretyazhka" },
  { text: "пуфи", href: "#posluhy-peretyazhka" },
  { text: "стоматологічні крісла", href: "#posluhy-krisla" },
  { text: "сидіння авто", href: "#posluhy-avto" },
];

export type ServiceItem = { label: string; future: boolean };
export type ServiceGroup = {
  id: string;
  title: string;
  note?: string;
  items: ServiceItem[];
  extra?: { title: string; items: string[] };
  photo?: "sofa" | "office" | "car";
  photoCaption?: string;
};

/** 21 positions of C-006 in 5 groups (business_lines). Items with their own future page are FutureLink. */
export const services: ServiceGroup[] = [
  {
    id: "posluhy-peretyazhka",
    title: "Перетяжка м'яких меблів",
    items: [
      { label: "Дивани", future: true },
      { label: "Ліжка", future: true },
      { label: "Узголів'я ліжок", future: true },
      { label: "М'які крісла", future: true },
      { label: "Кухонні куточки", future: true },
      { label: "Стільці", future: true },
      { label: "Пуфи", future: true },
      { label: "Заміна чохла для матраца", future: false },
    ],
    note: "Також робимо обшивку подушок.",
    photo: "sofa",
    photoCaption: "Кутовий диван",
  },
  {
    id: "posluhy-krisla",
    title: "Офісні та спеціальні крісла",
    items: [
      { label: "Комп'ютерні крісла", future: true },
      { label: "Офісні крісла", future: true },
      { label: "Стоматологічні крісла", future: true },
    ],
    photo: "office",
    photoCaption: "Офісне крісло",
  },
  {
    id: "posluhy-avto",
    title: "Сидіння авто",
    items: [
      { label: "Перетяжка сидінь авто", future: true },
      { label: "Хімчистка сидінь авто", future: true },
    ],
    photo: "car",
    photoCaption: "Сидіння авто",
  },
  {
    id: "posluhy-khimchystka",
    title: "Хімчистка",
    note: "Як і де чистимо саме вашу річ, розкаже майстер по телефону.",
    items: [
      { label: "Меблі", future: true },
      { label: "Дивани", future: true },
      { label: "Крісла", future: true },
      { label: "Матраци", future: true },
      { label: "Узголів'я ліжка", future: true },
      { label: "Стільці", future: true },
    ],
  },
  {
    id: "posluhy-remont",
    title: "Ремонт меблів",
    note: "Ремонтуємо дивани, а під час перетяжки — за потреби й менші м'які меблі: крісла, стільці.",
    items: [{ label: "Ремонт м'яких, корпусних і офісних меблів", future: true }],
    extra: {
      title: "Корпусні меблі",
      items: [
        "Проблема з відкриттям та провисання дверей шаф",
        "Просідання основи шафи, комода, тумбочок",
        "Проблема з відкриттям ящиків",
        "Механічні ушкодження поверхні",
        "Несправність фурнітури, елементів кріплення",
      ],
    },
  },
];

export const steps = [
  { title: "Напишіть або зателефонуйте", text: "Розкажіть, що саме треба перетягнути." },
  { title: "Надішліть фото", text: "Обговоріть деталі з майстром і надішліть йому фото ваших меблів." },
  { title: "Оберіть матеріал", text: "", materials: ["рогожка", "жаккард", "велюр", "антикіготь", "шкірозамінник", "шкіра", "гобелен", "флок", "або ваш матеріал"] },
  { title: "Дізнайтеся ціну", text: "Після цього майстер назве вартість перетяжки." },
] as const;

export const workFacts = [
  "Майстри забирають меблі в майстерню і привозять назад",
  "Перетяжка переважно в майстерні, невеликі обсяги можна вдома",
  "Оплата готівкою або переказом з картки",
  "Майстри з досвідом роботи від 5 років",
  "Гарантія на всі види робіт",
];

export const reviews = [
  { name: "Олена", date: "2025-07-27", dateText: "27.07.2025", text: "Наш диванчик тепер виглядає як новенький, навіть краще, бо підібрали оптимальний колір." },
  { name: "Андрій", date: "2025-06-14", dateText: "14.06.2025", text: "Дуже якісно перетягнули комп'ютерне крісло, було в такому стані, що думав вже викидати :) Дякую!" },
  { name: "Катерина", date: "2025-09-05", dateText: "05.09.2025", text: "Дякуємо вашим спеціалістам за перетягнення нашого дивана, виглядає фантастично. Буду рекомендувати друзям" },
  { name: "Ольга", date: "2025-10-14", dateText: "14.10.2025", text: "Замовляли перетяжку двох офісних стільців, результатом дуже задоволені. Майстер зробив все швидко та професійно." },
  { name: "Василь", date: "2025-11-04", dateText: "04.11.2025", text: "Перетягували нам м'який куточок, виглядає як новий, дякуємо за роботу." },
];

export const faq = [
  { q: "Які меблі ви перетягуєте?", a: "Усі види м'яких меблів: дивани, ліжка, крісла, стільці, пуфи та інші. Також перетягуємо сидіння авто." },
  { q: "У які райони ви виїжджаєте?", a: "В усі райони Львова та області. Меблі можна привезти й самостійно: у нас є майстерні на Науковій та в районі Галицького перехрестя. Яка з них, залежить від того, що саме потрібно перетягнути." },
  { q: "Чи можлива часткова перетяжка?", a: "Так, ми робимо часткову перетяжку габаритних меблів — диванів, крісел." },
  { q: "Ви перетягуєте вдома чи в майстерні?", a: "Переважно в майстерні: для якісної перетяжки потрібне спеціальне обладнання. Майстри приїдуть, заберуть меблі й після перетяжки доставлять їх назад. Якщо обсяг невеликий, за вашим бажанням можемо зробити перетяжку у вас удома." },
  { q: "Чи можна перетягнути моїм матеріалом?", a: "Так, ми перетягуємо як нашим, так і вашим матеріалом. Колір обговорюємо з вами перед початком робіт." },
  { q: "Чи ремонтуєте ви меблі?", a: "Так, ремонтуємо дивани, а під час перетяжки за потреби можемо відремонтувати й менші м'які меблі — крісла, стільці та інші." },
  { q: "Чи можна розрахуватися карткою?", a: "Так, приймаємо оплату готівкою або переказом з картки." },
];

export const footerPages = ["Послуги", "Наші роботи", "Відгуки", "Питання й відповіді", "Контакти"];
