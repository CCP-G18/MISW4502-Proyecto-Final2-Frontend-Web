import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter as Router, MemoryRouter, Routes, Route } from 'react-router';
import { AuthProvider } from '../context/AuthContext';
import Login from '../pages/Login';
import Logout from '../pages/Logout';

describe('Login Page', () => {
    const renderWithContext = () => {
        return render(
            <AuthProvider>
                <Router>
                    <Login />
                </Router>
            </AuthProvider>
        );
    };

    describe('cuando se renderiza', () => {
        it('debería mostrar los inputs y el botón habilitado con datos', () => {
            renderWithContext();

            const emailInput = screen.getByLabelText(/usuario/i);
            const passwordInput = screen.getByLabelText(/contraseña/i);
            const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });

            fireEvent.change(emailInput, { target: { value: 'admin@admin.com' } });
            fireEvent.change(passwordInput, { target: { value: '123' } });

            expect(emailInput.value).toBe('admin@admin.com');
            expect(passwordInput.value).toBe('123');
            expect(submitButton.disabled).toBe(false);
        });
    });

    describe('cuando el login es exitoso', () => {
        it('debería llamar a login con las credenciales correctas', async () => {
            renderWithContext();

            fireEvent.change(screen.getByLabelText(/usuario/i), {
                target: { value: 'admin@admin.com' },
            });
            fireEvent.change(screen.getByLabelText(/contraseña/i), {
                target: { value: '123' },
            });
            fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

            await waitFor(() => {
                expect(localStorage.getItem('token')).not.toBeNull();
            });
        });
    });

    describe('cuando el login falla', () => {
        it('debería mostrar un mensaje de error', async () => {
            renderWithContext();

            fireEvent.change(screen.getByLabelText(/usuario/i), {
                target: { value: 'admin@admin.com' },
            });
            fireEvent.change(screen.getByLabelText(/contraseña/i), {
                target: { value: 'wrongpass' },
            });
            fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }));

            const errorMessage = await screen.findByText(/Credenciales inválidas/i);
            expect(errorMessage).to.exist;
        });
    });
});

describe('Logout Page', () => {
    it('debería llamar a logout automáticamente al renderizarse', async () => {
        localStorage.setItem('token', '1234');

        render(
            <AuthProvider>
                <MemoryRouter initialEntries={['/logout']}>
                    <Routes>
                        <Route path="/logout" element={<Logout />} />
                        <Route path="/login" element={<Login />} />
                    </Routes>
                </MemoryRouter>
            </AuthProvider>
        );

        await waitFor(() => {
            expect(localStorage.getItem('token')).toBeNull();
            expect(screen.getByText('Login')).to.exist;
        });
    });
});