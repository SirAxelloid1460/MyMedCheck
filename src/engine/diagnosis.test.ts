import assert from 'node:assert/strict';
import { test } from 'node:test';
import { diagnose, selectedRedFlags } from './diagnosis';

test('detecta síntomas de alarma (red flags)', () => {
  const flags = selectedRedFlags(['chest_pain', 'cough', 'fever']);
  assert.deepEqual(flags, ['chest_pain']);
});

test('no hay alarma sin síntomas de riesgo', () => {
  assert.deepEqual(selectedRedFlags(['cough', 'fever']), []);
});

test('clasifica un resfriado por encima de otras causas', () => {
  const results = diagnose(['runny_nose', 'sneezing', 'sore_throat']);
  assert.ok(results.length > 0);
  assert.equal(results[0].condition.id, 'common_cold');
});

test('los resultados vienen ordenados por confianza descendente', () => {
  const results = diagnose(['fever', 'body_aches', 'chills', 'cough']);
  for (let i = 1; i < results.length; i++) {
    assert.ok(results[i - 1].score >= results[i].score);
  }
});

test('distingue rinitis alérgica de la gripe por picor de ojos sin fiebre', () => {
  const results = diagnose(['sneezing', 'runny_nose', 'itchy_eyes']);
  assert.equal(results[0].condition.id, 'allergic_rhinitis');
});

test('una selección sin coincidencias devuelve lista vacía', () => {
  assert.deepEqual(diagnose(['weight_loss']), []);
});

test('respeta el límite de resultados', () => {
  const results = diagnose(['fever', 'cough', 'fatigue', 'headache', 'nausea'], 3);
  assert.ok(results.length <= 3);
});
