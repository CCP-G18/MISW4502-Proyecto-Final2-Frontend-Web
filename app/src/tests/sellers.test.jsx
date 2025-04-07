import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, vi, beforeEach, expect } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router';
import { NotificationProvider } from '../context/NotificationContext';
import Sellers from '../pages/Sellers';
import CreateSeller from '../pages/CreateSeller';
import * as api from '../api/sellers';

describe('Sellers Page', () => {
    const renderWithContext = () => {
        return render(
            <NotificationProvider>
                <MemoryRouter>
                    <Sellers />
                </MemoryRouter>
            </NotificationProvider>
        );
    };

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    describe('cuando la página se carga correctamente', () => {
        it('debería mostrar la lista de vendedores', async () => {
            vi.spyOn(api, 'getSellers').mockResolvedValue([
                {
                    name: 'Juan Pérez',
                    email: 'juan@example.com',
                    assigned_area: 'Zona Norte',
                    updated_at: '2024-01-01T00:00:00Z',
                },
            ]);

            renderWithContext();

            await waitFor(() => {
                expect(screen.getByText('Juan Pérez')).toBeDefined();
                expect(screen.getByText('juan@example.com')).toBeDefined();
                expect(screen.getByText('Zona Norte')).toBeDefined();
            });
        });
    });

    describe('cuando la página está cargando', () => {
        it('debería mostrar el loader', async () => {
            vi.spyOn(api, 'getSellers').mockImplementation(
                () =>
                    new Promise((resolve) => {
                        setTimeout(() => resolve([]), 1000);
                    })
            );

            renderWithContext();

            expect(screen.getByText(/Cargando datos.../i)).toBeDefined();
        });
    });

    describe('cuando ocurre un error al cargar', () => {
        it('debería mostrar un mensaje de error', async () => {
            vi.spyOn(api, 'getSellers').mockRejectedValue(new Error('Error al cargar'));

            renderWithContext();

            await waitFor(() => {
                expect(screen.getByText(/No se encontraron vendedores/i)).toBeDefined();
            });
        });
    });
});

vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router');
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});

describe('CreateSeller Page', () => {
    const mockNavigate = vi.fn();

    const renderWithContext = () => {
        return render(
            <NotificationProvider>
                <MemoryRouter>
                    <CreateSeller />
                </MemoryRouter>
            </NotificationProvider>
        );
    };

    beforeEach(() => {
        vi.restoreAllMocks();
        vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    });

    describe('cuando se completa correctamente el formulario', () => {
        it('debería enviar el formulario y redirigir al usuario', async () => {
            vi.spyOn(api, 'createSeller').mockResolvedValue({});

            renderWithContext();

            fireEvent.change(screen.getByPlaceholderText(/nombre del vendedor/i), {
                target: { value: 'Carlos', name: 'name' },
            });

            fireEvent.change(screen.getByPlaceholderText(/apellido del vendedor/i), {
                target: { value: 'López', name: 'lastname' },
            });

            fireEvent.change(screen.getByPlaceholderText(/correo electrónico del vendedor/i), {
                target: { value: 'carlos@example.com', name: 'email' },
            });

            fireEvent.change(screen.getByPlaceholderText(/zona del vendedor/i), {
                target: { value: 'Centro', name: 'assignedArea' },
            });

            fireEvent.click(screen.getByRole('button', { name: /crear/i }));

            await waitFor(() => {
                expect(api.createSeller).toHaveBeenCalledWith({
                    name: 'Carlos',
                    lastname: 'López',
                    email: 'carlos@example.com',
                    assignedArea: 'Centro',
                });

                expect(mockNavigate).toHaveBeenCalledWith('/vendedores', expect.anything());
            });
        });
    });

    describe('cuando hay errores de validación', () => {
        it('debería mostrar mensajes de error en campos vacíos', async () => {
            renderWithContext();

            fireEvent.click(screen.getByRole('button', { name: /crear/i }));

            expect(await screen.findByText(/nombre es requerido/i)).toBeDefined();
            expect(screen.getByText(/apellido es requerido/i)).toBeDefined();
            expect(screen.getByText(/correo electrónico es requerido/i)).toBeDefined();
            expect(screen.getByText(/zona asignada es requerida/i)).toBeDefined();
        });

        it('debería mostrar error si el correo es inválido', async () => {
            renderWithContext();

            fireEvent.change(screen.getByPlaceholderText(/correo electrónico del vendedor/i), {
                target: { value: 'correo@malo', name: 'email' },
            });

            fireEvent.click(screen.getByRole('button', { name: /crear/i }));

            expect(await screen.findByText(/correo inválido/i)).toBeDefined();
        });
    });

    describe('cuando ocurre un error en la API', () => {
        it('debería mostrar una notificación de error', async () => {
            vi.spyOn(api, 'createSeller').mockRejectedValue(new Error('Algo salió mal'));

            renderWithContext();

            fireEvent.change(screen.getByPlaceholderText(/nombre del vendedor/i), {
                target: { value: 'Carlos', name: 'name' },
            });

            fireEvent.change(screen.getByPlaceholderText(/apellido del vendedor/i), {
                target: { value: 'López', name: 'lastname' },
            });

            fireEvent.change(screen.getByPlaceholderText(/correo electrónico del vendedor/i), {
                target: { value: 'carlos@example.com', name: 'email' },
            });

            fireEvent.change(screen.getByPlaceholderText(/zona del vendedor/i), {
                target: { value: 'Centro', name: 'assignedArea' },
            });

            fireEvent.click(screen.getByRole('button', { name: /crear/i }));

            await waitFor(() => {
                expect(screen.getByText(/error al crear el vendedor/i)).toBeDefined();
                expect(screen.getByText(/algo salió mal/i)).toBeDefined();
            });
        });
    });
});