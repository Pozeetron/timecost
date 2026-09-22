export type TranslationKeys = {
  appName: string;
  tagline: string;
  hourlyRate: string;
  hourlyRateHint: string;
  hoursPerDay: string;
  hoursPerDayHint: string;
  purchasePrice: string;
  purchasePriceHint: string;
  resultTitle: string;
  hours: string;
  days: string;
  weeks: string;
  months: string;
  ofWork: string;
  equals: string;
  settings: string;
  save: string;
  yourRate: string;
  enterValues: string;
  workDay: string;
  visualization: string;
  insightCheap: string;
  insightModerate: string;
  insightExpensive: string;
  insightHuge: string;
  currencySymbol: string;
  welcome: string;
  chooseCurrency: string;
  chooseRate: string;
  continue: string;
  back: string;
  getStarted: string;
  searchCurrency: string;
  currency: string;
  ratePeriod: string;
  perMinute: string;
  perHour: string;
  perDay: string;
  perWeek: string;
  yourEarnings: string;
  workUnits: string;
  minutesPerHour: string;
  minutesPerHourHint: string;
  daysPerWeek: string;
  daysPerWeekHint: string;
  ratePerMinute: string;
  ratePerHour: string;
  ratePerDay: string;
  ratePerWeek: string;
  rateHint: string;
  done: string;
  openSettings: string;
};

export type LocaleCode =
  | 'en'
  | 'zh'
  | 'es'
  | 'hi'
  | 'ar'
  | 'pt'
  | 'bn'
  | 'ru'
  | 'ja'
  | 'de'
  | 'fr'
  | 'ko'
  | 'tr'
  | 'it'
  | 'pl'
  | 'nl'
  | 'vi'
  | 'th'
  | 'id'
  | 'uk';

export const SUPPORTED_LOCALES: LocaleCode[] = [
  'en', 'zh', 'es', 'hi', 'ar', 'pt', 'bn', 'ru', 'ja', 'de',
  'fr', 'ko', 'tr', 'it', 'pl', 'nl', 'vi', 'th', 'id', 'uk',
];
