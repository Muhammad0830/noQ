export type AppLanguage = "uz-latn" | "uz-cyrl" | "ru";

const DEFAULT_LANGUAGE: AppLanguage = "uz-latn";

const categoryDictionary: Record<
  string,
  Record<AppLanguage, string>
> = {
  dentist: {
    "uz-latn": "Stomatologiya",
    "uz-cyrl": "Стоматология",
    ru: "Стоматология",
  },
  dentistry: {
    "uz-latn": "Stomatologiya",
    "uz-cyrl": "Стоматология",
    ru: "Стоматология",
  },
  barbershop: {
    "uz-latn": "Barbershop",
    "uz-cyrl": "Барбершоп",
    ru: "Барбершоп",
  },
  beauty: {
    "uz-latn": "Go'zallik",
    "uz-cyrl": "Гўзаллик",
    ru: "Красота",
  },
  "beauty salon": {
    "uz-latn": "Go'zallik saloni",
    "uz-cyrl": "Гўзаллик салони",
    ru: "Салон красоты",
  },
  salon: {
    "uz-latn": "Salon",
    "uz-cyrl": "Салон",
    ru: "Салон",
  },
  fitness: {
    "uz-latn": "Fitnes",
    "uz-cyrl": "Фитнес",
    ru: "Фитнес",
  },
  cafe: {
    "uz-latn": "Kafe",
    "uz-cyrl": "Кафе",
    ru: "Кафе",
  },
  "spa & massage": {
    "uz-latn": "SPA va massaj",
    "uz-cyrl": "СПА ва массаж",
    ru: "СПА и массаж",
  },
  spa: {
    "uz-latn": "SPA",
    "uz-cyrl": "СПА",
    ru: "SPA",
  },
  massage: {
    "uz-latn": "Massaj",
    "uz-cyrl": "Массаж",
    ru: "Массаж",
  },
  "nail salon": {
    "uz-latn": "Tirnoq saloni",
    "uz-cyrl": "Тирноқ салони",
    ru: "Нейл-салон",
  },
  hair: {
    "uz-latn": "Soch parvarishi",
    "uz-cyrl": "Соч парвариши",
    ru: "Уход за волосами",
  },
  manicure: {
    "uz-latn": "Manikyur",
    "uz-cyrl": "Маникюр",
    ru: "Маникюр",
  },
  pedicure: {
    "uz-latn": "Pedikyur",
    "uz-cyrl": "Педикюр",
    ru: "Педикюр",
  },
};

const normalizeKey = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[\-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const pickLanguage = (raw?: string | null): AppLanguage | null => {
  if (!raw) return null;
  const value = raw.toLowerCase();

  if (value.includes("uz-cyrl") || value.includes("uz_cyrl")) return "uz-cyrl";
  if (value.includes("uz-latn") || value.includes("uz_latn") || value === "uz") {
    return "uz-latn";
  }
  if (value.includes("ru")) return "ru";

  return null;
};

export const resolveRequestLanguage = (input: {
  queryLang?: string | null;
  xLanguageHeader?: string | null;
  acceptLanguageHeader?: string | null;
}): AppLanguage => {
  return (
    pickLanguage(input.queryLang) ||
    pickLanguage(input.xLanguageHeader) ||
    pickLanguage(input.acceptLanguageHeader) ||
    DEFAULT_LANGUAGE
  );
};

export const translateCategoryName = (
  categoryName: string,
  language: AppLanguage,
): string => {
  const normalized = normalizeKey(categoryName);

  if (categoryDictionary[normalized]?.[language]) {
    return categoryDictionary[normalized][language];
  }

  return categoryName;
};
