import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ChipSelector } from './ChipSelector';
import { CurrencyPicker } from './CurrencyPicker';
import { NumberField } from './NumberField';
import { t } from '../i18n';
import { colors } from '../theme/colors';
import type { AppSettings, RatePeriod } from '../types/settings';
import { getCurrency } from '../data/currencies';

type Props = {
  settings: AppSettings;
  onChange: (next: AppSettings) => void;
  onClose: () => void;
};

export function SettingsScreen({ settings, onChange, onClose }: Props) {
  const currency = getCurrency(settings.currency);

  const periodOptions: { value: RatePeriod; label: string }[] = [
    { value: 'hour', label: t('perHour') },
    { value: 'minute', label: t('perMinute') },
    { value: 'day', label: t('perDay') },
    { value: 'week', label: t('perWeek') },
  ];

  const rateLabel =
    settings.ratePeriod === 'minute'
      ? t('ratePerMinute')
      : settings.ratePeriod === 'day'
        ? t('ratePerDay')
        : settings.ratePeriod === 'week'
          ? t('ratePerWeek')
          : t('ratePerHour');

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#E8F5F3', '#F5F7FA', '#EEF2F7']}
        locations={[0, 0.45, 1]}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.topBar}>
            <Text style={styles.title}>{t('settings')}</Text>
            <Pressable onPress={onClose} style={styles.doneBtn}>
              <Text style={styles.doneText}>{t('done')}</Text>
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.panel}>
              <Text style={styles.sectionLabel}>{t('yourEarnings')}</Text>
              <Text style={styles.fieldLabel}>{t('ratePeriod')}</Text>
              <ChipSelector
                options={periodOptions}
                value={settings.ratePeriod}
                onChange={(ratePeriod) => onChange({ ...settings, ratePeriod })}
                style={styles.chips}
              />
              <NumberField
                label={rateLabel}
                hint={t('rateHint')}
                value={settings.rate}
                onChangeText={(rate) => onChange({ ...settings, rate })}
                placeholder="25"
                suffix={currency.symbol}
                style={styles.fieldGap}
              />
            </View>

            <View style={styles.panel}>
              <Text style={styles.sectionLabel}>{t('workUnits')}</Text>
              <NumberField
                label={t('minutesPerHour')}
                hint={t('minutesPerHourHint')}
                value={settings.minutesPerHour}
                onChangeText={(minutesPerHour) =>
                  onChange({ ...settings, minutesPerHour })
                }
                placeholder="60"
              />
              <NumberField
                label={t('hoursPerDay')}
                hint={t('hoursPerDayHint')}
                value={settings.hoursPerDay}
                onChangeText={(hoursPerDay) => onChange({ ...settings, hoursPerDay })}
                placeholder="8"
                style={styles.fieldGap}
              />
              <NumberField
                label={t('daysPerWeek')}
                hint={t('daysPerWeekHint')}
                value={settings.daysPerWeek}
                onChangeText={(daysPerWeek) => onChange({ ...settings, daysPerWeek })}
                placeholder="5"
                style={styles.fieldGap}
              />
            </View>

            <View style={styles.panel}>
              <Text style={styles.sectionLabel}>{t('currency')}</Text>
              <CurrencyPicker
                value={settings.currency}
                onChange={(code) => onChange({ ...settings, currency: code })}
                searchPlaceholder={t('searchCurrency')}
                maxHeight={360}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safe: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  doneBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.accentSoft,
  },
  doneText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.accentDark,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.textTertiary,
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  chips: {
    marginBottom: 4,
  },
  fieldGap: {
    marginTop: 14,
  },
});
