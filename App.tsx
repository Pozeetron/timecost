import { getLocales } from 'expo-localization';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NumberField } from './src/components/NumberField';
import { OnboardingScreen } from './src/components/OnboardingScreen';
import { ResultCard } from './src/components/ResultCard';
import { SettingsScreen } from './src/components/SettingsScreen';
import { getCurrency, guessCurrencyFromLocale } from './src/data/currencies';
import { t } from './src/i18n';
import { colors } from './src/theme/colors';
import { DEFAULT_SETTINGS, type AppSettings } from './src/types/settings';
import {
  calculateTimeCost,
  getInsightLevel,
  parseNumericInput,
} from './src/utils/calculations';
import { loadSettings, saveSettings } from './src/utils/storage';

function TimeCostScreen() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [price, setPrice] = useState('');
  const [ready, setReady] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    (async () => {
      const loaded = await loadSettings();
      if (!loaded.onboardingDone && loaded.currency === DEFAULT_SETTINGS.currency) {
        const region = getLocales()[0]?.regionCode;
        loaded.currency = guessCurrencyFromLocale(region);
      }
      setSettings(loaded);
      setReady(true);
    })();
  }, []);

  const persist = useCallback(async (next: AppSettings) => {
    setSettings(next);
    await saveSettings(next);
  }, []);

  const currency = getCurrency(settings.currency);

  const result = useMemo(
    () =>
      calculateTimeCost(
        parseNumericInput(price),
        parseNumericInput(settings.rate),
        settings.ratePeriod,
        {
          minutesPerHour: parseNumericInput(settings.minutesPerHour) || 60,
          hoursPerDay: parseNumericInput(settings.hoursPerDay) || 8,
          daysPerWeek: parseNumericInput(settings.daysPerWeek) || 5,
        },
      ),
    [price, settings],
  );

  const insight = useMemo(() => {
    if (!result.hasResult) return '';
    switch (getInsightLevel(result.hours)) {
      case 'cheap':
        return t('insightCheap');
      case 'moderate':
        return t('insightModerate');
      case 'expensive':
        return t('insightExpensive');
      case 'huge':
        return t('insightHuge');
    }
  }, [result]);

  const rateSummary = useMemo(() => {
    const periodLabel =
      settings.ratePeriod === 'minute'
        ? t('perMinute')
        : settings.ratePeriod === 'day'
          ? t('perDay')
          : settings.ratePeriod === 'week'
            ? t('perWeek')
            : t('perHour');
    if (!settings.rate) return `${currency.code} · ${periodLabel}`;
    return `${settings.rate} ${currency.symbol} · ${periodLabel}`;
  }, [settings.rate, settings.ratePeriod, currency]);

  if (!ready) {
    return <View style={styles.boot} />;
  }

  const needsOnboarding =
    !settings.onboardingDone || parseNumericInput(settings.rate) <= 0;

  if (needsOnboarding) {
    return (
      <OnboardingScreen
        settings={settings}
        onChange={persist}
        initialStep={settings.onboardingDone ? 'rate' : 'currency'}
        onFinish={() =>
          persist({
            ...settings,
            onboardingDone: true,
            ratePeriod: settings.ratePeriod || 'hour',
          })
        }
      />
    );
  }

  if (showSettings) {
    return (
      <SettingsScreen
        settings={settings}
        onChange={persist}
        onClose={() => setShowSettings(false)}
      />
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <LinearGradient
        colors={['#E8F5F3', '#F5F7FA', '#EEF2F7']}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <View style={styles.headerRow}>
                <Text style={styles.brand}>{t('appName')}</Text>
                <Pressable
                  onPress={() => setShowSettings(true)}
                  style={styles.settingsBtn}
                  accessibilityLabel={t('openSettings')}
                >
                  <Text style={styles.settingsBtnText}>{t('openSettings')}</Text>
                </Pressable>
              </View>
              <Text style={styles.tagline}>{t('tagline')}</Text>
            </View>

            <Pressable style={styles.rateChip} onPress={() => setShowSettings(true)}>
              <Text style={styles.rateChipLabel}>{t('yourRate')}</Text>
              <Text style={styles.rateChipValue}>{rateSummary}</Text>
            </Pressable>

            <View style={styles.panel}>
              <NumberField
                label={t('purchasePrice')}
                hint={t('purchasePriceHint')}
                value={price}
                onChangeText={setPrice}
                placeholder="199"
                suffix={currency.symbol}
              />
            </View>

            {result.hasResult ? (
              <ResultCard
                title={t('resultTitle')}
                hoursLabel={t('hours')}
                daysLabel={t('days')}
                weeksLabel={t('weeks')}
                monthsLabel={t('months')}
                hours={result.hours}
                days={result.days}
                weeks={result.weeks}
                months={result.months}
                insight={insight}
              />
            ) : (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>{t('enterValues')}</Text>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <TimeCostScreen />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  boot: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 16,
  },
  header: {
    gap: 8,
    marginBottom: 4,
    paddingTop: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  brand: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.8,
    flexShrink: 1,
  },
  settingsBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingsBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.accentDark,
  },
  tagline: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
    maxWidth: 340,
  },
  rateChip: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  rateChipLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  rateChipValue: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  empty: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    paddingVertical: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
  },
});
