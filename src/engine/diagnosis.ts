import { CONDITIONS } from '../data/conditions';
import { SYMPTOMS } from '../data/symptoms';
import { Condition, DiagnosisResult } from '../types';

const RED_FLAG_IDS = new Set(SYMPTOMS.filter((s) => s.redFlag).map((s) => s.id));

/** Síntomas de alarma presentes en la selección actual. */
export function selectedRedFlags(selected: string[]): string[] {
  return selected.filter((id) => RED_FLAG_IDS.has(id));
}

/**
 * Puntúa una condición frente a los síntomas seleccionados.
 *
 * score = (peso de los síntomas coincidentes)
 *         / (peso total de la condición + penalización por síntomas no explicados)
 *
 * Esto premia explicar muchos síntomas característicos y penaliza ligeramente
 * las condiciones que dejan síntomas seleccionados sin justificar.
 */
function scoreCondition(condition: Condition, selected: Set<string>): DiagnosisResult | null {
  const matched: string[] = [];
  let matchedWeight = 0;
  let totalWeight = 0;

  for (const [symptomId, weight] of Object.entries(condition.weights)) {
    totalWeight += weight;
    if (selected.has(symptomId)) {
      matched.push(symptomId);
      matchedWeight += weight;
    }
  }

  if (matched.length === 0 || totalWeight === 0) return null;

  // Síntomas seleccionados que esta condición no explica.
  const unexplained = [...selected].filter((id) => !(id in condition.weights)).length;
  const denominator = totalWeight + unexplained * 0.25;
  const score = matchedWeight / denominator;

  return { condition, score, matched };
}

/**
 * Devuelve las condiciones más probables ordenadas por confianza descendente.
 * @param selected ids de síntomas seleccionados
 * @param limit número máximo de resultados
 */
export function diagnose(selected: string[], limit = 5): DiagnosisResult[] {
  const set = new Set(selected);
  const results: DiagnosisResult[] = [];

  for (const condition of CONDITIONS) {
    const result = scoreCondition(condition, set);
    if (result) results.push(result);
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}
