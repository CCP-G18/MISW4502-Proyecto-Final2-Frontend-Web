import '@testing-library/jest-dom';
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import CreateProductMassive from '../pages/CreateProductMassive';
import { useNotification } from '../context/NotificationContext';
import { productUploadPreview, productsBulkSave } from '../api/products';

vi.mock('../context/NotificationContext', () => ({
    useNotification: vi.fn(),
}));

vi.mock('../api/products', () => ({
    productUploadPreview: vi.fn(),
    productsBulkSave: vi.fn(),
}));

describe('Componente CreateProductMassive', () => {
    const mockShowNotification = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        useNotification.mockReturnValue({ showNotification: mockShowNotification });
    });

    it('debería mostrar error si no se selecciona archivo', async () => {
        render(
            <MemoryRouter>
                <CreateProductMassive />
            </MemoryRouter>
        );

        const button = screen.getByRole('button', { name: /Cargar Archivo/i });
        fireEvent.click(button);

        expect(await screen.findByText(/Debes adjuntar el archivo!/i)).toBeInTheDocument();
    });

    it('debería cargar productos válidos y mostrarlos en la tabla', async () => {
        productUploadPreview.mockResolvedValue({
            data: {
                data: {
                    validos: [
                        { name: 'Producto Test', manufacturer_name: 'Fabricante', quantity: 10, amount_unit: 1000 },
                    ],
                    errores: [],
                }
            }
        });

        render(
            <MemoryRouter>
                <CreateProductMassive />
            </MemoryRouter>
        );

        const file = new File(['contenido'], 'productos.csv', { type: 'text/csv' });
        const input = screen.getByLabelText(/Archivo excel de productos/i);
        fireEvent.change(input, { target: { files: [file] } });

        fireEvent.click(screen.getByRole('button', { name: /Cargar Archivo/i }));

        await waitFor(() => {
            expect(mockShowNotification).toHaveBeenCalledWith(
                'success',
                'Cargue masivo de productos',
                'Productos validados correctamente!'
            );
            expect(screen.getByText(/Producto Test/)).toBeInTheDocument();
        });
    });

    it('debería mostrar notificación de error si hay productos inválidos', async () => {
        productUploadPreview.mockResolvedValue({
            data: {
                data: {
                    validos: [],
                    errores: [{ name: '', errores: ['Campo vacío'] }]
                }
            }
        });

        render(
            <MemoryRouter>
                <CreateProductMassive />
            </MemoryRouter>
        );

        const file = new File([''], 'vacío.csv', { type: 'text/csv' });
        const input = screen.getByLabelText(/Archivo excel de productos/i);
        fireEvent.change(input, { target: { files: [file] } });

        fireEvent.click(screen.getByRole('button', { name: /Cargar Archivo/i }));

        await waitFor(() => {
            expect(mockShowNotification).toHaveBeenCalledWith(
                'error',
                'Cargue masivo de productos',
                'No se pudieron procesar algunos productos'
            );
        });
    });

    it('debería guardar productos correctamente al hacer clic en Guardar Productos', async () => {
        const productos = [{ name: 'Producto Test', manufacturer_name: 'Fabricante', quantity: 10, amount_unit: 1000 }];

        productUploadPreview.mockResolvedValue({
            data: { data: { validos: productos, errores: [] } }
        });

        productsBulkSave.mockResolvedValue({
            data: { message: 'Guardado con éxito' }
        });

        render(
            <MemoryRouter>
                <CreateProductMassive />
            </MemoryRouter>
        );

        const file = new File(['ok'], 'productos.csv', { type: 'text/csv' });
        const input = screen.getByLabelText(/Archivo excel de productos/i);
        fireEvent.change(input, { target: { files: [file] } });
        fireEvent.click(screen.getByRole('button', { name: /Cargar Archivo/i }));

        await screen.findByText(/Producto Test/);

        fireEvent.click(screen.getByRole('button', { name: /Guardar Productos/i }));

        await waitFor(() => {
            expect(productsBulkSave).toHaveBeenCalledWith(productos);
            expect(mockShowNotification).toHaveBeenCalledWith(
                'success',
                'Cargue masivo de productos',
                'Guardado con éxito'
            );
        });
    });
});
