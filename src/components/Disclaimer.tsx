import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../theme';

/**
 * Aviso legal/médico. Se muestra de forma destacada para dejar claro que la
 * app NO sustituye una consulta profesional.
 */
export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>⚠️ Esto no es un diagnóstico médico</Text>
      {!compact && (
        <Text style={styles.body}>
          MyMedCheck ofrece orientación general con fines educativos. No
          reemplaza la valoración de un profesional sanitario. Ante síntomas
          graves o que empeoran, acude a urgencias o llama a tu número de
          emergencias local.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#FFF6E5',
    borderColor: '#F2C879',
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  title: {
    fontWeight: '700',
    color: '#7A5200',
    fontSize: 14,
  },
  body: {
    marginTop: spacing.xs,
    color: '#7A5200',
    fontSize: 13,
    lineHeight: 19,
  },
});
