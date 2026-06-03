    // src/test/EmailResumenBtn.test.tsx
    import { describe, it, expect, vi, beforeEach } from 'vitest';
    import { render, screen, waitFor } from '@testing-library/react';
    import userEvent from '@testing-library/user-event';
    import type { Tarea } from '../Tareas.types';

    vi.mock('../Routes/UseAuth', () => ({
    useAuth: () => ({
        user: {
        nombre:   'Martín',
        apellido: 'Vélez',
        correo:   'martin@email.com',
        edad:     22,
        },
    }),
    }));

    vi.mock('../email.service', () => ({
    enviarResumenEmail: vi.fn(),
    }));

    vi.mock('sweetalert2', () => ({
    default: {
        fire: vi.fn().mockResolvedValue({ isConfirmed: true }),
    },
    }));

    import EmailResumenBtn from '../EmailResumenBtn';
    import { enviarResumenEmail } from '../email.service';
    import Swal from 'sweetalert2';

    const tareasMock: Tarea[] = [
    {
        id:          '1',
        titulo:      'Tarea test',
        descripcion: 'Descripción test',
        fechaHora:   new Date(),
        estado:      'normal',
        completada:  false,
    },
    ];

    describe('EmailResumenBtn', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renderiza el botón correctamente', () => {
        render(<EmailResumenBtn tareas={tareasMock} />);
        expect(screen.getByRole('button', { name: /enviar resumen/i })).toBeInTheDocument();
    });

    it('muestra alerta de "sin tareas" si la lista está vacía', async () => {
        render(<EmailResumenBtn tareas={[]} />);
        await userEvent.click(screen.getByRole('button'));
        expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Sin tareas' })
        );
        expect(enviarResumenEmail).not.toHaveBeenCalled();
    });

    it('muestra confirmación antes de enviar', async () => {
        render(<EmailResumenBtn tareas={tareasMock} />);
        await userEvent.click(screen.getByRole('button'));
        expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({ title: '¿Enviar resumen?' })
        );
    });

    it('llama a enviarResumenEmail si el usuario confirma', async () => {
        vi.mocked(Swal.fire).mockResolvedValueOnce({ isConfirmed: true } as never);
        vi.mocked(enviarResumenEmail).mockResolvedValueOnce(undefined);

        render(<EmailResumenBtn tareas={tareasMock} />);
        await userEvent.click(screen.getByRole('button'));

        await waitFor(() => {
        expect(enviarResumenEmail).toHaveBeenCalledWith(
            'martin@email.com',
            'Martín',
            tareasMock
        );
        });
    });

    it('NO llama a enviarResumenEmail si el usuario cancela', async () => {
        vi.mocked(Swal.fire).mockResolvedValueOnce({ isConfirmed: false } as never);

        render(<EmailResumenBtn tareas={tareasMock} />);
        await userEvent.click(screen.getByRole('button'));

        await waitFor(() => {
        expect(enviarResumenEmail).not.toHaveBeenCalled();
        });
    });

    it('muestra alerta de error si enviarResumenEmail falla', async () => {
        vi.mocked(Swal.fire).mockResolvedValueOnce({ isConfirmed: true } as never);
        vi.mocked(enviarResumenEmail).mockRejectedValueOnce(new Error('Error SES'));

        render(<EmailResumenBtn tareas={tareasMock} />);
        await userEvent.click(screen.getByRole('button'));

        await waitFor(() => {
        expect(Swal.fire).toHaveBeenCalledWith(
            expect.objectContaining({ title: 'Error al enviar' })
        );
        });
    });
    });