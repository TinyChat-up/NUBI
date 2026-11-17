/**
 * Validación estructural de historias. Se ejecuta en los tests (npm test)
 * para que una historia nueva no rompa el reproductor.
 */
import type { AssetSpec, Character, Story, Tool } from './types.ts';

export interface ValidationContext {
  assets: Record<string, AssetSpec>;
  tools: Record<string, Tool>;
  characters: Record<string, Character>;
}

export function validateStory(story: Story, ctx: ValidationContext): string[] {
  const errors: string[] = [];
  const err = (msg: string) => errors.push(`[${story.id}] ${msg}`);

  const sceneIds = new Set<string>();
  const stepIds = new Set<string>();
  const checkAsset = (id: string, where: string) => {
    if (!ctx.assets[id]) err(`Recurso "${id}" no registrado (${where})`);
  };
  const checkCharacter = (id: string | undefined, where: string) => {
    if (id && !ctx.characters[id]) err(`Personaje "${id}" no registrado (${where})`);
  };
  const checkTool = (id: string, where: string) => {
    if (!ctx.tools[id]) err(`Herramienta "${id}" no registrada (${where})`);
  };

  if (story.scenes.length === 0) err('La historia no tiene escenas');
  if (!story.formats.includes('cuento')) err('Toda historia debe estar disponible al menos como cuento');
  checkAsset(story.cover, 'cubierta');
  story.characters.forEach((c) => checkCharacter(c, 'reparto'));
  story.strategies.forEach((t) => checkTool(t, 'estrategias'));

  for (const scene of story.scenes) {
    if (sceneIds.has(scene.id)) err(`Escena duplicada: ${scene.id}`);
    sceneIds.add(scene.id);
    if (scene.steps.length === 0) err(`La escena ${scene.id} no tiene pasos`);
    for (const step of scene.steps) {
      if (stepIds.has(step.id)) err(`Paso duplicado: ${step.id}`);
      stepIds.add(step.id);
    }
  }

  for (const scene of story.scenes) {
    if (scene.next && !sceneIds.has(scene.next)) err(`${scene.id}.next apunta a una escena inexistente`);
    if (story.formats.includes('comic') && !scene.comic?.length && scene.steps.some((s) => s.type === 'beat')) {
      err(`La escena ${scene.id} tiene narración pero no viñetas de cómic`);
    }
    scene.comic?.forEach((panel) => {
      checkAsset(panel.illustration, `${scene.id}/${panel.id}`);
      panel.bubbles.forEach((b) => checkCharacter(b.speaker, `${panel.id}/${b.id}`));
    });

    for (const step of scene.steps) {
      const where = `${scene.id}/${step.id}`;
      switch (step.type) {
        case 'beat':
          checkAsset(step.illustration, where);
          checkCharacter(step.speaker, where);
          if (!step.text.trim()) err(`${where}: texto vacío`);
          if (step.short !== undefined && !step.short.trim()) err(`${where}: versión corta vacía (quitar el campo o escribirla)`);
          break;
        case 'feelings':
          if (step.options.length < 3) err(`${where}: ofrece al menos 3 formas de sentir`);
          if (!step.options.some((o) => o.id === 'no-lo-se')) err(`${where}: incluye la opción "No lo sé"`);
          break;
        case 'know-need':
          if (step.questions.length === 0) err(`${where}: sin preguntas`);
          break;
        case 'choice': {
          if (!sceneIds.has(step.next)) err(`${where}: next apunta a una escena inexistente`);
          // Modelo de escena común (v1): al menos 3. Ramificado (v2): al menos 2; más de 2 es solo un aviso (branchWarnings).
          if (step.options.length < (story.engineVersion === 2 ? 2 : 3)) err(`${where}: una decisión debe ofrecer al menos ${story.engineVersion === 2 ? 2 : 3} posibilidades`);
          for (const option of step.options) {
            checkAsset(option.illustration, `${where}/${option.id}`);
            if (option.next && !sceneIds.has(option.next)) err(`${where}/${option.id}.next apunta a una escena inexistente`);
            if (!option.consequence) {
              if (!option.next) err(`${where}/${option.id}: sin consecuencia ni escena propia (next)`);
              continue;
            }
            option.consequence.story.forEach((s) => checkAsset(s.illustration, `${where}/${option.id}`));
            option.consequence.tools.forEach((t) => checkTool(t, `${where}/${option.id}`));
            // Lectura fácil: textos editoriales explícitos; nunca vacíos ni de momentos que no existen.
            const short = option.consequence.short;
            if (short) {
              const at = `${where}/${option.id}/short`;
              if ((short.story?.length ?? 0) > option.consequence.story.length) err(`${at}: más momentos cortos que momentos en la consecuencia`);
              short.story?.forEach((t, i) => t !== undefined && !t.trim() && err(`${at}.story[${i}]: versión corta vacía`));
              for (const k of ['youMayFeel', 'othersMay', 'helpsWhen', 'keepInMind', 'anotherWay'] as const) {
                const t = short[k];
                if (t !== undefined && !t.trim()) err(`${at}.${k}: versión corta vacía`);
              }
              if (short.anotherWay !== undefined && option.consequence.anotherWay === undefined) err(`${at}.anotherWay: no hay texto completo que acortar`);
            }
          }
          break;
        }
        case 'consequence': {
          if (!stepIds.has(step.choiceStepId)) err(`${where}: choiceStepId inexistente`);
          for (const route of step.routes) {
            if (!sceneIds.has(route.to.sceneId)) err(`${where}: ruta a escena inexistente ${route.to.sceneId}`);
            if (route.to.stepId && !stepIds.has(route.to.stepId)) err(`${where}: ruta a paso inexistente`);
          }
          break;
        }
        case 'strategies':
          step.tools.forEach((t) => checkTool(t, where));
          break;
        case 'summary':
          step.sections.forEach((s) => {
            if (!stepIds.has(s.fromStepId)) err(`${where}: la sección "${s.title}" lee un paso inexistente`);
          });
          break;
      }
    }
  }

  for (const rec of story.recreations) {
    if (!sceneIds.has(rec.sceneId)) err(`Recreación ${rec.id}: escena inexistente`);
    if (!stepIds.has(rec.choiceStepId)) err(`Recreación ${rec.id}: paso inexistente`);
    checkAsset(rec.cover, `recreación ${rec.id}`);
  }

  if (story.video) {
    checkAsset(story.video.poster, 'póster de vídeo');
    story.video.chapters.forEach((c) => {
      if (!sceneIds.has(c.sceneId)) err(`Capítulo de vídeo a escena inexistente ${c.sceneId}`);
    });
  }

  if (story.engineVersion === 2) {
    errors.push(...branchErrors(story).map((m) => `[${story.id}] ${m}`));
  } else {
    const last = story.scenes[story.scenes.length - 1];
    if (last && !last.steps.some((s) => s.type === 'summary')) err('La última escena debe cerrar con un resumen');
  }

  return errors;
}

