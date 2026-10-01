export const platformConfig = {
  appName: "NoQ",
  environment: process.env.NODE_ENV ?? "development",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001",
  defaultLocale: "uz-latn",
  supportedLocales: {
    "uz-latn": "O'zbekcha",
    "uz-cyrl": "Kirilcha",
    ru: "Russian",
  },
};

export type SupportedLocalesType = keyof typeof platformConfig.supportedLocales;

export default platformConfig;
