import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { getProductById } from '../api/products';
import { getWarehousesByProduct } from '../api/warehouses';
import Loader from '../components/Loader';

const ProductDetail = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [product, setProduct] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { productId } = useParams();

  useEffect(() => {
    const uploadProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(productId);
        setProduct(data);
      } catch {
        setError('No se encontró el producto');
      } finally {
        setLoading(false);
      }
    };

    uploadProduct();
  }, [productId]);

  useEffect(() => {
    const uploadWarehouses = async () => {
      setLoading(true);
      try {
        const data = await getWarehousesByProduct(productId);
        setWarehouses(data);
      } catch {
        setError('No se encontraron bodegas asociadas');
      } finally {
        setLoading(false);
      }
    };

    uploadWarehouses();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">¡Error!</strong>
        <span className="block sm:inline ml-2">{error}</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between mb-4">
        <div className="flex gap-4">
          <h1 className="text-xl font-bold">{product?.name} - Producto</h1>
        </div>
        <input
          type="text"
          placeholder="Buscar..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="px-3 py-1 border rounded-md w-full max-w-sm"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {warehouses.map((warehouse, index) => (
          <div key={index} className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-800 mb-3">
              Datos del producto
            </h2>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>
                <span className="font-medium text-gray-800">Nombre:</span>{" "}
                {product.name}
              </li>
              <li>
                <span className="font-medium text-gray-800">Cantidad:</span>{" "}
                {product.quantity}
              </li>
              <li>
                <span className="font-medium text-gray-800">Precio unitario:</span>{" "}
                ${product.unit_amount.toFixed(2)}
              </li>
              <li>
                <span className="font-medium text-gray-800">Bodega:</span>{" "}
                {warehouse.warehouse.name}
              </li>
              <li>
                <span className="font-medium text-gray-800">Ubicación de la bodega:</span>{" "}
                {warehouse.warehouse.location}
              </li>
              <li>
                <span className="font-medium text-gray-800">Lugar el bodega:</span>{" "}
                {warehouse.place}
              </li>
            </ul>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProductDetail;
