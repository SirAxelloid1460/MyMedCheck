import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Disclaimer } from '@/components/Disclaimer';
import { SYMPTOM_LABELS } from '@/data/symptoms';
import { diagnose, selectedRedFlags } from '@/engine/diagnosis';
import { analyzeWithAI } from '@/services/ai';
import { getApiKey } from '@/services/settings';
import { useSelection } from '@/state';
import { AiAssessment } from '@/types';
import { colors, radius, spacing, urgencyColor, urgencyLabel } from '@/theme';

export default function Results() {
  const router = useRouter();
  const { selected, notes } = useSelection();

  const results = useMemo(() => diagnose(selected), [selected]);
  const redFlags = useMemo(() => selectedRedFlags(selected), [selected]);

  const [hasKey, setHasKey] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [ai, setAi] = useState<AiAssessment | null>(null);

  useEffect(() => {
    getApiKey().then((k) => setHasKey(!!k));
  }, []);

  async function runAI() {
    setAiLoading(true);
    setAiError(null);
    setAi(null);
    try {
      const apiKey = await getApiKey();
      const assessment = await analyzeWithAI(apiKey, {
        symptomLabels: selected.map((id) => SYMPTOM_LABELS[id] ?? id),
        notes,
      });
      setAi(assessment);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'Error desconocido.');
    } finally {
      setAiLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {redFlags.length > 0 && (
        <View style={styles.emergency}>
          <Text style={styles.emergencyTitle}>🚨 Busca atención médica urgente</Text>
          <Text style={styles.emergencyBody}>
            Has marcado síntomas que pueden indicar una urgencia (
            {redFlags.map((id) => SYMPTOM_LABELS[id]).join(', ')}). No esperes:
            contacta con tu servicio de emergencias o acude a urgencias.
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Orientación local</Text>
      {results.length === 0 ? (
        <Text style={styles.empty}>
          No encontramos coincidencias claras. Prueba a marcar más síntomas.
        </Text>
      ) : (
        results.map((r) => (
          <View key={r.condition.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{r.condition.name}</Text>
              <View style={[styles.badge, { backgroundColor: urgencyColor[r.condition.urgency] }]}>
                <Text style={styles.badgeText}>{urgencyLabel[r.condition.urgency]}</Text>
              </View>
            </View>

            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  { width: `${Math.round(r.score * 100)}%`, backgroundColor: colors.primary },
                ]}
              />
            </View>
            <Text style={styles.confidence}>Coincidencia {Math.round(r.score * 100)}%</Text>

            <Text style={styles.cardDesc}>{r.condition.description}</Text>
            <Text style={styles.advice}>💡 {r.condition.advice}</Text>
            <Text style={styles.matched}>
              Basado en: {r.matched.map((id) => SYMPTOM_LABELS[id]).join(', ')}
            </Text>
          </View>
        ))
      )}

      <Text style={styles.sectionTitle}>Análisis con IA</Text>
      {!hasKey ? (
        <View style={styles.card}>
          <Text style={styles.cardDesc}>
            Para un análisis más detallado con Claude, añade tu clave de API en
            Ajustes. El análisis con IA requiere conexión a internet.
          </Text>
          <Pressable style={styles.secondaryBtn} onPress={() => router.push('/settings')}>
            <Text style={styles.secondaryBtnText}>Ir a Ajustes</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.card}>
          <Pressable
            style={[styles.cta, aiLoading && styles.ctaDisabled]}
            disabled={aiLoading}
            onPress={runAI}
          >
            {aiLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.ctaText}>{ai ? 'Volver a analizar' : 'Analizar con IA'}</Text>
            )}
          </Pressable>

          {aiError && <Text style={styles.error}>{aiError}</Text>}

          {ai && (
            <View style={styles.aiResult}>
              <View style={[styles.badge, styles.aiBadge, { backgroundColor: urgencyColor[ai.urgency] }]}>
                <Text style={styles.badgeText}>{urgencyLabel[ai.urgency]}</Text>
              </View>
              <Text style={styles.aiSummary}>{ai.summary}</Text>

              {ai.possibleCauses.length > 0 && (
                <>
                  <Text style={styles.aiHeading}>Posibles causas</Text>
                  {ai.possibleCauses.map((c, i) => (
                    <Text key={i} style={styles.aiItem}>
                      <Text style={styles.aiItemName}>{c.name}: </Text>
                      {c.explanation}
                    </Text>
                  ))}
                </>
              )}

              <Text style={styles.aiHeading}>Recomendación</Text>
              <Text style={styles.aiItem}>{ai.recommendation}</Text>

              {ai.followUpQuestions.length > 0 && (
                <>
                  <Text style={styles.aiHeading}>Para hablar con tu médico</Text>
                  {ai.followUpQuestions.map((q, i) => (
                    <Text key={i} style={styles.aiItem}>
                      • {q}
                    </Text>
                  ))}
                </>
              )}
            </View>
          )}
        </View>
      )}

      <Disclaimer />

      <Pressable style={styles.secondaryBtn} onPress={() => router.push('/symptoms')}>
        <Text style={styles.secondaryBtnText}>Editar síntomas</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl },
  emergency: {
    backgroundColor: '#FDECEA',
    borderColor: colors.emergency,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  emergencyTitle: { fontWeight: '800', color: colors.emergency, fontSize: 16 },
  emergencyBody: { color: '#8A1C13', marginTop: spacing.xs, lineHeight: 20 },
  sectionTitle: {
    fontWeight: '800',
    fontSize: 18,
    color: colors.text,
    marginTop: spacing.sm,
  },
  empty: { color: colors.textMuted, fontStyle: 'italic' },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: { fontWeight: '700', fontSize: 16, color: colors.text, flex: 1 },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  badgeText: { color: colors.white, fontSize: 12, fontWeight: '700' },
  barTrack: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: spacing.xs,
  },
  barFill: { height: 8, borderRadius: 4 },
  confidence: { fontSize: 12, color: colors.textMuted },
  cardDesc: { color: colors.text, fontSize: 14, lineHeight: 20 },
  advice: { color: colors.primaryDark, fontSize: 14, lineHeight: 20 },
  matched: { color: colors.textMuted, fontSize: 12, fontStyle: 'italic' },
  cta: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  ctaDisabled: { opacity: 0.7 },
  ctaText: { color: colors.white, fontWeight: '700', fontSize: 16 },
  error: { color: colors.emergency, marginTop: spacing.sm, fontSize: 14 },
  aiResult: { marginTop: spacing.md, gap: spacing.xs },
  aiBadge: { alignSelf: 'flex-start' },
  aiSummary: { color: colors.text, fontSize: 15, lineHeight: 22, marginTop: spacing.xs },
  aiHeading: { fontWeight: '700', color: colors.text, marginTop: spacing.sm },
  aiItem: { color: colors.text, fontSize: 14, lineHeight: 20 },
  aiItemName: { fontWeight: '700' },
  secondaryBtn: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  secondaryBtnText: { color: colors.primary, fontWeight: '600' },
});
