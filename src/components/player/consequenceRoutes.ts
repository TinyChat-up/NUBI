import type { ConsequenceStep, Route } from '../../engine/types.ts';

/**
 * Rutas de una consecuencia, separadas para la presentación de la fase 17:
 * - `retry`: la que vuelve a la decisión («Probar otra posibilidad»), que se ofrece arriba, antes del texto;
 * - `onward`: el resto («Seguir con la historia»…), que siguen al final como acción principal.
 * Se identifica por su destino (el paso de la decisión), no por su posición en la lista:
 * una historia sin ruta de vuelta, o con otro orden, no pierde ni intercambia botones.
 */
export function splitConsequenceRoutes(step: Pick<ConsequenceStep, 'choiceStepId' | 'routes'>): { retry?: Route; onward: Route[] } {
  const retry = step.routes.find((r) => r.to.stepId === step.choiceStepId);
  return { retry, onward: step.routes.filter((r) => r !== retry) };
}
