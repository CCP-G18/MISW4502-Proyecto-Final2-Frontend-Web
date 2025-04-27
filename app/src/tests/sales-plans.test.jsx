import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import SalesPlan from '../pages/SalesPlan';
import { useNotification } from '../context/NotificationContext';
import * as sellersApi from '../api/sellers';

vi.mock('../context/NotificationContext', () => ({
  useNotification: vi.fn(),
}));

vi.mock('../api/sellers', () => ({
  getSalesPlanBySeller: vi.fn(),
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('Componente SalesPlan', () => {

  beforeEach(() => {
    vi.clearAllMocks();
    useNotification.mockReturnValue({ showNotification: vi.fn() });
  });

  it('debería mostrar el loader mientras carga los datos', async () => {
    sellersApi.getSalesPlanBySeller.mockImplementation(() => 
      new Promise(() => {}) // Nunca resuelve para simular loading
    );

    render(
      <MemoryRouter initialEntries={['/vendedores/planes-venta/seller123']}>
        <Routes>
          <Route path="/vendedores/planes-venta/:sellerId" element={<SalesPlan />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText('Cargando datos...')).toBeTruthy();
  });

  it('debería mostrar mensaje de error si falla la carga de datos', async () => {
    sellersApi.getSalesPlanBySeller.mockRejectedValue(new Error('Error de carga'));

    render(
      <MemoryRouter initialEntries={['/vendedores/planes-venta/seller123']}>
        <Routes>
          <Route path="/vendedores/planes-venta/:sellerId" element={<SalesPlan />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No se encontraron planes de venta para este vendedor')).toBeTruthy();
    });
  });

  it('debería mostrar los planes de venta correctamente', async () => {
    sellersApi.getSalesPlanBySeller.mockResolvedValue([
      { initial_date: '2025-04-28T00:00:00', end_date: '2025-09-29T00:00:00', sales_goals: 20000 }
    ]);

    render(
      <MemoryRouter initialEntries={['/vendedores/planes-venta/seller123']}>
        <Routes>
          <Route path="/vendedores/planes-venta/:sellerId" element={<SalesPlan />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText('Lista de planes de venta del vendedor')).toBeTruthy();
    expect(await screen.findByText('2025-04-28')).toBeTruthy();
    expect(await screen.findByText('2025-09-29')).toBeTruthy();
    expect(await screen.findByText('$ 20.000')).toBeTruthy();
  });

  it('debería mostrar mensaje si no hay planes de venta', async () => {
    sellersApi.getSalesPlanBySeller.mockResolvedValue([]);

    render(
      <MemoryRouter initialEntries={['/vendedores/planes-venta/seller123']}>
        <Routes>
          <Route path="/vendedores/planes-venta/:sellerId" element={<SalesPlan />} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText('No se encontraron resultados.')).toBeTruthy();
  });

  it('debería actualizar el filtro global al escribir en la búsqueda', async () => {
    sellersApi.getSalesPlanBySeller.mockResolvedValue([]);

    render(
      <MemoryRouter initialEntries={['/vendedores/planes-venta/seller123']}>
        <Routes>
          <Route path="/vendedores/planes-venta/:sellerId" element={<SalesPlan />} />
        </Routes>
      </MemoryRouter>
    );

    const searchInput = await screen.findByPlaceholderText('Buscar...');
    fireEvent.change(searchInput, { target: { value: 'Plan especial' } });

    expect(searchInput.value).toBe('Plan especial');
  });

  it('debería mostrar notificación si location.state lo indica', async () => {
    const showNotificationMock = vi.fn();
    useNotification.mockReturnValue({ showNotification: showNotificationMock });

    sellersApi.getSalesPlanBySeller.mockResolvedValue([]);

    render(
      <MemoryRouter initialEntries={[{ pathname: '/vendedores/planes-venta/seller123', state: { showNotification: true, type: 'success', title: 'Éxito', message: 'Plan creado correctamente' } }]}>
        <Routes>
          <Route path="/vendedores/planes-venta/:sellerId" element={<SalesPlan />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(showNotificationMock).toHaveBeenCalledWith('success', 'Éxito', 'Plan creado correctamente');
    });
  });
});
