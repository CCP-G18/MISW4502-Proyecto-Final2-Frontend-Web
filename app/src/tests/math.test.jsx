import { describe, expect, it } from 'vitest';

function suma(a, b) {
    return a + b;
}

describe('Pruebas de funciones matemáticas', () => {
    it('Debe sumar dos números correctamente', () => {
      expect(suma(2, 3)).toBe(5);
    });
  
    it('Debe sumar números negativos', () => {
      expect(suma(-2, -3)).toBe(-5);
    });
});