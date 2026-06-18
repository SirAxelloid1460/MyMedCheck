/**
 * Paleta y tokens de estilo compartidos por toda la app.
 * Tonos sobrios y clínicos: verde azulado de confianza + acentos de urgencia.
 */
export const colors = {
  primary: '#0E7C7B',
  primaryDark: '#0A5C5B',
  background: '#F5F7F8',
  card: '#FFFFFF',
  text: '#1B2A2A',
  textMuted: '#5A6B6B',
  border: '#DCE3E3',
  // Niveles de urgencia
  selfCare: '#2E7D32',
  seeDoctor: '#F9A825',
  urgent: '#EF6C00',
  emergency: '#C62828',
  white: '#FFFFFF',
};

export const urgencyColor: Record<string, string> = {
  'self-care': colors.selfCare,
  'see-doctor': colors.seeDoctor,
  urgent: colors.urgent,
  emergency: colors.emergency,
};

export const urgencyLabel: Record<string, string> = {
  'self-care': 'Autocuidado',
  'see-doctor': 'Consulta médica',
  urgent: 'Atención pronta',
  emergency: 'Emergencia',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 20,
};
