import { MemoryRouter } from "react-router";
import { render, waitFor, screen } from "@testing-library/react";
import { NotificationProvider } from "../context/NotificationContext";
import Producers from "../pages/Producers";
import { vi } from "vitest";
import * as api from '../api/producers';


describe("Products Page", () => {
    const renderWithContext = () => {
        return render(
            <NotificationProvider>
                <MemoryRouter>
                    <Producers />
                </MemoryRouter>
            </NotificationProvider>
        );
    };

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    describe('cuando la página se carga correctamente', () => {
        it('debería mostrar la lista de fabricantes', async () => {
            vi.spyOn(api, 'getProducers').mockResolvedValue([
                {
                    name: 'Chinesse Chips',
                    country: "China",
                    email: 'chinesse@ch.com',
                },
            ]);

            renderWithContext();

            await waitFor(() => {
                expect(screen.getByText('Chinesse Chips')).toBeDefined();
                expect(screen.getByText('China')).toBeDefined();
                expect(screen.getByText('chinesse@ch.com')).toBeDefined();
            });
        });
    });

    describe('cuando la página está cargando', () => {
        it('debería mostrar el loader', async () => {
            vi.spyOn(api, 'getProducers').mockImplementation(
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
            vi.spyOn(api, 'getProducers').mockRejectedValue(new Error('Error al cargar'));

            renderWithContext();

            await waitFor(() => {
                expect(screen.getByText(/No se encontraron fabricantes/i)).toBeDefined();
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

});