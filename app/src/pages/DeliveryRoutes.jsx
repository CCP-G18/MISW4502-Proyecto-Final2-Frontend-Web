import { useEffect, useState, useRef } from 'react';

const DeliveryRoutes = () => {
    const [showMap, setShowMap] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        address: '',
        destination_addresses: [''],
    });
    const refs = useRef([]);
    refs.current = [];

    const setInputRef = (el, index) => {
        refs.current[index] = el;
    };

    const loadGoogleMapsScript = (callback) => {
        const existingScript = document.getElementById('googleMaps');

        if (!existingScript) {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
            script.id = 'googleMaps';
            document.body.appendChild(script);

            script.onload = () => {
                if (callback) callback();
            };
        } else {
            if (callback) callback();
        }
    };

    useEffect(() => {
        loadGoogleMapsScript(() => {
            if (window.google && refs.current.length) {
                const fieldNames = ['address', 'destination_address'];

                refs.current.forEach((input) => {
                    if (input) {
                        const autocomplete = new window.google.maps.places.Autocomplete(input, {
                            types: ['geocode'],
                        });

                        autocomplete.addListener('place_changed', () => {
                            const place = autocomplete.getPlace();
                            const value = place.formatted_address || '';
                            const type = input.dataset.type;
                            const index = parseInt(input.dataset.index, 10);

                            setFormData((prev) => {
                                if (type === 'destination') {
                                    const updatedDestinations = [...prev.destination_addresses];
                                    updatedDestinations[index] = value;
                                    return { ...prev, destination_addresses: updatedDestinations };
                                }

                                return {
                                    ...prev,
                                    [input.name]: value,
                                };
                            });
                        });
                    }
                });
            }
        });
    }, []);

    useEffect(() => {
        if (window.google && refs.current.length) {
            const allInputs = [formData.address, ...formData.destination_addresses];
            refs.current.forEach((input, index) => {
                if (input) {
                    const autocomplete = new window.google.maps.places.Autocomplete(input, {
                        types: ['geocode'],
                    });

                    autocomplete.addListener('place_changed', () => {
                        const place = autocomplete.getPlace();
                        const value = place.formatted_address || '';

                        if (index === 0) {
                            setFormData((prev) => ({ ...prev, address: value }));
                        } else {
                            const updated = [...formData.destination_addresses];
                            updated[index - 1] = value;
                            setFormData((prev) => ({ ...prev, destination_addresses: updated }));
                        }
                    });
                }
            });
        }
    }, [formData.destination_addresses.length]);


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.address.trim()) newErrors.address = 'La direccion de origen es requerida';

        formData.destination_addresses.forEach((dest, index) => {
            if (!dest.trim()) newErrors[`destination_${index}`] = 'Este destino es requerido';
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        

        if (window.google && window.google.maps) {
            const directionsService = new window.google.maps.DirectionsService();
            const directionsRenderer = new window.google.maps.DirectionsRenderer();

            const map = new window.google.maps.Map(document.getElementById('map'), {
                zoom: 7,
                center: { lat: 4.6482837, lng: -74.2478942 },
            });

            directionsRenderer.setMap(map);

            const [lastDestination, ...waypointsReverse] = [...formData.destination_addresses].reverse();
            const waypoints = waypointsReverse.reverse().map((address) => ({
                location: address,
                stopover: true,
            }));

            const request = {
                origin: formData.address,
                destination: lastDestination,
                waypoints,
                optimizeWaypoints: true,
                travelMode: window.google.maps.TravelMode.DRIVING,
            };

            directionsService.route(request, (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    directionsRenderer.setDirections(result);
                } else {
                    showNotification('error', 'Error al calcular la ruta', 'No se pudo mostrar la ruta. Intenta nuevamente.');
                }
            });

            setShowMap(true);
        }

    };

    return (
        <>
            <div className="flex justify-between mb-4">
                <div className="flex gap-4">
                    <h1 className="text-xl font-bold">Calcular ruta de entrega</h1>
                    <button 
                        type="button" 
                        onClick={() => {
                            setFormData((prev) => ({
                                ...prev,
                                destination_addresses: [...prev.destination_addresses, ''],
                            }));
                        }} 
                        className='bg-gray-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition'>
                        + Añadir destino
                    </button>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6">
                <div className='mb-6'>
                    <label className="block text-sm font-medium mb-1">Punto de origen</label>
                    <input 
                        name="address"
                        type="text"
                        ref={(el) => setInputRef(el, 0)}
                        value={formData.address || ''}
                        onChange={handleChange}
                        placeholder="Ingresa la dirección de origen"
                        className={`w-full border border-gray-300 rounded-md px-3 py-2 ${errors.address ? 'border-red-500 focus:border-red-500' : 'focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]'}`} 
                    />
                    {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {formData.destination_addresses.map((dest, index) => (
                        <div key={index}>
                            <div className='mb-2 relative'>
                                <label className="block text-sm font-medium mb-1">Punto destino #{index + 1}</label>
                                <input 
                                    data-type="destination"
                                    data-index={index}
                                    type="text"
                                    ref={(el) => setInputRef(el, index + 1)}
                                    name={`destination_${index}`}
                                    value={dest}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setFormData((prev) => {
                                            const updated = [...prev.destination_addresses];
                                            updated[index] = value;
                                            return { ...prev, destination_addresses: updated };
                                        });
                                    }}
                                    placeholder={`Destino ${index + 1}`}
                                    className={`w-full border border-gray-300 rounded-md px-3 py-2 mt-2 ${errors[`destination_${index}`] ? 'border-red-500 focus:border-red-500' : 'focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]'}`}
                                />
                                {index > 0 && (
                                    <button
                                    type="button"
                                    onClick={() => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            destination_addresses: prev.destination_addresses.filter((_, i) => i !== index),
                                        }));
                                    }}
                                    className="absolute top-3 right-2 text-red-600 hover:text-red-800"
                                    >
                                        ✕
                                    </button>
                                )}
                                {errors[`destination_${index}`] && <p className="text-red-500 text-sm">{errors[`destination_${index}`]}</p>}
                            </div>
                        </div>
                    ))}
                </div>

                <button type="submit" className="mt-6 w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2 rounded-md">
                    Generar ruta
                </button>
            </form>

            <div data-testid="map" id="map" className={`max-w-4xl mx-auto h-96 mt-6 rounded-md border transition-opacity duration-300 ${showMap ? 'block' : 'hidden'}`} />

        </>
    )
};

export default DeliveryRoutes;