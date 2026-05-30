    // src/test/tareas.helpers.test.ts
    import { describe, it, expect } from 'vitest';
    import { calcularEstado, formatearFecha, validarTarea } from '../Tareas.helpers';

    describe('calcularEstado', () => {
    it('retorna "normal" si no hay fecha de entrega', () => {
        expect(calcularEstado(undefined)).toBe('normal');
    });

    it('retorna "perdida" si la fecha de entrega ya pasó', () => {
        const pasado = new Date(Date.now() - 48 * 60 * 60 * 1000);
        expect(calcularEstado(pasado)).toBe('perdida');
    });

    it('retorna "prioridad" si faltan menos de 24 horas', () => {
        const pronto = new Date(Date.now() + 12 * 60 * 60 * 1000);
        expect(calcularEstado(pronto)).toBe('prioridad');
    });

    it('retorna "normal" si faltan más de 24 horas', () => {
        const lejos = new Date(Date.now() + 72 * 60 * 60 * 1000);
        expect(calcularEstado(lejos)).toBe('normal');
    });
    });

    describe('formatearFecha', () => {
    it('retorna una cadena no vacía', () => {
        const resultado = formatearFecha(new Date('2025-06-15T10:30:00'));
        expect(typeof resultado).toBe('string');
        expect(resultado.length).toBeGreaterThan(0);
    });

    it('incluye el año en el resultado', () => {
        const resultado = formatearFecha(new Date('2025-06-15T10:30:00'));
        expect(resultado).toContain('2025');
    });
    });

    describe('validarTarea', () => {
    it('retorna error si título está vacío', () => {
        expect(validarTarea('', 'descripcion valida', '')).toBeTruthy();
    });

    it('retorna error si título tiene menos de 3 caracteres', () => {
        expect(validarTarea('ab', 'descripcion valida', '')).toMatch(/3 caracteres/);
    });

    it('retorna error si descripción está vacía', () => {
        expect(validarTarea('Título válido', '', '')).toBeTruthy();
    });

    it('retorna error si descripción tiene menos de 5 caracteres', () => {
        expect(validarTarea('Título válido', 'abc', '')).toMatch(/5 caracteres/);
    });

    it('retorna error si descripción supera 200 caracteres', () => {
        const larga = 'a'.repeat(201);
        expect(validarTarea('Título válido', larga, '')).toMatch(/200 caracteres/);
    });

    it('retorna null si todos los campos son válidos sin fecha', () => {
        expect(validarTarea('Título válido', 'Descripción válida', '')).toBeNull();
    });

    it('retorna error si la fecha de entrega es anterior a hoy', () => {
        const ayer = new Date(Date.now() - 24 * 60 * 60 * 1000)
        .toISOString().slice(0, 16);
        expect(validarTarea('Título válido', 'Descripción válida', ayer)).toMatch(/anterior/);
    });

    it('retorna null con fecha de entrega futura válida', () => {
        const futuro = new Date(Date.now() + 48 * 60 * 60 * 1000)
        .toISOString().slice(0, 16);
        expect(validarTarea('Título válido', 'Descripción válida', futuro)).toBeNull();
    });
    });