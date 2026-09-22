import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { colors } from '../theme/colors';

type Props = {
  label: string;
  hint?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  suffix?: string;
  keyboardType?: KeyboardTypeOptions;
  style?: StyleProp<ViewStyle>;
};

export function NumberField({
  label,
  hint,
  value,
  onChangeText,
  placeholder = '0',
  suffix,
  keyboardType = 'decimal-pad',
  style,
}: Props) {
  return (
    <View style={[styles.wrap, style]}>
      <Text style={styles.label}>{label}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, Platform.OS === 'web' && styles.inputWeb]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          keyboardType={keyboardType}
          returnKeyType="done"
          selectTextOnFocus
        />
        {suffix ? <Text style={styles.suffix}>{suffix}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    letterSpacing: 0.2,
  },
  hint: {
    fontSize: 12,
    color: colors.textTertiary,
    marginBottom: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingLeft: 4,
    paddingRight: 14,
    paddingVertical: 4,
    minHeight: 56,
  },
  input: {
    flex: 1,
    fontSize: 22,
    fontWeight: '600',
    color: colors.text,
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 12,
    paddingRight: 8,
  },
  inputWeb: {
    outlineStyle: 'none',
    outlineWidth: 0,
  } as object,
  suffix: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
    paddingVertical: 8,
    paddingRight: 2,
    marginLeft: 4,
  },
});
