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

## Puesta en marcha (desarrollo)

```bash
npm install
npm start        # abre Expo (escanea el QR con la app Expo Go)
npm run android  # emulador/dispositivo Android
npm run ios      # simulador iOS (macOS)
npm run web      # abre la app en el navegador
```

Para el análisis con IA: abre **Ajustes** en la app y pega tu clave de API de Claude.

## 🖥️ Versión web para PC

La app se exporta como un **sitio estático** (HTML/JS) que se puede abrir en
cualquier navegador y hospedar en cualquier sitio.

```bash
npm run build:web   # genera la carpeta dist/ (sitio estático)
npm run serve:web   # sírvela en http://localhost:3000
```

La salida en `dist/` incluye una página por ruta (`index.html`, `symptoms.html`,
`results.html`, `settings.html`).

**Para ponerla online**, sube el contenido de `dist/` a cualquier hosting estático:

- **Netlify / Vercel:** arrastra la carpeta `dist/` o conecta el repo (carpeta de
  publicación: `dist`, comando de build: `npm run build:web`).
- **GitHub Pages:** publica `dist/` en la rama `gh-pages`.
- **EAS Hosting:** `npx eas-cli deploy` (requiere cuenta de Expo).

## 📱 Generar el APK para Android

El binario se compila con **EAS Build** (servicio en la nube de Expo). Necesitas
una cuenta gratuita de Expo.

```bash
npm i -g eas-cli        # instala la CLI (una vez)
eas login               # inicia sesión con tu cuenta de Expo
eas build:configure     # vincula el proyecto (una vez)
npm run build:apk       # eas build -p android --profile preview
```

Al terminar, EAS te da un enlace para **descargar el `.apk`** e instalarlo en el
móvil (activa "instalar apps de orígenes desconocidos"). Los perfiles de build
están en `eas.json`:

- `preview` → **APK** instalable directamente (para pruebas/compartir).
- `production` → **AAB** (App Bundle) para publicar en Google Play.

> El APK debe compilarse desde tu máquina o CI con tu cuenta de Expo; no se puede
> generar sin ese login. Toda la configuración necesaria ya está en el repo.

## Calidad

```bash
npm test       # pruebas del motor de reglas (node --test vía tsx)
npm run lint   # comprobación de tipos (tsc --noEmit)
```
