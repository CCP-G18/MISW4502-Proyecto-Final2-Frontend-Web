import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, getSortedRowModel, flexRender } from '@tanstack/react-table';
import { useState, useMemo, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { getProducers } from '../api/producers';
import { useNotification } from '../context/NotificationContext';
import Loader from '../components/Loader';

const Producers = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [producers, setProducers] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sorting, setSorting] = useState([]);
  const [notified, setNotified] = useState(false);
  const { showNotification } = useNotification();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const uploadProducers = async () => {
      setLoading(true);
      try {
        const data = await getProducers();
        setProducers(data);
      } catch {
        setError('No se encontraron fabricantes');
      } finally {
        setLoading(false);
      }
    };

    uploadProducers();
  }, []);

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

  const data = useMemo(() => producers, [producers]);
  const columns = useMemo(
    () => [
      { header: '#', cell: ({ row }) => row.index + 1 + pagination.pageIndex * pagination.pageSize, },
      { accessorKey: 'name', header: 'Nombre' },
      { accessorKey: 'country', header: 'País' },
      { accessorKey: 'email', header: 'Correo electrónico' },
    ],
    []
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
      <div className="flex justify-between mb-4">
        <div className="flex gap-4">
          <h1 className="text-xl font-bold">Lista de fabricantes</h1>
          <Link to="/fabricantes/crear" className="bg-gray-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-700 transition">Crear fabricante</Link>
        </div>
        <input type="text" placeholder="Buscar..." value={globalFilter ?? ''} onChange={(e) => setGlobalFilter(e.target.value)} className="px-3 py-1 border rounded-md w-full max-w-sm" />
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
          {loading ? (
            <tr>
              <td colSpan={columnCount} className="text-center py-4">
                <Loader text="Cargando datos..." />
              </td>
            </tr>
          ) : error ? (
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
    </>
  )
};

export default Producers;