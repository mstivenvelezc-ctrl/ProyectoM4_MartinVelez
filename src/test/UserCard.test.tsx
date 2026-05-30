    // src/test/email.service.test.ts
    import { describe, it, expect, vi, beforeEach } from 'vitest';
    import { enviarResumenEmail } from '../email-services';
    import type { Tarea } from '../Tareas.types';

    const tareasMock: Tarea[] = [
    {
        id:          '1',
        titulo:      'Tarea de prueba',
        descripcion: 'Descripción de prueba',
        fechaHora:   new Date('2025-06-01T10:00:00'),
        fechaEntrega: new Date('2025-06-10T18:00:00'),
        estado:      'normal',
        completada:  false,
    },
    {
        id:          '2',
        titulo:      'Tarea completada',
        descripcion: 'Esta ya fue hecha',
        fechaHora:   new Date('2025-06-01T09:00:00'),
        estado:      'completada',
        completada:  true,
    },
    ];

    describe('enviarResumenEmail', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('llama a fetch con los parámetros correctos', async () => {
        const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ message: 'ok' }), { status: 200 })
        );

        await enviarResumenEmail('test@email.com', 'Martín', tareasMock);

        expect(fetchMock).toHaveBeenCalledOnce();
        expect(fetchMock).toHaveBeenCalledWith(
        '/api/send-email',
        expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: expect.stringContaining('test@email.com'),
        })
        );
    });

    it('el body enviado incluye el nombre del usuario', async () => {
        const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ message: 'ok' }), { status: 200 })
        );

        await enviarResumenEmail('test@email.com', 'Martín', tareasMock);

        const llamada   = fetchMock.mock.calls[0];
        const bodyEnviado = JSON.parse(llamada[1]?.body as string);
        expect(bodyEnviado.body).toContain('Martín');
    });

    it('el resumen incluye estadísticas correctas', async () => {
        const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ message: 'ok' }), { status: 200 })
        );

        await enviarResumenEmail('test@email.com', 'Martín', tareasMock);

        const bodyEnviado = JSON.parse(fetchMock.mock.calls[0][1]?.body as string);
        expect(bodyEnviado.body).toContain('Total:       2');
        expect(bodyEnviado.body).toContain('Completadas: 1');
    });

    it('lanza error si el servidor responde con error', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
        new Response(JSON.stringify({ error: 'Error de SES' }), { status: 500 })
        );

        await expect(
        enviarResumenEmail('test@email.com', 'Martín', tareasMock)
        ).rejects.toThrow('Error de SES');
    });
});
