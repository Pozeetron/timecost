import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_SETTINGS, type AppSettings, type RatePeriod } from '../types/settings';

const KEY = '@timecost/settings/v1';

const RATE_PERIODS: RatePeriod[] = ['minute', 'hour', 'day', 'week'];

function isRatePeriod(value: unknown): value is RatePeriod {
  return typeof value === 'string' && RATE_PERIODS.includes(value as RatePeriod);
}

export async function loadSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) {
      // migrate legacy keys if present
      const [legacyRate, legacyHours] = await Promise.all([
        AsyncStorage.getItem('@timecost/hourlyRate'),
        AsyncStorage.getItem('@timecost/hoursPerDay'),
      ]);
      return {
        ...DEFAULT_SETTINGS,
        rate: legacyRate ?? DEFAULT_SETTINGS.rate,
        hoursPerDay: legacyHours ?? DEFAULT_SETTINGS.hoursPerDay,
      };
    }

    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      ratePeriod: isRatePeriod(parsed.ratePeriod) ? parsed.ratePeriod : 'hour',
      onboardingDone: Boolean(parsed.onboardingDone),
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveSettings(settings: AppSettings): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(settings));
}
