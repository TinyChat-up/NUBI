import { expect, it } from 'vitest';
import { matchPath } from './router.tsx';
it('una URL con codificación inválida no interrumpe el router', () => {
  expect(matchPath('/historias/:id', '/historias/%E0%A4%A')).toBeNull();
  expect(matchPath('/historias/:id', '/historias/ma%C3%B1ana')).toEqual({ id: 'mañana' });
});
