import React, { useMemo, useState } from 'react';
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
import { getCurrency } from '../data/currencies';
import { t } from '../i18n';
import { colors } from '../theme/colors';
import type { AppSettings, RatePeriod } from '../types/settings';
import { parseNumericInput } from '../utils/calculations';

type Step = 'currency' | 'rate';

type Props = {
  settings: AppSettings;
  onChange: (next: AppSettings) => void;
  onFinish: () => void;
  initialStep?: Step;
};

export function OnboardingScreen({
  settings,
  onChange,
  onFinish,
  initialStep = 'currency',
}: Props) {
  const [step, setStep] = useState<Step>(initialStep);
  const currency = getCurrency(settings.currency);
  const rateValid = parseNumericInput(settings.rate) > 0;

  const periodOptions: { value: RatePeriod; label: string }[] = useMemo(
    () => [
      { value: 'hour', label: t('perHour') },
      { value: 'minute', label: t('perMinute') },
      { value: 'day', label: t('perDay') },
      { value: 'week', label: t('perWeek') },
    ],
    [],
  );

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
          <View style={styles.header}>
            <Text style={styles.brand}>{t('appName')}</Text>
            <Text style={styles.title}>{t('welcome')}</Text>
            <Text style={styles.subtitle}>
              {step === 'currency' ? t('chooseCurrency') : t('chooseRate')}
            </Text>
            <View style={styles.steps}>
              <View style={[styles.dot, step === 'currency' && styles.dotActive]} />
              <View style={[styles.dot, step === 'rate' && styles.dotActive]} />
            </View>
          </View>

          {step === 'currency' ? (
            <View style={styles.pickerWrap}>
              <CurrencyPicker
                value={settings.currency}
                onChange={(code) => onChange({ ...settings, currency: code })}
                searchPlaceholder={t('searchCurrency')}
                maxHeight={480}
              />
            </View>
          ) : (
            <ScrollView
              style={styles.flex}
              contentContainerStyle={styles.rateContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.panel}>
                <Text style={styles.fieldLabel}>{t('ratePeriod')}</Text>
                <ChipSelector
                  options={periodOptions}
                  value={settings.ratePeriod}
                  onChange={(ratePeriod) => onChange({ ...settings, ratePeriod })}
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
            </ScrollView>
          )}

          <View style={styles.actions}>
            {step === 'rate' ? (
              <Pressable
                style={styles.secondaryButton}
                onPress={() => setStep('currency')}
              >
                <Text style={styles.secondaryButtonText}>{t('back')}</Text>
              </Pressable>
            ) : null}

            <Pressable
              style={[
                styles.button,
                step === 'rate' && styles.buttonFlex,
                step === 'rate' && !rateValid && styles.buttonDisabled,
              ]}
              disabled={step === 'rate' && !rateValid}
              onPress={() => {
                if (step === 'currency') {
                  setStep('rate');
                  return;
                }
                onFinish();
              }}
            >
              <Text style={styles.buttonText}>
                {step === 'currency' ? t('continue') : t('getStarted')}
              </Text>
            </Pressable>
          </View>
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
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  flex: {
    flex: 1,
  },
  header: {
    gap: 8,
    paddingTop: 12,
    marginBottom: 16,
  },
  brand: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.6,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  steps: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  dot: {
    width: 28,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  dotActive: {
    backgroundColor: colors.accent,
  },
  pickerWrap: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  rateContent: {
    flexGrow: 1,
  },
  panel: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  fieldGap: {
    marginTop: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  button: {
    flex: 1,
    backgroundColor: colors.accent,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonFlex: {
    flex: 1,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
