import { Link, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Disclaimer } from '@/components/Disclaimer';
import { useSelection } from '@/state';
import { colors, radius, spacing } from '@/theme';

export default function Home() {
  const router = useRouter();
  const { clear } = useSelection();

  function start() {
    clear();
    router.push('/symptoms');
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.logo}>🩺</Text>
        <Text style={styles.title}>MyMedCheck</Text>
        <Text style={styles.subtitle}>
          Revisa tus síntomas y recibe una orientación clara sobre qué podría
          estar pasando y cuándo conviene consultar.
        </Text>
      </View>

      <Pressable style={styles.cta} onPress={start}>
        <Text style={styles.ctaText}>Empezar autochequeo</Text>
      </Pressable>

      <View style={styles.steps}>
        <Step n={1} title="Marca tus síntomas" desc="Elige de una lista por categorías." />
        <Step n={2} title="Orientación local" desc="Un motor de reglas sugiere posibles causas al instante." />
        <Step n={3} title="Análisis con IA (opcional)" desc="Profundiza con Claude si tienes conexión y clave de API." />
      </View>

      <Disclaimer />

      <Link href="/settings" style={styles.settingsLink}>
        Ajustes y clave de API
      </Link>
    </ScrollView>
  );
}

function Step({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <View style={styles.step}>
      <View style={styles.stepBadge}>
        <Text style={styles.stepBadgeText}>{n}</Text>
      </View>
      <View style={styles.stepBody}>
        <Text style={styles.stepTitle}>{title}</Text>
        <Text style={styles.stepDesc}>{desc}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  hero: {
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  logo: { fontSize: 56 },
  title: { fontSize: 30, fontWeight: '800', color: colors.text },
  subtitle: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: spacing.sm,
  },
  cta: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  ctaText: { color: colors.white, fontWeight: '700', fontSize: 17 },
  steps: { gap: spacing.md },
  step: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBadgeText: { color: colors.white, fontWeight: '700' },
  stepBody: { flex: 1 },
  stepTitle: { fontWeight: '700', color: colors.text, fontSize: 15 },
  stepDesc: { color: colors.textMuted, fontSize: 13, marginTop: 2 },
  settingsLink: {
    textAlign: 'center',
    color: colors.primary,
    fontWeight: '600',
    paddingVertical: spacing.sm,
  },
});
