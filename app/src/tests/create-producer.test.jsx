import { vi } from 'vitest';

vi.mock('../api/producers', () => ({
  createProducer: vi.fn(),
}));

vi.mock('../api/countries', () => ({
  getCountries: vi.fn(),
}));

vi.mock('../context/NotificationContext', () => ({
  useNotification: vi.fn(),
}));

import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, beforeEach, expect } from 'vitest';
import CreateProducer from '../pages/CreateProducer';
import { useNotification } from '../context/NotificationContext';
import { createProducer } from '../api/producers';
import { getCountries } from '../api/countries';

describe('Componente CrearFabricante', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useNotification.mockReturnValue({ showNotification: vi.fn() });
  });

  it('debería renderizar correctamente los campos del formulario', async () => {

    render(
      <MemoryRouter>
        <CreateProducer />
      </MemoryRouter>
    );

    expect(await screen.findByPlaceholderText('Ingresa el nombre del fabricante')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingresa la dirección del fabricante')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingresa el correo del fabricante')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingresa el telefono del fabricante')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingresa el sitio web del fabricante')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingresa el nombre del contacto principal')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingresa el apellido del contacto principal')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingresa el teléfono del contacto principal')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ingresa el correo del contacto principal')).toBeInTheDocument();
    expect(screen.getByTestId('country-select')).toBeInTheDocument();
  });

  it('debería mostrar errores de validación al enviar el formulario vacío', async () => {
    render(
      <MemoryRouter>
        <CreateProducer />
      </MemoryRouter>
    );

    const submitButton = screen.getByRole('button', { name: /crear/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('El nombre del fabricante es requerido')).toBeInTheDocument();
      expect(screen.getByText('El país del fabricante es requerido')).toBeInTheDocument();
      expect(screen.getByText('La direccion del fabricante es requerido')).toBeInTheDocument();
      expect(screen.getByText('El correo del fabricante es requerido')).toBeInTheDocument();
      expect(screen.getByText('El telefono del fabricante es requerido')).toBeInTheDocument();
      expect(screen.getByText('El sitio web del fabricante es requerido')).toBeInTheDocument();
      expect(screen.getByText('El nombre de contacto del fabricante es requerido')).toBeInTheDocument();
      expect(screen.getByText('El apellido de contacto del fabricante es requerido')).toBeInTheDocument();
      expect(screen.getByText('El telefono de contacto del fabricante es requerido')).toBeInTheDocument();
      expect(screen.getByText('El correo de contacto del fabricante es requerido')).toBeInTheDocument();
    });
  });

  it('debería crear el fabricante cuando el formulario es válido', async () => {
    createProducer.mockResolvedValue({});
    getCountries.mockResolvedValue([{ id: '1', name: 'País 1' }]);

    render(
      <MemoryRouter>
        <CreateProducer />
      </MemoryRouter>
    );

    fireEvent.change(await screen.findByPlaceholderText('Ingresa el nombre del fabricante'), { target: { value: 'Fabricante Test' } });
    fireEvent.change(screen.getByPlaceholderText('Ingresa la dirección del fabricante'), { target: { value: 'Calle Falsa 123' } });
    fireEvent.change(screen.getByPlaceholderText('Ingresa el correo del fabricante'), { target: { value: 'fabricante@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Ingresa el telefono del fabricante'), { target: { value: '123456789' } });
    fireEvent.change(screen.getByPlaceholderText('Ingresa el sitio web del fabricante'), { target: { value: 'https://fabricante.com' } });
    fireEvent.change(screen.getByPlaceholderText('Ingresa el nombre del contacto principal'), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByPlaceholderText('Ingresa el apellido del contacto principal'), { target: { value: 'Pérez' } });
    fireEvent.change(screen.getByPlaceholderText('Ingresa el teléfono del contacto principal'), { target: { value: '987654321' } });
    fireEvent.change(screen.getByPlaceholderText('Ingresa el correo del contacto principal'), { target: { value: 'contacto@example.com' } });
    fireEvent.change(screen.getByTestId('country-select'), { target: { value: 'País 1' } });


    const submitButton = screen.getByRole('button', { name: /crear/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createProducer).toHaveBeenCalledOnce();
      expect(createProducer).toHaveBeenCalledWith({
        name: 'Fabricante Test',
        address: 'Calle Falsa 123',
        email: 'fabricante@example.com',
        phone: '123456789',
        website: 'https://fabricante.com',
        contact_name: 'Juan',
        contact_lastname: 'Pérez',
        contact_phone: '987654321',
        contact_email: 'contacto@example.com',
        country: 'País 1',
      });
    });
  });

  it('debería mostrar una notificación de error cuando falle la creación del fabricante', async () => {
    const mockShowNotification = vi.fn();
    useNotification.mockReturnValue({ showNotification: mockShowNotification });

    getCountries.mockResolvedValue([{ id: '1', name: 'País 1' }]);

    createProducer.mockRejectedValue(new Error('Error de API'));

    render(
      <MemoryRouter>
        <CreateProducer />
      </MemoryRouter>
    );

    fireEvent.change(await screen.findByPlaceholderText('Ingresa el nombre del fabricante'), { target: { value: 'Fabricante Test' } });
    fireEvent.change(screen.getByPlaceholderText('Ingresa la dirección del fabricante'), { target: { value: 'Calle Falsa 123' } });
    fireEvent.change(screen.getByPlaceholderText('Ingresa el correo del fabricante'), { target: { value: 'fabricante@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Ingresa el telefono del fabricante'), { target: { value: '123456789' } });
    fireEvent.change(screen.getByPlaceholderText('Ingresa el sitio web del fabricante'), { target: { value: 'https://fabricante.com' } });
    fireEvent.change(screen.getByPlaceholderText('Ingresa el nombre del contacto principal'), { target: { value: 'Juan' } });
    fireEvent.change(screen.getByPlaceholderText('Ingresa el apellido del contacto principal'), { target: { value: 'Pérez' } });
    fireEvent.change(screen.getByPlaceholderText('Ingresa el teléfono del contacto principal'), { target: { value: '987654321' } });
    fireEvent.change(screen.getByPlaceholderText('Ingresa el correo del contacto principal'), { target: { value: 'contacto@example.com' } });
    fireEvent.change(screen.getByTestId('country-select'), { target: { value: 'País 1' } });

    const submitButton = screen.getByRole('button', { name: /crear/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockShowNotification).toHaveBeenCalledOnce();
      expect(mockShowNotification).toHaveBeenCalledWith(
        'error',
        'Error al crear el fabricante!',
        'Error de API'
      );
    });
  });
});
