import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SelectionProvider } from '@/state';
import { colors } from '@/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SelectionProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.white,
            headerTitleStyle: { fontWeight: '700' },
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="index" options={{ title: 'MyMedCheck' }} />
          <Stack.Screen name="symptoms" options={{ title: 'Selecciona síntomas' }} />
          <Stack.Screen name="results" options={{ title: 'Resultados' }} />
          <Stack.Screen name="settings" options={{ title: 'Ajustes' }} />
        </Stack>
      </SelectionProvider>
    </SafeAreaProvider>
  );
}
