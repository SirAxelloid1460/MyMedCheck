import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { symptomsByCategory } from '@/data/symptoms';
import { useSelection } from '@/state';
import { colors, radius, spacing } from '@/theme';

export default function Symptoms() {
  const router = useRouter();
  const { selected, isSelected, toggle, notes, setNotes } = useSelection();
  const groups = useMemo(() => symptomsByCategory(), []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.hint}>
          Marca todos los síntomas que tengas. Cuantos más indiques, más
          precisa será la orientación.
        </Text>

        {groups.map((group) => (
          <View key={group.category} style={styles.group}>
            <Text style={styles.groupTitle}>{group.category}</Text>
            <View style={styles.chips}>
              {group.items.map((symptom) => {
                const active = isSelected(symptom.id);
                return (
                  <Pressable
                    key={symptom.id}
                    onPress={() => toggle(symptom.id)}
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {active ? '✓ ' : ''}
                      {symptom.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}

        <View style={styles.group}>
          <Text style={styles.groupTitle}>Notas (opcional)</Text>
          <TextInput
            style={styles.notes}
            placeholder="Cuéntanos más: desde cuándo, intensidad, antecedentes…"
            placeholderTextColor={colors.textMuted}
            multiline
            value={notes}
            onChangeText={setNotes}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          style={[styles.cta, selected.length === 0 && styles.ctaDisabled]}
          disabled={selected.length === 0}
          onPress={() => router.push('/results')}
        >
          <Text style={styles.ctaText}>
            Ver resultados{selected.length > 0 ? ` (${selected.length})` : ''}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xl },
  hint: { color: colors.textMuted, fontSize: 14, lineHeight: 20 },
  group: { gap: spacing.sm },
  groupTitle: { fontWeight: '700', color: colors.text, fontSize: 16 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.text, fontSize: 14 },
  chipTextActive: { color: colors.white, fontWeight: '600' },
  notes: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    minHeight: 90,
    color: colors.text,
    textAlignVertical: 'top',
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  cta: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  ctaDisabled: { backgroundColor: colors.border },
  ctaText: { color: colors.white, fontWeight: '700', fontSize: 16 },
});