/** Escenas a las que se puede ir desde `scene` (sin contar las rutas «probar otra» de una consecuencia). */
export function sceneEdges(story: Story, sceneId: string): string[] {
  const scene = story.scenes.find((s) => s.id === sceneId);
  if (!scene) return [];
  const out = new Set<string>();
  for (const step of scene.steps) if (step.type === 'choice') step.options.forEach((o) => out.add(o.next ?? step.next));
  if (scene.next) out.add(scene.next);
  return [...out];
}

/**
 * Historias ramificadas (fase 21): todas las escenas alcanzables, cada camino termina en un final,
 * sin ciclos accidentales y sin escenas que «caigan» por el orden del array.
 */
export function branchErrors(story: Story): string[] {
  const errors: string[] = [];
  const ids = new Set(story.scenes.map((s) => s.id));
  for (const scene of story.scenes) {
    const edges = sceneEdges(story, scene.id).filter((e) => ids.has(e));
    if (scene.ending && edges.length) errors.push(`El final ${scene.id} no puede continuar (tiene next o una decisión)`);
    if (!scene.ending && edges.length === 0) errors.push(`La escena ${scene.id} no continúa: añade next, una decisión o ending`);
  }
  if (!story.scenes.some((s) => s.ending)) errors.push('Una historia ramificada necesita al menos un final (ending)');
  const endings = story.scenes.flatMap((s) => (s.ending ? [s.ending.id] : []));
  if (new Set(endings).size !== endings.length) errors.push('Hay finales con el mismo id');
  // Alcanzables desde la primera escena.
  const seen = new Set<string>();
  const stack = story.scenes[0] ? [story.scenes[0].id] : [];
  while (stack.length) {
    const id = stack.pop()!;
    if (seen.has(id) || !ids.has(id)) continue;
    seen.add(id);
    stack.push(...sceneEdges(story, id));
  }
  for (const s of story.scenes) if (!seen.has(s.id)) errors.push(`La escena ${s.id} no es alcanzable desde el principio`);
  // Sin ciclos (búsqueda en profundidad con colores).
  const state = new Map<string, 'abierta' | 'cerrada'>();
  const visit = (id: string, trail: string[]): void => {
    if (state.get(id) === 'cerrada' || !ids.has(id)) return;
    if (state.get(id) === 'abierta') {
      errors.push(`Ciclo accidental: ${[...trail.slice(trail.indexOf(id)), id].join(' → ')}`);
      return;
    }
    state.set(id, 'abierta');
    for (const e of sceneEdges(story, id)) visit(e, [...trail, id]);
    state.set(id, 'cerrada');
  };
  if (story.scenes[0]) visit(story.scenes[0].id, []);
  return errors;
}

/** Avisos de diseño (no impiden publicar): más de dos opciones en una decisión ramificada. */
export function branchWarnings(story: Story): string[] {
  if (story.engineVersion !== 2) return [];
  return story.scenes.flatMap((sc) =>
    sc.steps.flatMap((st) => (st.type === 'choice' && st.options.length > 2 ? [`[${story.id}] ${sc.id}/${st.id}: ${st.options.length} opciones (se recomiendan 2)`] : [])),
  );
}
