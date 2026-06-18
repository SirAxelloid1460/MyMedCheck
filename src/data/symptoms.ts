import { Symptom } from '../types';

/**
 * Catálogo de síntomas seleccionables. Los marcados con `redFlag` son
 * señales de alarma que disparan una recomendación inmediata de emergencia.
 */
export const SYMPTOMS: Symptom[] = [
  // General
  { id: 'fever', label: 'Fiebre', category: 'General' },
  { id: 'fatigue', label: 'Cansancio / fatiga', category: 'General' },
  { id: 'chills', label: 'Escalofríos', category: 'General' },
  { id: 'body_aches', label: 'Dolores musculares', category: 'General' },
  { id: 'sweating', label: 'Sudoración', category: 'General' },
  { id: 'weight_loss', label: 'Pérdida de peso inexplicable', category: 'General' },

  // Cabeza y neurológico
  { id: 'headache', label: 'Dolor de cabeza', category: 'Cabeza y neurológico' },
  { id: 'dizziness', label: 'Mareo', category: 'Cabeza y neurológico' },
  { id: 'light_sensitivity', label: 'Sensibilidad a la luz', category: 'Cabeza y neurológico' },
  { id: 'confusion', label: 'Confusión / desorientación', category: 'Cabeza y neurológico', redFlag: true },
  { id: 'vision_changes', label: 'Visión borrosa o doble', category: 'Cabeza y neurológico' },
  { id: 'fainting', label: 'Desmayo o pérdida de conciencia', category: 'Cabeza y neurológico', redFlag: true },

  // Respiratorio
  { id: 'cough', label: 'Tos', category: 'Respiratorio' },
  { id: 'sore_throat', label: 'Dolor de garganta', category: 'Respiratorio' },
  { id: 'runny_nose', label: 'Congestión / mocos', category: 'Respiratorio' },
  { id: 'sneezing', label: 'Estornudos', category: 'Respiratorio' },
  { id: 'shortness_breath', label: 'Dificultad para respirar', category: 'Respiratorio', redFlag: true },
  { id: 'loss_smell', label: 'Pérdida de olfato o gusto', category: 'Respiratorio' },
  { id: 'swollen_glands', label: 'Ganglios inflamados', category: 'Respiratorio' },

  // Digestivo
  { id: 'nausea', label: 'Náuseas', category: 'Digestivo' },
  { id: 'vomiting', label: 'Vómitos', category: 'Digestivo' },
  { id: 'diarrhea', label: 'Diarrea', category: 'Digestivo' },
  { id: 'abdominal_pain', label: 'Dolor abdominal', category: 'Digestivo' },
  { id: 'loss_appetite', label: 'Falta de apetito', category: 'Digestivo' },

  // Cardiovascular
  { id: 'chest_pain', label: 'Dolor en el pecho', category: 'Cardiovascular', redFlag: true },
  { id: 'palpitations', label: 'Palpitaciones', category: 'Cardiovascular' },

  // Urinario
  { id: 'painful_urination', label: 'Dolor al orinar', category: 'Urinario' },
  { id: 'frequent_urination', label: 'Orinar con frecuencia', category: 'Urinario' },

  // Piel
  { id: 'rash', label: 'Erupción en la piel', category: 'Piel' },
  { id: 'itchy_eyes', label: 'Picor de ojos', category: 'Piel' },

  // Estado de ánimo
  { id: 'anxiety', label: 'Ansiedad / nerviosismo', category: 'Estado de ánimo' },
  { id: 'insomnia', label: 'Dificultad para dormir', category: 'Estado de ánimo' },
];

/** Búsqueda rápida id -> etiqueta legible. */
export const SYMPTOM_LABELS: Record<string, string> = Object.fromEntries(
  SYMPTOMS.map((s) => [s.id, s.label]),
);

/** Síntomas agrupados por categoría, preservando el orden de definición. */
export function symptomsByCategory(): { category: string; items: Symptom[] }[] {
  const groups: { category: string; items: Symptom[] }[] = [];
  for (const symptom of SYMPTOMS) {
    let group = groups.find((g) => g.category === symptom.category);
    if (!group) {
      group = { category: symptom.category, items: [] };
      groups.push(group);
    }
    group.items.push(symptom);
  }
  return groups;
}
