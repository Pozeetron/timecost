export type RatePeriod = 'minute' | 'hour' | 'day' | 'week';

export type AppSettings = {
  currency: string;
  rate: string;
  ratePeriod: RatePeriod;
  minutesPerHour: string;
  hoursPerDay: string;
  daysPerWeek: string;
  onboardingDone: boolean;
};

export const DEFAULT_SETTINGS: AppSettings = {
  currency: 'USD',
  rate: '',
  ratePeriod: 'hour',
  minutesPerHour: '60',
  hoursPerDay: '8',
  daysPerWeek: '5',
  onboardingDone: false,
};

export const RATE_PERIODS: RatePeriod[] = ['hour', 'minute', 'day', 'week'];
