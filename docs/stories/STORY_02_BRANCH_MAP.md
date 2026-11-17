# Cuento 2 · Mapa de decisiones · «El libro de trenes»

Propuesta editorial **pendiente de aprobación**. No está implementada ni en la biblioteca. Guion completo: [STORY_02_PROPOSAL.md](STORY_02_PROPOSAL.md). Ilustraciones: [STORY_02_ART_INVENTORY.md](STORY_02_ART_INVENTORY.md).

## Esquema

```
P1  Teo lee su libro de trenes (con cascos)
 │
P2  Lía se acerca y le habla con su comunicador
 │
P3  (opcional) ¿Cómo podría sentirse Teo?
 │
P4  DECISIÓN 1 · ¿Qué podría hacer Teo?
 ├── A · Enseñarle el libro a Lía ─────────▶ P5a  Miran los trenes juntos ──────────────▶ FINAL A «Mirar los trenes juntos»
 │
 └── B · Seguir leyendo ───────────────────▶ P5b  Lía espera. No sabe si Teo la ha visto
                                              │
                                             (opcional) ¿Cómo podría sentirse Lía?
                                              │
                                             P6  DECISIÓN 2 · ¿Qué podría hacer Teo ahora?
                                              ├── B1 · Decirle «Ahora no. Luego sí» ──▶ FINAL B1 «Ahora no, luego sí»
                                              └── B2 · Seguir sin decir nada ─────────▶ P7  Lía va con Aya
                                                                                         │  Nubi: «¿Quieres probar otra forma?» (opcional)
                                                                                         ▼
                                                                                        FINAL B2 «Cada uno con su libro»
```

- **2 decisiones, 2 opciones cada una, 3 finales.** Profundidad máxima: 4 pantallas desde la situación hasta un final.
- **Pantallas**: 2 de situación, 2 preguntas opcionales, 2 decisiones, 3 de consecuencia/final, 1 oferta de Nubi y 3 cierres generados por el motor.
- La emoción elegida **no cambia el camino** (P3 y P5b solo preguntan).
- Ningún final es «bueno» ni «malo». Tres formas posibles de que siga la tarde: **leer juntos**, **leer juntos más tarde** o **cada uno con lo que quería**.
- Lo que en el mapa es una necesidad (Teo quiere seguir leyendo tranquilo) no se presenta como un error. Lo que cambia entre caminos es **qué entiende Lía**.

## Escenas para el motor ramificado (fase 21)

| Escena (id propuesto) | `role` | Pasos | Sale a | Recurso |
|---|---|---|---|---|
| `lt-leer` | situacion | P1 | `lt-lia` | `ume-k6-2` (existente) |
| `lt-lia` | situacion | P2 · P3 (feelings, opcional) | `lt-decidir-1` | `ume-s6-biblioteca` (existente) |
| `lt-decidir-1` | decision | choice A/B | A → `lt-juntos` · B → `lt-espera` | tarjetas: `lt-opt-ensenar` (nueva), `ume-k6-2` (existente) |
| `lt-juntos` | final | P5a · `ending: final-juntos` | — | `lt-juntos` (nueva) |
| `lt-espera` | consecuencia | P5b · feelings (Lía, opcional) | `lt-decidir-2` | `lt-espera` (nueva) |
| `lt-decidir-2` | decision | choice B1/B2 | B1 → `lt-luego` · B2 → `lt-con-aya` | tarjetas: `lt-opt-luego` (nueva), `lt-espera` (nueva, reutilizada) |
| `lt-luego` | final | final B1 · `ending: final-luego` | — | `lt-luego` (nueva) |
| `lt-con-aya` | final | P7 · `offer: true` · `ending: final-cada-uno` | — | `lt-con-aya` (nueva) |

- `engineVersion: 2`, `formats: ['cuento']` en la primera entrega (el cómic, más adelante).
- El validador de la fase 21 comprobará que las 8 escenas son alcanzables, que los 3 finales lo son y que no hay ciclos.
- **Explorar otro camino**: lo da el motor en cada final («Explorar otro camino» con las decisiones del recorrido) y en P7 con la oferta de Nubi. Atrás nunca mezcla ramas.
- **Sin cambios en el motor**: todo lo necesario existe desde la fase 21.

## Dónde aparece Nubi

| Momento | Qué hace | Por qué ahí |
|---|---|---|
| P7, antes del final B2 | «¿Quieres probar otra forma?», con la tarjeta de la otra opción (B1). Salidas: **Seguir con mi elección** (principal), probar otra, **Volver atrás**, **Terminar** | Es la única rama en la que alguien (Lía) se queda sin entender qué pasa. La oferta no corrige: invita |
| Finales | El cierre del motor: «Un final del cuento… Hay otros caminos» | Común a todos |

No aparece después de A ni de B1: ahí nadie se queda con una duda, y repetir la oferta podría leerse como «has elegido mal».
