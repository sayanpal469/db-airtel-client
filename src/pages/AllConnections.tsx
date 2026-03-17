import React, { useState, useEffect, useMemo } from 'react';
import { 
  createColumnHelper, 
  flexRender, 
  getCoreRowModel, 
  useReactTable,
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
  UserCheck,
  Loader2,
  AlertCircle
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { format, parseISO } from 'date-fns';
import { SearchableSelect } from '../components/SearchableSelect';
import { connectionApi, ConnectionFilterParams } from '../api/connectionApi';
import { engineerApi } from '../api/engineerApi';
import { Connection, Engineer } from '../types';
import { cn } from '../utils/cn';

const columnHelper = createColumnHelper<Connection>();

export const AllConnections = () => {
  const [data, setData] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  
  // Pagination & Filter State
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });

  const [globalFilter, setGlobalFilter] = useState('');
  const [filters, setFilters] = useState<ConnectionFilterParams>({
    connectionType: '',
    package: '',
    engineerId: '',
    startDate: '',
    endDate: ''
  });

  const fetchConnections = async () => {
    setIsLoading(true);
    try {
      const response = await connectionApi.getAll({
        ...filters,
        search: globalFilter,
        page: pagination.currentPage,
        limit: pagination.itemsPerPage
      });

      if (response.success) {
        setData(response.data.connections);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || 'Failed to fetch connections');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching connections');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, [pagination.currentPage, filters, globalFilter]);

  useEffect(() => {
    const fetchEngineers = async () => {
      try {
        const res = await engineerApi.getAll({ limit: 100 });
        if (res.success) setEngineers(res.data.engineers || []);
      } catch (err) {}
    };
    fetchEngineers();
  }, []);

  const columns = [
    columnHelper.display({
      id: 'serial',
      header: 'S.No',
      cell: info => <span className="text-slate-500 font-mono">{(pagination.currentPage - 1) * pagination.itemsPerPage + info.row.index + 1}</span>
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
    columnHelper.accessor('engineer.name', { header: 'Engineer', cell: info => <span className="text-slate-600">{info.getValue()}</span> }),
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
    columnHelper.accessor('retailer.shopName', { header: 'Retailer', cell: info => info.getValue() || '-' }),
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
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const exportToExcel = () => {
    const exportData = data.map(item => ({
      'Order ID': item.orderId,
      'Customer': item.customerName,
      'Phone': item.customerPhone,
      'Package': item.package,
      'Date': format(parseISO(item.installationDate), 'dd MMM yyyy'),
      'Engineer': item.engineer.name,
      'Eng. Commission': item.engineerCommission,
      'Ret. Commission': item.retailerCommission,
      'Profit': item.profit,
      'Type': item.connectionType,
      'Retailer': item.retailer?.shopName || 'Direct'
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Connections");
    XLSX.writeFile(wb, "AirFiber_Connections.xlsx");
  };

  const handleFilterChange = (name: string, value: any) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
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
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Calendar size={12} /> End Date
          </label>
          <input 
            type="date"
            className="w-full bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-red-600 outline-none p-2"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
            <Filter size={12} /> Connection Type
          </label>
          <select 
            className="w-full bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-red-600 outline-none p-2"
            value={filters.connectionType}
            onChange={(e) => handleFilterChange('connectionType', e.target.value)}
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
            options={engineers.map(eng => ({ value: eng.id, label: eng.name }))}
            value={filters.engineerId || ''}
            onChange={(val) => handleFilterChange('engineerId', val)}
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
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10 transition-all">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          </div>
        )}

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
              {data.length > 0 ? (
                table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors group">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4 text-sm text-slate-600">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-10 text-center text-slate-500">
                    No connections found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-4 md:px-6 py-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-500 text-center sm:text-left">
              Showing <span className="font-semibold text-slate-700">{data.length}</span> of <span className="font-semibold text-slate-700">{pagination.totalItems}</span> results
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button 
                onClick={() => setPagination(p => ({ ...p, currentPage: p.currentPage - 1 }))}
                disabled={pagination.currentPage === 1}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-1 flex-wrap justify-center">
                {Array.from({ length: pagination.totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPagination(p => ({ ...p, currentPage: i + 1 }))}
                    className={cn(
                      "w-8 h-8 rounded-lg text-sm font-medium transition-all",
                      pagination.currentPage === i + 1 
                        ? "bg-red-600 text-white shadow-md shadow-red-100" 
                        : "hover:bg-slate-50 text-slate-500 border border-transparent hover:border-slate-200"
                    )}
                  >
                    {i + 1}
                  </button>
                )).slice(Math.max(0, pagination.currentPage - 3), Math.min(pagination.totalPages, pagination.currentPage + 2))}
              </div>
              <button 
                onClick={() => setPagination(p => ({ ...p, currentPage: p.currentPage + 1 }))}
                disabled={pagination.currentPage === pagination.totalPages}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
