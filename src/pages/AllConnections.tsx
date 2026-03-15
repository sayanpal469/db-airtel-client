import React, { useState, useMemo } from 'react';
import { 
  createColumnHelper, 
  flexRender, 
  getCoreRowModel, 
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel
} from '@tanstack/react-table';
import { 
  Download, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  Package,
  User,
  Hash,
  UserCheck
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { format, isWithinInterval, parseISO, startOfWeek, endOfWeek } from 'date-fns';
import { SearchableSelect } from '../components/SearchableSelect';
import { DUMMY_CONNECTIONS, DUMMY_ENGINEERS } from '../data/dummyData';
import { Connection } from '../types';
import { cn } from '../utils/cn';

const columnHelper = createColumnHelper<Connection>();

export const AllConnections = () => {
  const [data] = useState(DUMMY_CONNECTIONS);
  const [globalFilter, setGlobalFilter] = useState('');
  const [filters, setFilters] = useState({
    type: '',
    package: '',
    installer: '',
    dateRange: { start: '', end: '' }
  });

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const date = parseISO(item.installationDate);
      
      // Type filter
      if (filters.type && item.connectionType !== filters.type) return false;
      
      // Package filter
      if (filters.package && item.package !== filters.package) return false;
      
      // Installer filter
      if (filters.installer && item.installerName !== filters.installer) return false;
      
      // Date range filter
      if (filters.dateRange.start && filters.dateRange.end) {
        if (!isWithinInterval(date, { 
          start: parseISO(filters.dateRange.start), 
          end: parseISO(filters.dateRange.end) 
        })) return false;
      }

      return true;
    });
  }, [data, filters]);

  const columns = [
    columnHelper.display({
      id: 'serial',
      header: 'S.No',
      cell: info => <span className="text-slate-500 font-mono">{info.row.index + 1}</span>
    }),
    columnHelper.accessor('orderId', { header: 'Order ID', cell: info => <span className="font-bold text-slate-800">{info.getValue()}</span> }),
    columnHelper.accessor('customerName', { header: 'Customer', cell: info => (
      <div className="flex flex-col">
        <span className="font-medium text-slate-700">{info.getValue()}</span>
        <span className="text-xs text-slate-500">{info.row.original.customerPhone}</span>
      </div>
    )}),
    columnHelper.accessor('package', { header: 'Package', cell: info => (
      <div className="max-w-[200px] truncate text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 border border-red-100 px-2 py-1 rounded-md">
        {info.getValue()}
      </div>
    )}),
    columnHelper.accessor('installationDate', { header: 'Date', cell: info => format(parseISO(info.getValue()), 'dd MMM yyyy') }),
    columnHelper.accessor('installerName', { header: 'Engineer', cell: info => <span className="text-slate-600">{info.getValue()}</span> }),
    columnHelper.accessor('engineerCommission', { header: 'Eng. Comm', cell: info => `₹${info.getValue()}` }),
    columnHelper.accessor('retailerCommission', { header: 'Ret. Comm', cell: info => `₹${info.getValue()}` }),
    columnHelper.accessor('profit', { header: 'Profit', cell: info => (
      <span className="font-bold text-red-600">₹{info.getValue()}</span>
    )}),
    columnHelper.accessor('connectionType', { header: 'Type', cell: info => (
      <span className={cn(
        "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
        info.getValue() === 'Retailer' ? "bg-red-50 text-red-600 border border-red-100" : "bg-slate-100 text-slate-600 border border-slate-200"
      )}>
        {info.getValue()}
      </span>
    )}),
    columnHelper.accessor('retailerShopName', { header: 'Retailer', cell: info => info.getValue() || '-' }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: () => (
        <div className="flex items-center gap-2">
          <button className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-red-600 rounded-lg transition-colors"><Edit2 size={14} /></button>
          <button className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"><Trash2 size={14} /></button>
        </div>
      )
    })
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    initialState: { pagination: { pageSize: 10 } }
  });

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Connections");
    XLSX.writeFile(wb, "AirFiber_Connections.xlsx");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">All Connections</h1>
          <p className="text-slate-500">Manage and track all AirFiber installations.</p>
        </div>
        <button 
          onClick={exportToExcel}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-100"
        >
          <Download size={18} /> Export to Excel
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Calendar size={12} /> Start Date
          </label>
          <input 
            type="date"
            className="w-full bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-red-600 outline-none p-2"
            onChange={(e) => setFilters({ ...filters, dateRange: { ...filters.dateRange, start: e.target.value } })}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Calendar size={12} /> End Date
          </label>
          <input 
            type="date"
            className="w-full bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-red-600 outline-none p-2"
            onChange={(e) => setFilters({ ...filters, dateRange: { ...filters.dateRange, end: e.target.value } })}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Filter size={12} /> Connection Type
          </label>
          <select 
            className="w-full bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-red-600 outline-none p-2"
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">All Types</option>
            <option value="Retailer">Retailer</option>
            <option value="Direct Customer">Direct Customer</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <User size={12} /> Engineer
          </label>
          <SearchableSelect 
            options={DUMMY_ENGINEERS.map(eng => ({ value: eng.name, label: eng.name }))}
            value={filters.installer}
            onChange={(val) => setFilters({ ...filters, installer: val })}
            placeholder="All Engineers"
            icon={UserCheck}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Search size={12} /> Search
          </label>
          <input 
            type="text" 
            placeholder="Order ID, Name..."
            className="w-full bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-red-600 outline-none p-2"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-white border-b border-slate-100">
                {table.getHeaderGroups().map(headerGroup => (
                  headerGroup.headers.map(header => (
                    <th key={header.id} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className="hover:bg-slate-50 transition-colors group">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-6 py-4 text-sm text-slate-600">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 md:px-6 py-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-slate-500 text-center sm:text-left">
            Showing <span className="font-semibold text-slate-700">{table.getRowModel().rows.length}</span> of <span className="font-semibold text-slate-700">{filteredData.length}</span> results
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <button 
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1 flex-wrap justify-center">
              {Array.from({ length: table.getPageCount() }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => table.setPageIndex(i)}
                  className={cn(
                    "w-8 h-8 rounded-lg text-sm font-medium transition-all",
                    table.getState().pagination.pageIndex === i 
                      ? "bg-red-600 text-white shadow-md shadow-red-100" 
                      : "hover:bg-slate-50 text-slate-500 border border-transparent hover:border-slate-200"
                  )}
                >
                  {i + 1}
                </button>
              )).slice(0, 5)}
            </div>
            <button 
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
