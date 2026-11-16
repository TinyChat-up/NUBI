/// <reference types="node" />
import { existsSync } from 'node:fs';
import { expect, it } from 'vitest';
import { assetGroups } from './index.ts';

it('todos los assets se pueden entregar de forma independiente con ruta, tamaño y alt', () => {
  const list = assetGroups.flatMap((g) => g.assets);
  expect(new Set(list.map((a) => a.id)).size).toBe(list.length);
  expect(new Set(list.map((a) => a.file)).size).toBe(list.length);
  for (const a of list) {
    expect(a.file, a.id).toMatch(/^\/media\/[a-z0-9/_.-]+$/);
    expect(a.alt.trim().length, a.id).toBeGreaterThan(3);
    expect(a.size.width, a.id).toBeGreaterThan(0);
    expect(a.size.height, a.id).toBeGreaterThan(0);
    if (a.status === 'listo') expect(existsSync(`public${a.file}`), a.id).toBe(true);
  }
});
