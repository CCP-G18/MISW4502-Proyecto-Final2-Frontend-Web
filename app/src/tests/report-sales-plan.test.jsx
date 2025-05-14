import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import ReportSalesPlan from '../pages/ReportSalesPlan';
import { useNotification } from '../context/NotificationContext';
import * as sellersApi from '../api/sellers';

vi.mock('../context/NotificationContext', () => ({
    useNotification: vi.fn(),
}));

vi.mock('../api/sellers', () => ({
    generateReportSeller: vi.fn(),
}));

describe('Componente ReportSalesPlan', () => {
    const sellerMock = {
        id: 'seller123',
        name: 'Juan Pérez',
        email: 'juan@example.com',
        assigned_area: 'Zona Norte'
    };

    beforeEach(() => {
        vi.clearAllMocks();
        useNotification.mockReturnValue({ showNotification: vi.fn() });
    });

    it('debería mostrar el loader mientras carga el reporte', async () => {
        sellersApi.generateReportSeller.mockImplementation(() => new Promise(() => { }));

        render(
            <MemoryRouter initialEntries={[{ pathname: '/vendedores/informe', state: { seller: sellerMock } }]}>
                <Routes>
                    <Route path="/vendedores/informe" element={<ReportSalesPlan />} />
                </Routes>
            </MemoryRouter>
        );

        expect(await screen.findByText('Cargando reporte...')).toBeTruthy();
    });

    it('debería mostrar mensaje de error si falla el fetch', async () => {
        sellersApi.generateReportSeller.mockRejectedValue(new Error('Error'));

        render(
            <MemoryRouter initialEntries={[{ pathname: '/vendedores/informe', state: { seller: sellerMock } }]}>
                <Routes>
                    <Route path="/vendedores/informe" element={<ReportSalesPlan />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('No se pudo generar el informe')).toBeTruthy();
        });
    });

    it('debería renderizar correctamente los datos del vendedor y las recomendaciones', async () => {
        sellersApi.generateReportSeller.mockResolvedValue({
            data: {
                data: {
                    sales_goal: 10000,
                    achieved_amount: 7500,
                    planes: [
                        {
                            name: 'Plan 1',
                            start_date: '2025-05-01',
                            end_date: '2025-05-30',
                            sales_goal: 10000,
                            achieved_amount: 7500,
                        },
                    ]
                }
            }
        });

        render(
            <MemoryRouter initialEntries={[{ pathname: '/vendedores/informe', state: { seller: sellerMock } }]}>
                <Routes>
                    <Route path="/vendedores/informe" element={<ReportSalesPlan />} />
                </Routes>
            </MemoryRouter>
        );

        expect(await screen.findByText('Perfil del vendedor')).toBeTruthy();
        expect(screen.getByText('Nombre: Juan Pérez')).toBeTruthy();
        expect(screen.getByText('Zona Asignada: Zona Norte')).toBeTruthy();
        expect(screen.getByText('Plan 1')).toBeTruthy();
    });

    it('debería mostrar notificación si location.state lo indica', async () => {
        const showNotificationMock = vi.fn();
        useNotification.mockReturnValue({ showNotification: showNotificationMock });

        sellersApi.generateReportSeller.mockResolvedValue({
            data: { data: { sales_goal: 0, achieved_amount: 0, planes: [] } }
        });

        render(
            <MemoryRouter initialEntries={[{
                pathname: '/vendedores/informe',
                state: {
                    seller: sellerMock,
                    showNotification: true,
                    type: 'success',
                    title: 'Listo',
                    message: 'Reporte generado'
                }
            }]}
            >
                <Routes>
                    <Route path="/vendedores/informe" element={<ReportSalesPlan />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(showNotificationMock).toHaveBeenCalledWith('success', 'Listo', 'Reporte generado');
        });
    });
});
