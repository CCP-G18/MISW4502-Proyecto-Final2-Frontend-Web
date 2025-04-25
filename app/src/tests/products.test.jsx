import { MemoryRouter } from "react-router";
import { render, waitFor, screen } from "@testing-library/react";
import { NotificationProvider } from "../context/NotificationContext";
import Products from "../pages/Products";
import { vi } from "vitest";
import * as api from '../api/products';


describe("Products Page", () => {
    const renderWithContext = () => {
        return render(
            <NotificationProvider>
                <MemoryRouter>
                    <Products />
                </MemoryRouter>
            </NotificationProvider>
        );
    };

    beforeEach(() => {
        vi.restoreAllMocks();
    });

    describe('cuando la página se carga correctamente', () => {
        it('debería mostrar la lista de productos', async () => {
            vi.spyOn(api, 'getProducts').mockResolvedValue([
                {
                    name: 'Avena',
                    quantity: "3",
                    unit_amount: '15000',
                },
            ]);

            renderWithContext();

            await waitFor(() => {
                expect(screen.getByText('Avena')).toBeDefined();
                expect(screen.getByText('3')).toBeDefined();
                expect(screen.getByText('$ 15.000')).toBeDefined();
            });
        });
    });

    describe('cuando la página está cargando', () => {
        it('debería mostrar el loader', async () => {
            vi.spyOn(api, 'getProducts').mockImplementation(
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
            vi.spyOn(api, 'getProducts').mockRejectedValue(new Error('Error al cargar'));

            renderWithContext();

            await waitFor(() => {
                expect(screen.getByText(/No se encontraron productos/i)).toBeDefined();
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