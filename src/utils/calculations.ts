import type { RatePeriod } from '../types/settings';

export type TimeCostResult = {
  minutes: number;
  hours: number;
  days: number;
  weeks: number;
  months: number;
  hasResult: boolean;
};

export type WorkUnits = {
  minutesPerHour: number;
  hoursPerDay: number;
  daysPerWeek: number;
};

/** Convert any earnings rate into an equivalent hourly rate */
export function toHourlyRate(rate: number, period: RatePeriod, units: WorkUnits): number {
  if (rate <= 0) return 0;

  const mph = units.minutesPerHour > 0 ? units.minutesPerHour : 60;
  const hpd = units.hoursPerDay > 0 ? units.hoursPerDay : 8;
  const dpw = units.daysPerWeek > 0 ? units.daysPerWeek : 5;

  switch (period) {
    case 'minute':
      return rate * mph;
    case 'hour':
      return rate;
    case 'day':
      return rate / hpd;
    case 'week':
      return rate / (hpd * dpw);
  }
}

export function calculateTimeCost(
  price: number,
  rate: number,
  period: RatePeriod,
  units: WorkUnits,
): TimeCostResult {
  const empty: TimeCostResult = {
    minutes: 0,
    hours: 0,
    days: 0,
    weeks: 0,
    months: 0,
    hasResult: false,
  };

  if (
    !Number.isFinite(price) ||
    !Number.isFinite(rate) ||
    price <= 0 ||
    rate <= 0
  ) {
    return empty;
  }

  const hourly = toHourlyRate(rate, period, units);
  if (hourly <= 0) return empty;

  const mph = units.minutesPerHour > 0 ? units.minutesPerHour : 60;
  const hpd = units.hoursPerDay > 0 ? units.hoursPerDay : 8;
  const dpw = units.daysPerWeek > 0 ? units.daysPerWeek : 5;

  const hours = price / hourly;
  const minutes = hours * mph;
  const days = hours / hpd;
  const weeks = days / dpw;
  const months = weeks / (52 / 12);

  return { minutes, hours, days, weeks, months, hasResult: true };
}

export function formatDuration(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return '0';

  if (value < 0.01) return '<0.01';
  if (value < 10) return value.toFixed(2);
  if (value < 100) return value.toFixed(1);
  return Math.round(value).toLocaleString();
}

export type InsightLevel = 'cheap' | 'moderate' | 'expensive' | 'huge';

export function getInsightLevel(hours: number): InsightLevel {
  if (hours < 2) return 'cheap';
  if (hours < 16) return 'moderate';
  if (hours < 80) return 'expensive';
  return 'huge';
}

export function parseNumericInput(raw: string): number {
  const normalized = raw.replace(',', '.').replace(/[^\d.]/g, '');
  if (!normalized) return 0;
  const value = Number.parseFloat(normalized);
  return Number.isFinite(value) ? value : 0;
}
