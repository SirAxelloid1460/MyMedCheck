import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { getApiKey, setApiKey } from '@/services/settings';
import { colors, radius, spacing } from '@/theme';

export default function Settings() {
  const [key, setKey] = useState('');
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getApiKey().then((k) => {
      setKey(k);
      setLoaded(true);
    });
  }, []);

  async function save() {
    await setApiKey(key);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.label}>Clave de API de Claude (Anthropic)</Text>
      <TextInput
        style={styles.input}
        placeholder="sk-ant-…"
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
        secureTextEntry
        value={key}
        onChangeText={setKey}
        editable={loaded}
      />

      <Pressable style={styles.cta} onPress={save}>
        <Text style={styles.ctaText}>{saved ? '✓ Guardado' : 'Guardar'}</Text>
      </Pressable>

      <View style={styles.note}>
        <Text style={styles.noteTitle}>Sobre la clave</Text>
        <Text style={styles.noteBody}>
          La clave se guarda únicamente en este dispositivo y habilita el
          análisis con IA. El motor de orientación local funciona sin clave y
          sin conexión.
        </Text>
        <Text style={styles.noteBody}>
          Nota de seguridad: en una app de producción, las llamadas a la IA
          deberían pasar por un servidor propio para no exponer la clave en el
          dispositivo. Aquí se usa directamente para simplificar el prototipo.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, gap: spacing.md },
  label: { fontWeight: '700', color: colors.text, fontSize: 15 },
  input: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.text,
  },
  cta: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  ctaText: { color: colors.white, fontWeight: '700', fontSize: 16 },
  note: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.sm,
  },
  noteTitle: { fontWeight: '700', color: colors.text },
  noteBody: { color: colors.textMuted, fontSize: 13, lineHeight: 19 },
});
