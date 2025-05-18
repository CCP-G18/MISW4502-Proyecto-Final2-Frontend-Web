import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DeliveryRoutes from '../pages/DeliveryRoutes';


describe('Componente DeliveryRoutes', () => {
    beforeEach(() => {
        global.window.google = {
            maps: {
            places: {
                Autocomplete: class {
                    constructor(input, options) {
                        this.input = input;
                        this.options = options;
                    }
                    addListener = vi.fn();
                    getPlace = () => ({
                        formatted_address: 'Mocked Address'
                    });
                },
                },
                DirectionsService: class {
                    route = vi.fn((request, callback) => {
                        callback({}, 'OK');
                    });
                },
                DirectionsRenderer: class {
                    setMap = vi.fn();
                    setDirections = vi.fn();
                },
                Map: class {
                    constructor() {}
                },
                TravelMode: {
                    DRIVING: 'DRIVING',
                },
                DirectionsStatus: {
                    OK: 'OK',
                },
            },
        };
    });

    it('renderiza correctamente el título', () => {
        render(<DeliveryRoutes />);
        expect(screen.getByText('Calcular ruta de entrega')).toBeInTheDocument();
    });

    it('muestra error si se intenta enviar sin dirección de origen', async () => {
        render(<DeliveryRoutes />);
        const boton = screen.getByRole('button', { name: /Generar ruta/i });
        fireEvent.click(boton);
        expect(await screen.findByText('La direccion de origen es requerida')).toBeInTheDocument();
    });

    it('añade un nuevo destino al hacer clic en "+ Añadir destino"', () => {
        render(<DeliveryRoutes />);
        const button = screen.getByText('+ Añadir destino');
        fireEvent.click(button);
        const inputs = screen.getAllByPlaceholderText(/Destino/);
        expect(inputs.length).toBe(2);
    });

    it('renderiza el contenedor del mapa', () => {
        render(<DeliveryRoutes />);
        const mapa = screen.getByTestId('map');
        expect(mapa).toBeInTheDocument();
    });
});