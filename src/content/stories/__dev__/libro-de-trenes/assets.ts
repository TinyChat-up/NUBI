/**
 * «El libro de trenes» — recursos (SOLO DESARROLLO, fase 22). No forman parte del registro oficial.
 *
 * Reutilizados del registro oficial (ids existentes, sin cambios): ume-k6-2, ume-s6-biblioteca,
 * emo-sorpresa, emo-curiosidad, emo-calma, emo-inseguridad, emo-tristeza, nubi-pensando, nubi-saludo,
 * char-teo / char-lia / char-aya (en la ficha y en los bocadillos).
 *
 * Marcadores PROVISIONALES (7, según STORY_02_ART_INVENTORY.md §4): `provisional: true`, estado pendiente.
 * Se dibujan con el placeholder técnico y una etiqueta visible. No son arte del proyecto.
 */
import { defineAsset } from '../../../assets/helpers.ts';
import type { AssetSpec } from '../../../../engine/types.ts';

const provisional = (id: string, kind: AssetSpec['kind'], aspect: AssetSpec['aspect'], motif: AssetSpec['placeholder']['motif'], figures: string[], usage: string, alt: string): AssetSpec =>
  defineAsset(kind, {
    id,
    file: `/media/stories/libro-de-trenes/${id}.webp`, // no existe: el marcador se dibuja
    usage,
    description: `PROVISIONAL. Marcador de ${alt}. Pendiente de la ilustración definitiva (ver STORY_02_ART_INVENTORY.md).`,
    characters: figures,
    emotionOrAction: 'Provisional',
    aspect,
    alt: `Marcador provisional: ${alt}`,
    provisional: true,
    placeholder: { motif, figures: figures.map((character) => ({ character, mood: 'neutral' as const })), tint: 'crema' },
  });

export const libroProvisionalAssets: AssetSpec[] = [
  provisional('lt-cover', 'cubierta', '4:3', 'library', ['teo', 'lia'], 'Portada del cuento 2 (provisional)', 'portada de «El libro de trenes»'),
  provisional('lt-opt-ensenar', 'opcion', '4:3', 'library', ['teo', 'lia'], 'Opción A, decisión 1', 'Teo enseña el libro a Lía'),
  provisional('lt-juntos', 'escena', '16:9', 'library', ['teo', 'lia'], 'Consecuencia A (final A)', 'Teo y Lía miran juntos el libro de trenes'),
  provisional('lt-espera', 'escena', '16:9', 'library', ['teo', 'lia'], 'Consecuencia B y opción B2', 'Teo sigue leyendo; Lía espera a su lado'),
  provisional('lt-opt-luego', 'opcion', '4:3', 'library', ['teo'], 'Opción B1, decisión 2', 'Teo hace el gesto de «luego»'),
  provisional('lt-luego', 'escena', '16:9', 'library', ['teo', 'lia', 'aya'], 'Final B1', 'Lía lee con Aya; después, Teo le enseña los trenes'),
  provisional('lt-con-aya', 'escena', '16:9', 'library', ['lia', 'aya'], 'Consecuencia B2 y final B2', 'Lía se va con Aya a mirar un libro de volcanes'),
];
