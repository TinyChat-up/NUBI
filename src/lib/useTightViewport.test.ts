import { describe, expect, it } from 'vitest';
import { SINGLE_BAR, TIGHT_ENTER, TIGHT_LEAVE, nextTight } from './useTightViewport.ts';

describe('nextTight (ventana baja por zoom alto)', () => {
  it('no se activa en los tamaños habituales (barras medidas en Chromium)', () => {
    // [alto de barras, alto de ventana]: reproductor en 390×844, 820×1180, 1180×820, 640×512, 320×568
    // y pantallas generales en 390×844 y 640×512.
    for (const [bars, h] of [[279, 844], [197, 1180], [197, 820], [237, 512], [251, 568], [169, 844], [169, 512]]) {
      expect(nextTight(false, bars, h)).toBe(false);
    }
  });

  it('se activa cuando las barras ocupan más de la mitad (400 % ≈ 320×256)', () => {
    expect(nextTight(false, 251, 256)).toBe(true); // reproductor
    expect(nextTight(false, 169, 256)).toBe(true); // pantallas generales
  });

  it('tiene histéresis: entra por encima del 50 % y sale por debajo del 45 %', () => {
    expect(TIGHT_ENTER).toBeGreaterThan(TIGHT_LEAVE);
    expect(nextTight(false, 48, 100)).toBe(false);
    expect(nextTight(true, 48, 100)).toBe(true); // ya era baja: se mantiene entre 45 % y 50 %
    expect(nextTight(true, 44, 100)).toBe(false);
    expect(nextTight(false, 51, 100)).toBe(true);
  });

  it('sin altura de ventana conocida no cambia de estado', () => {
    expect(nextTight(true, 100, 0)).toBe(true);
    expect(nextTight(false, 100, 0)).toBe(false);
  });

  it('con una sola barra (pantallas generales desde la fase 19) se activa con la cabecera a 400 %', () => {
    const t = (bars: number, h: number, was = false) => nextTight(was, bars, h, SINGLE_BAR.enter, SINGLE_BAR.leave);
    expect(t(72, 256)).toBe(true); // 320×256: la cabecera ocupa ≈ 28 %
    for (const [bars, h] of [[72, 844], [72, 512], [72, 568], [72, 820], [130, 568]]) expect(t(bars, h)).toBe(false);
    expect(t(55, 256, true)).toBe(true); // histéresis: entre 20 % y 25 % se mantiene
    expect(t(50, 256, true)).toBe(false);
  });
});
