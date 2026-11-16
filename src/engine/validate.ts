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
          if (step.options.length < 3) err(`${where}: una decisión debe ofrecer al menos 3 posibilidades`);
          for (const option of step.options) {
            checkAsset(option.illustration, `${where}/${option.id}`);
            option.consequence.story.forEach((s) => checkAsset(s.illustration, `${where}/${option.id}`));
            option.consequence.tools.forEach((t) => checkTool(t, `${where}/${option.id}`));
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

  const last = story.scenes[story.scenes.length - 1];
  if (last && !last.steps.some((s) => s.type === 'summary')) err('La última escena debe cerrar con un resumen');

  return errors;
}
