import Anthropic from '@anthropic-ai/sdk';
import { AiAssessment, Urgency } from '../types';

const MODEL = 'claude-opus-4-8';

/**
 * Esquema JSON que restringe la salida de Claude para poder parsearla sin
 * ambigüedad (structured outputs).
 */
const ASSESSMENT_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string' },
    possibleCauses: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          explanation: { type: 'string' },
        },
        required: ['name', 'explanation'],
        additionalProperties: false,
      },
    },
    recommendation: { type: 'string' },
    urgency: {
      type: 'string',
      enum: ['self-care', 'see-doctor', 'urgent', 'emergency'],
    },
    followUpQuestions: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: ['summary', 'possibleCauses', 'recommendation', 'urgency', 'followUpQuestions'],
  additionalProperties: false,
} as const;

const SYSTEM_PROMPT = `Eres un asistente de orientación de salud para una app de autodiagnóstico.
NO eres un médico y NO emites diagnósticos. Tu tarea es ofrecer una orientación
educativa, prudente y empática a partir de los síntomas que describe la persona.

Reglas:
- Escribe en español claro y cercano, sin tecnicismos innecesarios.
- Ofrece posibles causas como hipótesis, nunca como certezas.
- Sé conservador con la urgencia: ante la duda, recomienda consultar a un profesional.
- Si los síntomas sugieren una emergencia (dolor torácico, dificultad respiratoria,
  confusión, desmayo), marca urgency = "emergency" y recomienda atención inmediata.
- No recetes medicamentos concretos ni dosis.`;

export interface AiInput {
  symptomLabels: string[];
  /** Texto libre opcional con más contexto que escribe la persona. */
  notes?: string;
}

/**
 * Solicita a Claude un análisis de los síntomas. Requiere una clave de API
 * válida. Lanza un Error con mensaje legible si algo falla.
 */
export async function analyzeWithAI(apiKey: string, input: AiInput): Promise<AiAssessment> {
  if (!apiKey) {
    throw new Error('No hay clave de API configurada. Añádela en Ajustes.');
  }

  const client = new Anthropic({
    apiKey,
    // React Native es un entorno tipo navegador; habilitamos el uso del SDK.
    dangerouslyAllowBrowser: true,
  });

  const symptomList =
    input.symptomLabels.length > 0
      ? input.symptomLabels.map((s) => `- ${s}`).join('\n')
      : '- (sin síntomas marcados)';

  const userContent =
    `Síntomas seleccionados:\n${symptomList}` +
    (input.notes?.trim() ? `\n\nNotas de la persona:\n${input.notes.trim()}` : '');

  // El cuerpo usa campos recientes de la API (thinking adaptativo y
  // output_config) que el tipado del SDK no siempre cubre; lo pasamos como
  // `any` y tipamos la respuesta como Message (respuesta no-streaming).
  const requestBody = {
    model: MODEL,
    max_tokens: 4096,
    thinking: { type: 'adaptive' },
    system: SYSTEM_PROMPT,
    output_config: {
      format: { type: 'json_schema', schema: ASSESSMENT_SCHEMA },
    },
    messages: [{ role: 'user', content: userContent }],
  };

  let response: Anthropic.Message;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    response = (await client.messages.create(requestBody as any)) as Anthropic.Message;
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      throw new Error('La clave de API no es válida. Revísala en Ajustes.');
    }
    if (err instanceof Anthropic.RateLimitError) {
      throw new Error('Demasiadas solicitudes. Inténtalo de nuevo en unos segundos.');
    }
    if (err instanceof Anthropic.APIConnectionError) {
      throw new Error('No hay conexión. El análisis con IA necesita internet.');
    }
    throw new Error('No se pudo completar el análisis con IA. Inténtalo más tarde.');
  }

  // output_config.format garantiza que el primer bloque de texto es JSON válido.
  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('Respuesta de IA vacía. Inténtalo de nuevo.');
  }

  try {
    const parsed = JSON.parse(textBlock.text) as AiAssessment;
    return normalize(parsed);
  } catch {
    throw new Error('No se pudo interpretar la respuesta de la IA.');
  }
}

const VALID_URGENCY: Urgency[] = ['self-care', 'see-doctor', 'urgent', 'emergency'];

/** Saneamiento defensivo de la salida por si llega incompleta. */
function normalize(a: AiAssessment): AiAssessment {
  return {
    summary: a.summary ?? '',
    possibleCauses: Array.isArray(a.possibleCauses) ? a.possibleCauses : [],
    recommendation: a.recommendation ?? '',
    urgency: VALID_URGENCY.includes(a.urgency) ? a.urgency : 'see-doctor',
    followUpQuestions: Array.isArray(a.followUpQuestions) ? a.followUpQuestions : [],
  };
}
