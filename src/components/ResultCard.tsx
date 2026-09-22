import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { formatDuration } from '../utils/calculations';

type Metric = {
  key: string;
  label: string;
  value: number;
  color: string;
};

type Props = {
  title: string;
  hoursLabel: string;
  daysLabel: string;
  weeksLabel: string;
  monthsLabel: string;
  hours: number;
  days: number;
  weeks: number;
  months: number;
  insight: string;
};

export function ResultCard({
  title,
  hoursLabel,
  daysLabel,
  weeksLabel,
  monthsLabel,
  hours,
  days,
  weeks,
  months,
  insight,
}: Props) {
  const metrics: Metric[] = [
    { key: 'h', label: hoursLabel, value: hours, color: colors.hours },
    { key: 'd', label: daysLabel, value: days, color: colors.days },
    { key: 'w', label: weeksLabel, value: weeks, color: colors.weeks },
    { key: 'm', label: monthsLabel, value: months, color: colors.months },
  ];

  const barShares = [
    1,
    Math.min(1, days / Math.max(hours / 2, 1)),
    Math.min(1, weeks / Math.max(hours / 8, 1)),
    Math.min(1, months / Math.max(hours / 20, 1)),
  ];

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.hero}>
        <Text style={styles.heroValue}>{formatDuration(hours)}</Text>
        <Text style={styles.heroUnit}>{hoursLabel}</Text>
      </View>

      <Text style={styles.insight}>{insight}</Text>

      <View style={styles.grid}>
        {metrics.map((metric, index) => (
          <View key={metric.key} style={styles.metric}>
            <View style={styles.metricHeader}>
              <View style={[styles.dot, { backgroundColor: metric.color }]} />
              <Text style={styles.metricLabel}>{metric.label}</Text>
            </View>
            <Text style={[styles.metricValue, { color: metric.color }]}>
              {formatDuration(metric.value)}
            </Text>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    backgroundColor: metric.color,
                    width: `${Math.max(8, barShares[index] * 100)}%`,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 3,
    gap: 16,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.textTertiary,
  },
  hero: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  heroValue: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.accentDark,
    letterSpacing: -1,
  },
  heroUnit: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  insight: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  grid: {
    gap: 14,
    marginTop: 4,
  },
  metric: {
    gap: 6,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  metricLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  barTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.surfaceMuted,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
});
