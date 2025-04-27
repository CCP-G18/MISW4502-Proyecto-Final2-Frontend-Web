import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import CreateSalesPlan from '../pages/CreateSalesPlan';
import { useNotification } from '../context/NotificationContext';
import * as sellersApi from '../api/sellers';

vi.mock('../context/NotificationContext', () => ({
  useNotification: vi.fn(),
}));

vi.mock('../api/sellers', () => ({
  createSalesPlanBySeller: vi.fn(),
}));

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('Componente CreateSalesPlan', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNotification.mockReturnValue({ showNotification: vi.fn() });
  });

  it('debería renderizar los campos del formulario', () => {
    render(
      <MemoryRouter initialEntries={['/vendedores/planes-venta/crear/seller123']}>
        <Routes>
          <Route path="/vendedores/planes-venta/crear/:sellerId" element={<CreateSalesPlan />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByLabelText('Fecha de inicio')).toBeTruthy();
    expect(screen.getByLabelText('Fecha de finalización')).toBeTruthy();
    expect(screen.getByLabelText('Metas de Ventas')).toBeTruthy();
    expect(screen.getByRole('button', { name: /crear/i })).toBeTruthy();
  });

  it('debería mostrar errores de validación al intentar enviar vacío', async () => {
    render(
      <MemoryRouter initialEntries={['/vendedores/planes-venta/crear/seller123']}>
        <Routes>
          <Route path="/vendedores/planes-venta/crear/:sellerId" element={<CreateSalesPlan />} />
        </Routes>
      </MemoryRouter>
    );

    const submitButton = screen.getByRole('button', { name: /crear/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('La fecha de inicio es requerida')).toBeTruthy();
      expect(screen.getByText('La fecha de finalización es requerida')).toBeTruthy();
      expect(screen.getByText('El valor por unidad debe ser requerido')).toBeTruthy();
    });
  });

  it('debería llamar a createSalesPlanBySeller si el formulario es válido', async () => {
    sellersApi.createSalesPlanBySeller.mockResolvedValue({});

    render(
      <MemoryRouter initialEntries={['/vendedores/planes-venta/crear/seller123']}>
        <Routes>
          <Route path="/vendedores/planes-venta/crear/:sellerId" element={<CreateSalesPlan />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Fecha de inicio'), { target: { value: '2025-01-01' } });
    fireEvent.change(screen.getByLabelText('Fecha de finalización'), { target: { value: '2025-02-01' } });
    fireEvent.change(screen.getByLabelText('Metas de Ventas'), { target: { value: '5000' } });

    const submitButton = screen.getByRole('button', { name: /crear/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(sellersApi.createSalesPlanBySeller).toHaveBeenCalledOnce();
      expect(sellersApi.createSalesPlanBySeller).toHaveBeenCalledWith('seller123', {
        initial_date: '2025-01-01',
        end_date: '2025-02-01',
        sales_goals: '5000',
      });
    });
  });

  it('debería mostrar notificación si ocurre un error al crear el plan', async () => {
    const showNotificationMock = vi.fn();
    useNotification.mockReturnValue({ showNotification: showNotificationMock });

    sellersApi.createSalesPlanBySeller.mockRejectedValue(new Error('Error al crear'));

    render(
      <MemoryRouter initialEntries={['/vendedores/planes-venta/crear/seller123']}>
        <Routes>
          <Route path="/vendedores/planes-venta/crear/:sellerId" element={<CreateSalesPlan />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Fecha de inicio'), { target: { value: '2025-01-01' } });
    fireEvent.change(screen.getByLabelText('Fecha de finalización'), { target: { value: '2025-02-01' } });
    fireEvent.change(screen.getByLabelText('Metas de Ventas'), { target: { value: '5000' } });

    const submitButton = screen.getByRole('button', { name: /crear/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(showNotificationMock).toHaveBeenCalledOnce();
      expect(showNotificationMock).toHaveBeenCalledWith(
        'error',
        'Error al crear el producto!',
        'Error al crear'
      );
    });
  });
});
