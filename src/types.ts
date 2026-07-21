/** Niveles de urgencia ordenados de menor a mayor gravedad. */
export type Urgency = 'self-care' | 'see-doctor' | 'urgent' | 'emergency';

export interface Symptom {
  id: string;
  label: string;
  /** Agrupación para mostrar los síntomas por secciones. */
  category: string;
  /** Si es true, su sola presencia dispara una alerta de emergencia. */
  redFlag?: boolean;
}

export interface Condition {
  id: string;
  name: string;
  description: string;
  advice: string;
  urgency: Urgency;
  /**
   * Pesos por síntoma (0–1). Cuanto mayor el peso, más característico es
   * ese síntoma de la condición. Los síntomas no listados no aportan.
   */
  weights: Record<string, number>;
}

export interface DiagnosisResult {
  condition: Condition;
  /** Confianza normalizada 0–1 calculada por el motor de reglas. */
  score: number;
  /** Síntomas seleccionados que coinciden con esta condición. */
  matched: string[];
}

/** Análisis devuelto por la IA (Claude), opcional en el modo híbrido. */
export interface AiAssessment {
  summary: string;
  possibleCauses: { name: string; explanation: string }[];
  recommendation: string;
  urgency: Urgency;
  /** Preguntas que un profesional podría querer hacer. */
  followUpQuestions: string[];
}
