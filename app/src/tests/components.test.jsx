import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router';
import Footer from '../components/Footer';
import Breadcrumb from '../components/Breadcrumb';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

describe('Footer Component', () => {
    it('debería mostrar el texto de copyright', () => {
        render(<Footer />);

        expect(screen.getByText(/Copyright CCP/i)).toBeDefined();
        expect(screen.getByText(/© 2025/i)).toBeDefined();
    });

    it('debería mostrar el texto del sitio web', () => {
        render(<Footer />);

        expect(screen.getByText(/Sitio web logístico/i)).toBeDefined();
    });
});

describe('Breadcrumb Component', () => {
    it('debería mostrar solo "Inicio" cuando está en la ruta raíz', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Breadcrumb />
            </MemoryRouter>
        );

        expect(screen.getByText('Inicio')).toBeDefined();
    });

    it('debería mostrar "Inicio / Vendedores" cuando está en /vendedores', () => {
        render(
            <MemoryRouter initialEntries={['/vendedores']}>
                <Breadcrumb />
            </MemoryRouter>
        );

        expect(screen.getByText('Inicio')).toBeDefined();
        expect(screen.getByText('Vendedores')).toBeDefined();
    });

    it('debería mostrar rutas anidadas correctamente', () => {
        render(
            <MemoryRouter initialEntries={['/vendedores/crear']}>
                <Breadcrumb />
            </MemoryRouter>
        );

        expect(screen.getByText('Inicio')).toBeDefined();
        expect(screen.getByText('Vendedores')).toBeDefined();
        expect(screen.getByText('Crear')).toBeDefined();
    });
});

describe('Sidebar Component', () => {
    it('debería renderizar el título CCP y los enlaces de navegación', () => {
        render(
            <MemoryRouter>
                <Sidebar />
            </MemoryRouter>
        );

        expect(screen.getByText('CCP')).toBeDefined();

        expect(screen.getByText('Fabricantes')).toBeDefined();
        expect(screen.getByText('Vendedores')).toBeDefined();
        expect(screen.getByText('Productos')).toBeDefined();
        expect(screen.getByText('Rutas de entrega')).toBeDefined();
    });
});

describe('Topbar Component', () => {
    it('debería renderizar el Breadcrumb y el enlace de cierre de sesión', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Topbar />
            </MemoryRouter>
        );

        expect(screen.getByText('Inicio')).toBeDefined();

        const logoutLink = screen.getByText(/cerrar sesión/i);
        expect(logoutLink).toBeDefined();
        expect(logoutLink.getAttribute('href')).toBe('/logout');
    });
});