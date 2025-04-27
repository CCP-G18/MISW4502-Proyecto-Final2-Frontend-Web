import { vi } from 'vitest';

vi.mock('../api/producers', () => ({
  getProducers: vi.fn(),
}));

vi.mock('../api/categories', () => ({
  getCategories: vi.fn(),
}));

vi.mock('../api/products', () => ({
  createProduct: vi.fn(),
}));

vi.mock('../context/NotificationContext', () => ({
  useNotification: vi.fn(),
}));

import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, beforeEach, expect } from 'vitest';
import CreateProduct from '../pages/CreateProduct';
import { useNotification } from '../context/NotificationContext';
import { getProducers } from '../api/producers';
import { getCategories } from '../api/categories';
import { createProduct } from '../api/products';

describe('Componente CrearProducto', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNotification.mockReturnValue({ showNotification: vi.fn() });
  });

  it('debería renderizar correctamente los campos del formulario', async () => {
    getProducers.mockResolvedValue([{ id: '1', name: 'Fabricante 1' }]);
    getCategories.mockResolvedValue([{ id: '1', nombre: 'Categoría 1' }]);

    render(
      <MemoryRouter>
        <CreateProduct />
      </MemoryRouter>
    );

    expect(await screen.findByPlaceholderText('Ingresa el nombre del producto')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingresa la descripción del producto')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingresa la cantidad inicial de productos')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingresa el precio unitario del producto')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingresa la url de la imagen del producto')).toBeInTheDocument();
    expect(screen.getByTestId('manufacturer-select')).toBeInTheDocument();
    expect(screen.getByTestId('category-select')).toBeInTheDocument();
  });

  it('debería mostrar errores de validación al enviar el formulario vacío', async () => {
    render(
      <MemoryRouter>
        <CreateProduct />
      </MemoryRouter>
    );

    const submitButton = screen.getByRole('button', { name: /crear/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('El nombre del producto es requerido')).toBeInTheDocument();
      expect(screen.getByText('La descripción del producto es requerida')).toBeInTheDocument();
      expect(screen.getByText('La cantidad del producto es requerido')).toBeInTheDocument();
      expect(screen.getByText('El valor por unidad debe ser requerido')).toBeInTheDocument();
      expect(screen.getByText('Se debe escoger un fabricante')).toBeInTheDocument();
      expect(screen.getByText('Se debe escoger una categoria')).toBeInTheDocument();
      expect(screen.getByText('El enlace de la imagen es requerido')).toBeInTheDocument();
    });
  });

  it('debería crear el producto cuando el formulario es válido', async () => {
    getProducers.mockResolvedValue([{ id: '1', name: 'Fabricante 1' }]);
    getCategories.mockResolvedValue([{ id: '1', nombre: 'Categoría 1' }]);
    createProduct.mockResolvedValue({});

    render(
      <MemoryRouter>
        <CreateProduct />
      </MemoryRouter>
    );

    fireEvent.change(await screen.findByPlaceholderText('Ingresa el nombre del producto'), { target: { value: 'Producto Test' } });
    fireEvent.change(screen.getByPlaceholderText('Ingresa la descripción del producto'), { target: { value: 'Descripción de prueba' } });
    fireEvent.change(screen.getByPlaceholderText('Ingresa la cantidad inicial de productos'), { target: { value: '10' } });
    fireEvent.change(screen.getByPlaceholderText('Ingresa el precio unitario del producto'), { target: { value: '5000' } });
    fireEvent.change(screen.getByPlaceholderText('Ingresa la url de la imagen del producto'), { target: { value: 'https://example.com/image.png' } });
    fireEvent.change(screen.getByTestId('manufacturer-select'), { target: { value: '1' } });
    fireEvent.change(screen.getByTestId('category-select'), { target: { value: '1' } });

    const submitButton = screen.getByRole('button', { name: /crear/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createProduct).toHaveBeenCalledOnce();
      expect(createProduct).toHaveBeenCalledWith({
        name: 'Producto Test',
        description: 'Descripción de prueba',
        quantity: '10',
        unit_amount: '5000',
        manufacturer_id: '1',
        image_url: 'https://example.com/image.png',
        category_id: '1',
      });
    });
  });

  it('debería mostrar una notificación de error cuando falle la creación del producto', async () => {
    const mockShowNotification = vi.fn();
    useNotification.mockReturnValue({ showNotification: mockShowNotification });

    getProducers.mockResolvedValue([{ id: '1', name: 'Fabricante 1' }]);
    getCategories.mockResolvedValue([{ id: '1', nombre: 'Categoría 1' }]);
    createProduct.mockRejectedValue(new Error('Error de API'));

    render(
      <MemoryRouter>
        <CreateProduct />
      </MemoryRouter>
    );

    fireEvent.change(await screen.findByPlaceholderText('Ingresa el nombre del producto'), { target: { value: 'Producto Test' } });
    fireEvent.change(screen.getByPlaceholderText('Ingresa la descripción del producto'), { target: { value: 'Descripción de prueba' } });
    fireEvent.change(screen.getByPlaceholderText('Ingresa la cantidad inicial de productos'), { target: { value: '10' } });
    fireEvent.change(screen.getByPlaceholderText('Ingresa el precio unitario del producto'), { target: { value: '5000' } });
    fireEvent.change(screen.getByPlaceholderText('Ingresa la url de la imagen del producto'), { target: { value: 'https://example.com/image.png' } });
    fireEvent.change(screen.getByTestId('manufacturer-select'), { target: { value: '1' } });
    fireEvent.change(screen.getByTestId('category-select'), { target: { value: '1' } });

    const submitButton = screen.getByRole('button', { name: /crear/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowNotification).toHaveBeenCalledOnce();
      expect(mockShowNotification).toHaveBeenCalledWith(
        'error',
        'Error al crear el producto!',
        'Error de API'
      );
    });
  });
});
