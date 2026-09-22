export type Currency = {
  code: string;
  symbol: string;
  name: string;
};

/** Popular currencies; names are English — UI shows code + symbol primarily */
export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Zloty' },
  { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
  { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
  { code: 'RON', symbol: 'lei', name: 'Romanian Leu' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'ILS', symbol: '₪', name: 'Israeli Shekel' },
  { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
  { code: 'ARS', symbol: 'AR$', name: 'Argentine Peso' },
];

export function getCurrency(code: string): Currency {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

/** Guess currency from device locale region when possible */
export function guessCurrencyFromLocale(regionCode?: string | null): string {
  const map: Record<string, string> = {
    US: 'USD', GB: 'GBP', EU: 'EUR', DE: 'EUR', FR: 'EUR', IT: 'EUR', ES: 'EUR',
    NL: 'EUR', PT: 'EUR', IE: 'EUR', AT: 'EUR', BE: 'EUR', FI: 'EUR',
    JP: 'JPY', CN: 'CNY', IN: 'INR', RU: 'RUB', BR: 'BRL', KR: 'KRW',
    TR: 'TRY', PL: 'PLN', UA: 'UAH', TH: 'THB', VN: 'VND', ID: 'IDR',
    CA: 'CAD', AU: 'AUD', CH: 'CHF', MX: 'MXN', SA: 'SAR', AE: 'AED',
    SE: 'SEK', NO: 'NOK', DK: 'DKK', CZ: 'CZK', HU: 'HUF', RO: 'RON',
    HK: 'HKD', SG: 'SGD', NZ: 'NZD', ZA: 'ZAR', PH: 'PHP', MY: 'MYR',
    IL: 'ILS', EG: 'EGP', AR: 'ARS', BD: 'USD',
  };
  if (regionCode && map[regionCode.toUpperCase()]) {
    return map[regionCode.toUpperCase()];
  }
  return 'USD';
}
