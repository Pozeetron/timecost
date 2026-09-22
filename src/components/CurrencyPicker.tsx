import React, { useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { CURRENCIES } from '../data/currencies';
import { colors } from '../theme/colors';

type Props = {
  value: string;
  onChange: (code: string) => void;
  searchPlaceholder?: string;
  /** Cap height when embedded in another scroll view */
  maxHeight?: number;
};

export function CurrencyPicker({
  value,
  onChange,
  searchPlaceholder = 'Search',
  maxHeight = 320,
}: Props) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CURRENCIES;
    return CURRENCIES.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <View style={styles.wrap}>
      <TextInput
        style={[styles.search, Platform.OS === 'web' && styles.searchWeb]}
        value={query}
        onChangeText={setQuery}
        placeholder={searchPlaceholder}
        placeholderTextColor={colors.textTertiary}
        autoCorrect={false}
        autoCapitalize="characters"
      />
      <ScrollView
        style={{ maxHeight }}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {filtered.map((item) => {
          const active = item.code === value;
          return (
            <Pressable
              key={item.code}
              onPress={() => onChange(item.code)}
              style={[styles.item, active && styles.itemActive]}
            >
              <View style={styles.symbolWrap}>
                <Text style={styles.symbol}>{item.symbol}</Text>
              </View>
              <View style={styles.meta}>
                <Text style={styles.code}>{item.code}</Text>
                <Text style={styles.name}>{item.name}</Text>
              </View>
              {active ? <View style={styles.check} /> : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 12,
  },
  search: {
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  searchWeb: {
    outlineStyle: 'none',
    outlineWidth: 0,
  } as object,
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  itemActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  symbolWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  meta: {
    flex: 1,
    gap: 2,
  },
  code: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  name: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  check: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
  },
});
