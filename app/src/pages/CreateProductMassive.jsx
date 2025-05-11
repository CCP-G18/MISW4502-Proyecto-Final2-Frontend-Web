import { useEffect, useMemo, useState } from "react";
import { productsBulkSave, productUploadPreview } from "../api/products";
import { useNotification } from "../context/NotificationContext";
import { useNavigate } from "react-router";
import { formatCurrency } from "../utils/formatters";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import Loader from "../components/Loader";


const CreateProductMassive = () => {
    const [file, setFile] = useState(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const { showNotification } = useNotification();
    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState([]);
    const [notified, setNotified] = useState(false);
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const showIfNeeded = () => {
            if (!notified && location.state?.showNotification) {
                showNotification(
                    location.state.type,
                    location.state.title,
                    location.state.message
                );
                setNotified(true);

                navigate(location.pathname, { replace: true });
            }
        };

        showIfNeeded();
    }, [location.state, location.pathname, navigate, showNotification, notified]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setProducts([]);
        setLoading(true);
        try {
            const response = await productUploadPreview(file);
            if (response.data['data']['errores'].length > 0) {
                showNotification('error', 'Cargue masivo de productos', 'No se pudieron procesar algunos productos');
            } else {
                showNotification('success', 'Cargue masivo de productos', "Productos validados correctamente!");
            }
            setProducts(response.data['data']['validos']);
        } catch (error) {
            showNotification('error', 'Error al cargar el documento', error.message);
            setError('No se encontraron productos');
        } finally {
            setLoading(false);
        }
    }

    const validate = () => {
        const newErrors = {};

        if (!file) newErrors.file = 'Debes adjuntar el archivo!';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleGuardarProductos = async (e) => {
        e.preventDefault();
        setLoading(true);
        setProducts([]);
        try {
            const response = await productsBulkSave(products);
            showNotification('success', 'Cargue masivo de productos', response.data['message'])
        } catch (error) {
            showNotification('error', 'Error al crear los productos', error.message);
        } finally {
            setLoading(false);
            setFile(null);
        }
    }

    const data = useMemo(() => products, [products]);

    const columns = useMemo(
        () => [
            { header: '#', cell: ({ row }) => row.index + 1 + pagination.pageIndex * pagination.pageSize },
            { accessorKey: 'manufacturer_name', header: 'Fabricante' },
            { accessorKey: 'name', header: 'Producto' },
            { accessorKey: 'quantity', header: 'Cantidad' },
            {
                accessorKey: 'amount_unit',
                header: 'Precio unitario',
                cell: info => formatCurrency(info.getValue())
            }
        ]
    );

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            pagination,
            globalFilter,
        },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });


    const visibleColumns = table.getAllLeafColumns().filter(
        (col) => !col.columnDef.meta?.isHidden
    );
    const columnCount = visibleColumns.length;

    return (
        <>
            <h1 className="text-xl font-bold mb-4">Cargar productos masivamente</h1>
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">
                            Archivo excel de productos
                        </label>

                        <div className="relative">
                            <input
                                id="file-upload"
                                type="file"
                                accept=".csv,.xlsx"
                                onChange={(e) => setFile(e.target.files[0])}
                                className={`absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10 ${errors.file ? 'border-red-500 focus:border-red-500' : 'focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)]'}`}
                            />
                            <div
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-500 bg-white cursor-pointer"
                            >
                                {file?.name || "Adjunte el archivo de productos"}
                            </div>
                            {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
                        </div>
                    </div>
                </div>
                <button type="submit" className="mt-6 w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2 rounded-md">
                    Cargar Archivo
                </button>
            </form>
            {loading && (
                <>
                    <Loader text="Cargando datos..." />
                </>
            )}
            {products.length > 0 && (
                <>
                    <div className="flex justify-between mb-4">
                        <div className="flex gap-4">
                            <h1 className="text-xl font-bold">Contenido de productos por cargar</h1>
                        </div>
                    </div>
                    <table className="w-full text-sm text-left text-white border border-teal-800">
                        <thead className="bg-[#033649] text-white border-b border-gray-800">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => {
                                        const isHidden = header.column.columnDef.meta?.isHidden;
                                        return !isHidden ? (
                                            <th key={header.id} className="px-4 py-2">
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </th>
                                        ) : null;
                                    })}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {error ? (
                                <tr>
                                    <td colSpan={columnCount} className="text-center text-red-600 py-4">
                                        {error}
                                    </td>
                                </tr>
                            ) : table.getRowModel().rows.length === 0 ? (
                                <tr>
                                    <td colSpan={columnCount} className="text-center text-gray-500 py-4">
                                        No se encontraron resultados.
                                    </td>
                                </tr>
                            ) : (
                                table.getRowModel().rows.map((row, index) => (
                                    <tr key={row.id} className={index % 2 === 0 ? 'bg-teal-800' : 'bg-[#033649]'}>
                                        {row.getVisibleCells().map((cell) => {
                                            const isHidden = cell.column.columnDef.meta?.isHidden;
                                            return !isHidden ? (
                                                <td key={cell.id} className="px-4 py-2">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ) : null;
                                        })}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    <div className="mt-4 flex justify-between items-center text-sm">
                        <div>
                            Página {table.getState().pagination.pageIndex + 1} de{' '}
                            {table.getPageCount()}
                        </div>
                        <div className="space-x-2">
                            <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="px-3 py-1 border rounded disabled:opacity-50">
                                Anterior
                            </button>
                            <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="px-3 py-1 border rounded disabled:opacity-50">
                                Siguiente
                            </button>
                        </div>
                    </div>
                    <div className="max-w-4xl mx-auto p-6">
                        <button type="submit" onClick={handleGuardarProductos}  className="mt-6 w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-2 rounded-md">
                            Guardar Productos
                        </button>
                    </div>
                </>
            )}
        </>
    );
}


export default CreateProductMassive;