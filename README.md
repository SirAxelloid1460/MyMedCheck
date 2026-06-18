# MyMedCheck 🩺

App móvil de **autodiagnóstico** (orientación de salud) construida con **Expo + React Native + TypeScript**.

> ⚠️ **Aviso importante:** MyMedCheck ofrece orientación general con fines educativos.
> **No es un diagnóstico médico** ni sustituye la valoración de un profesional sanitario.
> Ante síntomas graves o que empeoran, acude a urgencias.

## ¿Qué hace?

1. **Selección de síntomas** por categorías (general, respiratorio, digestivo, etc.).
2. **Orientación local** — un motor de reglas puntúa condiciones comunes al instante,
   **sin conexión ni clave de API**, y muestra nivel de urgencia + consejo.
3. **Análisis con IA (opcional)** — con una clave de API de Claude, profundiza el
   análisis usando el modelo `claude-opus-4-8` y devuelve causas posibles,
   recomendación, urgencia y preguntas para tu médico.
4. **Señales de alarma** — ciertos síntomas (dolor torácico, dificultad respiratoria,
   confusión, desmayo) disparan una alerta de emergencia inmediata.

Este es el enfoque **híbrido**: las reglas locales son la base y la IA es un extra
cuando hay conexión.

## Arquitectura

```
app/                 Pantallas (expo-router, file-based routing)
  _layout.tsx        Navegación + proveedores globales
  index.tsx          Inicio
  symptoms.tsx       Selección de síntomas + notas
  results.tsx        Resultados locales + análisis con IA
  settings.tsx       Clave de API de Claude
src/
  data/              Catálogo de síntomas y base de condiciones
  engine/            Motor de diagnóstico por reglas (+ tests)
  services/          Integración con Claude y almacenamiento de ajustes
  components/        UI reutilizable (aviso médico)
  state.tsx          Estado compartido de la selección
  theme.ts           Tokens de estilo
  types.ts           Tipos compartidos
```

### Motor de reglas

Cada condición define pesos (0–1) por síntoma. La puntuación premia explicar
síntomas característicos y penaliza ligeramente los síntomas seleccionados que la
condición no justifica:

```
score = peso(síntomas coincidentes) / (peso total + 0.25 * síntomas no explicados)
```

### Integración con Claude

`src/services/ai.ts` usa el SDK oficial `@anthropic-ai/sdk` con `claude-opus-4-8`,
pensamiento adaptativo (`thinking: { type: 'adaptive' }`) y *structured outputs*
(`output_config.format`) para obtener una respuesta JSON validable.

> Nota de seguridad: en producción, las llamadas a la IA deberían pasar por un
> backend propio para no exponer la clave en el dispositivo. En este prototipo la
> clave se guarda localmente (AsyncStorage) y se usa directamente.

## Puesta en marcha

```bash
npm install
npm start        # abre Expo (escanea el QR con la app Expo Go)
npm run android  # emulador/dispositivo Android
npm run ios      # simulador iOS (macOS)
```

Para el análisis con IA: abre **Ajustes** en la app y pega tu clave de API de Claude.

## Calidad

```bash
npm test       # pruebas del motor de reglas (node --test vía tsx)
npm run lint   # comprobación de tipos (tsc --noEmit)
```
