import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, flexRender } from '@tanstack/react-table';
import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router';
import { getSellers } from '../api/sellers';

const Sellers = () => {
    const [globalFilter, setGlobalFilter] = useState('');
    const [sellers, setSellers] = useState([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

    useEffect(() => {
        const uploadSellers = async () => {
            const data = await getSellers();
            setSellers(data);
        };
    
        uploadSellers();
    }, []);


    const data = useMemo(() => sellers, [sellers]);
    const columns = useMemo(
        () => [
            { header: '#', cell: ({ row }) => row.index + 1 + pagination.pageIndex * pagination.pageSize, },
            { accessorKey: 'name', header: 'Nombre' },
            { accessorKey: 'email', header: 'Correo Electrónico' },
            { accessorKey: 'assigned_area', header: 'Área Asignada' },
            {
                id: 'acciones',
                header: 'Acciones',
                cell: ({ row }) => {
                    const vendedor = row.original;
                
                    const handlePlanes = () => {
                        console.log('Planes de venta para', vendedor.name);
                    };
                
                    const handleInforme = () => {
                        console.log('Informe de', vendedor.name);
                    };
                
                    return (
                        <div className="flex space-x-2">
                            <button onClick={handlePlanes} className="bg-[#E8DDCB] text-gray-800 px-3 font-semibold py-1 rounded-md hover:bg-gray-300 transition">
                                Planes de venta
                            </button>
                            <button onClick={handleInforme} className="bg-[#E8DDCB] text-gray-800 px-3 font-semibold py-1 rounded-md hover:bg-gray-300 transition">
                                Informe
                            </button>
                        </div>
                    );
                },
            },
        ],
        []
    );

    const table = useReactTable({
        data,
        columns,
        state: {
          pagination,
          globalFilter,
        },
        onPaginationChange: setPagination,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <>
            <div className="flex justify-between mb-4">
                <div className="flex gap-4">
                    <h1 className="text-xl font-bold">Lista de vendedores</h1>
                    <Link to="/" className="bg-gray-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition">Crear vendedor</Link>
                </div>
                <input type="text" placeholder="Buscar..." value={globalFilter ?? ''} onChange={(e) => setGlobalFilter(e.target.value)} className="px-3 py-1 border rounded-md w-full max-w-sm" />
            </div>
            <table className="w-full text-sm text-left text-white border border-teal-800">
                <thead className="bg-[#033649] text-white">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <th key={header.id} className="px-4 py-3 text-left">
                                {flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                        ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="divide-y divide-gray-100">
                {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className={row.id % 2 === 0 ? 'bg-teal-800' : 'bg-[#033649]'}>
                        {row.getVisibleCells().map((cell) => (
                            <td key={cell.id} className="px-4 py-2">
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
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
        </>
    )
};
  
export default Sellers;