import { Condition } from '../types';

/**
 * Base de conocimiento local de condiciones comunes. Los pesos (0–1) indican
 * cuán característico es cada síntoma de la condición. Esto NO es un
 * diagnóstico médico, solo una orientación basada en patrones frecuentes.
 */
export const CONDITIONS: Condition[] = [
  {
    id: 'common_cold',
    name: 'Resfriado común',
    description: 'Infección viral leve de las vías respiratorias altas.',
    advice:
      'Descansa, hidrátate y usa analgésicos de venta libre si hace falta. Suele resolverse en 7–10 días.',
    urgency: 'self-care',
    weights: {
      runny_nose: 1,
      sneezing: 0.9,
      sore_throat: 0.7,
      cough: 0.6,
      headache: 0.4,
      fatigue: 0.4,
    },
  },
  {
    id: 'influenza',
    name: 'Gripe (influenza)',
    description: 'Infección viral con inicio brusco y síntomas más intensos que un resfriado.',
    advice:
      'Reposo, líquidos y antipiréticos. Consulta si tienes factores de riesgo o no mejoras en 3–5 días.',
    urgency: 'see-doctor',
    weights: {
      fever: 1,
      body_aches: 0.9,
      chills: 0.8,
      fatigue: 0.8,
      cough: 0.6,
      headache: 0.6,
      sore_throat: 0.4,
    },
  },
  {
    id: 'covid19',
    name: 'COVID-19',
    description: 'Infección respiratoria por SARS-CoV-2 con presentación muy variable.',
    advice:
      'Considera hacerte una prueba y aíslate. Vigila la respiración; busca ayuda urgente si te falta el aire.',
    urgency: 'see-doctor',
    weights: {
      fever: 0.8,
      cough: 0.8,
      loss_smell: 1,
      fatigue: 0.7,
      sore_throat: 0.5,
      shortness_breath: 0.6,
      body_aches: 0.5,
    },
  },
  {
    id: 'allergic_rhinitis',
    name: 'Rinitis alérgica',
    description: 'Reacción alérgica de las vías respiratorias altas (p. ej. polen o ácaros).',
    advice:
      'Antihistamínicos de venta libre y evitar el alérgeno suelen ayudar. No cursa con fiebre.',
    urgency: 'self-care',
    weights: {
      sneezing: 1,
      runny_nose: 0.9,
      itchy_eyes: 1,
      cough: 0.3,
    },
  },
  {
    id: 'strep_throat',
    name: 'Faringitis estreptocócica',
    description: 'Infección bacteriana de la garganta que puede requerir antibióticos.',
    advice:
      'Conviene una valoración médica: puede necesitar antibiótico, sobre todo con fiebre y sin tos.',
    urgency: 'see-doctor',
    weights: {
      sore_throat: 1,
      fever: 0.7,
      swollen_glands: 0.6,
      headache: 0.4,
    },
  },
  {
    id: 'migraine',
    name: 'Migraña',
    description: 'Cefalea intensa, a menudo pulsátil y unilateral, con sensibilidad sensorial.',
    advice:
      'Descansa en un lugar oscuro y silencioso. Analgésicos pueden ayudar. Consulta si es muy frecuente.',
    urgency: 'self-care',
    weights: {
      headache: 1,
      light_sensitivity: 0.9,
      nausea: 0.6,
      vision_changes: 0.5,
      dizziness: 0.4,
    },
  },
  {
    id: 'tension_headache',
    name: 'Cefalea tensional',
    description: 'Dolor de cabeza opresivo, normalmente por estrés o tensión muscular.',
    advice: 'Descanso, hidratación y manejo del estrés. Analgésicos suaves si es necesario.',
    urgency: 'self-care',
    weights: {
      headache: 1,
      fatigue: 0.5,
      anxiety: 0.4,
      insomnia: 0.3,
    },
  },
  {
    id: 'gastroenteritis',
    name: 'Gastroenteritis',
    description: 'Inflamación del tracto digestivo, normalmente viral o por intoxicación alimentaria.',
    advice:
      'Hidratación con sales de rehidratación y dieta blanda. Consulta si hay signos de deshidratación.',
    urgency: 'self-care',
    weights: {
      diarrhea: 1,
      nausea: 0.8,
      vomiting: 0.8,
      abdominal_pain: 0.7,
      fever: 0.4,
      loss_appetite: 0.4,
    },
  },
  {
    id: 'uti',
    name: 'Infección urinaria',
    description: 'Infección de las vías urinarias, frecuente y tratable.',
    advice:
      'Conviene valoración médica: suele necesitar antibiótico. Bebe abundante agua mientras tanto.',
    urgency: 'see-doctor',
    weights: {
      painful_urination: 1,
      frequent_urination: 0.9,
      abdominal_pain: 0.4,
      fever: 0.4,
    },
  },
  {
    id: 'dehydration',
    name: 'Deshidratación',
    description: 'Falta de líquidos corporales, a menudo tras vómitos, diarrea o calor.',
    advice:
      'Bebe líquidos con electrolitos de forma gradual. Busca atención si hay confusión o mareo intenso.',
    urgency: 'see-doctor',
    weights: {
      dizziness: 0.8,
      fatigue: 0.7,
      headache: 0.5,
      nausea: 0.4,
      diarrhea: 0.4,
    },
  },
  {
    id: 'anxiety',
    name: 'Cuadro de ansiedad',
    description: 'Respuesta de estrés con manifestaciones físicas como palpitaciones o insomnio.',
    advice:
      'Técnicas de respiración y descanso pueden ayudar. Considera apoyo profesional si persiste.',
    urgency: 'self-care',
    weights: {
      anxiety: 1,
      palpitations: 0.7,
      insomnia: 0.6,
      dizziness: 0.4,
      fatigue: 0.4,
    },
  },
  {
    id: 'food_poisoning',
    name: 'Intoxicación alimentaria',
    description: 'Malestar digestivo de inicio rápido tras ingerir alimentos contaminados.',
    advice:
      'Hidratación y reposo digestivo. Consulta si hay fiebre alta, sangre en heces o dura más de 2 días.',
    urgency: 'see-doctor',
    weights: {
      vomiting: 1,
      diarrhea: 0.9,
      abdominal_pain: 0.8,
      nausea: 0.8,
      fever: 0.3,
    },
  },
];
