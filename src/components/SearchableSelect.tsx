import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { cn } from '../utils/cn';

interface Option {
  value: string;
  label: string;
  sublabel?: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  icon?: React.ElementType;
}

export const SearchableSelect = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select option...", 
  label,
  icon: Icon
}: SearchableSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(search.toLowerCase()) ||
    opt.sublabel?.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-2" ref={containerRef}>
      {label && (
        <label className="text-sm font-semibold text-slate-500 flex items-center gap-2 uppercase tracking-wider">
          {Icon && <Icon size={16} className="text-slate-600" />} {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full px-4 py-2 bg-white border border-slate-200 rounded-xl flex items-center justify-between transition-all outline-none text-left text-slate-800",
            isOpen ? "ring-2 ring-red-600 border-transparent" : "hover:border-slate-300"
          )}
        >
          <span className={cn("truncate", !selectedOption && "text-slate-400")}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown size={18} className={cn("text-slate-400 transition-transform", isOpen && "rotate-180")} />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-2 border-b border-slate-100">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-red-600 outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="max-h-60 overflow-auto p-1">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={cn(
                      "w-full px-3 py-2 rounded-lg text-left flex items-center justify-between group hover:bg-red-50 transition-colors",
                      value === opt.value && "bg-red-50"
                    )}
                  >
                    <div className="flex flex-col">
                      <span className={cn("text-sm font-medium", value === opt.value ? "text-red-600" : "text-slate-700")}>
                        {opt.label}
                      </span>
                      {opt.sublabel && (
                        <span className="text-xs text-slate-500 group-hover:text-red-400">{opt.sublabel}</span>
                      )}
                    </div>
                    {value === opt.value && <Check size={16} className="text-red-600" />}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-slate-500 text-center">No results found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
