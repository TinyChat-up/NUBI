import { describe, expect, it } from 'vitest';
import { storyList } from '../../content/stories/index.ts';
import type { ConsequenceStep, Route } from '../../engine/types.ts';
import { splitConsequenceRoutes } from './consequenceRoutes.ts';

const consequenceSteps = () => storyList.flatMap((s) => s.scenes.flatMap((sc) => sc.steps)).filter((st): st is ConsequenceStep => st.type === 'consequence');

/** Rutas sintéticas de prueba. */
const back: Route = { label: 'VOLVER', icon: 'refresh', to: { sceneId: 'a', stepId: 'decidir' } };
const on: Route = { label: 'SEGUIR', icon: 'arrow-right', to: { sceneId: 'b' } };

describe('Consecuencias: «Probar otra posibilidad» arriba y la continuación al final', () => {
  it('en las historias, la ruta de arriba vuelve a la decisión y «Seguir» queda abajo', () => {
    const steps = consequenceSteps();
    expect(steps.length).toBeGreaterThan(0);
    for (const step of steps) {
      const { retry, onward } = splitConsequenceRoutes(step);
      expect(retry?.to.stepId).toBe(step.choiceStepId);
      expect(onward.length).toBe(step.routes.length - 1);
      expect(onward.every((r) => r.to.stepId !== step.choiceStepId)).toBe(true);
    }
  });

  it('identifica la vuelta por su destino, no por su posición', () => {
    expect(splitConsequenceRoutes({ choiceStepId: 'decidir', routes: [on, back] })).toEqual({ retry: back, onward: [on] });
  });

  it('sin ruta de vuelta (o sin rutas) no inventa ni pierde botones', () => {
    expect(splitConsequenceRoutes({ choiceStepId: 'decidir', routes: [on] })).toEqual({ retry: undefined, onward: [on] });
    expect(splitConsequenceRoutes({ choiceStepId: 'decidir', routes: [] })).toEqual({ retry: undefined, onward: [] });
  });
});
